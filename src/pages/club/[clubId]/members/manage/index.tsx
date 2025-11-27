import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { ClipLoader } from 'react-spinners';

import { fetchApplicants, fetchMyRole } from '@/lib/apis/club/club';
import { fetchInviteCode, createInviteCode, deleteInviteCode } from '@/lib/apis/invite';
import { generateBase62Code, handleMutationError, handleQueryError } from '@/lib/utils';
import { ERROR_MESSAGE } from '@/lib/constants';
import { hasPermission } from '@/lib/club/service';
import useClubPageValidation from '@/hooks/useClubPageValidation';
import DuplicateIcon from '@/icons/duplicate-icon';
import TrashIcon from '@/icons/trash-icon';
import ShareIcon from '@/icons/share-icon';
import UserGroupIcon from '@/icons/user-group-icon';
import Header from '@/components/layout/header';
import BackButton from '@/components/common/back-button';
import MemberBoard from '@/components/club/[clubId]/members/manage/member-board';

function MembersManagePage() {
  const router = useRouter();
  const { clubId } = router.query as { clubId: string };
  const queryClient = useQueryClient();

  const { isValid, ErrorComponent } = useClubPageValidation();

  const { data: code } = useQuery({
    queryKey: ['inviteCode', clubId],
    queryFn: () => fetchInviteCode(clubId as string),
    enabled: isValid,
    throwOnError: (error) => handleQueryError(error, ERROR_MESSAGE.CLUB.INVITE_CODE_FETCH_FAILED),
  });

  const {
    data: myRole,
    isPending,
    isSuccess,
  } = useQuery({
    queryKey: ['myRole', clubId],
    queryFn: () => fetchMyRole(clubId as string),
    enabled: isValid,
    throwOnError: (error) => handleQueryError(error, ERROR_MESSAGE.USER.ROLE_FETCH_FAILED),
  });

  const { data: applications } = useQuery({
    queryKey: ['applications', clubId],
    queryFn: () => fetchApplicants(clubId as string),
    enabled: isValid,
    throwOnError: (error) => handleQueryError(error, ERROR_MESSAGE.CLUB.APPLY_FETCH_FAILED),
  });

  const { mutate: handleCreateCode } = useMutation({
    mutationFn: (newCode: string) => createInviteCode(clubId, newCode),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inviteCode', clubId] });
    },
    onError: (error) => handleMutationError(error, ERROR_MESSAGE.CLUB.INVITE_LINK_CREATE_FAILED),
  });

  const { mutate: handleDeleteCode } = useMutation({
    mutationFn: () => deleteInviteCode(clubId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inviteCode', clubId] });
    },
    onError: (error) => handleMutationError(error, ERROR_MESSAGE.CLUB.INVITE_LINK_DELETE_FAILED),
  });

  useEffect(() => {
    if (isSuccess && (!myRole || !hasPermission(myRole, 'manage_membership'))) {
      router.replace(`/club/${clubId}`);
    }
  }, [myRole, router, clubId, isSuccess]);

  if (!isValid) {
    return ErrorComponent;
  }

  if (isPending) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <ClipLoader size={30} color="#F9A825" />
      </div>
    );
  }

  const issueInvitationLink = () => {
    const newCode = generateBase62Code(8);
    handleCreateCode(newCode);
  };

  const deleteInvitationLink = () => {
    handleDeleteCode();
  };

  const copyToClipboard = async () => {
    try {
      const url = `${process.env.NEXT_PUBLIC_SITE_URL}/invite/${code}`;
      await navigator.clipboard.writeText(url);
      toast.success('초대 링크가 클립보드에 복사되었습니다!');
    } catch (error) {
      toast.error('초대 링크 복사에 실패했습니다. 다시 시도해주세요.');
    }
  };

  return (
    <div className="flex h-screen flex-col gap-[20px] px-[20px] pt-[64px]">
      <Header>
        <BackButton />
        <div className="text-bold16 ml-[10px] w-full">부원 관리</div>
      </Header>
      <div>
        {code ? (
          <div className="flex w-full flex-row justify-between rounded-[9px] border border-gray0 pb-[21px] pl-[26px] pr-[32px] pt-[22px]">
            <span
              role="button"
              tabIndex={0}
              className="text-regular16 truncate text-gray1"
              onClick={copyToClipboard}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  copyToClipboard();
                }
              }}
            >{`${process.env.NEXT_PUBLIC_SITE_URL}/invite/${code}`}</span>
            <div className="ml-[18px] flex flex-row gap-[18px]">
              <button type="button" onClick={copyToClipboard}>
                <DuplicateIcon />
              </button>
              <button type="button" onClick={deleteInvitationLink}>
                <TrashIcon />
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            className="flex w-full flex-row gap-[7px] rounded-[9px] border border-gray0 px-[24px] pb-[21px] pt-[22px]"
            onClick={issueInvitationLink}
          >
            <ShareIcon />
            <p>초대 코드 발급</p>
          </button>
        )}

        <button
          type="button"
          className="mb-[29px] mt-[16px] flex w-full flex-row justify-between rounded-[9px] border border-gray0 pb-[21px] pl-[24px] pr-[30px] pt-[22px]"
          onClick={() => {
            if (window.ReactNativeWebView) {
              window.ReactNativeWebView.postMessage(
                JSON.stringify({ type: 'event', action: 'go to application page' }),
              );
              return;
            }

            router.push(`/club/${clubId}/members/manage/application`);
          }}
        >
          <div className="flex gap-[7px]">
            <UserGroupIcon />
            <p>신청 현황 보기</p>
          </div>
          <div>{applications?.length}명</div>
        </button>

        <MemberBoard />
      </div>
    </div>
  );
}

export default MembersManagePage;
