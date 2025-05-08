function GenderInput({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  return (
    <div>
      <div className="text-bold12 mb-[18px]">성별</div>
      <div className="flex h-[32px] w-full gap-[16px]">
        <button
          type="button"
          className={`h-[32px] w-[68px] rounded-[24px] ${value === 'male' ? 'bg-primary' : 'bg-gray0'} text-bold12 ${value === 'male' ? 'text-white' : 'text-black'}`}
          onClick={() => {
            onChange('male');
          }}
        >
          남
        </button>
        <button
          type="button"
          className={`h-[32px] w-[68px] rounded-[24px] ${value === 'female' ? 'bg-primary' : 'bg-gray0'} text-bold12 ${value === 'female' ? 'text-white' : 'text-black'}`}
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
