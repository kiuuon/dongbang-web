import { useRouter } from 'next/router';

import CheckIcon2 from '@/icons/check-icon2';

function ProgressBar() {
  const router = useRouter();
  const { pathname } = router;

  const currentPageName = () => {
    if (pathname.split('/')[4] === 'info') {
      return '동아리 정보 입력';
    }

    return '동아리 페이지 설정';
  };

  return (
    <div
      className={`flex h-[24px] w-full justify-between bg-white ${pathname.split('/')[4] === 'detail' && 'px-[20px]'}`}
    >
      <div className="text-bold20 flex items-center">{currentPageName()}</div>
      <div className="flex items-center justify-end gap-[3.5px]">
        <div
          className={`text-bold12 flex h-[24px] w-[24px] items-center justify-center rounded-[24px] ${pathname.split('/')[4] === 'info' ? 'bg-primary text-white' : 'text-gray1'} ${pathname === '/club/create' && 'border border-gray0'}`}
        >
          {pathname.split('/')[4] === 'info' ? '1' : <CheckIcon2 />}
        </div>
        <div className="flex items-center gap-[3px]">
          <div
            className={`h-[1px] w-[3px] rounded-[10px] ${pathname.split('/')[4] === 'detail' ? 'bg-primary' : 'bg-gray0'}`}
          />
          <div
            className={`h-[1px] w-[3px] rounded-[10px] ${pathname.split('/')[4] === 'detail' ? 'bg-primary' : 'bg-gray0'}`}
          />
        </div>
        <div
          className={`text-bold12 flex h-[24px] w-[24px] items-center justify-center rounded-[24px] ${pathname.split('/')[4] === 'detail' ? 'bg-primary text-white' : 'border border-gray0 text-gray1'}`}
        >
          2
        </div>
      </div>
    </div>
  );
}

export default ProgressBar;
