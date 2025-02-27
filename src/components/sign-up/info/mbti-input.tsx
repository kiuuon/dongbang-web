import { signUpErrorMessages } from '@/lib/constants';
import userInfoStore from '@/stores/sign-up/user-info-store';
import userInfoErrorStore from '@/stores/sign-up/user-info-error-store';

function MbtiInput() {
  const mbti = userInfoStore((state) => state.mbti);
  const setMbti = userInfoStore((state) => state.setMbti);
  const mbtiError = userInfoErrorStore((state) => state.mbtiError);
  const setMbtiError = userInfoErrorStore((state) => state.setMbtiError);

  const handleMbti = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMbti(event.target.value.toUpperCase());
  };

  const mbtiRegExp = /^(INTJ|INTP|ENTJ|ENTP|INFJ|INFP|ENFJ|ENFP|ISTJ|ISFJ|ESTJ|ESFJ|ISTP|ISFP|ESTP|ESFP)$/;
  const handleMbtiBlur = () => {
    if (!mbti.match(mbtiRegExp)) {
      if (mbti.length !== 0) {
        setMbtiError(true);
      } else {
        setMbtiError(false);
      }
    } else {
      setMbtiError(false);
    }
  };

  return (
    <div>
      <div>
        <div className="text-[14px] text-[#969696]">MBTI(선택)</div>
        <div className="flex gap-[4px]">
          <input
            value={mbti}
            className="mb-[10px] h-[24px] w-[136px] rounded-[5px] border-b border-[#969696] bg-[#F5F5F5] pl-[5px] outline-none"
            onChange={handleMbti}
            onBlur={handleMbtiBlur}
          />
          {mbtiError && (
            <div className="flex items-center text-[6px] text-[#CB0101]">{signUpErrorMessages.mbtiErrorMessage}</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MbtiInput;
