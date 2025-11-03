import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useQuery } from '@tanstack/react-query';
import { ClipLoader } from 'react-spinners';

import { fetchSession } from '@/lib/apis/auth';
import { fetchUser } from '@/lib/apis/user';
import { handleQueryError } from '@/lib/utils';
import { ERROR_MESSAGE } from '@/lib/constants';
import CogIcon from '@/icons/cog-icon';
import Header from '@/components/layout/header';
import GridIcon from '@/icons/grid-icon';
import ListIcon from '@/icons/list-icon';

function MyPage() {
  const router = useRouter();

  const [viewType, setViewType] = useState('grid');

  const { data: session } = useQuery({
    queryKey: ['session'],
    queryFn: fetchSession,
    throwOnError: (error) => handleQueryError(error, ERROR_MESSAGE.SESSION.FETCH_FAILED),
  });

  const { data: user, isPending } = useQuery({
    queryKey: ['user'],
    queryFn: fetchUser,
    throwOnError: (error) => handleQueryError(error, ERROR_MESSAGE.USER.INFO_FETCH_FAILED),
  });

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
                <Image
                  src="/images/none_avatar.png"
                  alt="아바타"
                  width={64}
                  height={64}
                  style={{
                    objectFit: 'cover',
                    width: '64px',
                    height: '64px',
                    borderRadius: '50%',
                  }}
                />
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
              className="text-bold16 w-full rounded-lg bg-primary py-4 text-white"
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
              {user.avatar ? (
                <Image
                  src={user.avatar}
                  alt="아바타"
                  width={64}
                  height={64}
                  style={{
                    objectFit: 'cover',
                    width: '64px',
                    height: '64px',
                    borderRadius: '50%',
                  }}
                />
              ) : (
                <Image
                  src="/images/none_avatar.png"
                  alt="아바타"
                  width={64}
                  height={64}
                  style={{
                    objectFit: 'cover',
                    width: '64px',
                    height: '64px',
                    borderRadius: '50%',
                  }}
                />
              )}
            </div>
            <div className="pt-[12px]">
              <div className="text-bold16">{user.name}</div>
              <div className="text-regular14 text-gray2">{user.nickname}</div>
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
            <span>{user.University.name}</span>
          </div>
          <div className="flex justify-between">
            <span>학과</span>
            <span>{user.major}</span>
          </div>
        </div>
      </div>

      <div className="flex w-full gap-[14px]">
        <button
          type="button"
          className="text-regular14 mb-[24px] mt-[16px] h-[32px] w-full rounded-[8px] bg-gray0"
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
        <button type="button" className="text-regular14 mb-[24px] mt-[16px] h-[32px] w-full rounded-[8px] bg-gray0">
          프로필 공유
        </button>
      </div>

      <div>
        <div className="mb-[48px] flex w-full justify-end gap-[27px]">
          <button type="button" onClick={() => setViewType('grid')}>
            <GridIcon isActive={viewType === 'grid'} />
          </button>
          <button type="button" onClick={() => setViewType('list')}>
            <ListIcon isActive={viewType === 'list'} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default MyPage;
