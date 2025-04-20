import { useRouter } from 'next/router';

import BackButton from '@/components/common/back-button';

function ProgressBar() {
  const router = useRouter();
  const { pathname } = router;

  return (
    <div className="fixed left-0 top-0 z-10 flex w-full flex-col gap-[8px] bg-white px-[20px] pt-[12px]">
      <BackButton />
      <div className="t-0 relative flex w-full items-center justify-between pl-[34px] pr-[21px] pt-[5px]">
        <div className={`h-[13px] w-[13px] rounded-[16px] ${pathname === '/club/create' ? 'bg-gray2' : 'bg-gray0'}`} />
        <div
          className={`h-[13px] w-[13px] rounded-[16px] ${pathname.split('/')[4] === 'info' ? 'bg-gray2' : 'bg-gray0'}`}
        />
        <div
          className={`h-[13px] w-[13px] rounded-[16px] ${pathname.split('/')[4] === 'detail' ? 'bg-gray2' : 'bg-gray0'}`}
        />
        <div className="absolute left-[34px] right-[21px] z-[-1] h-[1px] bg-gray0" />
      </div>
      <div className="flex w-full justify-between">
        <div className="text-regular12 text-gray2">동아리 개설하기</div>
        <div className="text-regular12 text-gray2">동아리 정보 입력</div>
        <div className="text-regular12 text-gray2">페이지 설정</div>
      </div>
    </div>
  );
}

export default ProgressBar;
