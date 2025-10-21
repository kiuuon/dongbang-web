import { useEffect } from 'react';
import { useRouter } from 'next/router';

import { fetchSession } from '@/lib/apis/auth';
import { fetchUser } from '@/lib/apis/user';

function Home() {
  const router = useRouter();

  useEffect(() => {
    (async () => {
      try {
        const { user } = await fetchSession();
        const userInfo = await fetchUser();

        if (window.ReactNativeWebView) {
          return;
        }

        if (!user) {
          router.push('/feed/union');
        } else if (user && !userInfo) {
          router.push('/sign-up/terms');
        } else if (user && userInfo) {
          router.push('/feed/my');
        }
      } catch (error) {
        alert(`로그인 상태를 확인하는 데 실패했습니다. 다시 시도해주세요.\n\n${(error as Error).message}`);
      }
    })();
  }, [router]);

  return null;
}

export default Home;
