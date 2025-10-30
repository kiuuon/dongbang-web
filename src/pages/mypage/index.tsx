import { useRouter } from 'next/router';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';

import { fetchSession, logout } from '@/lib/apis/auth';
import { handleMutationError, handleQueryError } from '@/lib/utils';
import { ERROR_MESSAGE } from '@/lib/constants';

function MyPage() {
  const router = useRouter();

  const queryClient = useQueryClient();

  const { data: session } = useQuery({
    queryKey: ['session'],
    queryFn: fetchSession,
    throwOnError: (error) => handleQueryError(error, ERROR_MESSAGE.SESSION.FETCH_FAILED),
  });

  const { mutate } = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['session'] });
    },
    onError: (error) => handleMutationError(error, ERROR_MESSAGE.AUTH.LOGOUT_FAILED),
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
