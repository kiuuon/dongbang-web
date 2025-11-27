import { useEffect, useRef, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import Image from 'next/image';

import { fetchSession } from '@/lib/apis/auth';
import {
  applyToClub,
  cancelApplication,
  checkIsClubMember,
  fetchClubMembers,
  fetchMyApply,
} from '@/lib/apis/club/club';
import { handleMutationError, handleQueryError } from '@/lib/utils';
import { ERROR_MESSAGE } from '@/lib/constants';
import useClubPageValidation from '@/hooks/useClubPageValidation';
import loginModalStore from '@/stores/login-modal-store';
import PencilIcon from '@/icons/pencil-icon';
import XIcon3 from '@/icons/x-icon3';
import MembersIcon from '@/icons/members-icon';
import ReportIcon2 from '@/icons/report-icon2';
import WriteModal from '@/components/club/[clubId]/write-modal';
import ClubProfile from '@/components/club/[clubId]/club-profile';
import ClubHeader from '@/components/club/[clubId]/club-header';
import AnnouncementButton from '@/components/club/[clubId]/announcement-button';
import Board from '@/components/club/[clubId]/board/board';
import MembersModal from '@/components/club/[clubId]/members-modal';

function ClubPage() {
  const router = useRouter();
  const { clubId } = router.query;
  const queryClient = useQueryClient();
  const [isMembersModalOpen, setIsMembersModalOpen] = useState(false);
  const [isWriteModalOpen, setIsWriteModalOpen] = useState(false);

  const setIsLoginModalOpen = loginModalStore((state) => state.setIsOpen);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const [isDropDownOpen, setIsDropDownOpen] = useState(false);

  const { isValid, clubInfo, ErrorComponent } = useClubPageValidation();

  useEffect(() => {
    const key = `scroll:${router.asPath}`;

    const savedPosition = sessionStorage.getItem(key);
    if (document.scrollingElement && savedPosition) {
      document.scrollingElement.scrollTop = parseInt(savedPosition, 10);
      sessionStorage.removeItem(key);
    }
  }, [router]);

  const { data: session, isPending } = useQuery({
    queryKey: ['session'],
    queryFn: fetchSession,
    throwOnError: (error) => handleQueryError(error, ERROR_MESSAGE.SESSION.FETCH_FAILED),
  });

  const { data: isClubMember, isPending: isPendingToCheckingClubMember } = useQuery({
    queryKey: ['isClubMember', clubId],
    queryFn: () => checkIsClubMember(clubId as string),
    enabled: !!clubInfo,
    throwOnError: (error) => handleQueryError(error, ERROR_MESSAGE.CLUB.JOIN_STATUS_FETCH_FAILED),
  });

  const { data: myApply } = useQuery({
    queryKey: ['myApply', clubId],
    queryFn: () => fetchMyApply(clubId as string),
    enabled: !!clubInfo,
    throwOnError: (error) => handleQueryError(error, ERROR_MESSAGE.CLUB.APPLY_FETCH_FAILED),
  });

  const { data: members } = useQuery({
    queryKey: ['clubMembers', clubId],
    queryFn: () => fetchClubMembers(clubId as string),
    throwOnError: (error) => handleQueryError(error, ERROR_MESSAGE.CLUB.MEMBERS_FETCH_FAILED),
  });

  const { mutate: handleApplyToClub } = useMutation({
    mutationFn: async () => applyToClub(clubId as string),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myApply', clubId] });
    },
    onError: (error) => handleMutationError(error, ERROR_MESSAGE.CLUB.APPLY_FAILED),
  });

  const { mutate: handleCancelApplication } = useMutation({
    mutationFn: async () => cancelApplication(clubId as string),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myApply', clubId] });
    },
    onError: (error) => handleMutationError(error, ERROR_MESSAGE.CLUB.CANCEL_APPLICATION_FAILED),
  });

  if (!isValid) {
    return ErrorComponent;
  }

  const handleApplicationButton = () => {
    if (!session?.user) {
      if (window.ReactNativeWebView) {
        window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'event', action: 'open login modal' }));
        return;
      }

      setIsLoginModalOpen(true);
    } else if (!isClubMember) {
      if (window.ReactNativeWebView) {
        window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'event', action: 'apply to club' }));
      }
      handleApplyToClub();
    }
  };

  const handleCancelApplicationButton = () => {
    if (!isClubMember) {
      if (window.ReactNativeWebView) {
        window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'event', action: 'cancel application' }));
      }
      handleCancelApplication();
    }
  };

  const report = () => {
    if (!session?.user) {
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

    // TODO: 신고하기
  };

  return (
    <div className="relative flex min-h-screen flex-col bg-white">
      <ClubHeader dropdownRef={dropdownRef} setIsDropDownOpen={setIsDropDownOpen} />

      <div className="relative w-full">
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

        <div className="to-transparent pointer-events-none absolute inset-0 bg-gradient-to-b from-black/10" />
      </div>

      <div className="absolute top-[280px] flex w-full items-end justify-between pl-[32px] pr-[20px]">
        {clubInfo ? (
          <Image
            src={clubInfo?.logo}
            alt="로고"
            width={80}
            height={80}
            style={{
              objectFit: 'cover',
              width: '80px',
              height: '80px',
              borderRadius: '16px',
              boxShadow: '0 1px 4px rgba(0, 0, 0, 0.15)',
            }}
          />
        ) : (
          <div className="left-[22px] top-0 h-[80px] w-[80px] rounded-[16px] border border-background bg-gray0" />
        )}

        <button
          type="button"
          className="text-regular12 flex items-center gap-[4px] rounded-[4px] border border-gray0 px-[8px] py-[5px]"
          onClick={() => {
            if (window.ReactNativeWebView) {
              window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'event', action: 'open members modal' }));
              return;
            }

            setIsMembersModalOpen((prev) => !prev);
          }}
        >
          <MembersIcon />
          {members?.length}명
        </button>
      </div>

      <div className="mt-[47px] flex w-full flex-col px-[20px]">
        <ClubProfile />

        {!isPendingToCheckingClubMember && (
          <div>
            {/* eslint-disable-next-line no-nested-ternary */}
            {!isPending && session?.user && !isPendingToCheckingClubMember && isClubMember ? (
              <AnnouncementButton />
            ) : !myApply || myApply.status === 'cancelled' || myApply.status === 'rejected' ? (
              <button
                type="button"
                className="text-bold12 mb-[16px] mt-[18px] flex h-[40px] w-full flex-row items-center justify-center rounded-[16px] bg-primary text-white"
                onClick={handleApplicationButton}
              >
                가입 신청
              </button>
            ) : (
              <button
                type="button"
                className="text-bold12 mb-[19px] mt-[12px] flex h-[40px] w-full flex-row items-center justify-center rounded-[16px] bg-gray0 text-black"
                onClick={handleCancelApplicationButton}
              >
                가입 취소
              </button>
            )}
          </div>
        )}

        <Board />
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

      {isDropDownOpen && (
        <div
          ref={dropdownRef}
          className="absolute right-[16px] top-[64px] z-10 flex flex-col gap-[11px] rounded-[4px] bg-white p-[10px] shadow-[0px_1px_4px_0px_rgba(0,0,0,0.25)]"
        >
          <button type="button" className="flex w-full items-center gap-[9px]" onClick={report}>
            <ReportIcon2 />
            <span className="text-regular16 whitespace-nowrap text-error">신고</span>
          </button>
        </div>
      )}
    </div>
  );
}

export default ClubPage;
