import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { fetchSession, login } from '@/lib/apis/auth';
import { fetchUser } from '@/lib/apis/user';
import Tab from '@/components/layout/tab';
import { supabase } from '@/lib/apis/supabaseClient';

const queryClient = new QueryClient();

const REQUIRES_LOGIN_PATHS: (string | RegExp)[] = [
  /^\/club\/create(\/.*)?$/,
  /^\/club\/[^/]+\/recruit/,
  /^\/feed\/[^/]+\/write/,
  '/feed/my',
  '/feed/campus',
];

function requiresLoginPath(pathname: string) {
  return REQUIRES_LOGIN_PATHS.some((pattern) =>
    typeof pattern === 'string' ? pathname === pattern : pattern.test(pathname),
  );
}

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
    const handleUnload = () => {
      sessionStorage.clear();
    };

    window.addEventListener('beforeunload', handleUnload);
    return () => window.removeEventListener('beforeunload', handleUnload);
  }, []);

  useEffect(() => {
    const handler = async (event: MessageEvent) => {
      try {
        const { data } = await supabase.auth.getSession();
        const { type, action, payload } = JSON.parse(event.data);

        if (type === 'event') {
          if (action === 'set session request') {
            const { accessToken, refreshToken } = payload;
            if (!data.session) {
              const { error } = await supabase.auth.setSession({
                access_token: accessToken,
                refresh_token: refreshToken,
              });
              if (error) {
                throw error;
              }
            }
          } else if (action === 'login request') {
            login(payload);
          }
        }
      } catch (error) {
        if ((error as any).status !== 400) {
          alert(`세션 정보를 설정하는 데 실패했습니다. 다시 시도해주세요.\n\n${(error as Error).message}`);
        }
      }
    };

    if ((window as any).ReactNativeWebView) {
      window.addEventListener('message', handler);
      (document as any).addEventListener('message', handler);
    }

    return () => {
      if ((window as any).ReactNativeWebView) {
        window.removeEventListener('message', handler);
        (document as any).removeEventListener('message', handler);
      }
    };
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const { user } = await fetchSession();
        const userInfo = await fetchUser();

        if (window.ReactNativeWebView) return;

        if (user && router.pathname === '/login') {
          setIsAuthenticated(true);
          router.push('/');
        } else {
          setIsAuthenticated(true);
        }

        if (!user && requiresLoginPath(router.asPath)) {
          router.replace('/login');
        } else if (
          user &&
          !userInfo &&
          !router.pathname.startsWith('/sign-up/') &&
          !router.pathname.startsWith('/invite/')
        ) {
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
      <div className="scrollbar-hide m-auto max-w-[600px] overflow-scroll shadow-lg">
        <Component {...pageProps} />
        {!isWebView && tabPage.includes(pathname) && <Tab />}
      </div>
    </QueryClientProvider>
  );
}
