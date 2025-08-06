import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import Image from 'next/image';

import { fetchRecommendedClubs } from '@/lib/apis/club';
import XIcon from '@/icons/x-icon';

function JoinClubPrompt() {
  const { data: recommendedClubs } = useQuery({
    queryKey: ['recommendedClubs'],
    queryFn: fetchRecommendedClubs,
    throwOnError: (error) => {
      alert(`동아리 추천을 불러오는 데 실패했습니다. 다시 시도해주세요.\n\n${error.message}`);
      return false;
    },
  });

  const [clubList, setClubList] = useState<typeof recommendedClubs>([]);
  const [isWebView, setIsWebView] = useState(true);

  useEffect(() => {
    if (!window.ReactNativeWebView) {
      setIsWebView(false);
    }
  }, []);

  useEffect(() => {
    if (recommendedClubs) {
      setClubList(recommendedClubs);
    }
  }, [recommendedClubs]);

  const handleRemoveClub = (index: number) => {
    setClubList((prev = []) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className={`${isWebView ? 'pb-[15px]' : 'pb-[75px]'} flex h-screen w-full flex-col justify-between`}>
      <div className="mt-[177px] flex w-full flex-col items-center justify-center gap-[25px]">
        <Image src="/images/join.gif" alt="post" width={70} height={70} priority />
        <p className="text-bold20 text-gray1">소속된 동아리가 없습니다</p>
      </div>
      {clubList?.length !== 0 && (
        <div className="flex flex-col border-t border-t-background px-[20px]">
          <div className="text-bold16 mt-[20px]">동아리 추천</div>
          <div className="scrollbar-hide flex w-full flex-nowrap overflow-x-auto p-[13px]">
            {clubList?.map((club, index) => (
              <div
                key={club.id}
                className="relative mr-[14px] flex h-[180px] min-w-[140px] flex-col items-center rounded-[10px] bg-white py-[16px] shadow-[0px_1px_12px_0px_rgba(0,0,0,0.2)]"
              >
                <button
                  type="button"
                  className="absolute right-[9px] top-[8px]"
                  onClick={() => {
                    handleRemoveClub(index);
                  }}
                >
                  <XIcon />
                </button>
                <Image
                  src={club.logo}
                  alt="로고"
                  width={80}
                  height={80}
                  style={{
                    objectFit: 'cover',
                    width: '80px',
                    height: '80px',
                    minWidth: '80px',
                    minHeight: '80px',
                    borderRadius: '50%',
                  }}
                />
                <div className="text-bold14 mb-[11px] mt-[18px]">{club.name}</div>
                <div className="flex h-[55px] gap-[8px]">
                  {club.tags.map(
                    (tag: string, idx: number) =>
                      idx < 2 && <div className="text-bold10 rounded-[5px] bg-primary p-[5px] text-white">{tag}</div>,
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default JoinClubPrompt;
