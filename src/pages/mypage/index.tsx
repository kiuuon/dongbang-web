import { useRouter } from 'next/router';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';

import { fetchSession, logout } from '@/lib/apis/auth';

function MyPage() {
  const router = useRouter();

  const queryClient = useQueryClient();

  const { data: session } = useQuery({
    queryKey: ['session'],
    queryFn: fetchSession,
    throwOnError: (error) => {
      if (window.ReactNativeWebView) {
        window.ReactNativeWebView.postMessage(
          JSON.stringify({
            type: 'error',
            headline: '세션 정보를 불러오는 데 실패했습니다. 다시 시도해주세요.',
            message: error.message,
          }),
        );
        return false;
      }
      alert(`세션 정보를 불러오는 데 실패했습니다. 다시 시도해주세요.\n\n${error.message}`);
      return false;
    },
  });

  const { mutate } = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['session'] });
    },
    onError: (error) => {
      if (window.ReactNativeWebView) {
        window.ReactNativeWebView.postMessage(
          JSON.stringify({
            type: 'error',
            headline: '로그아웃에 실패했습니다. 다시 시도해주세요.',
            message: error.message,
          }),
        );
        return;
      }
      alert(`로그아웃에 실패했습니다. 다시 시도해주세요.\n\n${error.message}`);
    },
  });

  return (
    <div className="h-screen p-[20px]">
      {session?.user ? (
        <button
          type="button"
          className="text-bold16 w-full rounded-lg bg-primary py-4 text-white"
          onClick={() => {
            if (window.ReactNativeWebView) {
              window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'event', action: 'logout' }));
            } else {
              mutate();
            }
          }}
        >
          로그아웃
        </button>
      ) : (
        <button
          type="button"
          className="text-bold16 w-full rounded-lg bg-primary py-4 text-white"
          onClick={() => {
            if (window.ReactNativeWebView) {
              window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'event', action: 'go to login page' }));
            } else {
              router.push('/login');
            }
          }}
        >
          로그인
        </button>
      )}
    </div>
  );
}

export default MyPage;
