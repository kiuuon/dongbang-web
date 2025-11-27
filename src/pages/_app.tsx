import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';

import { fetchSession, login } from '@/lib/apis/auth';
import { fetchUser } from '@/lib/apis/user';
import { supabase } from '@/lib/apis/supabaseClient';
import { ERROR_MESSAGE } from '@/lib/constants';
import loginModalStore from '@/stores/login-modal-store';
import clubInfoStore from '@/stores/club-info-store';
import clubPageStore from '@/stores/club-page-store';
import Tab from '@/components/layout/tab';
import LoginModal from '@/components/common/login-modal';

const queryClient = new QueryClient();

const REQUIRES_LOGIN_PATHS: (string | RegExp)[] = [
  /^\/club\/create(\/.*)?$/,
  /^\/club\/[^/]+\/edit/,
  /^\/club\/[^/]+\/announcement/,
  /^\/club\/[^/]+\/members\/manage/,
  /^\/feed\/write\/[^/]+/,
  /^\/feed\/edit\/[^/]+/,
  '/feed/my',
  '/feed/campus',
  '/profile/edit',
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

  const setCampusClubType = clubInfoStore((state) => state.setCampusClubType);
  const setName = clubInfoStore((state) => state.setName);
  const setCategory = clubInfoStore((state) => state.setCategory);
  const setLocation = clubInfoStore((state) => state.setLocation);
  const setBio = clubInfoStore((state) => state.setBio);
  const setDescription = clubInfoStore((state) => state.setDescription);
  const setTags = clubInfoStore((state) => state.setTags);

  const setClubPageTop = clubPageStore((state) => state.setClubPageTop);

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
          } else if (action === 'edit feed') {
            queryClient.invalidateQueries({
              predicate: (query) => query.queryKey[0] === 'feeds',
            });

            queryClient.invalidateQueries({ queryKey: ['feedDetail', payload] });

            queryClient.invalidateQueries({
              predicate: (query) => query.queryKey[0] === 'authoredFeedList',
            });

            queryClient.invalidateQueries({
              predicate: (query) => query.queryKey[0] === 'taggedFeedList',
            });

            queryClient.invalidateQueries({
              predicate: (query) => query.queryKey[0] === 'clubFeedList',
            });
          } else if (action === 'delete feed') {
            queryClient.invalidateQueries({
              predicate: (query) => query.queryKey[0] === 'feeds',
            });

            queryClient.invalidateQueries({
              predicate: (query) => query.queryKey[0] === 'authoredFeedList',
            });

            queryClient.invalidateQueries({
              predicate: (query) => query.queryKey[0] === 'taggedFeedList',
            });

            queryClient.invalidateQueries({
              predicate: (query) => query.queryKey[0] === 'clubFeedList',
            });
          } else if (action === 'set club detail in create/edit club page') {
            const { clubCampusType, name, category, location, bio, description, tags } = payload;
            setCampusClubType(clubCampusType);
            setName(name);
            setCategory(category);
            setLocation(location);
            setBio(bio);
            setDescription(description);
            setTags(tags);
          } else if (action === 'set top in club page') {
            setClubPageTop(+payload.top);
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
  }, [setCampusClubType, setName, setCategory, setLocation, setBio, setDescription, setTags, setClubPageTop]);

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
      <div className="scrollbar-hide m-auto max-w-[600px] shadow-lg">
        <Head>
          <title>동방</title>
        </Head>
        <Component {...pageProps} />
        {isOpen && <LoginModal onClose={() => setIsLoginModalOpen(false)} />}
        {!isWebView && tabPage.includes(pathname) && <Tab />}
      </div>
      <Toaster />
    </QueryClientProvider>
  );
}
