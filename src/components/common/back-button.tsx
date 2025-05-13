import { useRouter } from 'next/router';

import LeftArrowIcon from '@/icons/left-arrow-icon';

function BackButton() {
  const router = useRouter();

  const handleBackButtonClick = () => {
    if (window.ReactNativeWebView) {
      window.ReactNativeWebView.postMessage('back');
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
