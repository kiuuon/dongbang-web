import { useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { useQueryClient } from '@tanstack/react-query';

import useChatMessages from '@/hooks/useChatMessages';
import useChatPageValidation from '@/hooks/useChatPageValidation';
import { MessageType } from '@/types/message-type';
import ChatRoomHeader from '@/components/chats/chat-room-header';
import SystemMessage from '@/components/chats/system-message';
import TextMessage from '@/components/chats/text-message';

function ChatRoomPage() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { chatRoomId } = router.query as { chatRoomId: string };

  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const boundaryMessageRef = useRef<HTMLDivElement | null>(null);

  const topObserverElement = useRef(null);
  const bottomObserverElement = useRef(null);

  const previousScrollHeightRef = useRef<number | null>(null);
  const isInitialLoadRef = useRef(true);

  const { isValid, ErrorComponent } = useChatPageValidation();

  const {
    firstPageUnreadCount,
    messages,
    firstUnreadIndex,
    boundaryIndex,
    fetchNextPage,
    hasNextPage,
    fetchPreviousPage,
    hasPreviousPage,
    chatMessages,
  } = useChatMessages(chatRoomId);

  useEffect(
    () => () => queryClient.removeQueries({ queryKey: ['chatMessages', chatRoomId, 'centered'] }),
    [chatRoomId, queryClient],
  );

  useEffect(() => {
    const target = topObserverElement.current;

    if (!target) return undefined;

    const observerInstance = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && hasPreviousPage) {
            const container = scrollContainerRef.current;
            if (container) {
              previousScrollHeightRef.current = container.scrollHeight;
            }
            fetchPreviousPage();
          }
        });
      },
      { threshold: 1 },
    );

    observerInstance.observe(target);

    return () => observerInstance.unobserve(target);
  }, [fetchPreviousPage, hasPreviousPage]);

  useEffect(() => {
    const target = bottomObserverElement.current;
    if (!target) return undefined;

    const observerInstance = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && hasNextPage) {
            // 아래로 스크롤할 때는 previousScrollHeightRef를 null로 설정하여 스크롤 위치 조정 방지
            previousScrollHeightRef.current = null;
            fetchNextPage();
          }
        });
      },
      { threshold: 1 },
    );

    observerInstance.observe(target);

    return () => observerInstance.unobserve(target);
  }, [fetchNextPage, hasNextPage]);

  // 스크롤 맞추기
  useEffect(() => {
    if (!chatMessages || !messages.length) return;

    requestAnimationFrame(() => {
      if (scrollContainerRef.current) {
        const container = scrollContainerRef.current;

        // 처음 로드 시 스크롤 맞추기
        if (isInitialLoadRef.current && boundaryMessageRef.current) {
          isInitialLoadRef.current = false;
          // 안읽은 메세지가 10개 이하이거나 경계 메세지가 마지막이면 그냥 맨 아래로
          if (firstPageUnreadCount < 11 || boundaryIndex === messages.length - 1) {
            container.scrollTop = container.scrollHeight;
            return;
          }

          // 경계 메시지가 컨테이너의 중간에 오도록
          const el = boundaryMessageRef.current;
          const { offsetTop } = el;
          const { offsetHeight } = el;
          const { clientHeight } = container;

          container.scrollTop = offsetTop + offsetHeight / 2 - clientHeight / 2;

          return;
        }

        // 처음 로드 이후 새 페이지 로드 시 스크롤 위치 조정 (위로 스크롤 할 때)
        if (!isInitialLoadRef.current && previousScrollHeightRef.current) {
          const heightDiff = container.scrollHeight - previousScrollHeightRef.current;
          if (heightDiff > 0) {
            // 위로 스크롤할 때: 새 메시지가 위에 추가되므로 높이 차이만큼 스크롤 위치 조정
            container.scrollTop += heightDiff;
          }
          previousScrollHeightRef.current = container.scrollHeight;
        }
      }
    });
  }, [chatMessages, messages, boundaryIndex, firstPageUnreadCount]);

  if (!isValid) {
    return ErrorComponent;
  }

  return (
    <div className="flex h-screen flex-col">
      <ChatRoomHeader />
      <div ref={scrollContainerRef} className="flex min-h-screen flex-col overflow-y-auto bg-tag px-[20px]">
        {hasPreviousPage && <div ref={topObserverElement} />}
        {messages.map((message: MessageType, idx: number) => (
          <div key={message.id}>
            {idx === 0 && <div className="h-[80px]" />}

            {message.message_type === 'grouped_system' && (
              <SystemMessage
                message={message}
                index={idx}
                boundaryIndex={boundaryIndex}
                boundaryMessageRef={boundaryMessageRef}
              />
            )}
            {firstPageUnreadCount === 11 && firstUnreadIndex >= 0 && idx === firstUnreadIndex && (
              <div className="text-regular14 mx-auto mb-[8px] w-fit max-w-full rounded-[16px] bg-gray3 px-[12px] py-[6px] text-white opacity-60">
                마지막으로 읽은 위치
              </div>
            )}
            {message.message_type === 'text' && (
              <TextMessage
                message={message}
                messages={messages}
                index={idx}
                boundaryIndex={boundaryIndex}
                boundaryMessageRef={boundaryMessageRef}
              />
            )}
          </div>
        ))}

        {hasNextPage && <div ref={bottomObserverElement} />}
      </div>
    </div>
  );
}

export default ChatRoomPage;
