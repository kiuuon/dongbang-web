import { useEffect } from 'react';
import { useRouter } from 'next/router';

import { supabase } from '@/lib/apis/supabaseClient';

function LoginCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getSession();
      const { session } = data;

      if (!session) {
        alert('로그인 세션이 없습니다.');
        return;
      }

      const { access_token: accessToken, refresh_token: refreshToken } = session;

      if (window.ReactNativeWebView) {
        window.ReactNativeWebView.postMessage(
          JSON.stringify({ type: 'event', action: 'login success', payload: { accessToken, refreshToken } }),
        );
      } else {
        router.replace('/');
      }
    })();
  }, [router]);

  return null;
}

export default LoginCallbackPage;
