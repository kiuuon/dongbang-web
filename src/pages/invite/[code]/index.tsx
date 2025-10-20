import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useMutation, useQuery } from '@tanstack/react-query';
import { ClipLoader } from 'react-spinners';

import { fetchSession, loginAndRedirect } from '@/lib/apis/auth';
import { checkIsClubMember, joinClub } from '@/lib/apis/club';
import { fetchClubIdByCode } from '@/lib/apis/invite';
import { fetchUser } from '@/lib/apis/user';
import DongbangIcon from '@/icons/dongbang-icon';
import KakaoIcon from '@/icons/kakao-icon';
import GoogleIcon from '@/icons/google-icon';
import XIcon6 from '@/icons/x-icon6';
import CheckIcon4 from '@/icons/check-icon4';
import AlertIcon from '@/icons/alert-icon';

function InvitePage() {
  const router = useRouter();
  const { code } = router.query;
  const [isCompleted, setIsCompleted] = useState(false);

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

  const { data: user } = useQuery({
    queryKey: ['user'],
    queryFn: fetchUser,
    throwOnError: (error) => {
      if (window.ReactNativeWebView) {
        window.ReactNativeWebView.postMessage(
          JSON.stringify({
            type: 'error',
            headline: '사용자 정보를 불러오는 데 실패했습니다. 다시 시도해주세요.',
            message: error.message,
          }),
        );
        return false;
      }
      alert(`사용자 정보를 불러오는 데 실패했습니다. 다시 시도해주세요.\n\n${error.message}`);
      return false;
    },
  });

  const { data: club, isPending } = useQuery({
    queryKey: ['club', code],
    queryFn: () => fetchClubIdByCode(code as string),
    throwOnError: (error) => {
      if (window.ReactNativeWebView) {
        window.ReactNativeWebView.postMessage(
          JSON.stringify({
            type: 'error',
            headline: '동아리를 불러오는 데 실패했습니다. 다시 시도해주세요.',
            message: error.message,
          }),
        );
        return false;
      }
      alert(`동아리를 불러오는 데 실패했습니다. 다시 시도해주세요.\n\n${error.message}`);
      return false;
    },
  });

  const { data: isClubMember, isPending: isPendingToCheckingClubMember } = useQuery({
    queryKey: ['isClubMember', code],
    queryFn: () => checkIsClubMember(club?.id),
    throwOnError: (error) => {
      if (window.ReactNativeWebView) {
        window.ReactNativeWebView.postMessage(
          JSON.stringify({
            type: 'error',
            headline: '동아리 가입 상태 확인을 실패했습니다. 다시 시도해주세요.',
            message: error.message,
          }),
        );
        return false;
      }
      alert(`동아리 가입 상태 확인을 실패했습니다. 다시 시도해주세요.\n\n${error.message}`);
      return false;
    },
  });

  const { mutate: handleJoinClub } = useMutation({
    mutationFn: () => joinClub(club?.id),
    onSuccess: () => {
      setIsCompleted(true);
    },
    onError: (error) => {
      if (window.ReactNativeWebView) {
        window.ReactNativeWebView.postMessage(
          JSON.stringify({
            type: 'error',
            headline: '동아리 가입에 실패했습니다. 다시 시도해주세요.',
            message: error.message,
          }),
        );
        return;
      }
      alert(`동아리 가입에 실패했습니다. 다시 시도해주세요.\n\n${error.message}`);
    },
  });

  if (isPending || isPendingToCheckingClubMember) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <ClipLoader size={30} color="#F9A825" />
      </div>
    );
  }

  if (session?.user && !user) {
    router.replace(`/sign-up/terms?redirect=/invite/${code}`);
    return null;
  }

  if (!club) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center">
        <XIcon6 />
        <div className="text-bold24 mb-[220px] mt-[40px]">유효하지 않는 초대 링크입니다.</div>
        <button
          type="button"
          className="text-bold16 flex h-[48px] w-[292px] items-center justify-center rounded-[12px] bg-primary text-white"
          onClick={() => router.push('/')}
        >
          홈으로 가기
        </button>
      </div>
    );
  }

  if (isClubMember) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center">
        <AlertIcon />
        <div className="text-bold24 mb-[220px] mt-[40px]">이미 가입한 동아리입니다.</div>
        <button
          type="button"
          className="text-bold16 flex h-[48px] w-[292px] items-center justify-center rounded-[12px] bg-primary text-white"
          onClick={() => router.push('/')}
        >
          홈으로 가기
        </button>
      </div>
    );
  }

  if (isCompleted) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center">
        <CheckIcon4 />
        <div className="text-bold24 mb-[10px] mt-[40px]">가입이 완료되었습니다!</div>
        <div className="text-regular20 mb-[12px] text-gray3">즐거운 활동을 시작해보세요.</div>
        <div className="mb-[40px] mt-[12px] flex flex-col items-center gap-[10px]">
          <Image
            src={club?.logo}
            alt="로고"
            width={96}
            height={96}
            style={{
              objectFit: 'cover',
              width: '96px',
              height: '96px',
              borderRadius: '50%',
              border: '1px solid #F9F9F9',
            }}
          />
          <div className="text-bold24">{club?.name}</div>
        </div>
        <button
          type="button"
          className="text-bold16 flex h-[48px] w-[292px] items-center justify-center rounded-[12px] bg-primary text-white"
          onClick={() => router.push('/')}
        >
          홈으로 가기
        </button>
      </div>
    );
  }
  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <div className="H-[71px] flex flex-row items-center justify-center gap-[18]">
        <DongbangIcon />
        <span className="text-bold24">동방</span>
      </div>
      <div className="mb-[15px] mt-[18px] flex flex-col items-center">
        <Image
          src={club?.logo}
          alt="로고"
          width={96}
          height={96}
          style={{
            objectFit: 'cover',
            width: '96px',
            height: '96px',
            borderRadius: '50%',
            border: '1px solid #F9F9F9',
          }}
        />
        <div className="text-bold24 mb-[15px] mt-[20px]">{club?.name}</div>
        <div className="text-regular20">회원님을 초대했어요!</div>
      </div>
      {session?.user ? (
        <div className="flex flex-col items-center gap-[40px]">
          <div className="text-regular16 text-center text-gray3">
            아래 버튼을 눌러
            <br /> {`${club?.name}에 바로 참여해보세요!`}
          </div>
          <button
            type="button"
            className="text-bold16 h-[48px] w-[292px] rounded-[12px] bg-primary text-white"
            onClick={() => {
              handleJoinClub();
            }}
          >
            가입하기
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-[41px]">
          <div className="text-regular16 text-center text-gray3">
            아래 버튼을 눌러 동방에 가입하고
            <br /> {`${club?.name}에 바로 참여해보세요!`}
          </div>
          <div className="flex flex-col gap-[12px]">
            <button
              type="button"
              className="bg-yellow1 flex h-[48px] w-[292px] flex-row items-center justify-center gap-[8px] rounded-[12px] pl-[27px]"
              onClick={() => loginAndRedirect('kakao', `/invite/${code}`)}
            >
              <KakaoIcon />
              <span className="text-regular16 flex w-full items-center justify-center">카카오톡 계정으로 시작하기</span>
            </button>
            <button
              type="button"
              className="flex h-[48px] w-[292px] flex-row items-center justify-center gap-[8px] rounded-[12px] border border-gray0 pl-[27px]"
              onClick={() => loginAndRedirect('google', `/invite/${code}`)}
            >
              <GoogleIcon />
              <span className="text-regular16 flex w-full items-center justify-center">구글 계정으로 시작하기</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default InvitePage;
