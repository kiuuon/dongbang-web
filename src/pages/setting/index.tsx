import { useRouter } from 'next/router';

import RightArrowIcon2 from '@/icons/right-arrow-icon2';
import Header from '@/components/layout/header';
import BackButton from '@/components/common/back-button';

function SettingPage() {
  const router = useRouter();

  return (
    <div className="h-screen pt-[82px]">
      <div className="px-[20px]">
        <Header>
          <div className="flex items-center gap-[10px]">
            <BackButton />
            <div className="text-bold16">설정</div>
          </div>
        </Header>
      </div>
      <div className="border-t border-gray0">
        <button
          type="button"
          className="text-regular14 flex w-full items-center justify-between border-b border-gray0 py-[18px] pl-[24px] pr-[20px]"
          onClick={() => {}}
        >
          공지사항
          <RightArrowIcon2 />
        </button>

        <button
          type="button"
          className="text-regular14 flex w-full items-center justify-between border-b border-gray0 py-[18px] pl-[24px] pr-[20px]"
          onClick={() => {
            router.push('/setting/inquiry');
          }}
        >
          문의하기
          <RightArrowIcon2 />
        </button>

        <button
          type="button"
          className="text-regular14 flex w-full items-center justify-between border-b border-gray0 py-[18px] pl-[24px] pr-[20px]"
          onClick={() => {
            router.push('/setting/terms');
          }}
        >
          약관 및 정책
          <RightArrowIcon2 />
        </button>
      </div>
    </div>
  );
}

export default SettingPage;
