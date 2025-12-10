import { useMemo } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';

import { fetchChatMessages } from '@/lib/apis/chats';
import { handleQueryError } from '@/lib/utils';
import { ERROR_MESSAGE } from '@/lib/constants';
import { groupSystemMessages } from '@/lib/chats/service';
import { MessageType } from '@/types/message-type';

function useFetchChatMessages(chatRoomId: string) {
  const {
    data: chatMessages,
    fetchNextPage,
    hasNextPage,
    fetchPreviousPage,
    hasPreviousPage,
  } = useInfiniteQuery({
    queryKey: ['chatMessages', chatRoomId],
    queryFn: async ({ pageParam }) =>
      fetchChatMessages(
        chatRoomId,
        pageParam as { cursor: string | null; cursorId: string | null; direction: 'initial' | 'past' | 'future' },
      ),
    initialPageParam: { cursor: null, cursorId: null, direction: 'initial' },
    // 위로 스크롤 (과거 메시지 로드) -> PREVIOUS Page
    getPreviousPageParam: (firstPage) => {
      if (!firstPage || firstPage.length === 0) return undefined;
      const oldestMsg = firstPage[0];
      return { cursor: oldestMsg.created_at, cursorId: oldestMsg.id, direction: 'past' };
    },
    // 아래로 스크롤 (최신 메시지 로드) -> NEXT Page
    getNextPageParam: (lastPage) => {
      if (!lastPage || lastPage.length === 0) return undefined;
      const newestMsg = lastPage[lastPage.length - 1];
      return { cursor: newestMsg.created_at, cursorId: newestMsg.id, direction: 'future' };
    },
    throwOnError: (error) => handleQueryError(error, ERROR_MESSAGE.CHATS.FETCH_FAILED),
    refetchOnWindowFocus: false,
  });

  const firstPageUnreadCount = useMemo(
    () => chatMessages?.pages[0]?.filter((message: MessageType) => message.is_unread === true).length ?? 0,
    [chatMessages?.pages],
  );

  const flatMessages = useMemo(() => (chatMessages?.pages ?? []).flat(), [chatMessages?.pages]);

  const groupedMessages = useMemo(() => groupSystemMessages(flatMessages), [flatMessages]);

  // 시스템 메시지 제외하고 첫 안 읽은 text 메시지 찾기
  const firstUnreadIndex = useMemo(
    () => groupedMessages.findIndex((message: MessageType) => message.message_type === 'text' && message.is_unread),
    [groupedMessages],
  );

  // 첫 안 읽은 메시지가 없으면 마지막 메시지를 경계로 사용
  const boundaryIndex = useMemo(
    () => (firstUnreadIndex >= 0 ? firstUnreadIndex : groupedMessages.length - 1),
    [firstUnreadIndex, groupedMessages.length],
  );

  return {
    firstPageUnreadCount,
    messages: groupedMessages,
    firstUnreadIndex,
    boundaryIndex,
    fetchNextPage,
    hasNextPage,
    fetchPreviousPage,
    hasPreviousPage,
    chatMessages,
  };
}

export default useFetchChatMessages;
