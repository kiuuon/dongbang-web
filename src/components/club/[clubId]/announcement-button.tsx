import { useRouter } from 'next/router';

import RightArrowIcon4 from '@/icons/right-arrow-icon4';

function AnnouncementButton() {
  const router = useRouter();

  const goToCommingSoon = () => {
    if (window.ReactNativeWebView) {
      window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'event', action: 'go to coming soon page' }));
      return;
    }
    router.push('/coming-soon');
  };

  return (
    <button
      type="button"
      className="mb-[16px] mt-[18px] flex h-[40px] w-full flex-row items-center justify-between rounded-[8px] bg-secondary pl-[38px] pr-[16px]"
      onClick={goToCommingSoon}
    >
      <div className="text-bold12">공지</div>
      <RightArrowIcon4 />
    </button>
  );
}

export default AnnouncementButton;
