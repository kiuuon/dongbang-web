import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { fetchSession } from '@/lib/apis/auth';
import { fetchUser } from '@/lib/apis/user';
import Tab from '@/components/layout/tab';
import { supabase } from '@/lib/apis/supabaseClient';

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const { pathname } = router;
  const queryClient = new QueryClient();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [isWebView, setIsWebView] = useState(true);

  const NoneTabPage = [
    '/login',
    '/login/callback',
    '/sign-up/terms',
    '/sign-up/info',
    '/sign-up/complete',
    '/club/create',
    '/club/create/[clubType]/info',
    '/club/create/[clubType]/detail',
  ];

  useEffect(() => {
    if (!window.ReactNativeWebView) {
      setIsWebView(false);
    }
  }, []);

  useEffect(() => {
    const handler = async (event: MessageEvent) => {
      const { data } = await supabase.auth.getSession();
      const { accessToken, refreshToken } = event.data;
      if (!data.session) {
        await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        });
      }
    };

    window.addEventListener('message', handler);

    return () => {
      window.removeEventListener('message', handler);
    };
  }, []);

  useEffect(() => {
    (async () => {
      const { user } = await fetchSession();
      const userInfo = await fetchUser();

      if (window.ReactNativeWebView) {
        return;
      }

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
        if (router.pathname !== '/sign-up/complete') {
          setIsRegistered(true);
          router.push('/');
        }
      } else {
        setIsRegistered(true);
      }
    })();
  }, [router]);

  if (!isWebView && !isAuthenticated && router.pathname !== '/login') return null;

  if (!isWebView && !isRegistered && !router.pathname.startsWith('/sign-up/')) return null;

  return (
    <QueryClientProvider client={queryClient}>
      <Component {...pageProps} />
      {!isWebView && !NoneTabPage.includes(pathname) && <Tab />}
    </QueryClientProvider>
  );
}
