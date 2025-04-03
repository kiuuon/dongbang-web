import termsStore from '@/stores/terms-store';
import CheckIcon from '@/icons/check-icon';
import NoneCheckIcon from '@/icons/none-check-icon';

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
        className="text-bold20 flex h-[54px] w-full cursor-pointer items-center gap-[13px] rounded-[10px] bg-primary pl-[11px] text-[16px] text-tertiary_dark"
        onClick={handleFullAgreeButton}
        onKeyDown={handleFullAgreeButton}
      >
        {termOfUse && privacyPolicy && thirdPartyConsent && marketing ? <CheckIcon /> : <NoneCheckIcon />}
        전체 동의
      </div>
      <div className="my-[25px] h-[1px] w-full bg-[#B4B4B4]" />
      <div className="flex flex-col gap-[12px] pl-[11px]">
        <div
          role="button"
          tabIndex={0}
          className="flex cursor-pointer items-center gap-[8px] text-[16px]"
          onClick={() => setTermOfUse(!termOfUse)}
          onKeyDown={() => setTermOfUse(!termOfUse)}
        >
          {termOfUse ? <CheckIcon /> : <NoneCheckIcon />}
          <div className="text-bold16 text-error">[필수]</div>
          <div className="text-regular16 text-tertiary">동방 이용약관 동의</div>
        </div>
        <div
          role="button"
          tabIndex={0}
          className="flex cursor-pointer items-center gap-[8px] text-[16px]"
          onClick={() => setPrivacyPolicy(!privacyPolicy)}
          onKeyDown={() => setPrivacyPolicy(!privacyPolicy)}
        >
          {privacyPolicy ? <CheckIcon /> : <NoneCheckIcon />}
          <div className="text-bold16 text-error">[필수]</div>
          <div className="text-regular16 text-tertiary">개인정보 수집 및 이용 동의</div>
        </div>
        <div
          role="button"
          tabIndex={0}
          className="flex cursor-pointer items-center gap-[8px] text-[16px]"
          onClick={() => setThirdPartyConsent(!thirdPartyConsent)}
          onKeyDown={() => setThirdPartyConsent(!thirdPartyConsent)}
        >
          {thirdPartyConsent ? <CheckIcon /> : <NoneCheckIcon />}
          <div className="text-bold16 text-error">[필수]</div>
          <div className="text-regular16 text-tertiary">개인정보 제3자 제공 동의</div>
        </div>
        <div
          role="button"
          tabIndex={0}
          className="flex cursor-pointer items-center gap-[8px] text-[16px]"
          onClick={() => setMarketing(!marketing)}
          onKeyDown={() => setMarketing(!marketing)}
        >
          {marketing ? <CheckIcon /> : <NoneCheckIcon />}
          <div className="text-bold16">[선택]</div>
          <div className="text-regular16 text-tertiary">마케팅 정보 수신 동의</div>
        </div>
      </div>
    </div>
  );
}

export default CheckBox;
