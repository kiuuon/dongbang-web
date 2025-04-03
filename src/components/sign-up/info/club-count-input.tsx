function ClubCountInput({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  return (
    <div>
      <div className="text-[14px] text-[#969696]">가입한 동아리 수</div>
      <div className="mb-[10px] mt-[5px] flex gap-[10px]">
        <button
          type="button"
          className={`h-[16px] w-[30px] rounded-[5px] text-[10px] ${value === '0' ? 'text-[#080808]' : 'text-[#969696]'} ${value === '0' ? 'bg-[#BCBBBB]' : 'bg-[#D9D9D9]'}`}
          onClick={() => {
            onChange('0');
          }}
        >
          0개
        </button>
        <button
          type="button"
          className={`h-[16px] w-[30px] rounded-[5px] text-[10px] ${value === '1' ? 'text-[#080808]' : 'text-[#969696]'} ${value === '1' ? 'bg-[#BCBBBB]' : 'bg-[#D9D9D9]'}`}
          onClick={() => {
            onChange('1');
          }}
        >
          1개
        </button>
        <button
          type="button"
          className={`h-[16px] w-[30px] rounded-[5px] text-[10px] ${value === '2' ? 'text-[#080808]' : 'text-[#969696]'} ${value === '2' ? 'bg-[#BCBBBB]' : 'bg-[#D9D9D9]'}`}
          onClick={() => {
            onChange('2');
          }}
        >
          2개
        </button>
        <button
          type="button"
          className={`h-[16px] w-[50px] rounded-[5px] text-[10px] ${value === '3+' ? 'text-[#080808]' : 'text-[#969696]'} ${value === '3+' ? 'bg-[#BCBBBB]' : 'bg-[#D9D9D9]'}`}
          onClick={() => {
            onChange('3+');
          }}
        >
          3개 이상
        </button>
      </div>
    </div>
  );
}

export default ClubCountInput;
