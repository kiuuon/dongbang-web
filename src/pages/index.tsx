import { useQuery, useMutation } from '@tanstack/react-query';

import { logout } from '@/lib/apis/auth';
import { fetchUser } from '@/lib/apis/user';
import { queryKey } from '@/lib/constants';

function Home() {
  const { data: userInfo } = useQuery({
    queryKey: [queryKey.userInfo],
    queryFn: fetchUser,
  });

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

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-[12px]">
      <div>이름: {userInfo?.name}</div>
      <div>닉네임: {userInfo?.nickname}</div>
      <div>이메일: {userInfo?.email}</div>
      <div>성별: {userInfo?.gender}</div>
      <div>생년월일: {userInfo?.birth}</div>
      <div>MBTI: {userInfo?.mbti}</div>
      <div>학교: {userInfo?.University.name}</div>
      <div>가입된 동아리 수: {userInfo?.clubs_joined}</div>
      <div>가입 경로: {userInfo?.join_path}</div>
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
