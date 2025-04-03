function ClubCountInput({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  return (
    <div className="flex h-[40px] w-full items-center justify-between rounded-[5px] border border-tertiary pl-[8px] pr-[20px]">
      <div className="text-bold12 flex text-gray2">가입한 동아리 수</div>
      <div className="flex h-[30px] w-[224px]">
        <button
          type="button"
          className={`h-[30px] w-[56px] rounded-l-[5px] border border-gray2 text-[10px] ${value === '0' ? 'text-tertiary_dark' : 'text-gray2'} ${value === '0' ? 'bg-secondary' : 'bg-primary'}`}
          onClick={() => {
            onChange('0');
          }}
        >
          0개
        </button>
        <button
          type="button"
          className={`h-[30px] w-[56px] border border-l-0 border-gray2 text-[10px] ${value === '1' ? 'text-tertiary_dark' : 'text-gray2'} ${value === '1' ? 'bg-secondary' : 'bg-primary'}`}
          onClick={() => {
            onChange('1');
          }}
        >
          1개
        </button>
        <button
          type="button"
          className={`h-[30px] w-[56px] border border-l-0 border-gray2 text-[10px] ${value === '2' ? 'text-tertiary_dark' : 'text-gray2'} ${value === '2' ? 'bg-secondary' : 'bg-primary'}`}
          onClick={() => {
            onChange('2');
          }}
        >
          2개
        </button>
        <button
          type="button"
          className={`h-[30px] w-[56px] rounded-r-[5px] border border-l-0 border-gray2 text-[10px] ${value === '3+' ? 'text-tertiary_dark' : 'text-gray2'} ${value === '3+' ? 'bg-secondary' : 'bg-primary'}`}
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
