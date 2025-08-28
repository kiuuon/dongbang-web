import { useState } from 'react';
import Image from 'next/image';

import { ClubType } from '@/types/club-type';
import LockIcon from '@/icons/lock-icon';

type RecruitmentStatus = 'open' | 'always' | 'closed';

function ClubCard({ club }: { club: ClubType }) {
  const [isOpen, setIsOpen] = useState(false);

  const statusClasses: Record<RecruitmentStatus, string> = {
    open: 'text-bold12 text-primary',
    always: 'text-regular12',
    closed: 'text-regular12 text-gray1',
  };

  function getDiffInDays(endDate: string | Date): number {
    const today = new Date();
    const end = new Date(endDate);

    today.setHours(0, 0, 0, 0);
    end.setHours(0, 0, 0, 0);

    const diffTime = end.getTime() - today.getTime();
    return Math.floor(diffTime / (1000 * 60 * 60 * 24));
  }

  let text: string;

  if (club.recruitment?.[0].recruitment_status === 'open' && club.recruitment?.[0].end_date) {
    const end = new Date(club.recruitment?.[0].end_date);
    const diff = getDiffInDays(end);
    text = diff >= 0 ? `D - ${diff}` : '모집 종료';
  } else if (club.recruitment?.[0].recruitment_status === 'always') {
    text = '상시 모집';
  } else {
    text = '모집 종료';
  }

  return (
    <div className="relative flex items-center">
      <button
        type="button"
        className={`relative z-10 bg-white transition-all ${isOpen ? 'w-[calc(100%-56px)]' : 'w-full'} flex rounded-[8px] border-b-gray0 px-[10px] pb-[9px] pt-[20px] shadow-[0_1px_24px_0_rgba(0,0,0,0.08)]`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="mr-[20px] min-w-[60px]">
          <Image
            src={club.logo}
            alt="로고"
            width={60}
            height={60}
            style={{
              objectFit: 'cover',
              width: '60px',
              height: '60px',
              borderRadius: '5px',
              border: '1px solid #F9F9F9',
            }}
          />
        </div>
        <div className="flex w-full flex-col items-start">
          <div className="flex">
            <div className="mr-[10px] flex flex-col">
              <div className="text-bold16 mb-[6px] text-start">{club.name}</div>
              <div className="text-regular12 mb-[15px] text-start">{club.description}</div>
            </div>
            <div
              className={`whitespace-nowrap ${statusClasses[club.recruitment?.[0].recruitment_status as RecruitmentStatus]}`}
            >
              {text}
            </div>
          </div>
          <div className="flex gap-[4px]">
            {club.tags.map(
              (tag, index: number) =>
                index < 3 && (
                  <div key={tag} className="text-regular12 rounded-[8px] bg-gray0 px-[5px] py-[2px] text-gray2">
                    {tag}
                  </div>
                ),
            )}
          </div>
        </div>
      </button>

      <div className="text-regular12 absolute right-0 flex w-[72px] flex-col gap-[7px] text-primary">
        <button
          type="button"
          className={`flex h-[44px] items-center justify-center bg-white pl-[16px] ${isOpen && 'shadow-[0_1px_4px_0_rgba(0,0,0,0.18)]'}`}
        >
          소개
        </button>
        <button
          type="button"
          className={`flex h-[44px] items-center justify-center bg-white pl-[16px] ${isOpen && 'shadow-[0_1px_4px_0_rgba(0,0,0,0.18)]'}`}
        >
          {club.recruitment?.[0].recruitment_status === 'closed' ? <LockIcon /> : '모집 공고'}
        </button>
      </div>
    </div>
  );
}

export default ClubCard;
