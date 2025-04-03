import { useState } from 'react';

function PathInput({ value, onChange }: { value: string | undefined; onChange: (value: string) => void }) {
  const [etcPath, setEtcPath] = useState('');

  const handleEtcPath = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEtcPath(event.target.value);
    onChange(event.target.value);
  };

  return (
    <div className="flex h-[122px] w-full justify-between rounded-[5px] border border-tertiary pl-[8px] pr-[20px]">
      <div className="text-bold12 mt-[13px] flex text-gray2">가입 경로(선택)</div>
      <div className="my-auto flex flex-col gap-[8px]">
        <div className="flex h-[30px] w-[224px]">
          <button
            type="button"
            className={`h-[30px] w-[112px] rounded-l-[5px] border border-gray2 ${value === 'SNS' ? 'bg-secondary' : 'bg-primary'} text-bold12 ${value === 'SNS' ? 'text-tertiary_dark' : 'text-gray2'}`}
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
            className={`h-[30px] w-[112px] rounded-r-[5px] border border-l-0 border-gray2 ${value === '학교 행사' ? 'bg-secondary' : 'bg-primary'} text-bold12 ${value === '학교 행사' ? 'text-tertiary_dark' : 'text-gray2'}`}
            onClick={() => {
              setEtcPath('');
              if (value === '학교 행사') {
                onChange('');
              } else {
                onChange('학교 행사');
              }
            }}
          >
            학교 행사
          </button>
        </div>
        <div className="flex h-[30px] w-[224px]">
          <button
            type="button"
            className={`h-[30px] w-[112px] rounded-l-[5px] border border-gray2 ${value === '지인 추천' ? 'bg-secondary' : 'bg-primary'} text-bold12 ${value === '지인 추천' ? 'text-tertiary_dark' : 'text-gray2'}`}
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
            className={`h-[30px] w-[112px] rounded-r-[5px] border border-l-0 border-gray2 ${value === '교내 어플' ? 'bg-secondary' : 'bg-primary'} text-bold12 ${value === '교내 어플' ? 'text-tertiary_dark' : 'text-gray2'}`}
            onClick={() => {
              setEtcPath('');
              if (value === '교내 어플') {
                onChange('');
              } else {
                onChange('교내 어플');
              }
            }}
          >
            교내 어플
          </button>
        </div>

        <input
          placeholder="기타"
          value={etcPath}
          className={`text-bold12 h-[30px] w-[224px] rounded-[5px] border border-gray2 ${etcPath !== '' ? 'bg-secondary' : 'bg-primary'} text-center ${etcPath !== '' ? 'text-tertiary_dark' : 'text-gray2'} outline-none`}
          onChange={handleEtcPath}
        />
      </div>
    </div>
  );
}

export default PathInput;
