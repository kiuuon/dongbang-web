import { useEffect, useRef, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import Image from 'next/image';

import { fetchSession } from '@/lib/apis/auth';
import { checkIsClubMember, fetchClubInfo } from '@/lib/apis/club';
import { handleQueryError } from '@/lib/utils';
import { ERROR_MESSAGE } from '@/lib/constants';
import loginModalStore from '@/stores/login-modal-store';
import MessageIcon from '@/icons/message-icon';
import PencilIcon from '@/icons/pencil-icon';
import XIcon3 from '@/icons/x-icon3';
import Header from '@/components/layout/header';
import BackButton from '@/components/common/back-button';
import WriteModal from '@/components/club/[clubId]/write-modal';
import ClubProfile from '@/components/club/[clubId]/club-profile';
import AnnouncementButton from '@/components/club/[clubId]/announcement-button';
import Board from '@/components/club/[clubId]/board/board';
import MembersModal from '@/components/club/[clubId]/members-modal';

function ClubPage() {
  const router = useRouter();
  const { clubId } = router.query;
  const [isMembersModalOpen, setIsMembersModalOpen] = useState(false);
  const [isWriteModalOpen, setIsWriteModalOpen] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);

  const setIsLoginModalOpen = loginModalStore((state) => state.setIsOpen);

  useEffect(() => {
    const savedPosition = sessionStorage.getItem('scrollPosition');
    if (scrollRef.current && savedPosition) {
      scrollRef.current.scrollTop = parseInt(savedPosition, 10);
      sessionStorage.removeItem('scrollPosition');
    }
  }, []);

  const { data: session, isPending } = useQuery({
    queryKey: ['session'],
    queryFn: fetchSession,
    throwOnError: (error) => handleQueryError(error, ERROR_MESSAGE.SESSION.FETCH_FAILED),
  });

  const { data: isClubMember, isPending: isPendingToCheckingClubMember } = useQuery({
    queryKey: ['isClubMember', clubId],
    queryFn: () => checkIsClubMember(clubId as string),
    throwOnError: (error) => handleQueryError(error, ERROR_MESSAGE.CLUB.JOIN_STATUS_FETCH_FAILED),
  });

  const { data: clubInfo } = useQuery({
    queryKey: ['club', clubId],
    queryFn: () => fetchClubInfo(clubId as string),
    throwOnError: (error) => handleQueryError(error, ERROR_MESSAGE.CLUB.INFO_FETCH_FAILED),
  });

  const goToCommingSoon = () => {
    if (window.ReactNativeWebView) {
      window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'event', action: 'go to coming soon page' }));
      return;
    }
    router.push('/coming-soon');
  };

  const handleApplicationButton = () => {
    if (!session?.user) {
      if (window.ReactNativeWebView) {
        window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'event', action: 'open login modal' }));
        return;
      }

      setIsLoginModalOpen(true);
    } else if (!isClubMember) {
      if (window.ReactNativeWebView) {
        window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'event', action: 'application for club' }));
      }
      // TODO: 가입 로직
    }
  };

  return (
    <div ref={scrollRef} className="scrollbar-hide relative flex min-h-screen flex-col overflow-y-auto bg-white">
      <Header>
        <BackButton />
        {!isPending && session?.user && !isPendingToCheckingClubMember && isClubMember && (
          <button type="button" onClick={goToCommingSoon}>
            <MessageIcon />
          </button>
        )}
      </Header>

      {clubInfo?.background ? (
        <Image
          src={clubInfo?.background}
          alt="배경"
          width={600}
          height={321}
          style={{
            objectFit: 'cover',
            width: '100%',
            height: '321px',
          }}
        />
      ) : (
        <div className="h-[321px] w-full bg-secondary" />
      )}

      <div className="absolute top-[258px] flex w-full flex-col px-[20px]">
        <ClubProfile setIsMembersModalOpen={setIsMembersModalOpen} />

        {!isPending && session?.user && !isPendingToCheckingClubMember && isClubMember ? (
          <AnnouncementButton />
        ) : (
          <button
            type="button"
            className="text-bold12 mb-[19px] mt-[12px] flex h-[40px] w-full flex-row items-center justify-center rounded-[16px] bg-primary text-white"
            onClick={handleApplicationButton}
          >
            가입 신청
          </button>
        )}

        <Board scrollRef={scrollRef} />
      </div>
      {!isPending && session?.user && !isPendingToCheckingClubMember && isClubMember && (
        <div className="fixed bottom-[30px] left-0 right-0 m-auto flex w-full max-w-[600px] items-end px-[20px]">
          <button
            type="button"
            className="absolute right-[20px] z-50 flex h-[60px] w-[60px] items-center justify-center rounded-full bg-primary"
            onClick={() => {
              if (window.ReactNativeWebView) {
                window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'event', action: 'open write modal' }));
                return;
              }
              setIsWriteModalOpen((prev) => !prev);
            }}
          >
            {isWriteModalOpen ? <XIcon3 /> : <PencilIcon />}
          </button>
        </div>
      )}

      {isWriteModalOpen && <WriteModal onClose={() => setIsWriteModalOpen(false)} />}
      {isMembersModalOpen && <MembersModal onClose={() => setIsMembersModalOpen(false)} />}
    </div>
  );
}

export default ClubPage;
