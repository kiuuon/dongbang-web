import { useQuery, useMutation } from '@tanstack/react-query';
import Image from 'next/image';

import { fetchSession, logout } from '@/lib/apis/auth';
import KakaoLoginButton from '@/components/home/buttons/KakaoLoginButton';
import GoogleLoginButton from '@/components/home/buttons/GoogleLoginButton';

function Home() {
  const { data: session, isPending } = useQuery({ queryKey: ['session'], queryFn: fetchSession });

  const { mutate: handleLogout } = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      window.location.href = '/';
    },
    onError: (error) => {
      // eslint-disable-next-line no-console
      console.error(error);
    },
  });

  if (isPending) {
    return null;
  }

  if (!session?.user) {
    return (
      <div className="flex h-screen w-screen flex-col items-center justify-center bg-[#F5F5F5]">
        <Image src="/images/logo.png" alt="로고" width={180} height={170} />
        <div className="mb-[75px] mt-[105px] w-[200px] text-center text-[24px]">
          더욱 즐거운 동아리 활동을 위한 모든 것
        </div>
        <div className="flex flex-col gap-[12px]">
          <KakaoLoginButton />
          <GoogleLoginButton />
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col items-center justify-center gap-[12px]">
      <div>{session.user?.email}</div>
      <button
        type="button"
        className="cursor-pointer rounded bg-blue-500 px-4 py-2 text-white"
        onClick={() => handleLogout()}
      >
        로그아웃
      </button>
    </div>
  );
}

export default Home;
