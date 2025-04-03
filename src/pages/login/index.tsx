import Image from 'next/image';

import KakaoLoginButton from '@/components/login/KakaoLoginButton';
import GoogleLoginButton from '@/components/login/GoogleLoginButton';

function Login() {
  return (
    <div className="flex h-screen w-screen flex-col items-center gap-[172px] bg-primary pt-[210px]">
      <Image src="/images/logo.png" alt="로고" width={132} height={132} />
      <div className="flex flex-col gap-[12px]">
        <KakaoLoginButton />
        <GoogleLoginButton />
      </div>
    </div>
  );
}

export default Login;
