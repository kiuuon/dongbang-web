import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import useChatMessages from '@/hooks/useChatMessages';
import useChatPageValidation from '@/hooks/useChatPageValidation';
import { MessageType } from '@/types/message-type';
import RightArrowIcon6 from '@/icons/right-arrow-icon6';
import ChatRoomHeader from '@/components/chats/chat-room-header';
import SystemMessage from '@/components/chats/system-message';
import TextMessage from '@/components/chats/text-message';
import { sendTextMessage } from '@/lib/apis/chats';
import { handleMutationError, handleQueryError } from '@/lib/utils';
import { ERROR_MESSAGE } from '@/lib/constants';
import { fetchUserId } from '@/lib/apis/auth';

function ChatRoomPage() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { chatRoomId } = router.query as { chatRoomId: string };

  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const boundaryMessageRef = useRef<HTMLDivElement | null>(null);

  const topObserverElement = useRef(null);
  const bottomObserverElement = useRef(null);

  const previousScrollHeightRef = useRef<number | null>(null);
  const previousMessageCountRef = useRef<number>(0);
  const isInitialLoadRef = useRef(true);
  const isBottomScrollRef = useRef(false);

  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const previousInputHeightRef = useRef<number>(91);
  const [inputContainerHeight, setInputContainerHeight] = useState(91);
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

    const newInputHeight = textareaRef.current.scrollHeight + 49;
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

  const { data: userId } = useQuery({
    queryKey: ['userId'],
    queryFn: fetchUserId,
    throwOnError: (error) => handleQueryError(error, ERROR_MESSAGE.USER.ID_FETCH_FAILED),
  });

  const { mutate: handleSendTextMessage } = useMutation({
    mutationFn: (content: string) => sendTextMessage(chatRoomId, content),
    // 낙관적 업데이트: 서버 응답 전에 UI에 메시지 추가
    onMutate: async (content: string) => {
      // 진행 중인 쿼리 취소 (낙관적 업데이트를 덮어쓰지 않도록)
      await queryClient.cancelQueries({ queryKey: ['chatMessages', chatRoomId] });

      // 이전 데이터 스냅샷 저장 (롤백용)
      const previousMessages = queryClient.getQueryData(['chatMessages', chatRoomId]);

      // 임시 ID 생성
      const tempId = `temp-${Date.now()}-${Math.random()}`;

      // 임시 메시지 생성 (임시 ID 사용)
      const optimisticMessage: MessageType = {
        id: tempId,
        chat_room_id: chatRoomId,
        sender_id: userId,
        message_type: 'text',
        content,
        created_at: new Date().toISOString(),
        isMine: true,
        is_unread: false,
        unread_count: chatRoomInfo ? chatRoomInfo.members.length - 1 : 0,
      };

      // 캐시에 낙관적 메시지 추가
      queryClient.setQueryData(['chatMessages', chatRoomId], (oldData: any) => {
        if (!oldData) return oldData;

        const lastPage = oldData.pages[oldData.pages.length - 1];
        const newLastPage = [...lastPage, optimisticMessage];

        return {
          ...oldData,
          pages: [...oldData.pages.slice(0, -1), newLastPage],
        };
      });

      // 롤백을 위한 이전 데이터 반환
      return { previousMessages, tempId };
    },
    onSuccess: (data, _, context: any) => {
      // 서버에서 반환된 실제 메시지 ID로 임시 메시지 교체
      const realMessageId = data;

      const { tempId } = context;

      if (!tempId) return;

      queryClient.setQueryData(['chatMessages', chatRoomId], (oldData: any) => {
        if (!oldData) return oldData;

        // 임시 메시지는 항상 마지막 페이지에 있으므로 마지막 페이지만 확인
        const lastPageIndex = oldData.pages.length - 1;
        const lastPage = oldData.pages[lastPageIndex];
        const messageIndex = lastPage.findIndex((msg: any) => msg.id === tempId);

        if (messageIndex === -1) {
          // 마지막 페이지에 없으면 다른 페이지에 있을 수 없음 (임시 메시지는 항상 마지막에 추가)
          return oldData;
        }

        // 마지막 페이지만 업데이트
        const updatedLastPage = [...lastPage];
        updatedLastPage[messageIndex] = {
          ...updatedLastPage[messageIndex],
          id: realMessageId,
        };

        const updatedPages = [...oldData.pages];
        updatedPages[lastPageIndex] = updatedLastPage;

        return {
          ...oldData,
          pages: updatedPages,
        };
      });
      setInputValue('');

      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }

      setInputContainerHeight(91);

      requestAnimationFrame(() => {
        if (!scrollContainerRef.current) return;
        scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
      });
    },
    onError: (error, _, context: any) => {
      if (context?.previousMessages) {
        queryClient.setQueryData(['chatMessages', chatRoomId], context.previousMessages);
      }

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
            isBottomScrollRef.current = true;
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
          if (heightDiff > 500 || heightDiff === 0) {
            // 위로 스크롤할 때: 새 메시지가 위에 추가되므로 높이 차이만큼 스크롤 위치 조정
            container.scrollTop += heightDiff;
          } else if (previousMessageCountRef.current < messages.length && previousMessageCountRef.current !== 0) {
            container.scrollTo({
              top: container.scrollHeight,
              // behavior: 'smooth',
            });
          }
          previousMessageCountRef.current = messages.length;
          previousScrollHeightRef.current = container.scrollHeight;

          return;
        }

        if (isBottomScrollRef.current) {
          isBottomScrollRef.current = false;
          return;
        }

        container.scrollTo({
          top: container.scrollHeight,
          // behavior: 'smooth',
        });

        previousMessageCountRef.current = messages.length;
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

      <div className="fixed bottom-0 left-0 right-0 z-40 mx-auto max-w-[600px] bg-white px-[20px] pb-[33px] pt-[10px]">
        <textarea
          ref={textareaRef}
          rows={1}
          value={inputValue}
          placeholder={chatRoomInfo?.is_active ? '입력' : '채팅방이 비활성화되었습니다.'}
          className="text-regular16 box-border w-full resize-none overflow-hidden rounded-[8px] bg-gray0 py-[9px] pl-[21px] pr-[52px] leading-normal outline-none placeholder:text-gray2"
          onChange={handleInput}
          disabled={!chatRoomInfo?.is_active}
          // 1. 자동완성 끄기
          autoComplete="off"
          // 2. 자동교정 끄기
          autoCorrect="off"
          // 3. 첫글자 대문자 끄기 (선택사항)
          autoCapitalize="off"
          // 4. 맞춤법 검사 끄기
          spellCheck="false"
        />
        {inputValue.trim() !== '' && (
          <button
            type="button"
            className="absolute bottom-[48px] right-[26px]"
            onClick={() => {
              if (!inputValue.trim()) return;

              handleSendTextMessage(inputValue);
              textareaRef.current?.focus();
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
