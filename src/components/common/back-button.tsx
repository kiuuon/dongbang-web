import { useRouter } from 'next/router';

import LeftArrowIcon from '@/icons/left-arrow-icon';

function BackButton() {
  const router = useRouter();

  const handleBackButtonClick = () => {
    if (window.ReactNativeWebView) {
      window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'event', action: 'back button click' }));
      return;
    }
    router.back();
  };

  return (
    <button type="button" className="h-[24px] w-[24px]" onClick={handleBackButtonClick}>
      <LeftArrowIcon />
    </button>
  );
}

export default BackButton;
