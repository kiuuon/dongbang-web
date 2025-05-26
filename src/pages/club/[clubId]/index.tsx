import { useRef, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import Image from 'next/image';

import BackButton from '@/components/common/back-button';
import Header from '@/components/layout/header';
import BottomArrowIcon from '@/icons/bottom-arrow-icon';
import MonitorIcon from '@/icons/monitor-icon';
import MessageIcon from '@/icons/message-icon';
import { fetchClubInfo, fetchMyClubs } from '@/lib/apis/club';
import BottomSheet from '@/components/common/bottom-sheet';

function Club() {
  const router = useRouter();
  const { clubId } = router.query;
  const bottomSheetCloseRef = useRef<() => void>(null);
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);

  const { data: clubInfo } = useQuery({ queryKey: ['club', clubId], queryFn: () => fetchClubInfo(clubId as string) });
  const { data: myClubs } = useQuery({
    queryKey: ['myClubs'],
    queryFn: fetchMyClubs,
  });

  const handleNavigationOpen = () => {
    if (!myClubs || myClubs.length <= 1) return;

    if (window.ReactNativeWebView) {
      window.ReactNativeWebView.postMessage('openNavigation');
    } else {
      setIsBottomSheetOpen((prev) => !prev);
    }
  };

  const goToSelectedClub = (selectedClubId: string) => {
    router.replace(`/club/${selectedClubId}`);
    bottomSheetCloseRef.current?.();
  };

  return (
    <div>
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
          <button type="button">
            <MonitorIcon />
          </button>
          <button type="button">
            <MessageIcon />
          </button>
        </div>
      </Header>
      {isBottomSheetOpen && (
        <BottomSheet
          setIsBottomSheetOpen={setIsBottomSheetOpen}
          onRequestClose={(closeFn) => {
            bottomSheetCloseRef.current = closeFn;
          }}
        >
          {myClubs?.map(
            (club) =>
              club.id !== clubId && (
                <button
                  key={club.id}
                  type="button"
                  className="text-bold16 flex h-[76px] w-full flex-row items-center gap-[24px] border-b border-b-gray0"
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
                    }}
                  />
                  {club.name}
                </button>
              ),
          )}
        </BottomSheet>
      )}
    </div>
  );
}

export default Club;
