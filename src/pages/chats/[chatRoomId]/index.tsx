import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import useFetchChatMessages from '@/hooks/chats/useFetchChatMessages';
import useSearchChatMessages from '@/hooks/chats/useSearchChatMessages';
import useChatPageValidation from '@/hooks/chats/useChatPageValidation';
import { MessageType } from '@/types/message-type';
import RightArrowIcon6 from '@/icons/right-arrow-icon6';
import ChevronDownIcon from '@/icons/cheveron-down-icon';
import ChevronUpIcon from '@/icons/cheveron-up-icon';
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
  } = useFetchChatMessages(chatRoomId);

  const {
    isSearchMode,
    setIsSearchMode,
    setMessageRef,
    searchQuery,
    setSearchQuery,
    searchResults,
    currentSearchIndex,
    searchCount,
    isConfirm,
    setIsConfirm,
    handleSearchConfirm,
    handlePreviousSearchResult,
    handleNextSearchResult,
  } = useSearchChatMessages();

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

  const { data: userId } = useQuery({
    queryKey: ['userId'],
    queryFn: fetchUserId,
    throwOnError: (error) => handleQueryError(error, ERROR_MESSAGE.USER.ID_FETCH_FAILED),
  });

  // 텍스트 메시지 전송
  const { mutate: handleSendTextMessage, isPending } = useMutation({
    mutationFn: (content: string) => sendTextMessage(chatRoomId, content),
    // 낙관적 업데이트: 서버 응답 전에 UI에 메시지 추가
    onMutate: async (content: string) => {
      // 쿼리 초기화
      await queryClient.invalidateQueries({ queryKey: ['chatMessages', chatRoomId] });

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
        if (!oldData || !oldData.pages?.length) return oldData;

        // 마지막 비어있지 않은 페이지 인덱스 찾기
        const lastNonEmptyIndex =
          [...oldData.pages]
            .map((p, idx) => ({ p, idx }))
            .reverse()
            .find(({ p }) => p.length > 0)?.idx ?? oldData.pages.length - 1;

        const pages = oldData.pages.map((p: any[]) => [...p]);
        pages[lastNonEmptyIndex] = [...pages[lastNonEmptyIndex], optimisticMessage];

        return { ...oldData, pages };
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

        let found = false;
        const updatedPages = oldData.pages.map((page: any[]) =>
          page.map((msg: any) => {
            if (!found && msg.id === tempId) {
              found = true;
              return { ...msg, id: realMessageId };
            }
            return msg;
          }),
        );

        return found ? { ...oldData, pages: updatedPages } : oldData;
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

  // 채팅방 나가면 캐시 제거
  useEffect(
    () => () => queryClient.removeQueries({ queryKey: ['chatMessages', chatRoomId] }),
    [chatRoomId, queryClient],
  );

  // 위로 스크롤할 때 메시지 로드
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

  // 아래로 스크롤할 때 메시지 로드
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
          if (heightDiff > 100 || heightDiff === 0) {
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

  const isNearBottomRef = useRef(true);
  const [hasPendingNewMessage, setHasPendingNewMessage] = useState(false);

  // 스크롤 위치 확인
  useEffect(() => {
    const c = scrollContainerRef.current;
    if (!c) return;
    isNearBottomRef.current = c.scrollHeight - c.scrollTop - c.clientHeight < 40;
  }, [messages]);

  // 스크롤 위치 확인 이벤트 핸들러
  const handleScroll = () => {
    const c = scrollContainerRef.current;
    if (!c) return;
    isNearBottomRef.current = c.scrollHeight - c.scrollTop - c.clientHeight < 40; // 여유값
  };

  // 새 메시지 도착 시 로직
  useEffect(() => {
    const handler = (e: any) => {
      const message = e.detail?.message;
      if (!message || message.chat_room_id !== chatRoomId) return;

      if (isNearBottomRef.current) {
        // 바닥이면 최신 캐시로 다시 fetch (또는 setQueryData append)
        // queryClient.invalidateQueries({ queryKey: ['chatMessages', chatRoomId] });
        queryClient.setQueryData(['chatMessages', chatRoomId], (oldData: any) => {
          if (!oldData || !oldData.pages?.length) return oldData;

          // 마지막 비어있지 않은 페이지 인덱스 찾기
          const lastNonEmptyIndex =
            [...oldData.pages]
              .map((p, idx) => ({ p, idx }))
              .reverse()
              .find(({ p }) => p.length > 0)?.idx ?? oldData.pages.length - 1;

          const pages = oldData.pages.map((p: any[]) => [...p]);
          pages[lastNonEmptyIndex] = [...pages[lastNonEmptyIndex], message];

          // 메시지 순서 재정렬
          pages[lastNonEmptyIndex] = pages[lastNonEmptyIndex].sort(
            (a: any, b: any) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
          );

          return { ...oldData, pages };
        });

        requestAnimationFrame(() => {
          scrollContainerRef.current?.scrollTo({ top: scrollContainerRef.current.scrollHeight });
        });
      } else {
        // 바닥이 아니면 신호만 켜기
        setHasPendingNewMessage(true);
      }
    };

    window.addEventListener('chat:new-message', handler);
    return () => window.removeEventListener('chat:new-message', handler);
  }, [chatRoomId, queryClient]);

  if (!isValid) {
    return ErrorComponent;
  }

  return (
    <div className="flex h-screen flex-col">
      <ChatRoomHeader
        isSearchMode={isSearchMode}
        setIsSearchMode={setIsSearchMode}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        handleSearchConfirm={handleSearchConfirm}
        setInputValue={setInputValue}
        setInputContainerHeight={setInputContainerHeight}
        setIsConfirm={setIsConfirm}
      />
      <div
        ref={scrollContainerRef}
        className="flex flex-col overflow-y-auto overscroll-none bg-tag px-[20px]"
        onScroll={handleScroll}
        style={{
          height: `calc(100vh - ${inputContainerHeight}px)`,
          minHeight: `calc(100vh - ${inputContainerHeight}px)`,
        }}
      >
        {hasPreviousPage && <div ref={topObserverElement} />}
        {messages.map((message: MessageType, idx: number) => {
          const isSearchResult = searchResults[currentSearchIndex]?.id === message.id;

          return (
            <div
              key={message.id}
              ref={(el) => setMessageRef(message.id, el)}
              className={`relative ${isSearchResult ? 'animate-[bounce_0.6s_ease-in-out]' : ''}`}
            >
              {/* {isSearchResult && <div className="absolute h-[80px]" />} */}
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
                  searchQuery={searchQuery}
                />
              )}
            </div>
          );
        })}

        {hasNextPage && <div ref={bottomObserverElement} />}
      </div>
      <div className="fixed bottom-0 left-0 right-0 z-40 mx-auto max-w-[600px] bg-white px-[20px] pb-[33px] pt-[10px]">
        {hasPendingNewMessage && (
          <div className="absolute inset-x-0 top-[-54px] flex justify-center">
            <button
              type="button"
              className="text-regular16 rounded-full bg-primary px-3 py-2 text-white shadow"
              onClick={async () => {
                setHasPendingNewMessage(false);
                await queryClient.invalidateQueries({ queryKey: ['chatMessages', chatRoomId] });
                requestAnimationFrame(() => {
                  if (scrollContainerRef.current) {
                    scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
                  }
                });
              }}
            >
              새 메시지 보기
            </button>
          </div>
        )}
        {isSearchMode ? (
          <div className="flex justify-between pb-[22px]">
            <div className="w-[56px]" />
            {isConfirm ? (
              <div className="text-regular16">
                {currentSearchIndex + 1}/{searchCount}
              </div>
            ) : (
              <div />
            )}
            <div className="flex items-center gap-[8px]">
              <button type="button" className="text-regular16" onClick={handlePreviousSearchResult}>
                <ChevronDownIcon />
              </button>
              <button type="button" className="text-regular16" onClick={handleNextSearchResult}>
                <ChevronUpIcon />
              </button>
            </div>
          </div>
        ) : (
          <textarea
            ref={textareaRef}
            rows={1}
            value={inputValue}
            placeholder={chatRoomInfo?.is_active ? '입력' : '채팅방이 비활성화되었습니다.'}
            className="text-regular16 box-border w-full resize-none overflow-hidden rounded-[8px] bg-gray0 py-[9px] pl-[21px] pr-[52px] leading-normal outline-none placeholder:text-gray2"
            onChange={handleInput}
            disabled={!chatRoomInfo?.is_active}
          />
        )}
        {inputValue.trim() !== '' && (
          <button
            type="button"
            className="absolute bottom-[48px] right-[26px]"
            onClick={() => {
              if (!inputValue.trim()) return;

              handleSendTextMessage(inputValue);
              textareaRef.current?.focus();
            }}
            disabled={isPending}
          >
            <RightArrowIcon6 />
          </button>
        )}
      </div>
    </div>
  );
}

export default ChatRoomPage;
