function GenderInput({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  return (
    <div className="flex h-[40px] w-full items-center justify-between rounded-[5px] border border-tertiary pl-[8px] pr-[20px]">
      <div className="text-bold12 flex text-gray2">성별</div>
      <div className="flex h-[30px] w-[224px]">
        <button
          type="button"
          className={`h-[30px] w-[112px] rounded-l-[5px] border border-gray2 ${value === 'male' ? 'bg-secondary' : 'bg-primary'} text-bold12 ${value === 'male' ? 'text-tertiary_dark' : 'text-gray2'}`}
          onClick={() => {
            onChange('male');
          }}
        >
          남
        </button>
        <button
          type="button"
          className={`h-[30px] w-[112px] rounded-r-[5px] border border-l-0 border-gray2 ${value === 'female' ? 'bg-secondary' : 'bg-primary'} text-bold12 ${value === 'female' ? 'text-tertiary_dark' : 'text-gray2'}`}
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
