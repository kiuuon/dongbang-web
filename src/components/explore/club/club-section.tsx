import { useEffect, useRef } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { ClipLoader } from 'react-spinners';

import { fetchClubs } from '@/lib/apis/club';
import ClubCard from './club-card';

function ClubSection() {
  const observerElement = useRef(null);
  const { data, fetchNextPage, hasNextPage, isPending } = useInfiniteQuery({
    initialPageParam: 0,
    queryKey: ['clubs'],
    queryFn: ({ pageParam }) => fetchClubs(pageParam),
    getNextPageParam: (lastPage, allPages) => (lastPage?.length ? allPages.length : undefined),
    throwOnError: (error) => {
      if (window.ReactNativeWebView) {
        window.ReactNativeWebView.postMessage(
          JSON.stringify({
            type: 'error',
            headline: '동아리를 불러오는 데 실패했습니다. 다시 시도해주세요.',
            message: error.message,
          }),
        );
        return false;
      }
      alert(`동아리를 불러오는 데 실패했습니다. 다시 시도해주세요.\n\n${error.message}`);
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
    <div className="scrollbar-hide flex min-h-0 flex-1 flex-col gap-[10px] overflow-y-scroll px-[10px] pb-[80px] pt-[10px]">
      <div className="text-regular10 ml-[10px]">총 12건</div>
      {data?.pages.map((page) => page?.map((club) => <ClubCard key={club.id} club={club} />))}
      {hasNextPage && (
        <div ref={observerElement} className="flex h-[40px] items-center justify-center text-[32px]">
          <ClipLoader size={30} color="#F9A825" />
        </div>
      )}
    </div>
  );
}

export default ClubSection;
