import { useRouter } from 'next/router';

import LeftArrowIcon from '@/icons/left-arrow-icon';

function BackButton() {
  const router = useRouter();

  const handleBackButtonClick = () => {
    if (window.ReactNativeWebView) {
      window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'event', action: 'back button click' }));
      return;
    }

    const ref = document.referrer;

    if (window.history.length === 0) {
      router.replace('/');
      return;
    }

    if (!ref) {
      router.replace('/');
      return;
    }

    if (!ref.startsWith(process.env.NEXT_PUBLIC_SITE_URL as string)) {
      router.replace('/');
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
