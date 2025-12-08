import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import useChatMessages from '@/hooks/useChatMessages';
import useChatPageValidation from '@/hooks/useChatPageValidation';
import { MessageType } from '@/types/message-type';
import RightArrowIcon6 from '@/icons/right-arrow-icon6';
import ChatRoomHeader from '@/components/chats/chat-room-header';
import SystemMessage from '@/components/chats/system-message';
import TextMessage from '@/components/chats/text-message';
import { sendTextMessage } from '@/lib/apis/chats';
import { handleMutationError } from '@/lib/utils';
import { ERROR_MESSAGE } from '@/lib/constants';

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

  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const previousInputHeightRef = useRef<number>(124);
  const [inputContainerHeight, setInputContainerHeight] = useState(124);
  const [inputValue, setInputValue] = useState('');

  const { chatRoomInfo, isValid, ErrorComponent } = useChatPageValidation();

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, []);

  const handleInput = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(event.target.value);
    if (!textareaRef.current || !scrollContainerRef.current) return;

    const container = scrollContainerRef.current;
    const previousHeight = previousInputHeightRef.current;

    textareaRef.current.style.height = 'auto';
    textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;

    const newInputHeight = textareaRef.current.scrollHeight + 82;
    const heightDiff = newInputHeight - previousHeight;

    // 맨 아래에 있는지 확인 (약간의 여유를 둠, 5px)
    const isAtBottom = container.scrollHeight - container.scrollTop - container.clientHeight < 5;

    setInputContainerHeight(newInputHeight);
    previousInputHeightRef.current = newInputHeight;

    requestAnimationFrame(() => {
      if (!scrollContainerRef.current) return;

      if (isAtBottom) {
        // 맨 아래일 때는 맨 아래로 유지
        scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
      } else if (heightDiff !== 0) {
        // 중간일 때는 높이 차이만큼만 스크롤 조정
        scrollContainerRef.current.scrollTop += heightDiff;
      }
    });
  };

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

  const { mutate: handleSendTextMessage } = useMutation({
    mutationFn: (content: string) => sendTextMessage(chatRoomId, content),
    onSuccess: () => {
      setInputValue('');

      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }

      setInputContainerHeight(124);

      requestAnimationFrame(() => {
        if (!scrollContainerRef.current) return;
        scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
      });
    },
    onError: (error) => {
      handleMutationError(error, ERROR_MESSAGE.CHATS.SEND_FAILED);
    },
  });

  useEffect(
    () => () => queryClient.removeQueries({ queryKey: ['chatMessages', chatRoomId] }),
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
      <div
        ref={scrollContainerRef}
        className="flex flex-col overflow-y-auto overscroll-none bg-tag px-[20px]"
        style={{
          height: `calc(100vh - ${inputContainerHeight}px)`,
          minHeight: `calc(100vh - ${inputContainerHeight}px)`,
        }}
      >
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

      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white px-[20px] pb-[66px] pt-[10px]">
        <textarea
          ref={textareaRef}
          rows={1}
          value={inputValue}
          placeholder={chatRoomInfo?.is_active ? '입력' : '채팅방이 비활성화되었습니다.'}
          className="text-regular16 box-border w-full resize-none overflow-hidden rounded-[8px] bg-gray0 py-[9px] pl-[21px] pr-[52px] leading-normal outline-none placeholder:text-gray2"
          onChange={handleInput}
          disabled={!chatRoomInfo?.is_active}
        />
        {inputValue.trim() !== '' && (
          <button
            type="button"
            className="absolute bottom-[81px] right-[26px]"
            onClick={() => {
              if (!inputValue.trim()) return;

              handleSendTextMessage(inputValue);
            }}
          >
            <RightArrowIcon6 />
          </button>
        )}
      </div>
    </div>
  );
}

export default ChatRoomPage;
