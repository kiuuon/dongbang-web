import { useState } from 'react';

function PathInput({ value, onChange }: { value: string | undefined; onChange: (value: string) => void }) {
  const [etcPath, setEtcPath] = useState('');

  const handleEtcPath = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEtcPath(event.target.value);
    onChange(event.target.value);
  };

  return (
    <div>
      <div className="text-bold16 flex text-gray2">가입 경로(선택)</div>
      <div className="flex h-[50px] w-full rounded-[5px]">
        <button
          type="button"
          className={`h-[50px] w-[88px] rounded-l-[5px] border border-gray0 ${value === 'SNS' ? 'bg-secondary_light' : 'bg-white'} text-bold12 ${value === 'SNS' ? 'text-tertiary_dark' : 'text-gray2'}`}
          onClick={() => {
            setEtcPath('');
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
          className={`h-[50px] w-[88px] border border-l-0 border-gray0 ${value === '지인 추천' ? 'bg-secondary_light' : 'bg-white'} text-bold12 ${value === '지인 추천' ? 'text-tertiary_dark' : 'text-gray2'}`}
          onClick={() => {
            setEtcPath('');
            if (value === '지인 추천') {
              onChange('');
            } else {
              onChange('지인 추천');
            }
          }}
        >
          지인 추천
        </button>
        <button
          type="button"
          className={`h-[50px] w-[88px] border border-l-0 border-gray0 ${value === '검색' ? 'bg-secondary_light' : 'bg-white'} text-bold12 ${value === '검색' ? 'text-tertiary_dark' : 'text-gray2'}`}
          onClick={() => {
            setEtcPath('');
            if (value === '검색') {
              onChange('');
            } else {
              onChange('검색');
            }
          }}
        >
          검색
        </button>
        <input
          placeholder="기타"
          value={etcPath}
          className={`text-bold12 h-[50px] w-[88px] rounded-r-[5px] border border-l-0 border-gray0 ${etcPath !== '' ? 'bg-secondary_light' : 'bg-white'} text-center ${etcPath !== '' ? 'text-tertiary_dark' : 'text-gray2'} outline-none`}
          onChange={handleEtcPath}
        />
      </div>
    </div>
  );
}

export default PathInput;
