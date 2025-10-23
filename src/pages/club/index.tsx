import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useQuery } from '@tanstack/react-query';

import { fetchSession } from '@/lib/apis/auth';
import { fetchMyClubs } from '@/lib/apis/club';
import loginModalStore from '@/stores/login-modal-store';
import PlusIcon2 from '@/icons/plus-icon2';
import Header from '@/components/layout/header';
import ClubCard from '@/components/club/club-card';

function ClubListPage() {
  const router = useRouter();
  const setIsLoginModalOpen = loginModalStore((state) => state.setIsOpen);
  const { data: myClubs } = useQuery({
    queryKey: ['myClubs'],
    queryFn: fetchMyClubs,
    throwOnError: (error) => {
      if (window.ReactNativeWebView) {
        window.ReactNativeWebView.postMessage(
          JSON.stringify({
            type: 'error',
            headline: '동아리 목록을 불러오는 데 실패했습니다. 다시 시도해주세요.',
            message: error.message,
          }),
        );
        return false;
      }
      alert(`동아리 목록을 불러오는 데 실패했습니다. 다시 시도해주세요.\n\n${error.message}`);
      return false;
    },
  });

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

  const [isWebView, setIsWebView] = useState(true);

  useEffect(() => {
    // 리스트 부분만 스크롤이 가능하도록 전체 스크롤은 막기
    document.body.style.overflow = 'hidden';
  }, []);

  useEffect(() => {
    if (!window.ReactNativeWebView) {
      setIsWebView(false);
    }
  }, []);

  return (
    <div
      className={`${myClubs?.length !== 0 && 'bg-background pt-[100px]'} flex h-screen flex-col gap-[16px] px-[20px] ${isWebView ? 'pb-[25px]' : 'pb-[95px]'} scrollbar-hide overflow-y-scroll`}
    >
      <Header>
        <div className="text-bold16">내 동아리 리스트</div>
        <button
          type="button"
          onClick={() => {
            if (session?.user) {
              document.body.style.overflow = 'auto';
              if (window.ReactNativeWebView) {
                window.ReactNativeWebView.postMessage(
                  JSON.stringify({
                    type: 'event',
                    action: 'create club',
                  }),
                );
                return;
              }
              router.push('/club/create');
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
          <PlusIcon2 />
        </button>
      </Header>
      {myClubs?.length === 0 ? (
        <div className="mt-[177px] flex w-full flex-col items-center gap-[25px]">
          <Image src="/images/join.gif" alt="post" width={70} height={70} priority />
          <p className="text-bold20 text-gray1">소속된 동아리가 없습니다</p>
        </div>
      ) : (
        myClubs?.map((club) => <ClubCard key={club.id} club={club} />)
      )}
    </div>
  );
}

export default ClubListPage;
