import { useEffect, useRef } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { ClipLoader } from 'react-spinners';

import { FeedType } from '@/types/feed-type';
import { searchFeeds } from '@/lib/apis/feed/feed';
import FeedCard from './feed-card';

function FeedSection({ keyword }: { keyword: string }) {
  const observerElement = useRef(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const savedPosition = sessionStorage.getItem('scrollPosition');
    if (scrollRef.current && savedPosition) {
      scrollRef.current.scrollTop = parseInt(savedPosition, 10);
      sessionStorage.removeItem('scrollPosition');
    }
  }, []);

  const { data, fetchNextPage, hasNextPage, isPending } = useInfiniteQuery({
    initialPageParam: 0,
    queryKey: ['feeds', keyword],
    queryFn: ({ pageParam }) => searchFeeds(keyword, pageParam),
    getNextPageParam: (lastPage, allPages) => (lastPage?.length ? allPages.length : undefined),
    placeholderData: (prev) => prev,
    throwOnError: (error) => {
      alert(`피드를 불러오는 데 실패했습니다. 다시 시도해주세요.\n\n${error.message}`);
      return false;
    },
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

  if (isPending) {
    return (
      <div className="flex w-full justify-center">
        <ClipLoader size={30} color="#F9A825" />
      </div>
    );
  }

  return (
    <div
      ref={scrollRef}
      className="scrollbar-hide mx-auto grid w-full grid-cols-2 gap-[13px] overflow-y-scroll px-[20px] pb-[80px] pt-[15px]"
    >
      {data?.pages.map((page) =>
        page.map((feed: FeedType) => <FeedCard key={feed.id} feed={feed} scrollRef={scrollRef} />),
      )}
      {hasNextPage && (
        <div ref={observerElement} className="flex h-[40px] items-center justify-center text-[32px]">
          <ClipLoader size={30} color="#F9A825" />
        </div>
      )}
    </div>
  );
}

export default FeedSection;
