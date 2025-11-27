import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import { useQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { ClipLoader } from 'react-spinners';

import { fetchSession } from '@/lib/apis/auth';
import { fetchUserByNickname, fetchUserProfileVisibilityByNickname } from '@/lib/apis/user';
import { handleQueryError } from '@/lib/utils';
import { ERROR_MESSAGE } from '@/lib/constants';
import profilePageStore from '@/stores/profile-page-store';
import loginModalStore from '@/stores/login-modal-store';
import MoreVertIcon from '@/icons/more-vert-icon';
import GridIcon from '@/icons/grid-icon';
import ListIcon from '@/icons/list-icon';
import FeedIcon2 from '@/icons/feed-icon2';
import TaggedFeedIcon from '@/icons/tagged-feed-icon';
import ReportIcon2 from '@/icons/report-icon2';
import Header from '@/components/layout/header';
import BackButton from '@/components/common/back-button';
import AccessDeniedPage from '@/components/common/access-denied-page';
import UserAvatar from '@/components/common/user-avatar';
import AuthoredFeedSection from '@/components/profile/authored-feed-section';
import TaggedFeedSection from '@/components/profile/tagged-feed-section';
import ClubsModal from '@/components/profile/clubs-modal';

function ProfilePage() {
  const router = useRouter();
  const { nickname } = router.query as { nickname: string };

  const viewType = profilePageStore((state) => state.viewType[nickname] ?? 'grid');
  const selectedFeedType = profilePageStore((state) => state.selectedFeedType[nickname] ?? 'authored');
  const setViewType = profilePageStore((state) => state.setViewType);
  const setSelectedFeedType = profilePageStore((state) => state.setSelectedFeedType);

  const setIsLoginModalOpen = loginModalStore((state) => state.setIsOpen);

  const [isWebView, setIsWebView] = useState(true);
  const [isClubsModalOpen, setIsClubsModalOpen] = useState(false);
  const [isDropDownOpen, setIsDropDownOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const moreButtonRef = useRef<HTMLButtonElement>(null);

  const [isFeedHeaderOnTop, setIsFeedHeaderOnTop] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      const top = sentinelRef.current?.getBoundingClientRect().top ?? Infinity;
      setIsFeedHeaderOnTop(top <= 60);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        moreButtonRef.current &&
        !moreButtonRef.current?.contains(event.target as Node)
      ) {
        setIsDropDownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (!window.ReactNativeWebView) {
      setIsWebView(false);
    }
  }, []);

  useEffect(() => {
    const key = `scroll:${router.asPath}`;

    const savedPosition = sessionStorage.getItem(key);
    if (document.scrollingElement && savedPosition) {
      document.scrollingElement.scrollTop = parseInt(savedPosition, 10);
      sessionStorage.removeItem(key);
    }
  }, [router]);

  const { data: session } = useQuery({
    queryKey: ['session'],
    queryFn: fetchSession,
    throwOnError: (error) => handleQueryError(error, ERROR_MESSAGE.SESSION.FETCH_FAILED),
  });

  const { data: profileVisibility, isPending: isProfileVisibilityPending } = useQuery({
    queryKey: ['userProfileVisibility', nickname],
    queryFn: () => fetchUserProfileVisibilityByNickname(nickname as string),
    enabled: !!nickname,
    throwOnError: (error) => handleQueryError(error, ERROR_MESSAGE.USER.PROFILE_VISIBILITY_FETCH_FAILED),
  });

  const {
    data: user,
    isPending,
    isSuccess,
  } = useQuery({
    queryKey: ['user', nickname],
    queryFn: () => fetchUserByNickname(nickname as string, profileVisibility?.show_university),
    enabled: !!profileVisibility,
    throwOnError: (error) => handleQueryError(error, ERROR_MESSAGE.USER.INFO_FETCH_FAILED),
  });

  if (isSuccess && !user && !isPending) {
    return <AccessDeniedPage title="사용자를 찾을 수 없어요." content="존재하지 않는 사용자입니다." />;
  }

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

  const copyProfileLinkToClipboard = async () => {
    try {
      const url = `${process.env.NEXT_PUBLIC_SITE_URL}/profile/${nickname}`;
      await navigator.clipboard.writeText(url);
      toast.success('프로필 링크가 클립보드에 복사되었습니다!');
    } catch (error) {
      toast.error('프로필 링크 복사에 실패했습니다. 다시 시도해주세요.');
    }
  };

  if (isPending || isProfileVisibilityPending) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <ClipLoader size={30} color="#F9A825" />
      </div>
    );
  }

  return (
    <div className={`min-h-screen p-[20px] ${!isWebView && 'pb-[60px]'} pt-[72px]`}>
      <Header>
        <BackButton />
        <button ref={moreButtonRef} type="button" onClick={() => setIsDropDownOpen((prev) => !prev)}>
          <MoreVertIcon />
        </button>
      </Header>

      {/* 학생증 */}
      <div className="w-full rounded-[10px] bg-gradient-to-br from-[#FFF9E8] via-[#FFE6A1] to-[#F9A825] p-[20px] shadow-[0_6px_16px_0_rgba(0,0,0,0.24)]">
        <div className="flex justify-between">
          <div className="flex gap-[14px]">
            <div>
              <UserAvatar avatar={user?.avatar} size={64} />
            </div>
            <div className="pt-[12px]">
              <div className="text-bold16">{user?.name}</div>
              <div className="text-regular14 text-gray2">{user?.nickname}</div>
            </div>
          </div>
          <div className="flex h-auto items-center justify-center">
            <div className="text-bold12 rounded-[20px] bg-secondary px-[7px] py-[5px]">학생증</div>
          </div>
        </div>
        <div className="mb-[8px] mt-[22px] h-[1px] w-full bg-gray1 opacity-50" />
        <div className="text-regular14 flex flex-col gap-[4px] text-gray2">
          <div className="flex justify-between">
            <span>학교</span>
            {profileVisibility?.show_university && <span>{user?.University.name}</span>}
          </div>
          <div className="flex justify-between">
            <span>학과</span>
            {profileVisibility?.show_university && <span>{user?.major}</span>}
          </div>
        </div>
      </div>

      {/* 버튼 */}
      <div className="mb-[24px] mt-[16px] flex w-full gap-[14px]">
        <button
          type="button"
          className={`text-regular14 h-[32px] w-full rounded-[8px] bg-gray0 ${!profileVisibility?.show_clubs ? 'text-gray1' : 'text-black'}`}
          onClick={() => {
            if (!profileVisibility?.show_clubs) {
              return;
            }

            if (window.ReactNativeWebView) {
              window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'event', action: 'open clubs modal' }));
            } else {
              setIsClubsModalOpen(true);
            }
          }}
        >
          소속 동아리
        </button>
        <button
          type="button"
          className="text-regular14 h-[32px] w-full rounded-[8px] bg-gray0"
          onClick={copyProfileLinkToClipboard}
        >
          프로필 공유
        </button>
      </div>

      {isClubsModalOpen && <ClubsModal onClose={() => setIsClubsModalOpen(false)} />}

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

      {/* 피드 */}
      {profileVisibility?.show_feed ? (
        <div>
          <div ref={sentinelRef} className={`${isFeedHeaderOnTop && 'h-[47px]'} w-full`} />
          <div
            className={`${isFeedHeaderOnTop && 'fixed left-[20px] right-[20px] top-[60px] z-50 m-auto w-[calc(100vw-40px)] max-w-[560px]'} mb-[15px] flex w-full justify-between border-b border-b-gray0 bg-white`}
          >
            <div className="flex">
              <button
                type="button"
                className={`flex w-[75px] items-center justify-center ${selectedFeedType === 'authored' && 'border-b border-b-primary'} pb-[5px]`}
                onClick={() => setSelectedFeedType(nickname, 'authored')}
              >
                <FeedIcon2 isActive={selectedFeedType === 'authored'} />
              </button>
              <button
                type="button"
                className={`flex w-[75px] items-center justify-center ${selectedFeedType === 'tagged' && 'border-b border-b-primary'} pb-[5px]`}
                onClick={() => setSelectedFeedType(nickname, 'tagged')}
              >
                <TaggedFeedIcon isActive={selectedFeedType === 'tagged'} />
              </button>
            </div>
            <div className="flex gap-[27px] pb-[5px]">
              <button type="button" onClick={() => setViewType(nickname, 'grid')}>
                <GridIcon isActive={viewType === 'grid'} />
              </button>
              <button type="button" onClick={() => setViewType(nickname, 'list')}>
                <ListIcon isActive={viewType === 'list'} />
              </button>
            </div>
          </div>

          {selectedFeedType === 'authored' && <AuthoredFeedSection userId={user.id} viewType={viewType} />}
          {selectedFeedType === 'tagged' && <TaggedFeedSection userId={user.id} viewType={viewType} />}
        </div>
      ) : (
        <div className="text-bold24 mt-[164px] text-center">비공개</div>
      )}
    </div>
  );
}

export default ProfilePage;
