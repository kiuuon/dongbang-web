import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { fetchSession } from '@/lib/apis/auth';
import { fetchUser } from '@/lib/apis/user';

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const queryClient = new QueryClient();

  useEffect(() => {
    (async () => {
      const session = await fetchSession();

      if (!session.user && router.pathname !== '/') {
        router.push('/');
      }
    })();
  }, [router]);

  useEffect(() => {
    (async () => {
      const { user } = await fetchSession();
      const userInfo = await fetchUser(user?.id || '');

      if (user && !userInfo?.length && router.pathname !== '/sign-up') {
        router.push('/sign-up');
      }
    })();
  }, [router]);

  return (
    <QueryClientProvider client={queryClient}>
      <Component {...pageProps} />
    </QueryClientProvider>
  );
}
