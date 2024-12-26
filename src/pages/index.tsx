import Image from 'next/image';

import KakaoLoginButton from '@/components/home/buttons/KakaoLoginButton';
import NaverLoginButton from '@/components/home/buttons/NaverLoginButton';
import GoogleLoginButton from '@/components/home/buttons/GoogleLoginButton';
import { useEffect } from 'react';
import { fetchSession, fetchUser } from '@/lib/apis/auth';

function Home() {
  useEffect(() => {
    (async () => {
      const email = await fetchUser();
      const isLogin = await fetchSession();
      console.log(isLogin);
    })();
  }, []);

  return (
    <div className="flex h-screen flex-col items-center justify-center bg-[#F5F5F5]">
      <Image src="/images/logo.png" alt="로고" width={180} height={170} />
      <div className="mb-[75px] mt-[105px] w-[200px] text-center text-[24px]">
        더욱 즐거운 동아리 활동을 위한 모든 것
      </div>
      <div className="flex flex-col gap-[12px]">
        <KakaoLoginButton />
        <NaverLoginButton />
        <GoogleLoginButton />
      </div>
    </div>
  );
}

export default Home;
