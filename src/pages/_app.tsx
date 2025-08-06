import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { fetchSession } from '@/lib/apis/auth';
import { fetchUser } from '@/lib/apis/user';
import Tab from '@/components/layout/tab';
import { supabase } from '@/lib/apis/supabaseClient';

const queryClient = new QueryClient();

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const { pathname } = router;
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [isWebView, setIsWebView] = useState(true);

  const tabPage = ['/feed/[clubType]', '/explore', '/club', '/interact', '/mypage'];

  useEffect(() => {
    if (!window.ReactNativeWebView) {
      setIsWebView(false);
    }
  }, []);

  useEffect(() => {
    const handler = async (event: MessageEvent) => {
      try {
        const { data } = await supabase.auth.getSession();
        const { accessToken, refreshToken } = event.data;
        if (!data.session) {
          const { error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });
          if (error) {
            throw error;
          }
        }
      } catch (error) {
        alert(`세션 정보를 설정하는 데 실패했습니다. 다시 시도해주세요.\n\n${(error as Error).message}`);
      }
    };

    window.addEventListener('message', handler);

    return () => {
      window.removeEventListener('message', handler);
    };
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const { user } = await fetchSession(); // 이 함수도 throw 가능하면 같이 try 안에 둠
        const userInfo = await fetchUser(); // 여기서 에러 나면 catch로 감

        if (window.ReactNativeWebView) return;

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
      } catch (error) {
        alert(`로그인 상태를 확인하는 데 실패했습니다. 다시 시도해주세요.\n\n${(error as Error).message}`);
      }
    })();
  }, [router]);

  if (!isWebView && !isAuthenticated && router.pathname !== '/login') return null;

  if (!isWebView && !isRegistered && !router.pathname.startsWith('/sign-up/')) return null;

  return (
    <QueryClientProvider client={queryClient}>
      <Component {...pageProps} />
      {!isWebView && tabPage.includes(pathname) && <Tab />}
    </QueryClientProvider>
  );
}
