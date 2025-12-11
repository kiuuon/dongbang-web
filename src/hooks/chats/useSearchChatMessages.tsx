import { useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import { useQuery, useQueryClient } from '@tanstack/react-query';

import { fetchChatMessagesAround, searchChatMessages } from '@/lib/apis/chats';
import { handleQueryError } from '@/lib/utils';
import { ERROR_MESSAGE } from '@/lib/constants';

function useSearchChatMessages() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { chatRoomId } = router.query as { chatRoomId: string };
  const [isSearchMode, setIsSearchMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isConfirm, setIsConfirm] = useState(false);
  const [searchCount, setSearchCount] = useState(0);

  const messageRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const [currentSearchIndex, setCurrentSearchIndex] = useState(0);

  // 메시지 ref 설정
  const setMessageRef = (messageId: string, element: HTMLDivElement | null) => {
    if (element) {
      messageRefs.current.set(messageId, element);
    } else {
      messageRefs.current.delete(messageId);
    }
  };

  // 서버에서 검색 결과 가져오기
  const { data: serverSearchResults } = useQuery({
    queryKey: ['chatSearch', chatRoomId, searchQuery],
    queryFn: () => searchChatMessages(chatRoomId, searchQuery),
    enabled: false, // 수동으로만 실행
    throwOnError: (error) => handleQueryError(error, ERROR_MESSAGE.CHATS.FETCH_FAILED),
  });

  // 검색 결과 (최신순으로 정렬)
  const searchResults = useMemo(() => {
    if (!serverSearchResults || serverSearchResults.length === 0) return [];
    return [...serverSearchResults].sort(
      (a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
    );
  }, [serverSearchResults]);

  // 검색 실행 (확인 클릭 시)
  const handleSearchConfirm = async () => {
    if (!searchQuery.trim()) return;

    // 검색 결과 가져오기
    const results = await queryClient.fetchQuery({
      queryKey: ['chatSearch', chatRoomId, searchQuery],
      queryFn: () => searchChatMessages(chatRoomId, searchQuery),
    });

    if (!results || results.length === 0) {
      alert('검색 결과가 없습니다.');
      return;
    }

    setSearchCount(results.length);

    setIsConfirm(true);

    // 검색 결과를 최신 순으로 정렬
    const sortedResults = [...results].sort(
      (a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(), // 최신 순
    );

    const newestResult = sortedResults[0]; // 최신 순이므로 첫 번째가 가장 최신
    setCurrentSearchIndex(0); // 가장 최신 검색 결과 인덱스

    // 캐시된 메시지에서 검색 결과가 있는지 확인
    const cachedMessages = queryClient.getQueryData(['chatMessages', chatRoomId]) as any;
    const flatCachedMessages = cachedMessages?.pages?.flat() || [];
    const isMessageInCache = flatCachedMessages.some((msg: any) => msg.id === newestResult.id);

    if (isMessageInCache) {
      // 캐시에 있으면 스크롤만 이동
      setTimeout(() => {
        const messageElement = messageRefs.current.get(newestResult.id);
        if (messageElement) {
          messageElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 100);
      return;
    }

    // 캐시에 없으면 서버에서 fetch
    const messagesAround = await fetchChatMessagesAround(chatRoomId, newestResult.created_at);

    if (messagesAround && messagesAround.length > 0) {
      // 캐시 교체
      queryClient.setQueryData(['chatMessages', chatRoomId], {
        pages: [messagesAround],
        pageParams: [{ cursor: null, direction: 'initial' }],
      });
    }
  };

  // 아래 방향키: 더 최신 검색 결과를 기준으로 fetch (인덱스 감소)
  const handlePreviousSearchResult = async () => {
    if (currentSearchIndex <= 0 || searchResults.length === 0) return;

    const previousIndex = currentSearchIndex - 1; // 더 최신으로
    const previousResult = searchResults[previousIndex];

    // 캐시된 메시지에서 검색 결과가 있는지 확인
    const cachedMessages = queryClient.getQueryData(['chatMessages', chatRoomId]) as any;
    const flatCachedMessages = cachedMessages?.pages?.flat() || [];
    const isMessageInCache = flatCachedMessages.some((msg: any) => msg.id === previousResult.id);

    if (isMessageInCache) {
      // 캐시에 있으면 스크롤만 이동
      setTimeout(() => {
        const messageElement = messageRefs.current.get(previousResult.id);
        if (messageElement) {
          messageElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 100);

      setCurrentSearchIndex(previousIndex);
      return;
    }

    // 캐시에 없으면 서버에서 fetch
    const messagesAround = await fetchChatMessagesAround(chatRoomId, previousResult.created_at);

    if (messagesAround && messagesAround.length > 0) {
      // 캐시 교체 (페이지 나누지 않고 하나의 페이지로)
      queryClient.setQueryData(['chatMessages', chatRoomId], {
        pages: [messagesAround],
        pageParams: [{ cursor: null, direction: 'initial' }],
      });

      setCurrentSearchIndex(previousIndex);
    }
  };

  // 위 방향키: 더 오래된 검색 결과를 기준으로 fetch (인덱스 증가)
  const handleNextSearchResult = async () => {
    if (currentSearchIndex >= searchResults.length - 1 || searchResults.length === 0) return;

    const nextIndex = currentSearchIndex + 1; // 더 오래된 것으로
    const nextResult = searchResults[nextIndex];

    // 캐시된 메시지에서 검색 결과가 있는지 확인
    const cachedMessages = queryClient.getQueryData(['chatMessages', chatRoomId]) as any;
    const flatCachedMessages = cachedMessages?.pages?.flat() || [];
    const isMessageInCache = flatCachedMessages.some((msg: any) => msg.id === nextResult.id);

    if (isMessageInCache) {
      // 캐시에 있으면 스크롤만 이동
      setTimeout(() => {
        const messageElement = messageRefs.current.get(nextResult.id);
        if (messageElement) {
          messageElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 100);

      setCurrentSearchIndex(nextIndex);
      return;
    }

    // 캐시에 없으면 서버에서 fetch
    const messagesAround = await fetchChatMessagesAround(chatRoomId, nextResult.created_at);

    if (messagesAround && messagesAround.length > 0) {
      // 캐시 교체 (페이지 나누지 않고 하나의 페이지로)
      queryClient.setQueryData(['chatMessages', chatRoomId], {
        pages: [messagesAround],
        pageParams: [{ cursor: null, direction: 'initial' }],
      });

      setCurrentSearchIndex(nextIndex);

      // 마지막 인덱스가 아니라 마지막 페이지인 경우 스크롤링 필요
      if (messagesAround.length < 20) {
        setTimeout(() => {
          const messageElement = messageRefs.current.get(nextResult.id);
          if (messageElement) {
            messageElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }, 100);
      }
    }
  };

  return {
    isSearchMode,
    setIsSearchMode,
    searchQuery,
    setSearchQuery,
    isConfirm,
    setIsConfirm,
    serverSearchResults,
    handleSearchConfirm,
    messageRefs,
    setMessageRef,
    currentSearchIndex,
    setCurrentSearchIndex,
    searchCount,
    setSearchCount,
    searchResults,
    handlePreviousSearchResult,
    handleNextSearchResult,
  };
}

export default useSearchChatMessages;
