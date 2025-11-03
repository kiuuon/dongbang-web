import Image from 'next/image';

import { login } from '@/lib/apis/auth';

function KakaoLoginButton() {
  return (
    <button
      type="button"
      className="text-bold16 flex w-full items-center gap-[22px] whitespace-nowrap rounded-[10px] bg-[#FFEB3B] pl-[8px] pr-[42px]"
      onClick={() => login('kakao')}
    >
      <Image src="/images/kakao_logo.png" alt="카카오 로고" width={50} height={50} />
      카카오톡 계정으로 시작하기
    </button>
  );
}

export default KakaoLoginButton;
