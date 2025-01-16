import CheckIcon from '@/icons/check-icon';
import { useState } from 'react';

function Signup() {
  const [page, setPage] = useState(1);

  if (page === 1) {
    return (
      <div className="flex h-screen w-screen flex-col bg-[#F5F5F5] p-[40px]">
        <div className="mb-[12px] mt-[50px] text-[20px] font-black">이용 약관 동의</div>
        <div className="mb-[370px] text-[16px]">
          서비스 이용에 필요한 약관 동의 사항입니다. 정책 및 약관을 확인해주세요.
        </div>
        <div className="flex items-center gap-[8px] text-[16px]">
          <CheckIcon /> 전체 동의
        </div>
        <div className="my-[25px] h-[1px] w-full bg-[#B4B4B4]" />
        <div>
          <div className="flex items-center gap-[8px] text-[16px]">
            <CheckIcon />
            동방 이용약간 동의 (필수)
          </div>
          <div className="flex items-center gap-[8px] text-[16px]">
            <CheckIcon />
            개인정보 수집 및 이용 동의(필수)
          </div>
          <div className="flex items-center gap-[8px] text-[16px]">
            <CheckIcon />
            개인정보 제3자 제공 동의(필수)
          </div>
          <div className="flex items-center gap-[8px] text-[16px]">
            <CheckIcon />
            마케팅 정보 메일, SMS 수신 동의
          </div>
        </div>
        <div className="mt-[40px] flex justify-center">
          <button
            type="button"
            className="h-[40px] w-[152px] rounded-[10px] bg-[#D9D9D9] text-[16px]"
            onClick={() => setPage(2)}
          >
            다음
          </button>
        </div>
      </div>
    );
  }

  return <div>page2</div>;
}

export default Signup;
