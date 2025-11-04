import { useEffect, useRef } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { ClipLoader } from 'react-spinners';

import { fetchUserId } from '@/lib/apis/auth';
import { handleQueryError } from '@/lib/utils';
import { ERROR_MESSAGE } from '@/lib/constants';
import { fetchFeedsByAuthor } from '@/lib/apis/feed/feed';
import profileViewTypeStore from '@/stores/profile-view-type-store';
import FeedCard from '../feed/feed-card/feed-card';

function AuthoredFeedSection({ scrollRef }: { scrollRef: React.RefObject<HTMLDivElement | null> }) {
  const router = useRouter();
  const viewType = profileViewTypeStore((state) => state.viewType);

  const observerElement = useRef(null);

  const { data: userId } = useQuery({
    queryKey: ['userId'],
    queryFn: fetchUserId,
    throwOnError: (error) => handleQueryError(error, ERROR_MESSAGE.USER.ID_FETCH_FAILED),
  });

  const { data, fetchNextPage, hasNextPage } = useInfiniteQuery({
    initialPageParam: 0,
    queryKey: ['authoredFeedList', userId],
    queryFn: ({ pageParam }) => fetchFeedsByAuthor(userId as string, pageParam),
    getNextPageParam: (lastPage, allPages) => (lastPage?.length === 15 ? allPages.length : undefined),
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

  if (data?.pages[0].length === 0) {
    return <div className="text-bold24 mt-[128px] flex w-full items-center justify-center">작성한 피드 없음</div>;
  }

  return (
    <div>
      {viewType === 'grid' && (
        <div className="grid w-full grid-cols-3">
          {data?.pages.map((page) =>
            page.map((feed) => (
              <button
                type="button"
                className="relative aspect-square w-full"
                onClick={() => {
                  if (window.ReactNativeWebView) {
                    window.ReactNativeWebView.postMessage(
                      JSON.stringify({ type: 'event', action: 'go to feed detail page', payload: feed.id }),
                    );
                    return;
                  }
                  router.push({
                    pathname: `/feed/detail/${feed.id}`,
                    query: { scroll: scrollRef.current?.scrollTop || 0 },
                  });
                }}
              >
                <Image
                  src={feed.photos[0]}
                  alt="피드 이미지"
                  fill
                  style={{
                    objectFit: 'cover',
                  }}
                />
              </button>
            )),
          )}
        </div>
      )}
      {viewType === 'list' && (
        <div>
          {data?.pages.map((page) => page.map((feed) => <FeedCard key={feed.id} feed={feed} scrollRef={scrollRef} />))}
        </div>
      )}
      {hasNextPage && (
        <div ref={observerElement} className="flex h-[40px] items-center justify-center text-[32px]">
          <ClipLoader size={30} color="#F9A825" />
        </div>
      )}
    </div>
  );
}

export default AuthoredFeedSection;
