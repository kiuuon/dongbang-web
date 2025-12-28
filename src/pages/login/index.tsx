import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';

import { supabase } from '@/lib/apis/supabaseClient';
import KakaoLoginButton from '@/components/login/kakao-login-button';
import AppleLoginButton from '@/components/login/apple-login-button';

function LoginPage() {
  const router = useRouter();

  const [isReviewMode, setIsReviewMode] = useState(false);
  const [testLoginEmail, setTestLoginEmail] = useState('');
  const [testLoginPassword, setTestLoginPassword] = useState('');
  const [isTestLoginModalOpen, setIsTestLoginModalOpen] = useState(false);

  useEffect(() => {
    async function fetchConfig() {
      const { data } = await supabase.from('app_settings').select('value').eq('key', 'is_review_mode').single();

      if (data) {
        setIsReviewMode(data.value);
      }
    }
    fetchConfig();
  }, []);

  const handleTestLogin = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: testLoginEmail,
        password: testLoginPassword,
      });

      if (error) {
        throw error;
      }

      const { access_token: accessToken, refresh_token: refreshToken } = data.session;

      if (window.ReactNativeWebView) {
        window.ReactNativeWebView.postMessage(
          JSON.stringify({ type: 'event', action: 'login success', payload: { accessToken, refreshToken } }),
        );
      } else {
        router.replace('/');
      }
    } catch (error) {
      alert('로그인에 실패했습니다. 다시 시도해주세요.');
    }
  };

  return (
    <div className="flex h-screen max-w-[600px] items-center justify-center bg-white">
      <div className="flex w-fit flex-col items-center justify-center gap-[46px]">
        <div className="flex flex-col gap-[20px]">
          <div className="flex gap-[14px]">
            <div className="flex flex-col gap-[9px] rounded-[10px] border border-gray1 bg-white p-[10px] opacity-50">
              <div className="flex flex-col rounded-[10px] bg-background px-[5px] pb-[9px] pt-[5px]">
                <div className="h-[133px] w-[133px] rounded-[10px] bg-gray0" />
                <div className="mt-[8px] h-[10px] w-[115px] rounded-[10px] bg-gray0" />
                <div className="my-[6px] h-[10px] w-[78px] rounded-[10px] bg-gray0" />
                <div className="flex gap-[8px]">
                  <div className="h-[14px] w-[42px] rounded-[8px] bg-secondary opacity-40" />
                  <div className="h-[14px] w-[42px] rounded-[8px] bg-primary opacity-40" />
                </div>
              </div>

              <div className="flex flex-col rounded-[10px] bg-background px-[5px] pb-[9px] pt-[5px]">
                <div className="h-[133px] w-[133px] rounded-[10px] bg-gray0" />
                <div className="mt-[8px] h-[10px] w-[115px] rounded-[10px] bg-gray0" />
                <div className="my-[6px] h-[10px] w-[78px] rounded-[10px] bg-gray0" />
                <div className="flex gap-[8px]">
                  <div className="h-[14px] w-[42px] rounded-[8px] bg-secondary opacity-40" />
                  <div className="h-[14px] w-[42px] rounded-[8px] bg-primary opacity-40" />
                </div>
              </div>
            </div>

            <div className="flex flex-col items-center justify-between gap-[6px] pt-[136px]">
              <div>
                <Image src="/images/logo.png" alt="동방 로고" width={100} height={30} />
                <div className="text-bold20">
                  대학 동아리의 <br /> SNS 허브
                </div>
              </div>

              <div className="text-bold12 flex rounded-t-[15px] rounded-bl-[15px] bg-primary/30 px-[14px] py-[9px]">
                동방은 어떤 공간인가요?
              </div>
            </div>
          </div>

          <div className="text-bold12 flex rounded-t-[15px] rounded-br-[15px] bg-secondary/30 px-[14px] py-[9px]">
            모든 동아리들이 함께 어울릴 수 있는 동아리방입니다!
          </div>
        </div>

        <div className="flex w-full flex-col items-center">
          <KakaoLoginButton />
          <AppleLoginButton />
          {isReviewMode && (
            <button
              type="button"
              className="text-regular16 mt-[8px] flex h-[42px] w-[280px] items-center justify-center rounded-[12px] bg-primary text-white"
              onClick={() => setIsTestLoginModalOpen(true)}
            >
              테스트 계정으로 로그인
            </button>
          )}
          <button
            type="button"
            className="text-regular16 mt-[25px] text-gray2"
            onClick={() => {
              if (window.ReactNativeWebView) {
                window.ReactNativeWebView.postMessage(
                  JSON.stringify({
                    type: 'event',
                    action: 'look around',
                  }),
                );
                return;
              }
              router.push('/feed/all');
            }}
          >
            둘러보기
          </button>
        </div>
      </div>
      {isTestLoginModalOpen && (
        <div
          tabIndex={0}
          role="button"
          className="fixed bottom-0 left-0 right-0 z-50 m-auto flex h-screen w-screen max-w-[600px] items-center bg-black bg-opacity-60 px-[32px]"
          onClick={(event) => {
            if (event.target instanceof HTMLElement && event.target.classList.contains('bg-black')) {
              setIsTestLoginModalOpen(false);
            }
          }}
          onKeyDown={(event) => {
            if (event.target instanceof HTMLElement && event.target.classList.contains('bg-black')) {
              setIsTestLoginModalOpen(false);
            }
          }}
        >
          <div className="flex h-auto w-full flex-col items-center gap-[12px] rounded-[20px] bg-white px-[27px] py-[24px]">
            <input
              type="text"
              placeholder="이메일"
              value={testLoginEmail}
              className="text-regular16 w-full rounded-[12px] border border-gray1 p-[12px]"
              onChange={(event) => setTestLoginEmail(event.target.value)}
            />
            <input
              type="password"
              placeholder="비밀번호"
              value={testLoginPassword}
              className="text-regular16 w-full rounded-[12px] border border-gray1 p-[12px]"
              onChange={(event) => setTestLoginPassword(event.target.value)}
            />
            <button
              type="button"
              className="text-regular16 mt-[8px] flex h-[42px] w-[280px] items-center justify-center rounded-[12px] bg-primary text-white"
              onClick={handleTestLogin}
            >
              로그인
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default LoginPage;
