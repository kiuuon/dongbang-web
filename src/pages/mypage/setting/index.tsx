import { useQueryClient, useMutation } from '@tanstack/react-query';

import { logout } from '@/lib/apis/auth';
import { handleMutationError } from '@/lib/utils';
import { ERROR_MESSAGE } from '@/lib/constants';
import Header from '@/components/layout/header';
import BackButton from '@/components/common/back-button';
import { useRouter } from 'next/router';

function AccountSettingPage() {
  const queryClient = useQueryClient();
  const router = useRouter();

  const { mutate } = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['session'] });
      router.replace('/login');
    },
    onError: (error) => handleMutationError(error, ERROR_MESSAGE.AUTH.LOGOUT_FAILED),
  });

  return (
    <div className="h-screen p-[20px] pt-[80px]">
      <Header>
        <BackButton />
      </Header>
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
    </div>
  );
}

export default AccountSettingPage;
