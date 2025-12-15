import { useRouter } from 'next/router';
import { useQueryClient, useMutation } from '@tanstack/react-query';

import { logout } from '@/lib/apis/auth';
import { handleMutationError } from '@/lib/utils';
import { ERROR_MESSAGE } from '@/lib/constants';
import RightArrowIcon2 from '@/icons/right-arrow-icon2';
import LogoutIcon from '@/icons/logout-icon';
import ReportIcon3 from '@/icons/report-icon3';
import Header from '@/components/layout/header';
import BackButton from '@/components/common/back-button';

function AccountSettingPage() {
  const queryClient = useQueryClient();
  const router = useRouter();

  const { mutate } = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['session'] });
      queryClient.invalidateQueries({ queryKey: ['userId'] });
      router.replace('/login');
    },
    onError: (error) => handleMutationError(error, ERROR_MESSAGE.AUTH.LOGOUT_FAILED),
  });

  return (
    <div className="h-screen pt-[82px]">
      <div className="px-[20px]">
        <Header>
          <div className="flex items-center gap-[10px]">
            <BackButton />
            <div className="text-bold16">계정 관리</div>
          </div>
        </Header>
      </div>
      <div className="border-t border-gray0">
        <button
          type="button"
          className="text-regular14 flex w-full items-center justify-between border-b border-gray0 py-[18px] pl-[24px] pr-[20px]"
          onClick={() => {
            if (window.ReactNativeWebView) {
              window.ReactNativeWebView.postMessage(
                JSON.stringify({ type: 'event', action: 'click edit profile button' }),
              );
            } else {
              router.push('/profile/edit');
            }
          }}
        >
          프로필 편집
          <RightArrowIcon2 />
        </button>

        <button
          type="button"
          className="text-regular14 flex w-full items-center justify-between border-b border-gray0 py-[13px] pl-[24px] pr-[20px]"
          onClick={() => {
            if (window.ReactNativeWebView) {
              window.ReactNativeWebView.postMessage(
                JSON.stringify({ type: 'event', action: 'go to profile visibility page' }),
              );
            } else {
              router.push('/mypage/setting/profile-visibility');
            }
          }}
        >
          <div className="flex flex-col items-start justify-center gap-[1px]">
            <div className="text-regular14">프로필 공개 범위 설정</div>
            <div className="text-regular10 text-gray1">학교/학과· 이름 사용자명· 내활동 · 소속 동아리</div>
          </div>
          <RightArrowIcon2 />
        </button>

        <button
          type="button"
          className="text-regular14 flex w-full items-center justify-between border-b border-gray0 py-[13px] pl-[24px] pr-[20px]"
          onClick={() => {
            if (window.ReactNativeWebView) {
              window.ReactNativeWebView.postMessage(
                JSON.stringify({ type: 'event', action: 'go to notification settings page' }),
              );
            } else {
              router.push('/mypage/setting/notification-settings');
            }
          }}
        >
          <div className="flex flex-col items-start justify-center gap-[1px]">
            <div className="text-regular14">알림 범위 설정</div>
            <div className="text-regular10 text-gray1">앱내 알림 범위 설정</div>
          </div>
          <RightArrowIcon2 />
        </button>

        <button
          type="button"
          className="text-regular14 flex w-full items-center justify-between border-b border-gray0 py-[18px] pl-[24px] pr-[20px]"
          onClick={() => {
            if (window.ReactNativeWebView) {
              window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'event', action: 'go to block list page' }));
            } else {
              router.push('/mypage/setting/block-list');
            }
          }}
        >
          차단 목록
          <RightArrowIcon2 />
        </button>
        <button
          type="button"
          className="text-regular14 flex w-full items-center justify-between border-b border-gray0 py-[18px] pl-[24px] pr-[20px]"
          onClick={() => {
            if (window.ReactNativeWebView) {
              window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'event', action: 'logout' }));
            } else {
              mutate();
            }
          }}
        >
          로그아웃
          <LogoutIcon />
        </button>
        <button
          type="button"
          className="text-regular14 flex w-full items-center justify-between border-b border-gray0 py-[20px] pl-[24px] pr-[20px] text-error"
          onClick={() => {
            // TODO: 회원탈퇴
          }}
        >
          탈퇴하기
          <ReportIcon3 />
        </button>
      </div>
    </div>
  );
}

export default AccountSettingPage;
