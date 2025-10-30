import { useEffect, useRef } from 'react';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { ClipLoader } from 'react-spinners';

import { fetchClubs, fetchClubsCount } from '@/lib/apis/club';
import { handleQueryError } from '@/lib/utils';
import { ERROR_MESSAGE } from '@/lib/constants';
import { ClubType } from '@/types/club-type';
import filtersStore from '@/stores/filter-store';
import BottomSheet from '@/components/common/bottom-sheet';
import ClubCard from './club-card';
import DetailSearchModal from './detail-search-modal/detail.search-modal';

function ClubSection({
  keyword,
  isDetailSearchModalOpen,
  setIsDetailSearchModalOpen,
}: {
  keyword: string;
  isDetailSearchModalOpen: boolean;
  setIsDetailSearchModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const { filters } = filtersStore();

  const observerElement = useRef(null);
  const { data: clubCount } = useQuery({
    queryKey: ['clubCount', keyword, filters],
    queryFn: () => fetchClubsCount(keyword, filters),
    throwOnError: (error) => handleQueryError(error, ERROR_MESSAGE.CLUB.COUNT_FETCH_FAILED),
  });

  const { data, fetchNextPage, hasNextPage, isPending } = useInfiniteQuery({
    initialPageParam: 0,
    queryKey: ['clubs', keyword, filters],
    queryFn: ({ pageParam }) => fetchClubs(keyword, filters, pageParam),
    getNextPageParam: (lastPage, allPages) => (lastPage?.length ? allPages.length : undefined),
    throwOnError: (error) => handleQueryError(error, ERROR_MESSAGE.CLUB.LIST_FETCH_FAILED),
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
    <div>
      <div className="scrollbar-hide flex h-[calc(100vh-200px)] flex-col overflow-y-scroll pb-[40px] pt-[15px]">
        {!isPending && <div className="text-regular12 ml-[20px]">총 {clubCount}건</div>}
        <div className="flex flex-col gap-[8px] px-[10px] pt-[12px]">
          {isPending ? (
            <div className="flex w-full justify-center">
              <ClipLoader size={30} color="#F9A825" />
            </div>
          ) : (
            data?.pages.map((page) => page?.map((club: ClubType) => <ClubCard key={club.id} club={club} />))
          )}
          {hasNextPage && (
            <div ref={observerElement} className="flex h-[40px] items-center justify-center text-[32px]">
              <ClipLoader size={30} color="#F9A825" />
            </div>
          )}
        </div>
      </div>

      {isDetailSearchModalOpen && (
        <BottomSheet setIsBottomSheetOpen={setIsDetailSearchModalOpen}>
          <DetailSearchModal setIsDetailSearchModalOpen={setIsDetailSearchModalOpen} />
        </BottomSheet>
      )}
    </div>
  );
}

export default ClubSection;
