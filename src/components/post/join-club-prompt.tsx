import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import Image from 'next/image';

import { fetchRecommendedClubs } from '@/lib/apis/club';
import XIcon from '@/icons/x-icon';

function JoinClubPrompt() {
  const { data: recommendedClubs } = useQuery({
    queryKey: ['recommendedClubs'],
    queryFn: fetchRecommendedClubs,
  });

  const [clubList, setClubList] = useState<typeof recommendedClubs>([]);

  useEffect(() => {
    if (recommendedClubs) {
      setClubList(recommendedClubs);
    }
  }, [recommendedClubs]);

  const handleRemoveClub = (index: number) => {
    setClubList((prev = []) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="flex w-full flex-col gap-[204px]">
      <div className="mt-[144px] flex w-full flex-col items-center justify-center gap-[12px]">
        <p className="text-regular20">가입한 동아리가 없어요</p>
        <button
          type="button"
          className="text-regular20 h-[36px] w-[136px] rounded-[10px] bg-secondary text-tertiary_dark"
        >
          가입하러가기
        </button>
      </div>
      {clubList?.length !== 0 && (
        <div className="flex flex-col gap-[8px]">
          <div className="text-bold16 ml-[12px]">동아리 추천</div>
          <div className="scrollbar-hide flex w-full flex-nowrap overflow-x-auto pl-[5px]">
            {clubList?.map((club, index) => (
              <div
                key={club.id}
                className="relative mr-[5px] flex h-[230px] min-w-[150px] flex-col items-center gap-[8px] rounded-[3px] border border-gray0 bg-secondary_light pt-[13px]"
              >
                <button
                  type="button"
                  className="absolute right-[7px] top-[7px]"
                  onClick={() => {
                    handleRemoveClub(index);
                  }}
                >
                  <XIcon />
                </button>
                <Image
                  src={club.logo}
                  alt="로고"
                  width={100}
                  height={100}
                  style={{
                    objectFit: 'cover',
                    width: '100px',
                    height: '100px',
                  }}
                />
                <div className="text-bold14 h-[18px] text-gray3">{club.name}</div>
                <div className="h-[42px] w-[120px]">
                  {club.tags.map(
                    (tag: string, idx: number) =>
                      idx <= 2 && <div className="text-bold12 h-[14px] text-gray3">#{tag}</div>,
                  )}
                </div>
                <button
                  type="button"
                  className="text-bold14 h-[24px] w-[120px] rounded-[3px] bg-tertiary text-secondary"
                >
                  자세히
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default JoinClubPrompt;
