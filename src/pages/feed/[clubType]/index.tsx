import { useState, useRef, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useInfiniteQuery } from '@tanstack/react-query';
import { ClipLoader } from 'react-spinners';

import { fetchFeedsByClubType } from '@/lib/apis/feed';
import BottomSheet from '@/components/common/bottom-sheet';
import FeedHeader from '@/components/feed/feed-header';
import JoinClubPrompt from '@/components/feed/join-club-prompt';
import NotFeed from '@/components/feed/not-feed';
import FeedCard from '@/components/feed/feed-card/feed-card';

function FeedPage() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const observerElement = useRef(null);
  const router = useRouter();
  const { clubType } = router.query;
  const bottomSheetCloseRef = useRef<() => void>(null);
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);

  const { data, fetchNextPage, hasNextPage, isPending } = useInfiniteQuery({
    initialPageParam: 0,
    queryKey: ['feeds', clubType],
    queryFn: ({ pageParam }) => fetchFeedsByClubType(clubType as 'my' | 'campus' | 'union', pageParam),
    getNextPageParam: (lastPage, allPages) => (lastPage?.length ? allPages.length : undefined),
    throwOnError: (error) => {
      if (window.ReactNativeWebView) {
        window.ReactNativeWebView.postMessage(
          JSON.stringify({
            type: 'error',
            headline: '피드를 불러오는 데 실패했습니다. 다시 시도해주세요.',
            message: error.message,
          }),
        );
        return false;
      }
      alert(`피드를 불러오는 데 실패했습니다. 다시 시도해주세요.\n\n${error.message}`);
      return false;
    },
  });

  useEffect(() => {
    // 피드 부분만 스크롤이 가능하도록 전체 스크롤은 막기
    document.body.style.overflow = 'hidden';
  }, []);

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

    if (!data?.pages[0]) {
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
    <>
      <Head>
        {data?.pages.map((page) =>
          page?.map((feed) =>
            feed.photos.map((photo: string) => <link key={photo} rel="preload" as="image" href={photo} />),
          ),
        )}
      </Head>
      <div
        ref={scrollRef}
        className={`scrollbar-hide flex h-screen flex-col gap-[30px] overflow-y-scroll px-[20px] ${data?.pages[0] && data?.pages[0].length > 0 ? 'pb-[200px]' : ''} pt-[76px]`}
      >
        <FeedHeader scrollRef={scrollRef} setIsBottomSheetOpen={setIsBottomSheetOpen} />
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
            <div className="mb-[17px] mt-[10px] h-[4px] w-[37px] rounded-[10px] bg-gray1 px-[20px]" />
            <div className="flex w-full flex-col px-[20px]">
              {clubType !== 'my' && (
                <button
                  type="button"
                  className="text-bold16 flex h-[66px] w-full items-center border-b border-b-gray0"
                  onClick={() => goToSelectedClubType('my')}
                >
                  내 동아리
                </button>
              )}
              {clubType !== 'campus' && (
                <button
                  type="button"
                  className="text-bold16 flex h-[66px] w-full items-center border-b border-b-gray0"
                  onClick={() => goToSelectedClubType('campus')}
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
            </div>
          </BottomSheet>
        )}
      </div>
    </>
  );
}

export default FeedPage;
