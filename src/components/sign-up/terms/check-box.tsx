import termsStore from '@/stores/sign-up/terms-store';
import CheckIcon from '@/icons/check-icon';

function CheckBox() {
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
  return (
    <div>
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
    </div>
  );
}

export default CheckBox;
