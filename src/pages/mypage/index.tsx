import { useRouter } from 'next/router';

import { logout } from '@/lib/apis/auth';

function MyPage() {
  const router = useRouter();

  return (
    <div className="px-[20px]">
      <button
        type="button"
        className="mt-4 w-full rounded-lg bg-[#FFD600] py-4 text-[#000000]"
        onClick={async () => {
          if (window.ReactNativeWebView) {
            window.ReactNativeWebView.postMessage('logout');
          } else {
            await logout();
            router.push('/login');
          }
        }}
      >
        로그아웃
      </button>
    </div>
  );
}

export default MyPage;
