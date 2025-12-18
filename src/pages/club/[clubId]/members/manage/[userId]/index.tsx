import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
  changeMemberRole,
  expelMember,
  fetchClubInfo,
  fetchClubMember,
  fetchMyRole,
  transferPresident,
} from '@/lib/apis/club/club';
import { handleMutationError, handleQueryError, isValidUUID } from '@/lib/utils';
import { ERROR_MESSAGE } from '@/lib/constants';
import { ClubRole } from '@/lib/club/constants';
import { getPermissionLabels, getRole } from '@/lib/club/service';
import Header from '@/components/layout/header';
import BackButton from '@/components/common/back-button';
import AccessDeniedPage from '@/components/common/access-denied-page';
import UserAvatar from '@/components/common/user-avatar';

function MemberManagePage() {
  const router = useRouter();
  const { clubId, userId } = router.query as { clubId: string; userId: string };
  const queryClient = useQueryClient();

  const [selectedRole, setSelectedRole] = useState<ClubRole>('officer');
  const [transferInputValue, setTransferInputValue] = useState('');
  const [expelInputValue, setExpelInputValue] = useState('');

  const isClubIdValid = isValidUUID(clubId);
  const isMemberIdValid = isValidUUID(userId);

  const {
    data: member,
    isPending: isMemberFetchPending,
    isSuccess: isMemberFetchSuccess,
  } = useQuery({
    queryKey: ['member', clubId, userId],
    queryFn: () => fetchClubMember(clubId, userId),
    enabled: isClubIdValid && isMemberIdValid,
    throwOnError: (error) => handleQueryError(error, ERROR_MESSAGE.CLUB.MEMBER_FETCH_FAILED),
  });

  const {
    data: clubInfo,
    isPending: isClubInfoPending,
    isSuccess: isClubInfoSuccess,
  } = useQuery({
    queryKey: ['club', clubId],
    queryFn: () => fetchClubInfo(clubId as string),
    enabled: isClubIdValid,
    throwOnError: (error) => handleQueryError(error, ERROR_MESSAGE.CLUB.INFO_FETCH_FAILED),
  });

  useEffect(() => {
    if (member) {
      setSelectedRole(member.role as ClubRole);
    }
  }, [member]);

  const { data: myRole, isSuccess: isMyRoleFetchSuccess } = useQuery({
    queryKey: ['myRole', clubId],
    queryFn: () => fetchMyRole(clubId),
    enabled: isClubIdValid,
    throwOnError: (error) => handleQueryError(error, ERROR_MESSAGE.USER.ROLE_FETCH_FAILED),
  });

  const { mutate: handleChangeMemberRole } = useMutation({
    mutationFn: () => changeMemberRole(clubId, userId, selectedRole),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['member', clubId, userId] });
      queryClient.invalidateQueries({ queryKey: ['clubMembers', clubId] });
    },
    onError: (error) => handleMutationError(error, ERROR_MESSAGE.CLUB.CHANGE_MEMBER_ROLE_FAILED),
  });

  const { mutate: handleTransferPresident } = useMutation({
    mutationFn: () => transferPresident(clubId, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['member', clubId, userId] });
      queryClient.invalidateQueries({ queryKey: ['myRole', clubId] });
      queryClient.invalidateQueries({ queryKey: ['clubMembers', clubId] });

      if (window.ReactNativeWebView) {
        window.ReactNativeWebView.postMessage(
          JSON.stringify({
            type: 'event',
            action: 'back button click',
          }),
        );
      } else {
        router.back();
      }
    },
    onError: (error) => handleMutationError(error, ERROR_MESSAGE.CLUB.CHANGE_MEMBER_ROLE_FAILED),
  });

  const { mutate: handleExpelMember } = useMutation({
    mutationFn: () => expelMember(clubId, userId, expelInputValue),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['member', clubId, userId] });
      queryClient.invalidateQueries({ queryKey: ['clubMembers', clubId] });

      if (window.ReactNativeWebView) {
        window.ReactNativeWebView.postMessage(
          JSON.stringify({
            type: 'event',
            action: 'back button click',
          }),
        );
      } else {
        router.back();
      }
    },
    onError: (error) => handleMutationError(error, ERROR_MESSAGE.CLUB.EXPEL_MEMBER_FAILED),
  });

  if (
    (clubId && !isClubIdValid) ||
    (isClubInfoSuccess && !clubInfo && !isClubInfoPending) ||
    (userId && !isMemberIdValid) ||
    (isMemberFetchSuccess && !member && !isMemberFetchPending)
  ) {
    return <AccessDeniedPage title="멤버를 찾을 수 없어요." content="존재하지 않는 동아리 또는 멤버입니다." />;
  }

  if (isClubInfoPending || isMemberFetchPending) {
    return null;
  }

  if (isMemberFetchSuccess && member?.role === 'president') {
    router.replace('/');
    return null;
  }

  if (isMyRoleFetchSuccess && myRole !== 'president' && myRole !== 'officer') {
    router.replace('/');
    return null;
  }

  if (isMemberFetchSuccess && isMyRoleFetchSuccess && member?.role === 'officer' && myRole === 'officer') {
    router.replace('/');
    return null;
  }

  const changeRole = () => {
    handleChangeMemberRole();
  };

  const transfer = () => {
    if (transferInputValue !== '양도합니다') {
      return;
    }

    handleTransferPresident();
  };

  const expel = () => {
    handleExpelMember();
  };

  return (
    <div className="flex h-screen flex-col gap-[20px] px-[20px] pt-[63px]">
      <Header>
        <BackButton />
      </Header>
      <button
        type="button"
        className="flex items-center gap-[18px]"
        onClick={() => {
          if (member?.info.deleted_at) {
            return;
          }

          if (window.ReactNativeWebView) {
            window.ReactNativeWebView.postMessage(
              JSON.stringify({
                type: 'event',
                action: 'go to profile page',
                payload: member?.info.id,
              }),
            );
            return;
          }
          router.push(`/profile/${member?.info.nickname}`);
        }}
      >
        <UserAvatar avatar={member?.info.avatar} size={40} />
        <div className="flex flex-col text-start">
          <div
            className={`text-bold14 flex h-[17px] items-center gap-[2px] ${member?.info.deleted_at ? 'text-gray2' : 'text-black'}`}
          >
            {member?.info.deleted_at ? '(알수없음)' : member?.info.name}
            <span className="text-regular12 flex h-[14px] items-center text-gray2">
              · {getRole(member?.role as ClubRole)}
            </span>
          </div>
          <div className="text-regular12 h-[14px] text-gray2">{member?.info.nickname}</div>
        </div>
      </button>

      <div className="flex flex-col gap-[16px]">
        {/* 역할 설정 */}
        <div>
          <div className="text-bold14">역할 설정</div>
          <div className="scrollbar-hide mt-[6px] flex gap-[12px] overflow-x-auto">
            {myRole === 'president' && (
              <button
                type="button"
                className={`whitespace-nowrap rounded-[24px] px-[16px] py-[9px] ${selectedRole === 'officer' ? 'text-bold12 bg-primary text-white' : 'text-regular12 bg-gray0 text-black'}`}
                onClick={() => {
                  setSelectedRole('officer');
                }}
              >
                임원
              </button>
            )}
            <button
              type="button"
              className={`whitespace-nowrap rounded-[24px] px-[16px] py-[9px] ${selectedRole === 'member' ? 'text-bold12 bg-primary text-white' : 'text-regular12 bg-gray0 text-black'}`}
              onClick={() => {
                setSelectedRole('member');
              }}
            >
              부원
            </button>
            <button
              type="button"
              className={`whitespace-nowrap rounded-[24px] px-[16px] py-[9px] ${selectedRole === 'on_leave' ? 'text-bold12 bg-primary text-white' : 'text-regular12 bg-gray0 text-black'}`}
              onClick={() => {
                setSelectedRole('on_leave');
              }}
            >
              휴학생
            </button>
            <button
              type="button"
              className={`whitespace-nowrap rounded-[24px] px-[16px] py-[9px] ${selectedRole === 'graduate' ? 'text-bold12 bg-primary text-white' : 'text-regular12 bg-gray0 text-black'}`}
              onClick={() => {
                setSelectedRole('graduate');
              }}
            >
              졸업생
            </button>
          </div>
          <ul className="mb-[16px] mt-[12px] list-inside rounded-[10px] bg-gray0 px-[14px] py-[10px]">
            {getPermissionLabels(selectedRole).map((label) => (
              <li key={label} className="text-regular12">
                {label}
              </li>
            ))}
          </ul>
          <button
            type="button"
            className={`w-full rounded-[10px] ${selectedRole === member?.role ? 'bg-gray0' : 'bg-primary'} text-bold12 py-[12px] text-white`}
            onClick={changeRole}
          >
            변경
          </button>
        </div>

        {/* 회장 양도 */}
        {myRole === 'president' && (
          <div>
            <div className="text-bold14">회장 양도</div>
            <div className="text-regular12 mb-[8px] mt-[4px] text-gray2">
              해당 멤버에게 회장 권한을 넘깁니다. 현재 회장은 임원으로 변경됩니다.
            </div>
            <input
              value={transferInputValue}
              placeholder="'양도합니다' 입력 시 활성화"
              className="text-regular14 mb-[10px] w-full rounded-[10px] border border-gray0 px-[14px] py-[16px] outline-none placeholder:text-gray1"
              onChange={(event) => {
                setTransferInputValue(event.target.value);
              }}
            />
            <button
              type="button"
              className={`w-full rounded-[10px] ${transferInputValue === '양도합니다' ? 'bg-primary' : 'bg-gray0'} text-bold12 py-[12px] text-white`}
              onClick={transfer}
            >
              양도
            </button>
          </div>
        )}

        {/* 추방 */}
        <div>
          <div className="text-bold14">추방</div>
          <div className="text-regular12 mb-[8px] mt-[4px] text-gray2">해당 멤버를 즉시 내보냅니다.</div>
          <input
            value={expelInputValue}
            placeholder="예 : 장기간 활동 없음 / 내부 규정 위반"
            className="text-regular14 mb-[10px] w-full rounded-[10px] border border-gray0 px-[14px] py-[16px] outline-none placeholder:text-gray1"
            onChange={(event) => {
              setExpelInputValue(event.target.value);
            }}
          />
          <button
            type="button"
            className="text-bold12 w-full rounded-[10px] bg-error py-[12px] text-white"
            onClick={expel}
          >
            추방
          </button>
        </div>
      </div>
    </div>
  );
}
export default MemberManagePage;
