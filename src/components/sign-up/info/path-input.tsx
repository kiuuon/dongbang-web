import { useState } from 'react';

import userInfoStore from '@/stores/sign-up/user-info-store';
import CheckIcon2 from '@/icons/check-icon2';

function PathInput() {
  const path = userInfoStore((state) => state.path);
  const setPath = userInfoStore((state) => state.setPath);
  const etcPath = userInfoStore((state) => state.etcPath);
  const setEtcPath = userInfoStore((state) => state.setEtcPath);
  const [pathInputDisabled, setPathInputDisabled] = useState(true);

  const handleEtcPath = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEtcPath(event.target.value);
  };

  return (
    <div>
      <div className="text-[14px] text-[#969696]">가입 경로(선택)</div>
      <div className="mt-[8px] flex flex-col items-start gap-[5px] text-[14px] text-[#969696]">
        <button
          type="button"
          className="flex"
          onClick={() => {
            setPathInputDisabled(true);
            setEtcPath('');
            if (path === 'SNS') {
              setPath('');
            } else {
              setPath('SNS');
            }
          }}
        >
          <CheckIcon2 color={path === 'SNS' ? '#5686E1' : '#969696'} />
          SNS
        </button>
        <button
          type="button"
          className="flex"
          onClick={() => {
            setPathInputDisabled(true);
            setEtcPath('');
            if (path === '학교 행사') {
              setPath('');
            } else {
              setPath('학교 행사');
            }
          }}
        >
          <CheckIcon2 color={path === '학교 행사' ? '#5686E1' : '#969696'} />
          학교 행사
        </button>
        <button
          type="button"
          className="flex"
          onClick={() => {
            setPathInputDisabled(true);
            setEtcPath('');
            if (path === '지인 추천') {
              setPath('');
            } else {
              setPath('지인 추천');
            }
          }}
        >
          <CheckIcon2 color={path === '지인 추천' ? '#5686E1' : '#969696'} />
          지인 추천
        </button>
        <button
          type="button"
          className="flex"
          onClick={() => {
            setPathInputDisabled(true);
            setEtcPath('');
            if (path === '교내 어플') {
              setPath('');
            } else {
              setPath('교내 어플');
            }
          }}
        >
          <CheckIcon2 color={path === '교내 어플' ? '#5686E1' : '#969696'} />
          교내 어플
        </button>
        <button
          type="button"
          className="flex"
          onClick={() => {
            setEtcPath('');
            if (path === '기타') {
              setPath('');
              setPathInputDisabled(true);
            } else {
              setPath('기타');
              setPathInputDisabled(false);
            }
          }}
        >
          <CheckIcon2 color={path === '기타' ? '#5686E1' : '#969696'} />
          기타
        </button>
        <input
          placeholder="ex) 블로그"
          value={etcPath}
          className="ml-[20px] h-[27px] w-[174px] rounded-[10px] bg-[#E9E9E9] pl-[10px] outline-none"
          disabled={pathInputDisabled}
          onChange={handleEtcPath}
        />
      </div>
    </div>
  );
}

export default PathInput;
