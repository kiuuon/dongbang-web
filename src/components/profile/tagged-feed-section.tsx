import { useEffect, useRef } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useInfiniteQuery } from '@tanstack/react-query';
import { ClipLoader } from 'react-spinners';

import { handleQueryError } from '@/lib/utils';
import { ERROR_MESSAGE } from '@/lib/constants';
import { fetchFeedsTaggedUser } from '@/lib/apis/feed/feed';
import FeedCard from '../feed/feed-card/feed-card';

function TaggedFeedSection({ userId, viewType }: { userId: string; viewType: string }) {
  const router = useRouter();

  const observerElement = useRef(null);

  const { data, fetchNextPage, hasNextPage } = useInfiniteQuery({
    initialPageParam: 0,
    queryKey: ['feeds', userId],
    queryFn: ({ pageParam }) => fetchFeedsTaggedUser(userId as string, pageParam),
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
    return <div className="text-bold24 mt-[128px] flex w-full items-center justify-center">태그된 피드 없음</div>;
  }

  return (
    <div>
      {viewType === 'grid' && (
        <div className="grid w-full grid-cols-3 gap-[1px]">
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
                  sessionStorage.setItem(`scroll:${router.asPath}`, `${document.scrollingElement?.scrollTop || 0}`);

                  router.push(`/feed/detail/${feed.id}`);
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
        <div>{data?.pages.map((page) => page.map((feed) => <FeedCard key={feed.id} feed={feed} />))}</div>
      )}
      {hasNextPage && (
        <div ref={observerElement} className="flex h-[40px] items-center justify-center text-[32px]">
          <ClipLoader size={30} color="#F9A825" />
        </div>
      )}
    </div>
  );
}

export default TaggedFeedSection;
