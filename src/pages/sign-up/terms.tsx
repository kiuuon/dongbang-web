import { useRouter } from 'next/router';

import termsStore from '@/stores/terms-store';
import CheckIcon from '@/icons/check-icon';

function Terms() {
  const router = useRouter();
  const termOfUse = termsStore((state) => state.temrOfUse);
  const setTermOfUse = termsStore((state) => state.setTemrOfUse);
  const privacyPolicy = termsStore((state) => state.privacyPolicy);
  const setPrivacyPolicy = termsStore((state) => state.setPrivacyPolicy);
  const thirdPartyConsent = termsStore((state) => state.thirdPartyConsent);
  const setThirdPartyConsent = termsStore((state) => state.setThirdPartyConsent);
  const marketing = termsStore((state) => state.marketing);
  const setMarketing = termsStore((state) => state.setMarketing);

  const handleFullAgreeButton = () => {
    if (termOfUse && privacyPolicy && thirdPartyConsent && marketing) {
      setTermOfUse(false);
      setPrivacyPolicy(false);
      setThirdPartyConsent(false);
      setMarketing(false);
    } else {
      setTermOfUse(true);
      setPrivacyPolicy(true);
      setThirdPartyConsent(true);
      setMarketing(true);
    }
  };

  const handleNextButton = () => {
    if (termOfUse && privacyPolicy && thirdPartyConsent) {
      router.push('/sign-up/info');
    } else {
      // eslint-disable-next-line no-alert
      alert('필수 약관에 동의해주세요.');
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#F5F5F5] p-[40px]">
      <div className="mb-[12px] mt-[50px] text-[20px] font-black">이용 약관 동의</div>
      <div className="mb-[370px] text-[16px]">
        서비스 이용에 필요한 약관 동의 사항입니다. 정책 및 약관을 확인해주세요.
      </div>
      <div
        role="button"
        tabIndex={0}
        className="flex cursor-pointer items-center gap-[8px] text-[16px]"
        onClick={handleFullAgreeButton}
        onKeyDown={handleFullAgreeButton}
      >
        <CheckIcon color={termOfUse && privacyPolicy && thirdPartyConsent && marketing ? '#6593C8' : '#9C9C9C'} />
        전체 동의
      </div>
      <div className="my-[25px] h-[1px] w-full bg-[#B4B4B4]" />
      <div>
        <div
          role="button"
          tabIndex={0}
          className="flex cursor-pointer items-center gap-[8px] text-[16px]"
          onClick={() => setTermOfUse(!termOfUse)}
          onKeyDown={() => setTermOfUse(!termOfUse)}
        >
          <CheckIcon color={termOfUse ? '#6593C8' : '#9C9C9C'} /> 동방 이용약간 동의 (필수)
        </div>
        <div
          role="button"
          tabIndex={0}
          className="flex cursor-pointer items-center gap-[8px] text-[16px]"
          onClick={() => setPrivacyPolicy(!privacyPolicy)}
          onKeyDown={() => setPrivacyPolicy(!privacyPolicy)}
        >
          <CheckIcon color={privacyPolicy ? '#6593C8' : '#9C9C9C'} /> 개인정보 수집 및 이용 동의(필수)
        </div>
        <div
          role="button"
          tabIndex={0}
          className="flex cursor-pointer items-center gap-[8px] text-[16px]"
          onClick={() => setThirdPartyConsent(!thirdPartyConsent)}
          onKeyDown={() => setThirdPartyConsent(!thirdPartyConsent)}
        >
          <CheckIcon color={thirdPartyConsent ? '#6593C8' : '#9C9C9C'} /> 개인정보 제3자 제공 동의(필수)
        </div>
        <div
          role="button"
          tabIndex={0}
          className="flex cursor-pointer items-center gap-[8px] text-[16px]"
          onClick={() => setMarketing(!marketing)}
          onKeyDown={() => setMarketing(!marketing)}
        >
          <CheckIcon color={marketing ? '#6593C8' : '#9C9C9C'} /> 마케팅 정보 메일, SMS 수신 동의
        </div>
      </div>
      <div className="mt-[40px] flex justify-center">
        <button
          type="button"
          className="mb-[40px] h-[40px] w-[152px] rounded-[10px] bg-[#D9D9D9] text-[16px]"
          onClick={handleNextButton}
        >
          다음
        </button>
      </div>
    </div>
  );
}

export default Terms;
