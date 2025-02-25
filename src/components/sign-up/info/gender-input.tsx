import userInfoStore from '@/stores/sign-up/user-info-store';

function GenderInput() {
  const gender = userInfoStore((state) => state.gender);
  const setGender = userInfoStore((state) => state.setGender);

  return (
    <div>
      <div className="text-[14px] text-[#969696]">성별</div>
      <div className="mb-[10px] mt-[5px] flex gap-[10px]">
        <button
          type="button"
          className={`h-[16px] w-[27px] rounded-[5px] ${gender === 'male' ? 'bg-[#BCBBBB]' : 'bg-[#D9D9D9]'} text-[10px] ${gender === 'male' ? 'text-[#080808]' : 'text-[#969696]'}`}
          onClick={() => {
            setGender('male');
          }}
        >
          남
        </button>
        <button
          type="button"
          className={`h-[16px] w-[27px] rounded-[5px] ${gender === 'female' ? 'bg-[#BCBBBB]' : 'bg-[#D9D9D9]'} text-[10px] ${gender === 'female' ? 'text-[#080808]' : 'text-[#969696]'}`}
          onClick={() => {
            setGender('female');
          }}
        >
          여
        </button>
      </div>
    </div>
  );
}

export default GenderInput;
