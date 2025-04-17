function GenderInput({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  return (
    <div>
      <div className="text-bold16 flex text-gray2">성별</div>
      <div className="flex h-[50px] w-full">
        <button
          type="button"
          className={`h-[50px] w-[176px] rounded-l-[5px] border border-gray0 ${value === 'male' ? 'bg-secondary_light' : 'bg-white'} text-bold16 ${value === 'male' ? 'text-tertiary_dark' : 'text-gray2'}`}
          onClick={() => {
            onChange('male');
          }}
        >
          남
        </button>
        <button
          type="button"
          className={`h-[50px] w-[176px] rounded-r-[5px] border border-l-0 border-gray0 ${value === 'female' ? 'bg-secondary_light' : 'bg-white'} text-bold16 ${value === 'female' ? 'text-tertiary_dark' : 'text-gray2'}`}
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
