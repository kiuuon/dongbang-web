import { useRouter } from 'next/router';
import { useQuery } from '@tanstack/react-query';

import { fetchMyRole } from '@/lib/apis/club/club';
import { handleQueryError } from '@/lib/utils';
import { ERROR_MESSAGE } from '@/lib/constants';
import { ClubRole } from '@/lib/club/constants';
import { getRole } from '@/lib/club/service';
import UserAvatar from '@/components/common/user-avatar';

function MemberList({
  members,
}: {
  members: {
    userId: string;
    name: string | undefined;
    nickname: string | undefined;
    avatar: string | undefined;
    role: string | undefined;
  }[];
}) {
  const router = useRouter();
  const { clubId } = router.query;

  const { data: myRole } = useQuery({
    queryKey: ['myRole', clubId],
    queryFn: () => fetchMyRole(clubId as string),
    throwOnError: (error) => handleQueryError(error, ERROR_MESSAGE.USER.ROLE_FETCH_FAILED),
  });

  return (
    <div className="flex w-full flex-col rounded-[10px] border border-gray0">
      {members.map((member, index: number) => (
        <div
          className={`flex w-full justify-between py-[8px] pl-[28px] pr-[21px] ${index !== members.length - 1 && 'border-b border-gray0'} items-center`}
        >
          <button
            type="button"
            className="flex items-center gap-[18px]"
            onClick={() => {
              if (window.ReactNativeWebView) {
                window.ReactNativeWebView.postMessage(
                  JSON.stringify({
                    type: 'event',
                    action: 'go to profile page',
                    payload: member.userId,
                  }),
                );
                return;
              }
              router.push(`/profile/${member.nickname}`);
            }}
          >
            <UserAvatar avatar={member.avatar} size={40} />
            <div className="flex flex-col text-start">
              <div className="text-bold14 flex h-[17px] items-center gap-[2px]">
                {member.name}
                <span className="text-regular12 flex h-[14px] items-center text-gray2">
                  · {getRole(member.role as ClubRole)}
                </span>
              </div>
              <div className="text-regular12 h-[14px] text-gray2">{member.nickname}</div>
            </div>
          </button>

          {member.role !== 'president' && !(member.role === 'officer' && myRole === 'officer') && (
            <button
              type="button"
              className="text-regular12 rounded-[4px] border border-gray0 px-[7px] py-[3px]"
              onClick={() => {
                if (window.ReactNativeWebView) {
                  window.ReactNativeWebView.postMessage(
                    JSON.stringify({
                      type: 'event',
                      action: 'go to member manage page',
                      payload: member.userId,
                    }),
                  );
                  return;
                }
                router.push(`/club/${clubId}/members/manage/${member.userId}`);
              }}
            >
              권한
            </button>
          )}
        </div>
      ))}
    </div>
  );
}

export default MemberList;
