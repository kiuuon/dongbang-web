import { useRouter } from 'next/router';

import { signUpErrorMessages } from '@/lib/constants';
import termsStore from '@/stores/sign-up/terms-store';

function NextButton() {
  const router = useRouter();
  const termOfUse = termsStore((state) => state.temrOfUse);
  const privacyPolicy = termsStore((state) => state.privacyPolicy);
  const thirdPartyConsent = termsStore((state) => state.thirdPartyConsent);

  const handleNextButton = () => {
    if (termOfUse && privacyPolicy && thirdPartyConsent) {
      router.push('/sign-up/info');
    } else {
      // eslint-disable-next-line no-alert
      alert(signUpErrorMessages.termsErrorMessage);
    }
  };

  return (
    <button
      type="button"
      className="mb-[40px] h-[40px] w-[152px] rounded-[10px] bg-[#D9D9D9] text-[16px]"
      onClick={handleNextButton}
    >
      다음
    </button>
  );
}

export default NextButton;
