import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { ClipLoader } from 'react-spinners';

import { fetchSession, fetchUserId } from '@/lib/apis/auth';
import { fetchUser } from '@/lib/apis/user';
import { handleQueryError } from '@/lib/utils';
import { ERROR_MESSAGE } from '@/lib/constants';
import myPageStore from '@/stores/mypage-store';
import CogIcon from '@/icons/cog-icon';
import GridIcon from '@/icons/grid-icon';
import ListIcon from '@/icons/list-icon';
import FeedIcon2 from '@/icons/feed-icon2';
import TaggedFeedIcon from '@/icons/tagged-feed-icon';
import Header from '@/components/layout/header';
import UserAvatar from '@/components/common/user-avatar';
import AuthoredFeedSection from '@/components/profile/authored-feed-section';
import TaggedFeedSection from '@/components/profile/tagged-feed-section';

function MyPage() {
  const router = useRouter();

  const viewType = myPageStore((state) => state.viewType);
  const setViewType = myPageStore((state) => state.setViewType);
  const selectedFeedType = myPageStore((state) => state.selectedFeedType);
  const setSelectedFeedType = myPageStore((state) => state.setSelectedFeedType);

  const [isWebView, setIsWebView] = useState(true);

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

  const { data: userId } = useQuery({
    queryKey: ['userId'],
    queryFn: fetchUserId,
    throwOnError: (error) => handleQueryError(error, ERROR_MESSAGE.USER.ID_FETCH_FAILED),
  });

  const { data: user, isPending } = useQuery({
    queryKey: ['user'],
    queryFn: fetchUser,
    throwOnError: (error) => handleQueryError(error, ERROR_MESSAGE.USER.INFO_FETCH_FAILED),
  });

  const copyProfileLinkToClipboard = async () => {
    try {
      const url = `${process.env.NEXT_PUBLIC_SITE_URL}/profile/${user?.nickname}`;
      await navigator.clipboard.writeText(url);
      toast.success('프로필 링크가 클립보드에 복사되었습니다!');
    } catch (error) {
      toast.error('프로필 링크 복사에 실패했습니다. 다시 시도해주세요.');
    }
  };

  if (isPending) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <ClipLoader size={30} color="#F9A825" />
      </div>
    );
  }

  if (!session?.user) {
    return (
      <div className="h-screen p-[20px] pt-[72px]">
        <Header>
          <div />
          <button type="button">
            <CogIcon />
          </button>
        </Header>

        {/* 학생증 */}
        <div className="w-full rounded-[10px] bg-gradient-to-br from-[#FFF9E8] via-[#FFE6A1] to-[#F9A825] p-[20px] shadow-[0_6px_16px_0_rgba(0,0,0,0.24)]">
          <div className="flex justify-between">
            <div className="flex gap-[14px]">
              <div>
                <UserAvatar avatar={null} size={64} />
              </div>
              <div className="flex h-full items-center">
                <div className="text-bold16">로그인 해주세요</div>
              </div>
            </div>
            <div className="flex h-auto items-center justify-center">
              <div className="text-bold12 rounded-[20px] bg-secondary px-[7px] py-[5px]">학생증</div>
            </div>
          </div>
          <div className="mb-[20px] mt-[22px] h-[1px] w-full bg-gray1 opacity-50" />
          <div className="text-regular14 flex flex-col gap-[4px] text-gray2">
            <button
              type="button"
              className="text-bold16 w-full rounded-[12px] bg-primary py-[12px] text-white"
              onClick={() => {
                if (window.ReactNativeWebView) {
                  window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'event', action: 'go to login page' }));
                } else {
                  router.push('/login');
                }
              }}
            >
              로그인하러 가기
            </button>
          </div>
        </div>

        <div className="text-bold24 mt-[180px] flex w-full justify-center text-center">
          로그인하고 동방의 <br />
          모든 기능을 만나보세요!
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen p-[20px] ${!isWebView && 'pb-[60px]'} pt-[72px]`}>
      <Header>
        <div />
        <button type="button">
          <CogIcon />
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
            <span>{user?.University.name}</span>
          </div>
          <div className="flex justify-between">
            <span>학과</span>
            <span>{user?.major}</span>
          </div>
        </div>
      </div>

      {/* 버튼 */}
      <div className="mb-[24px] mt-[16px] flex w-full gap-[14px]">
        <button
          type="button"
          className="text-regular14 h-[32px] w-full rounded-[8px] bg-gray0"
          onClick={() => {
            if (window.ReactNativeWebView) {
              window.ReactNativeWebView.postMessage(
                JSON.stringify({ type: 'event', action: 'go to account setting page' }),
              );
            } else {
              router.push('/mypage/setting');
            }
          }}
        >
          계정 관리
        </button>
        <button
          type="button"
          className="text-regular14 h-[32px] w-full rounded-[8px] bg-gray0"
          onClick={copyProfileLinkToClipboard}
        >
          프로필 공유
        </button>
      </div>

      {/* 피드 */}
      <div>
        <div className="sticky left-0 right-0 top-[59px] z-50 mb-[15px] flex w-full max-w-[600px] justify-between border-b border-b-gray0 bg-white px-[20px]">
          <div className="flex">
            <button
              type="button"
              className={`flex w-[75px] items-center justify-center ${selectedFeedType === 'authored' && 'border-b border-b-primary'} pb-[5px]`}
              onClick={() => setSelectedFeedType('authored')}
            >
              <FeedIcon2 isActive={selectedFeedType === 'authored'} />
            </button>
            <button
              type="button"
              className={`flex w-[75px] items-center justify-center ${selectedFeedType === 'tagged' && 'border-b border-b-primary'} pb-[5px]`}
              onClick={() => setSelectedFeedType('tagged')}
            >
              <TaggedFeedIcon isActive={selectedFeedType === 'tagged'} />
            </button>
          </div>
          <div className="flex gap-[27px] pb-[5px]">
            <button type="button" onClick={() => setViewType('grid')}>
              <GridIcon isActive={viewType === 'grid'} />
            </button>
            <button type="button" onClick={() => setViewType('list')}>
              <ListIcon isActive={viewType === 'list'} />
            </button>
          </div>
        </div>

        {selectedFeedType === 'authored' && <AuthoredFeedSection userId={userId as string} viewType={viewType} />}
        {selectedFeedType === 'tagged' && <TaggedFeedSection userId={userId as string} viewType={viewType} />}
      </div>
    </div>
  );
}

export default MyPage;
