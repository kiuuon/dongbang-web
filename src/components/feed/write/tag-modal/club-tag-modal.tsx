import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useInfiniteQuery } from '@tanstack/react-query';
import { ClipLoader } from 'react-spinners';

import { fetchClubs } from '@/lib/apis/club';
import { ClubType } from '@/types/club-type';

function ClubTagModal({
  selected,
  setSelected,
}: {
  selected: string[];
  setSelected: React.Dispatch<React.SetStateAction<string[]>>;
}) {
  const router = useRouter();
  const { clubId } = router.query;
  const [searchText, setSearchText] = useState('');

  const observerElement = useRef(null);

  const filters = {
    clubType: null,
    universityName: null,
    detailTypes: [],
    location: null,
    categories: [],
    recruitmentStatuses: [],
    endDateOption: null,
    meeting: null,
    duesOption: null,
  };

  const { data, fetchNextPage, hasNextPage } = useInfiniteQuery({
    initialPageParam: 0,
    queryKey: ['clubs', searchText, filters],
    queryFn: ({ pageParam }) => fetchClubs(searchText, filters, pageParam),
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

  const selectClub = (selectedClubId: string) => {
    setSelected((prev) =>
      prev.includes(selectedClubId) ? prev.filter((id) => id !== selectedClubId) : [...prev, selectedClubId],
    );
  };

  return (
    <div className="w-full">
      <input
        value={searchText}
        onChange={(event) => setSearchText(event.target.value)}
        placeholder="검색"
        className="text-regular16 mb-[20px] mt-[23px] h-[40px] w-full rounded-[10px] bg-gray0 px-[13px] placeholder:text-gray2"
      />
      <div className="scrollbar-hide flex h-[140px] w-full flex-col gap-[10px] overflow-y-scroll">
        {data?.pages?.map((page) =>
          page.map(
            (club: ClubType) =>
              club.id !== clubId && (
                <div key={club.id} className="flex h-[40px] min-h-[40px] w-full items-center justify-between">
                  <Image
                    src={club.logo}
                    alt="로고"
                    width={40}
                    height={40}
                    style={{
                      objectFit: 'cover',
                      width: '40px',
                      height: '40px',
                      minWidth: '40px',
                      minHeight: '40px',
                      borderRadius: '5px',
                      border: '1px solid #F9F9F9',
                    }}
                  />
                  <button
                    type="button"
                    aria-label="클럽 선택"
                    className="ml-[29px] flex w-full items-center justify-between"
                    onClick={() => selectClub(club.id)}
                  >
                    <span className="text-bold12">{club.name}</span>
                    <div
                      className={`h-[20px] w-[20px] rounded-full ${selected.includes(club.id) ? 'bg-primary' : 'border border-gray2 bg-white'}`}
                    />
                  </button>
                </div>
              ),
          ),
        )}
        {hasNextPage && (
          <div ref={observerElement} className="flex h-[40px] items-center justify-center text-[32px]">
            <ClipLoader size={30} color="#F9A825" />
          </div>
        )}
      </div>
    </div>
  );
}

export default ClubTagModal;
