import { useRouter } from 'next/router';

import ProgressBar from '@/components/club/create/progress-bar';

function Create() {
  const router = useRouter();

  const goToClubCreate = (clubType: string) => {
    router.push(`/club/create/${clubType}`);
  };

  return (
    <div className="flex flex-col items-start justify-center px-[20px] pt-[160px]">
      <ProgressBar />
      <button
        type="button"
        className="flex h-[140px] w-full flex-col items-start"
        onClick={() => goToClubCreate('campus/info')}
      >
        <div className="text-bold32 mt-[12px] flex h-[38px] items-center justify-center">교내 동아리</div>
        <div className="text-regular16 h-[19px] text-secondary">학교내에서 활동하는 동아리</div>
        <div className="mt-[8px] h-[42px]">
          <div className="text-regular12 h-[14px] text-left text-gray2">
            같은 학교 친구들과의 활동이 더욱 가까워집니다.
          </div>
          <div className="text-regular12 h-[14px] text-left text-gray2">
            동방은 교내 동아리만의 소속감과 일상적인 운영을
          </div>
          <div className="text-regular12 h-[14px] text-left text-gray2">편리하게 이어갈 수 있도록 도와드립니다.</div>
        </div>
      </button>
      <button
        type="button"
        className="flex h-[140px] w-full flex-col items-start"
        onClick={() => goToClubCreate('campus/info')}
      >
        <div className="text-bold32 mt-[12px] flex h-[38px] items-center justify-center">연합 동아리</div>
        <div className="text-regular16 h-[19px] text-secondary">전국/지역에서 다른 학교 학생들과 활동하는 동아리</div>
        <div className="mt-[8px] h-[42px]">
          <div className="text-regular12 h-[14px] text-left text-gray2">서로 다른 캠퍼스, 하나의 동아리.</div>
          <div className="text-regular12 h-[14px] text-left text-gray2">
            동방은 연합 동아리만의 특별한 교류와 협력을
          </div>
          <div className="text-regular12 h-[14px] text-left text-gray2">더 가까이 이어갈 수 있도록 지원합니다.</div>
        </div>
      </button>
    </div>
  );
}

export default Create;
