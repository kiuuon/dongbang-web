import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { ClipLoader } from 'react-spinners';

import { fetchSession } from '@/lib/apis/auth';
import { fetchFeedsByClubType } from '@/lib/apis/feed/feed';
import { fetchMyClubs } from '@/lib/apis/club';
import { handleQueryError } from '@/lib/utils';
import { ERROR_MESSAGE } from '@/lib/constants';
import loginModalStore from '@/stores/login-modal-store';
import BottomSheet from '@/components/common/bottom-sheet';
import FeedHeader from '@/components/feed/feed-header';
import JoinClubPrompt from '@/components/feed/join-club-prompt';
import NotFeed from '@/components/feed/not-feed';
import FeedCard from '@/components/feed/feed-card/feed-card';

function FeedPage() {
  const observerElement = useRef(null);
  const router = useRouter();
  const { clubType } = router.query;
  const bottomSheetCloseRef = useRef<() => void>(null);
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
  const setIsLoginModalOpen = loginModalStore((state) => state.setIsOpen);

  useEffect(() => {
    const key = `scroll:${router.asPath}`;

    const savedPosition = sessionStorage.getItem(key);
    if (document.scrollingElement && savedPosition) {
      document.scrollingElement.scrollTop = parseInt(savedPosition, 10);
      sessionStorage.removeItem(key);
    }
  }, [router]);

  const { data: session } = useQuery({
    queryKey: ['session'],
    queryFn: fetchSession,
    throwOnError: (error) => handleQueryError(error, ERROR_MESSAGE.SESSION.FETCH_FAILED),
  });

  const { data: myClubs } = useQuery({
    queryKey: ['myClubs'],
    queryFn: fetchMyClubs,
    throwOnError: (error) => handleQueryError(error, ERROR_MESSAGE.CLUB.LIST_FETCH_FAILED),
  });

  const { data, fetchNextPage, hasNextPage, isPending } = useInfiniteQuery({
    initialPageParam: 0,
    queryKey: ['feeds', clubType],
    queryFn: ({ pageParam }) => fetchFeedsByClubType(clubType as 'my' | 'campus' | 'union' | 'all', pageParam),
    getNextPageParam: (lastPage, allPages) => (lastPage?.length ? allPages.length : undefined),
    throwOnError: (error) => handleQueryError(error, ERROR_MESSAGE.FEED.LIST_FETCH_FAILED),
  });

  useEffect(() => {
    const target = observerElement.current;
    if (!target) return undefined;

    const observerInstance = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && hasNextPage) {
            fetchNextPage();
          }
        });
      },
      { threshold: 1 },
    );

    observerInstance.observe(target);

    return () => observerInstance.unobserve(target);
  }, [fetchNextPage, hasNextPage]);

  const getContent = () => {
    if (isPending) {
      return null;
    }

    if (clubType === 'my' && myClubs?.length === 0) {
      return <JoinClubPrompt />;
    }

    if (data?.pages[0].length === 0) {
      return (
        <div>
          <NotFeed />
        </div>
      );
    }

    return data?.pages.map((page) => page?.map((feed) => <FeedCard key={feed.id} feed={feed} />));
  };

  const goToSelectedClubType = (selectedClubType: string) => {
    router.replace(`/feed/${selectedClubType}`);
    bottomSheetCloseRef.current?.();
  };

  return (
    <div
      className={`scrollbar-hide flex min-h-screen flex-col px-[20px] ${data?.pages[0] && data?.pages[0].length > 0 ? 'pb-[200px]' : ''} pt-[76px]`}
    >
      <FeedHeader setIsBottomSheetOpen={setIsBottomSheetOpen} />
      {getContent()}

      {hasNextPage && (
        <div ref={observerElement} className="flex h-[40px] items-center justify-center text-[32px]">
          <ClipLoader size={30} color="#F9A825" />
        </div>
      )}

      {isBottomSheetOpen && (
        <BottomSheet
          setIsBottomSheetOpen={setIsBottomSheetOpen}
          onRequestClose={(closeFn) => {
            bottomSheetCloseRef.current = closeFn;
          }}
        >
          <div className="mb-[12px] mt-[12px] h-[2px] w-[37px] rounded-[10px] bg-gray1 px-[20px]" />
          <div className="flex w-full flex-col px-[20px]">
            {clubType !== 'my' && (
              <button
                type="button"
                className="text-bold16 flex h-[66px] w-full items-center border-b border-b-gray0"
                onClick={() => {
                  if (session?.user) {
                    goToSelectedClubType('my');
                  } else {
                    setIsBottomSheetOpen(false);
                    setIsLoginModalOpen(true);
                  }
                }}
              >
                내 동아리
              </button>
            )}
            {clubType !== 'campus' && (
              <button
                type="button"
                className="text-bold16 flex h-[66px] w-full items-center border-b border-b-gray0"
                onClick={() => {
                  if (session?.user) {
                    goToSelectedClubType('campus');
                  } else {
                    setIsBottomSheetOpen(false);
                    setIsLoginModalOpen(true);
                  }
                }}
              >
                교내 동아리
              </button>
            )}
            {clubType !== 'union' && (
              <button
                type="button"
                className="text-bold16 flex h-[66px] w-full items-center border-b border-b-gray0"
                onClick={() => goToSelectedClubType('union')}
              >
                연합 동아리
              </button>
            )}
            {clubType !== 'all' && (
              <button
                type="button"
                className="text-bold16 flex h-[66px] w-full items-center border-b border-b-gray0"
                onClick={() => goToSelectedClubType('all')}
              >
                모든 동아리
              </button>
            )}
          </div>
        </BottomSheet>
      )}
    </div>
  );
}

export default FeedPage;
