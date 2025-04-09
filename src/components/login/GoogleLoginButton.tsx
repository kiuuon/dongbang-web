import Image from 'next/image';

import { login } from '@/lib/apis/auth';

function GoogleLoginButton() {
  return (
    <button
      type="button"
      className="bg-white text-bold16 flex h-[50px] w-[295px] items-center gap-[44px] rounded-[10px] pl-[16px]"
      onClick={() => login('google')}
    >
      <Image src="/images/google_logo.png" alt="구글 로고" width={36} height={36} />
      구글 계정으로 시작하기
    </button>
  );
}

export default GoogleLoginButton;
