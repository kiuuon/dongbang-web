function ClubCountInput({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  return (
    <div>
      <div className="text-bold16 mb-[2px] flex text-gray2">가입한 동아리 수</div>
      <div className="flex h-[50px] w-full">
        <button
          type="button"
          className={`text-bold16 h-[50px] w-[88px] rounded-l-[5px] border border-gray0 ${value === '0' ? 'text-tertiary_dark' : 'text-gray2'} ${value === '0' ? 'bg-secondary_light' : 'bg-white'}`}
          onClick={() => {
            onChange('0');
          }}
        >
          0개
        </button>
        <button
          type="button"
          className={`text-bold16 h-[50px] w-[88px] border border-l-0 border-gray0 ${value === '1' ? 'text-tertiary_dark' : 'text-gray2'} ${value === '1' ? 'bg-secondary_light' : 'bg-white'}`}
          onClick={() => {
            onChange('1');
          }}
        >
          1개
        </button>
        <button
          type="button"
          className={`text-bold16 h-[50px] w-[88px] border border-l-0 border-gray0 ${value === '2' ? 'text-tertiary_dark' : 'text-gray2'} ${value === '2' ? 'bg-secondary_light' : 'bg-white'}`}
          onClick={() => {
            onChange('2');
          }}
        >
          2개
        </button>
        <button
          type="button"
          className={`text-bold16 h-[50px] w-[88px] rounded-r-[5px] border border-l-0 border-gray0 ${value === '3+' ? 'text-tertiary_dark' : 'text-gray2'} ${value === '3+' ? 'bg-secondary_light' : 'bg-white'}`}
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
