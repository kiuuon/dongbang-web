import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { fetchSession } from '@/lib/apis/auth';
import { fetchUser } from '@/lib/apis/user';
import Tab from '@/components/layout/tab';

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const { pathname } = router;
  const queryClient = new QueryClient();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);

  const NoneTabPage = [
    '/login',
    '/login/callback',
    '/sign-up/terms',
    '/sign-up/info',
    '/club/create',
    '/club/create/[clubType]/info',
    '/club/create/[clubType]/detail',
  ];

  useEffect(() => {
    (async () => {
      const { user } = await fetchSession();
      const userInfo = await fetchUser();

      if (!user && router.pathname !== '/login') {
        router.push('/login');
      } else if (user && router.pathname === '/login') {
        setIsAuthenticated(true);
        router.push('/');
      } else {
        setIsAuthenticated(true);
      }

      if (user && !userInfo && !router.pathname.startsWith('/sign-up/')) {
        router.push('/sign-up/terms');
      } else if (user && userInfo && router.pathname.startsWith('/sign-up/')) {
        setIsRegistered(true);
        router.push('/');
      } else {
        setIsRegistered(true);
      }
    })();
  }, [router]);

  if (!isAuthenticated && router.pathname !== '/login') return null;

  if (!isRegistered && !router.pathname.startsWith('/sign-up/')) return null;

  return (
    <QueryClientProvider client={queryClient}>
      <Component {...pageProps} />
      {!NoneTabPage.includes(pathname) && <Tab />}
    </QueryClientProvider>
  );
}
