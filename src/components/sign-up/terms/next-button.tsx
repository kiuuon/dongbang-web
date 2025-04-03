import { useRouter } from 'next/router';

import termsStore from '@/stores/terms-store';

function NextButton() {
  const router = useRouter();
  const termOfUse = termsStore((state) => state.temrOfUse);
  const privacyPolicy = termsStore((state) => state.privacyPolicy);
  const thirdPartyConsent = termsStore((state) => state.thirdPartyConsent);

  const handleNextButton = () => {
    if (termOfUse && privacyPolicy && thirdPartyConsent) {
      router.push('/sign-up/info');
    } else {
      alert('필수 약관에 동의해주세요.');
    }
  };

  return (
    <button
      type="button"
      className="text-bold32 mb-[16px] h-[74px] w-full rounded-[10px] bg-primary text-tertiary_dark"
      onClick={handleNextButton}
    >
      다음
    </button>
  );
}

export default NextButton;
