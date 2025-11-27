import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ClipLoader } from 'react-spinners';

import { approveApplication, fetchApplicants, fetchMyRole, rejectApplication } from '@/lib/apis/club';
import { handleMutationError, handleQueryError } from '@/lib/utils';
import { ERROR_MESSAGE } from '@/lib/constants';
import { hasPermission } from '@/lib/club/service';
import useClubPageValidation from '@/hooks/useClubPageValidation';
import Header from '@/components/layout/header';
import BackButton from '@/components/common/back-button';
import CheckIcon5 from '@/icons/check-icon5';
import XIcon8 from '@/icons/x-icon8';
import UserAvatar from '@/components/common/user-avatar';

function MembersManageApplicationPage() {
  const router = useRouter();
  const { clubId } = router.query as { clubId: string };
  const queryClient = useQueryClient();

  const [approvedIds, setApprovedIds] = useState<string[]>([]);
  const [rejectedIds, setRejectedIds] = useState<string[]>([]);

  const { isValid, ErrorComponent } = useClubPageValidation();

  const { data: applications } = useQuery({
    queryKey: ['applications', clubId],
    queryFn: () => fetchApplicants(clubId as string),
    enabled: isValid,
    throwOnError: (error) => handleQueryError(error, ERROR_MESSAGE.CLUB.APPLY_FETCH_FAILED),
  });

  const { mutate: handleApproveApplication } = useMutation({
    mutationFn: () => approveApplication(clubId, approvedIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['applications', clubId] });
      setApprovedIds([]);
    },
    onError: (error) => handleMutationError(error, ERROR_MESSAGE.CLUB.APPROVE_FAILED),
  });

  const { mutate: handleRejectApplication } = useMutation({
    mutationFn: () => rejectApplication(clubId, rejectedIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['applications', clubId] });
      setRejectedIds([]);
    },
    onError: (error) => handleMutationError(error, ERROR_MESSAGE.CLUB.REJECTED_FAILED),
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

  const onSubmit = () => {
    if (approvedIds.length > 0) {
      handleApproveApplication();
    }

    if (rejectedIds.length > 0) {
      handleRejectApplication();
    }
  };

  return (
    <div className="flex h-screen flex-col justify-between px-[20px] pt-[72px]">
      <Header>
        <BackButton />
      </Header>
      <div className="flex flex-col gap-[32px]">
        <div className="flex gap-[29px]">
          <div className="text-regular20">신청 현황</div>
          <div className="text-regular20 text-gray2">{applications?.length}명</div>
        </div>
        <div className="flex flex-col gap-[12px]">
          {applications?.map(({ user }: any) => (
            <div className="flex items-center justify-between rounded-[9px] bg-white py-[13px] pl-[18px] pr-[12px] shadow-[0_1px_24px_0_rgba(0,0,0,0.08)]">
              <button
                type="button"
                className="flex items-center gap-[18px]"
                onClick={() => {
                  if (window.ReactNativeWebView) {
                    window.ReactNativeWebView.postMessage(
                      JSON.stringify({
                        type: 'event',
                        action: 'go to profile page',
                        payload: user.id,
                      }),
                    );
                    return;
                  }
                  router.push(`/profile/${user.id}`);
                }}
              >
                <UserAvatar avatar={user.avatar} size={40} />
                <div className="flex flex-col text-start">
                  <div className="text-bold14 h-[17px]">{user.name}</div>
                  <div className="text-regular12 h-[14px] text-gray2">{user.nickname}</div>
                </div>
              </button>

              <div className="flex gap-[22px]">
                <button
                  type="button"
                  onClick={() => {
                    if (approvedIds.includes(user.id)) {
                      setApprovedIds((prev) => prev.filter((x) => x !== user.id));
                    } else {
                      setApprovedIds((prev) => [...prev, user.id]);
                      setRejectedIds((prev) => prev.filter((x) => x !== user.id));
                    }
                  }}
                >
                  <CheckIcon5 isActive={approvedIds.includes(user.id)} />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (rejectedIds.includes(user.id)) {
                      setRejectedIds((prev) => prev.filter((x) => x !== user.id));
                    } else {
                      setRejectedIds((prev) => [...prev, user.id]);
                      setApprovedIds((prev) => prev.filter((x) => x !== user.id));
                    }
                  }}
                >
                  <XIcon8 isActive={rejectedIds.includes(user.id)} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <button
        type="button"
        className={`text-bold16 mb-[20px] mt-[20px] flex h-[56px] min-h-[56px] w-full items-center justify-center rounded-[24px] ${approvedIds.length > 0 || rejectedIds.length > 0 ? 'bg-primary' : 'bg-gray0'} text-white`}
        onClick={onSubmit}
      >
        발송
      </button>
    </div>
  );
}

export default MembersManageApplicationPage;
