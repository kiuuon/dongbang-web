import { useEffect } from 'react';
import { useRouter } from 'next/router';

import { fetchSession } from '@/lib/apis/auth';
import { fetchUser } from '@/lib/apis/user';

function Home() {
  const router = useRouter();

  useEffect(() => {
    (async () => {
      const { user } = await fetchSession();
      const userInfo = await fetchUser();

      if (window.ReactNativeWebView) {
        return;
      }

      if (!user) {
        router.push('/login');
      } else if (user && !userInfo) {
        router.push('/sign-up/terms');
      } else if (user && userInfo) {
        router.push('/feed/my');
      }
    })();
  }, [router]);

  return null;
}

export default Home;
