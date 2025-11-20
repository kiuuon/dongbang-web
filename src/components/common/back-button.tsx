import { useRouter } from 'next/router';

import LeftArrowIcon from '@/icons/left-arrow-icon';

function BackButton({ color = '#000' }: { color?: string }) {
  const router = useRouter();

  const handleBackButtonClick = () => {
    if (window.ReactNativeWebView) {
      window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'event', action: 'back button click' }));
      return;
    }

    if (window.history.length > 1) {
      router.back();
    } else {
      router.replace('/');
    }
  };

  return (
    <button type="button" className="h-[24px] w-[24px]" onClick={handleBackButtonClick}>
      <LeftArrowIcon color={color} />
    </button>
  );
}

export default BackButton;
