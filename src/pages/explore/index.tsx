import { useEffect, useRef, useState } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { ClipLoader } from 'react-spinners';

import { fetchClubs } from '@/lib/apis/club';
import AdjustmentsIcon from '@/icons/adjustments-icon';
import ClubCard from '@/components/explore/club-card';

function Explore() {
  const observerElement = useRef(null);
  const [searchTarget, setSearchTarget] = useState('club');

  const { data, fetchNextPage, hasNextPage } = useInfiniteQuery({
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

  return (
    <div className="flex h-screen flex-col pt-[19px]">
      <div className="px-[20px]">
        <input
          placeholder="검색"
          className="text-regular16 h-[39px] w-full rounded-[10px] bg-gray0 px-[12px] py-[10px] placeholder:text-gray2"
        />
        <div className="mb-[17px] mt-[12px] flex flex-row gap-[14px]">
          <button
            type="button"
            className={`text-bold16 flex h-[29px] w-[52px] items-center justify-center border-b-[2px] ${searchTarget === 'club' ? 'border-b-primary text-black' : 'border-b-white text-gray2'}`}
            onClick={() => setSearchTarget('club')}
          >
            동아리
          </button>
          <button
            type="button"
            className={`text-bold16 flex h-[29px] w-[52px] items-center justify-center border-b-[2px] ${searchTarget === 'feed' ? 'border-b-primary text-black' : 'border-b-white text-gray2'}`}
            onClick={() => setSearchTarget('feed')}
          >
            피드
          </button>
          <button
            type="button"
            className={`text-bold16 flex h-[29px] w-[52px] items-center justify-center border-b-[2px] ${searchTarget === 'tag' ? 'border-b-primary text-black' : 'border-b-white text-gray2'}`}
            onClick={() => setSearchTarget('tag')}
          >
            태그
          </button>
        </div>
        <div className="flex flex-row items-center justify-between">
          <div />
          <button type="button">
            <AdjustmentsIcon />
          </button>
        </div>
      </div>
      <div className="-mx-[20px] mt-[7px] h-[6px] w-[calc(100%+20px)] bg-background" />
      <div className="flex min-h-0 flex-1 flex-col gap-[10px] overflow-y-scroll px-[10px] pb-[80px] pt-[10px]">
        <div className="text-regular10 ml-[10px]">총 12건</div>
        {data?.pages.map((page) => page?.map((club) => <ClubCard key={club.id} club={club} />))}
        {hasNextPage && (
          <div ref={observerElement} className="flex h-[40px] items-center justify-center text-[32px]">
            <ClipLoader size={30} color="#F9A825" />
          </div>
        )}
      </div>
    </div>
  );
}

export default Explore;
