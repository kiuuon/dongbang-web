import { useState } from 'react';
import { useRouter } from 'next/router';
import { useQueryClient, useMutation } from '@tanstack/react-query';

import { logout } from '@/lib/apis/auth';
import { supabase } from '@/lib/apis/supabaseClient';
import { handleMutationError } from '@/lib/utils';
import { ERROR_MESSAGE } from '@/lib/constants';
import RightArrowIcon2 from '@/icons/right-arrow-icon2';
import LogoutIcon from '@/icons/logout-icon';
import ReportIcon3 from '@/icons/report-icon3';
import Header from '@/components/layout/header';
import BackButton from '@/components/common/back-button';
import BottomSheet from '@/components/common/bottom-sheet';

function AccountSettingPage() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const [isWithdrawalModalOpen, setIsWithdrawalModalOpen] = useState(false);
  const [isWithdrawalAgreed, setIsWithdrawalAgreed] = useState(false);

  const { mutate } = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['session'] });
      queryClient.invalidateQueries({ queryKey: ['userId'] });
      router.replace('/login');
    },
    onError: (error) => handleMutationError(error, ERROR_MESSAGE.AUTH.LOGOUT_FAILED),
  });

  const handleWithdrawal = async () => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      // Edge Function 호출
      const { error } = await supabase.functions.invoke('delete-user', {
        headers: {
          Authorization: `Bearer ${session?.access_token}`,
        },
      });

      if (error) throw error;

      // 탈퇴 성공 시 처리
      alert('회원 탈퇴가 완료되었습니다.');

      // 로그아웃 처리 및 메인 이동
      await supabase.auth.signOut();
      window.location.href = '/';
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('탈퇴 처리 중 오류:', error);
      alert('탈퇴 처리에 실패했습니다. 고객센터에 문의해주세요.');
    }
  };

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
          onClick={async () => {
            if (window.ReactNativeWebView) {
              window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'event', action: 'open withdrawal modal' }));
            } else {
              setIsWithdrawalModalOpen(true);
            }
          }}
        >
          탈퇴하기
          <ReportIcon3 />
        </button>
      </div>
      {isWithdrawalModalOpen && (
        <BottomSheet setIsBottomSheetOpen={setIsWithdrawalModalOpen}>
          <div className="flex w-full flex-col p-[20px]">
            <div className="text-bold16 text-error">회원탈퇴</div>
            <div className="text-regular14 mt-[8px]">
              탈퇴시 회원 정보와 프로필은 영구 삭제되어 복구할 수 없습니다. 단, 서비스 내에 작성한 콘텐츠(게시글, 댓글,
              채팅 등)는 삭제되지 않으며, 작성자 정보는 &apos;(알수없음)&apos;으로 표시됩니다.
            </div>
            <button
              type="button"
              className="text-regular14 flex items-center gap-[8px]"
              onClick={() => setIsWithdrawalAgreed((prev) => !prev)}
            >
              <div
                className={`my-[19px] h-[14px] w-[14px] rounded-[2px] ${isWithdrawalAgreed ? 'bg-primary' : 'bg-gray0'}`}
              />
              회원탈퇴에 동의합니다.
            </button>
            <button
              type="button"
              className={`text-bold12 w-full rounded-[24px] py-[21px] text-center text-white ${!isWithdrawalAgreed ? 'bg-gray0' : 'bg-error'}`}
              disabled={!isWithdrawalAgreed}
              onClick={handleWithdrawal}
            >
              탈퇴하기
            </button>
          </div>
        </BottomSheet>
      )}
    </div>
  );
}

export default AccountSettingPage;
