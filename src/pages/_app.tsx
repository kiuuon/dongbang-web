import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';

import { fetchSession, login } from '@/lib/apis/auth';
import { fetchUser } from '@/lib/apis/user';
import { supabase } from '@/lib/apis/supabaseClient';
import { ERROR_MESSAGE } from '@/lib/constants';
import loginModalStore from '@/stores/login-modal-store';
import Tab from '@/components/layout/tab';
import LoginModal from '@/components/common/login-modal';

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
  const isOpen = loginModalStore((state) => state.isOpen);
  const setIsLoginModalOpen = loginModalStore((state) => state.setIsOpen);

  const tabPage = ['/feed/[clubType]', '/explore', '/club', '/interact', '/mypage', '/club/[clubId]'];

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
          } else if (action === 'edit feed') {
            queryClient.invalidateQueries({
              predicate: (query) => query.queryKey[0] === 'feeds',
            });
            queryClient.invalidateQueries({ queryKey: ['feedDetail', payload] });
          } else if (action === 'delete feed') {
            queryClient.invalidateQueries({
              predicate: (query) => query.queryKey[0] === 'feeds',
            });
          }
        }
      } catch (error) {
        if ((error as any).status !== 400) {
          alert(`${ERROR_MESSAGE.SESSION.SET_FAILED}\n\n${(error as Error).message}`);
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
        alert(`${ERROR_MESSAGE.AUTH.LOGIN_STATUS_CHECK_FAILED}\n\n${(error as Error).message}`);
      }
    })();
  }, [router]);

  if (!isWebView && !isAuthenticated && router.pathname !== '/login') return null;

  if (!isWebView && !isRegistered && !router.pathname.startsWith('/sign-up/')) return null;

  return (
    <QueryClientProvider client={queryClient}>
      <div className="scrollbar-hide m-auto max-w-[600px] overflow-scroll shadow-lg">
        <Component {...pageProps} />
        {isOpen && <LoginModal onClose={() => setIsLoginModalOpen(false)} />}
        {!isWebView && tabPage.includes(pathname) && <Tab />}
      </div>
      <Toaster />
    </QueryClientProvider>
  );
}
