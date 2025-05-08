function PathInput({ value, onChange }: { value: string | undefined; onChange: (value: string) => void }) {
  return (
    <div>
      <div className="text-bold12 mb-[18px]">가입 경로 (선택)</div>
      <div className="flex h-[32px] w-full gap-[16px]">
        <button
          type="button"
          className={`text-regular12 h-[32px] w-[68px] rounded-[24px] ${value === 'SNS' ? 'bg-primary' : 'bg-gray0'} ${value === 'SNS' ? 'text-white' : 'text-black'}`}
          onClick={() => {
            if (value === 'SNS') {
              onChange('');
            } else {
              onChange('SNS');
            }
          }}
        >
          SNS
        </button>
        <button
          type="button"
          className={`text-regular12 h-[32px] w-[68px] rounded-[24px] ${value === '지인' ? 'bg-primary' : 'bg-gray0'} ${value === '지인' ? 'text-white' : 'text-black'}`}
          onClick={() => {
            if (value === '지인') {
              onChange('');
            } else {
              onChange('지인');
            }
          }}
        >
          지인
        </button>
        <button
          type="button"
          className={`text-regular12 h-[32px] w-[68px] rounded-[24px] ${value === '검색' ? 'bg-primary' : 'bg-gray0'} ${value === '검색' ? 'text-white' : 'text-black'}`}
          onClick={() => {
            if (value === '검색') {
              onChange('');
            } else {
              onChange('검색');
            }
          }}
        >
          검색
        </button>
        <button
          type="button"
          className={`text-regular12 h-[32px] w-[68px] rounded-[24px] ${value === '기타' ? 'bg-primary' : 'bg-gray0'} ${value === '기타' ? 'text-white' : 'text-black'}`}
          onClick={() => {
            if (value === '기타') {
              onChange('');
            } else {
              onChange('기타');
            }
          }}
        >
          기타
        </button>
      </div>
    </div>
  );
}

export default PathInput;
