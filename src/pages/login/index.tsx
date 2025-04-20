import Image from 'next/image';

import KakaoLoginButton from '@/components/login/KakaoLoginButton';
import GoogleLoginButton from '@/components/login/GoogleLoginButton';

function Login() {
  return (
    <div className="flex h-screen w-screen flex-col items-center gap-[172px] bg-primary px-[48px] pt-[210px]">
      <Image src="/images/logo.png" alt="로고" width={140} height={140} />
      <div className="flex w-full flex-col gap-[12px]">
        <KakaoLoginButton />
        <GoogleLoginButton />
      </div>
    </div>
  );
}

export default Login;
