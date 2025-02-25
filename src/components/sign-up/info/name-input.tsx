import userInfoStore from '@/stores/sign-up/user-info-store';
import userInfoErrorStore from '@/stores/sign-up/user-info-error-store';

function NameInput() {
  const name = userInfoStore((state) => state.name);
  const setName = userInfoStore((state) => state.setName);
  const nameError = userInfoErrorStore((state) => state.nameError);
  const setNameError = userInfoErrorStore((state) => state.setNameError);

  const handleName = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  const nameRegExp = /^[a-zA-Z가-힣]{2,10}$/;
  const handleNameBlur = () => {
    if (!name.match(nameRegExp)) {
      setNameError(true);
    } else {
      setNameError(false);
    }
  };

  return (
    <div>
      <div className="flex items-end text-[14px] text-[#969696]">이름</div>
      <div className="flex gap-[4px]">
        <input
          value={name}
          className="mb-[10px] h-[24px] w-[136px] rounded-[5px] border-b border-[#969696] bg-[#F5F5F5] pl-[5px] outline-none"
          onChange={handleName}
          onBlur={handleNameBlur}
        />
        {nameError && (
          <div className="flex items-center text-[6px] text-[#CB0101]">
            2~10글자 이내에 한글 또는 영문을 입력해주세요
          </div>
        )}
      </div>
    </div>
  );
}

export default NameInput;
