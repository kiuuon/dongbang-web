import { useEffect, useRef, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import Image from 'next/image';

import { fetchClubInfo, fetchMyClubs } from '@/lib/apis/club';
import BottomArrowIcon from '@/icons/bottom-arrow-icon';
import BellIcon from '@/icons/bell-icon';
import MessageIcon from '@/icons/message-icon';
import PencilIcon from '@/icons/pencil-icon';
import XIcon3 from '@/icons/x-icon3';
import Header from '@/components/layout/header';
import BackButton from '@/components/common/back-button';
import BottomSheet from '@/components/common/bottom-sheet';
import WriteModal from '@/components/club/[clubId]/write-modal';
import ClubProfile from '@/components/club/[clubId]/club-profile';
import AnnouncementButton from '@/components/club/[clubId]/announcement-button';
import BoardSummary from '@/components/club/[clubId]/board-summary';

function ClubPage() {
  const router = useRouter();
  const { clubId } = router.query;
  const bottomSheetCloseRef = useRef<() => void>(null);
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
  const [isWriteModalOpen, setIsWriteModalOpen] = useState(false);
  const [isWebView, setIsWebView] = useState(true);

  useEffect(() => {
    if (!window.ReactNativeWebView) {
      setIsWebView(false);
    }
  }, []);

  const { data: clubInfo } = useQuery({
    queryKey: ['club', clubId],
    queryFn: () => fetchClubInfo(clubId as string),
    throwOnError: (error) => {
      if (window.ReactNativeWebView) {
        window.ReactNativeWebView.postMessage(
          JSON.stringify({
            type: 'error',
            headline: '동아리 정보를 불러오는 데 실패했습니다. 다시 시도해주세요.',
            message: error.message,
          }),
        );
        return false;
      }
      alert(`동아리 정보를 불러오는 데 실패했습니다. 다시 시도해주세요.\n\n${error.message}`);
      return false;
    },
  });

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

  const handleNavigationOpen = () => {
    if (!myClubs || myClubs.length <= 1) return;

    if (window.ReactNativeWebView) {
      window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'event', action: 'open navigation' }));
    } else {
      setIsBottomSheetOpen((prev) => !prev);
    }
  };

  const goToSelectedClub = (selectedClubId: string) => {
    router.replace(`/club/${selectedClubId}`);
    bottomSheetCloseRef.current?.();
  };

  const goToCommingSoon = () => {
    if (window.ReactNativeWebView) {
      window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'event', action: 'go to coming soon page' }));
      return;
    }
    router.push('/coming-soon');
  };

  return (
    <div className="flex min-h-screen flex-col bg-background px-[20px] pt-[75px]">
      <Header>
        <BackButton />
        <button
          type="button"
          className="ml-[44px] flex cursor-pointer items-center gap-[8px]"
          onClick={handleNavigationOpen}
        >
          <div className="text-bold16">{clubInfo?.name}</div>
          {(myClubs?.length as number) > 1 && <BottomArrowIcon />}
        </button>
        <div className="flex items-center gap-[20px]">
          <button type="button" onClick={goToCommingSoon}>
            <BellIcon />
          </button>
          <button type="button" onClick={goToCommingSoon}>
            <MessageIcon />
          </button>
        </div>
      </Header>

      <ClubProfile />
      <AnnouncementButton />
      <BoardSummary />

      <div
        className={`fixed ${isWebView ? 'bottom-[30px]' : 'bottom-[90px]'} left-0 right-0 m-auto flex w-full max-w-[600px] items-end px-[20px]`}
      >
        <button
          type="button"
          className="absolute right-[20px] z-50 flex h-[60px] w-[60px] items-center justify-center rounded-full bg-primary"
          onClick={() => {
            setIsWriteModalOpen((prev) => !prev);
          }}
        >
          {isWriteModalOpen ? <XIcon3 /> : <PencilIcon />}
        </button>
      </div>

      {isWriteModalOpen && <WriteModal onClose={() => setIsWriteModalOpen(false)} />}

      {isBottomSheetOpen && (
        <BottomSheet
          setIsBottomSheetOpen={setIsBottomSheetOpen}
          onRequestClose={(closeFn) => {
            bottomSheetCloseRef.current = closeFn;
          }}
        >
          <div className="mb-[17px] mt-[10px] h-[4px] w-[37px] rounded-[10px] bg-gray1 px-[20px]" />
          <div className="scrollbar-hide mb-[20px] flex max-h-[228px] w-full flex-col overflow-y-scroll px-[20px]">
            {myClubs?.map(
              (club) =>
                club.id !== clubId && (
                  <button
                    key={club.id}
                    type="button"
                    className="text-bold16 flex h-[76px] min-h-[76px] w-full flex-row items-center gap-[24px] border-b border-b-gray0"
                    onClick={() => goToSelectedClub(club.id)}
                  >
                    <Image
                      src={club.logo}
                      alt="로고"
                      width={50}
                      height={50}
                      style={{
                        objectFit: 'cover',
                        width: '50px',
                        height: '50px',
                        borderRadius: '50%',
                        border: '1px solid #F9F9F9',
                      }}
                    />
                    {club.name}
                  </button>
                ),
            )}
          </div>
        </BottomSheet>
      )}
    </div>
  );
}

export default ClubPage;
