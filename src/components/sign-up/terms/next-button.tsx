import { useRouter } from 'next/router';

import termsStore from '@/stores/terms-store';

function NextButton() {
  const router = useRouter();
  const termOfUse = termsStore((state) => state.temrOfUse);
  const privacyPolicy = termsStore((state) => state.privacyPolicy);
  const thirdPartyConsent = termsStore((state) => state.thirdPartyConsent);
  const marketing = termsStore((state) => state.marketing);

  const redirectTo = (router.query.redirect as string) || '/';

  const handleNextButton = () => {
    if (window.ReactNativeWebView) {
      window.ReactNativeWebView.postMessage(
        JSON.stringify({
          type: 'event',
          action: 'click next button',
          payload: {
            termOfUse,
            privacyPolicy,
            thirdPartyConsent,
            marketing,
          },
        }),
      );
      return;
    }

    if (redirectTo === '/') {
      router.push('/sign-up/info');
    } else {
      router.push(`/sign-up/info?redirect=${redirectTo}`);
    }
  };

  const isDisabled = !(termOfUse && privacyPolicy && thirdPartyConsent);

  return (
    <button
      type="button"
      className={`text-bold16 mb-[21px] h-[56px] w-full rounded-[24px] ${isDisabled ? 'bg-gray0' : 'bg-primary'} text-white`}
      onClick={handleNextButton}
      disabled={isDisabled}
    >
      다음
    </button>
  );
}

export default NextButton;
