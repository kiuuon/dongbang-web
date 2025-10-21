import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useMutation, useQuery } from '@tanstack/react-query';

import { sendFeedback } from '@/lib/apis/feedback';
import { fetchSession } from '@/lib/apis/auth';
import Header from '@/components/layout/header';
import BackButton from '@/components/common/back-button';
import LoginModal from '@/components/common/login-modal';

function ComingSoonPage() {
  const router = useRouter();
  const [feedBack, setFeedBack] = useState('');
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const { data: session } = useQuery({
    queryKey: ['session'],
    queryFn: fetchSession,
    throwOnError: (error) => {
      if (window.ReactNativeWebView) {
        window.ReactNativeWebView.postMessage(
          JSON.stringify({
            type: 'error',
            headline: '세션 정보를 불러오는 데 실패했습니다. 다시 시도해주세요.',
            message: error.message,
          }),
        );
        return false;
      }
      alert(`세션 정보를 불러오는 데 실패했습니다. 다시 시도해주세요.\n\n${error.message}`);
      return false;
    },
  });

  const { mutate } = useMutation({
    mutationFn: () => sendFeedback(feedBack),
    onSuccess: () => {
      if (window.ReactNativeWebView) {
        window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'event', action: 'complete send feedback' }));
        return;
      }
      router.back();
    },
    onError: (error) => {
      if (window.ReactNativeWebView) {
        window.ReactNativeWebView.postMessage(
          JSON.stringify({
            type: 'error',
            headline: '피드백 전송에 실패했습니다. 다시 시도해주세요.',
            message: error.message,
          }),
        );
        return;
      }
      alert(`피드백 전송에 실패했습니다. 다시 시도해주세요.\n\n${error.message}`);
    },
  });

  return (
    <div className="flex h-screen flex-col items-center justify-between px-[20px] pt-[177px]">
      <Header>
        <BackButton />
      </Header>
      <div className="flex flex-col items-center gap-[13px]">
        <Image src="/images/post.gif" alt="post" width={70} height={70} priority />
        <div className="text-bold20 text-center text-gray1">
          아직 준비중인 서비스입니다 <br />
          이용에 불편을 드려 죄송합니다
        </div>
      </div>
      <div className="flex w-full flex-col gap-[10px]">
        <div className="text-bold16 text-primary">
          더 나은 동방을 위해 <br />
          당신의 소중한 의견을 들려주세요
        </div>
        <textarea
          value={feedBack}
          onChange={(event) => setFeedBack(event.target.value)}
          placeholder="불편했던 점이나 바라는 기능을 적어주세요"
          className="text-bold12 h-[163px] w-full resize-none rounded-[8px] border border-gray0 p-[16px]"
        />
        <button
          type="button"
          className="text-bold16 my-[21px] flex h-[56px] w-full items-center justify-center rounded-[24px] bg-primary text-white"
          onClick={() => {
            if (session?.user) {
              if (feedBack.trim() === '') {
                alert('피드백을 입력해주세요.');
                return;
              }
              mutate();
            } else {
              if (window.ReactNativeWebView) {
                window.ReactNativeWebView.postMessage(
                  JSON.stringify({
                    type: 'event',
                    action: 'open login modal',
                  }),
                );
                return;
              }

              setIsLoginModalOpen(true);
            }
          }}
        >
          전송
        </button>
      </div>

      {isLoginModalOpen && <LoginModal onClose={() => setIsLoginModalOpen(false)} />}
    </div>
  );
}

export default ComingSoonPage;
