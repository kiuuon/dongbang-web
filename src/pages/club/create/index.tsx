import { useRouter } from 'next/router';

import Header from '@/components/layout/header';
import BackButton from '@/components/common/back-button';
import ProgressBar from '@/components/club/create/progress-bar';
import RightArrowIcon2 from '@/icons/right-arrow-icon2';

function Create() {
  const router = useRouter();

  const goToClubCreate = (clubType: string) => {
    router.push(`/club/create/${clubType}`);
  };

  return (
    <div className="flex flex-col px-[20px] pt-[68px]">
      <Header>
        <BackButton />
      </Header>
      <ProgressBar />
      <button
        type="button"
        className="mb-[21px] mt-[103px] flex h-[136px] w-full flex-col items-start border-b border-gray0"
        onClick={() => goToClubCreate('campus/info')}
      >
        <div className="flex h-[38px] w-full items-center justify-between">
          <div className="text-bold32">교내 동아리</div>
          <RightArrowIcon2 />
        </div>
        <div className="text-bold16 mb-[4px] mt-[8px] h-[19px] text-primary">학교내에서 활동하는 동아리</div>
        <div className="h-[42px]">
          <div className="text-bold12 h-[14px] text-left text-gray1">
            같은 학교 친구들과의 활동이 더욱 가까워집니다.
          </div>
          <div className="text-bold12 h-[14px] text-left text-gray1">
            동방은 교내 동아리만의 소속감과 일상적인 운영을
          </div>
          <div className="text-bold12 h-[14px] text-left text-gray1">편리하게 이어갈 수 있도록 도와드립니다.</div>
        </div>
      </button>
      <button
        type="button"
        className="flex h-[136px] w-full flex-col items-start"
        onClick={() => goToClubCreate('union/info')}
      >
        <div className="flex h-[38px] w-full items-center justify-between">
          <div className="text-bold32">연합 동아리</div>
          <RightArrowIcon2 />
        </div>
        <div className="text-bold16 mb-[4px] mt-[8px] h-[19px] text-primary">
          전국/지역에서 다른 학교 학생들과 활동하는 동아리
        </div>
        <div className="h-[42px]">
          <div className="text-bold12 h-[14px] text-left text-gray1">서로 다른 캠퍼스, 하나의 동아리.</div>
          <div className="text-bold12 h-[14px] text-left text-gray1">동방은 연합 동아리만의 특별한 교류와 협력을</div>
          <div className="text-bold12 h-[14px] text-left text-gray1">더 가까이 이어갈 수 있도록 지원합니다.</div>
        </div>
      </button>
      <div className="mt-[168px] flex flex-col gap-[4px]">
        <p className="text-bold12 h-[14px]">아래의 경우, 동아리가 삭제될 수 있습니다.</p>
        <ul>
          <li className="text-regular12 h-[14px] text-error">
            <p>실존하지 않는 동아리로 확인될 경우</p>
          </li>
        </ul>
        <ul>
          <li className="text-regular12 h-[14px] text-error">
            <p>플랫폼 운영 정책에 위배되는 경우</p>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default Create;
