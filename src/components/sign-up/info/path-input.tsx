import { useState } from 'react';

import CheckIcon2 from '@/icons/check-icon2';

function PathInput({ value, onChange }: { value: string | undefined; onChange: (value: string) => void }) {
  const [etcPath, setEtcPath] = useState('');

  const handleEtcPath = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEtcPath(event.target.value);
    onChange(event.target.value);
  };

  return (
    <div>
      <div className="text-[14px] text-[#969696]">가입 경로(선택)</div>
      <div className="mt-[8px] flex flex-col items-start gap-[5px] text-[14px] text-[#969696]">
        <button
          type="button"
          className="flex"
          onClick={() => {
            setEtcPath('');
            if (value === 'SNS') {
              onChange('');
            } else {
              onChange('SNS');
            }
          }}
        >
          <CheckIcon2 color={value === 'SNS' ? '#5686E1' : '#969696'} />
          SNS
        </button>
        <button
          type="button"
          className="flex"
          onClick={() => {
            setEtcPath('');
            if (value === '학교 행사') {
              onChange('');
            } else {
              onChange('학교 행사');
            }
          }}
        >
          <CheckIcon2 color={value === '학교 행사' ? '#5686E1' : '#969696'} />
          학교 행사
        </button>
        <button
          type="button"
          className="flex"
          onClick={() => {
            setEtcPath('');
            if (value === '지인 추천') {
              onChange('');
            } else {
              onChange('지인 추천');
            }
          }}
        >
          <CheckIcon2 color={value === '지인 추천' ? '#5686E1' : '#969696'} />
          지인 추천
        </button>
        <button
          type="button"
          className="flex"
          onClick={() => {
            setEtcPath('');
            if (value === '교내 어플') {
              onChange('');
            } else {
              onChange('교내 어플');
            }
          }}
        >
          <CheckIcon2 color={value === '교내 어플' ? '#5686E1' : '#969696'} />
          교내 어플
        </button>
        <input
          placeholder="ex) 블로그"
          value={etcPath}
          className="ml-[20px] h-[27px] w-[174px] rounded-[10px] bg-[#E9E9E9] pl-[10px] outline-none"
          onChange={handleEtcPath}
        />
      </div>
    </div>
  );
}

export default PathInput;
