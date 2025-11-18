import { useRouter } from 'next/router';

import DongBangIcon2 from '@/icons/dongbang-icon2';

function AccessDeniedPage({ title, content }: { title: string; content: string }) {
  const router = useRouter();
  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <DongBangIcon2 />
      <div className="text-bold24 mb-[16px] mt-[34px]">{title}</div>
      <div className="text-regular16 mb-[96px] text-gray3">{content}</div>
      <button
        type="button"
        className="text-bold16 flex h-[43px] w-[292px] items-center justify-center rounded-[12px] bg-primary text-white"
        onClick={() => {
          router.push('/');
        }}
      >
        홈으로 가기
      </button>
    </div>
  );
}

export default AccessDeniedPage;
