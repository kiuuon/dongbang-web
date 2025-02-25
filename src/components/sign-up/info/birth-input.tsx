import { signUpErrorMessages } from '@/lib/constants';
import userInfoStore from '@/stores/sign-up/user-info-store';
import userInfoErrorStore from '@/stores/sign-up/user-info-error-store';

function BirthInput() {
  const birth = userInfoStore((state) => state.birth);
  const setBirth = userInfoStore((state) => state.setBirth);
  const birthError = userInfoErrorStore((state) => state.birthError);
  const setBirthError = userInfoErrorStore((state) => state.setBirthError);

  const handleBirth = (event: React.ChangeEvent<HTMLInputElement>) => {
    setBirth(event.target.value);
  };

  const birthRegExp = /^[0-9]{8}$/;
  const handleBirthBlur = () => {
    if (!birth.match(birthRegExp)) {
      setBirthError(true);
    } else {
      setBirthError(false);
    }
  };

  return (
    <div>
      <div className="text-[14px] text-[#969696]">생년월일</div>
      <div className="flex gap-[4px]">
        <input
          value={birth}
          placeholder="ex) 20000413"
          className="mb-[10px] h-[24px] w-[136px] rounded-[5px] border-b border-[#969696] bg-[#F5F5F5] pl-[5px] outline-none"
          onChange={handleBirth}
          onBlur={handleBirthBlur}
        />
        {birthError && (
          <div className="flex items-center text-[6px] text-[#CB0101]">{signUpErrorMessages.birthErrorMessage}</div>
        )}
      </div>
    </div>
  );
}

export default BirthInput;
