function GenderInput({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  return (
    <div>
      <div className="text-[14px] text-[#969696]">성별</div>
      <div className="mb-[10px] mt-[5px] flex gap-[10px]">
        <button
          type="button"
          className={`h-[16px] w-[27px] rounded-[5px] ${value === 'male' ? 'bg-[#BCBBBB]' : 'bg-[#D9D9D9]'} text-[10px] ${value === 'male' ? 'text-[#080808]' : 'text-[#969696]'}`}
          onClick={() => {
            onChange('male');
          }}
        >
          남
        </button>
        <button
          type="button"
          className={`h-[16px] w-[27px] rounded-[5px] ${value === 'female' ? 'bg-[#BCBBBB]' : 'bg-[#D9D9D9]'} text-[10px] ${value === 'female' ? 'text-[#080808]' : 'text-[#969696]'}`}
          onClick={() => {
            onChange('female');
          }}
        >
          여
        </button>
      </div>
    </div>
  );
}

export default GenderInput;
