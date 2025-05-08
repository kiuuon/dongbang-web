import termsStore from '@/stores/terms-store';
import CheckIcon from '@/icons/check-icon';
import CheckIcon2 from '@/icons/check-icon2';
import NoneCheckIcon from '@/icons/none-check-icon';
import RightArrowIcon3 from '@/icons/right-arrow-icon3';

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
        className={`text-bold20 flex h-[56px] w-full cursor-pointer items-center justify-center rounded-[24px] ${termOfUse && privacyPolicy && thirdPartyConsent && marketing ? 'bg-primary' : 'bg-gray0'} pl-[11px] text-white`}
        onClick={handleFullAgreeButton}
        onKeyDown={handleFullAgreeButton}
      >
        약관 전체 동의
        <CheckIcon />
      </div>
      <div className="text-bold16 mb-[25px] mt-[16px]">
        서비스 이용에 필요한 약관 동의 사항입니다.
        <br />
        정책 및 약관을 확인해주세요
      </div>
      <div className="flex flex-col gap-[12px] pl-[11px]">
        <div className="flex items-center justify-between">
          <div
            role="button"
            tabIndex={0}
            className="flex cursor-pointer items-center text-[16px]"
            onClick={() => setTermOfUse(!termOfUse)}
            onKeyDown={() => setTermOfUse(!termOfUse)}
          >
            {termOfUse ? <CheckIcon2 /> : <NoneCheckIcon />}
            <span className="text-bold16 ml-[15px] mr-[13px] text-error">[필수]</span>
            <div className="text-regular16">동방 이용약관 동의</div>
          </div>
          <button
            type="button"
            onClick={() => {
              // TODO: 약관 전체보기
            }}
          >
            <RightArrowIcon3 />
          </button>
        </div>
        <div className="flex items-center justify-between">
          <div
            role="button"
            tabIndex={0}
            className="flex cursor-pointer items-center text-[16px]"
            onClick={() => setPrivacyPolicy(!privacyPolicy)}
            onKeyDown={() => setPrivacyPolicy(!privacyPolicy)}
          >
            {privacyPolicy ? <CheckIcon2 /> : <NoneCheckIcon />}
            <span className="text-bold16 ml-[15px] mr-[13px] text-error">[필수]</span>
            <div className="text-regular16">개인정보 수집 및 이용 동의</div>
          </div>
          <button
            type="button"
            onClick={() => {
              // TODO: 약관 전체보기
            }}
          >
            <RightArrowIcon3 />
          </button>
        </div>
        <div className="flex items-center justify-between">
          <div
            role="button"
            tabIndex={0}
            className="flex cursor-pointer items-center text-[16px]"
            onClick={() => setThirdPartyConsent(!thirdPartyConsent)}
            onKeyDown={() => setThirdPartyConsent(!thirdPartyConsent)}
          >
            {thirdPartyConsent ? <CheckIcon2 /> : <NoneCheckIcon />}
            <span className="text-bold16 ml-[15px] mr-[13px] text-error">[필수]</span>
            <div className="text-regular16">개인정보 제3자 제공 동의</div>
          </div>
          <button
            type="button"
            onClick={() => {
              // TODO: 약관 전체보기
            }}
          >
            <RightArrowIcon3 />
          </button>
        </div>
        <div className="flex items-center justify-between">
          <div
            role="button"
            tabIndex={0}
            className="flex cursor-pointer items-center text-[16px]"
            onClick={() => setMarketing(!marketing)}
            onKeyDown={() => setMarketing(!marketing)}
          >
            {marketing ? <CheckIcon2 /> : <NoneCheckIcon />}
            <span className="text-regular16 ml-[15px] mr-[13px]">[선택]</span>
            <div className="text-regular16">마케팅 정보 메일 수신 동의</div>
          </div>
          <button
            type="button"
            onClick={() => {
              // TODO: 약관 전체보기
            }}
          >
            <RightArrowIcon3 />
          </button>
        </div>
      </div>
    </div>
  );
}

export default CheckBox;
