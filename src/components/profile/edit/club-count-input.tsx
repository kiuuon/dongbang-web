function ClubCountInput({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  return (
    <div>
      <div className="text-bold12 mb-[18px]">가입한 동아리 수</div>
      <div className="flex h-[32px] w-full gap-[16px]">
        <button
          type="button"
          className={`text-regular12 h-[32px] w-[68px] rounded-[24px] ${value === '0' ? 'text-white' : 'text-black'} ${value === '0' ? 'bg-primary' : 'bg-gray0'}`}
          onClick={() => {
            onChange('0');
          }}
        >
          0개
        </button>
        <button
          type="button"
          className={`text-regular12 h-[32px] w-[68px] rounded-[24px] ${value === '1' ? 'text-white' : 'text-black'} ${value === '1' ? 'bg-primary' : 'bg-gray0'}`}
          onClick={() => {
            onChange('1');
          }}
        >
          1개
        </button>
        <button
          type="button"
          className={`text-regular12 h-[32px] w-[68px] rounded-[24px] ${value === '2' ? 'text-white' : 'text-black'} ${value === '2' ? 'bg-primary' : 'bg-gray0'}`}
          onClick={() => {
            onChange('2');
          }}
        >
          2개
        </button>
        <button
          type="button"
          className={`text-regular12 h-[32px] w-[68px] rounded-[24px] ${value === '3+' ? 'text-white' : 'text-black'} ${value === '3+' ? 'bg-primary' : 'bg-gray0'}`}
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
