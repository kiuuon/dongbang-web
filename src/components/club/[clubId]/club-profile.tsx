import Image from 'next/image';
import { useRouter } from 'next/router';
import { useQuery } from '@tanstack/react-query';

import { fetchUser } from '@/lib/apis/user';
import { fetchClubInfo, fetchClubMembers, fetchMyRole } from '@/lib/apis/club';
// import CrownIcon from '@/icons/crown-icon';
import CheckIcon3 from '@/icons/check-icon3';
import PeopleIcon from '@/icons/people-icon';

function ClubProfile() {
  const router = useRouter();
  const { clubId } = router.query;
  const { data: user } = useQuery({
    queryKey: ['user'],
    queryFn: fetchUser,
    throwOnError: (error) => {
      alert(`사용자 정보를 불러오는 데 실패했습니다. 다시 시도해주세요.\n\n${error.message}`);
      return false;
    },
  });
  const { data: role } = useQuery({
    queryKey: ['myRole', clubId],
    queryFn: () => fetchMyRole(clubId as string),
    throwOnError: (error) => {
      alert(`내 역할을 불러오는 데 실패했습니다. 다시 시도해주세요.\n\n${error.message}`);
      return false;
    },
  });
  const { data: clubInfo } = useQuery({
    queryKey: ['club', clubId],
    queryFn: () => fetchClubInfo(clubId as string),
    throwOnError: (error) => {
      alert(`동아리 정보를 불러오는 데 실패했습니다. 다시 시도해주세요.\n\n${error.message}`);
      return false;
    },
  });
  const { data: members } = useQuery({
    queryKey: ['clubMembers', clubId],
    queryFn: () => fetchClubMembers(clubId as string),
    throwOnError: (error) => {
      alert(`동아리 멤버 목록을 불러오는 데 실패했습니다. 다시 시도해주세요.\n\n${error.message}`);
      return false;
    },
  });

  const getRole = () => {
    if (role === 'president') {
      return '회장';
    }
    if (role === 'member') {
      return '부원';
    }
    return '';
  };

  return (
    <div className="relative flex w-full flex-col gap-[7px]">
      <div className="ml-[104px] flex h-[28] flex-row items-center gap-[15px]">
        <div className="text-bold16">{user?.name}</div>
        <div className="text-regular12 flex h-[24px] w-[44px] items-center justify-center rounded-[4px] border border-gray0">
          {getRole()}
        </div>
      </div>
      <div className="flex h-[124px] w-full flex-col gap-[32px] rounded-[12px] bg-white px-[20px] py-[12px] shadow-[0px_1px_24px_0px_rgba(0,0,0,0.08)]">
        <div className="ml-[85px] flex h-[16px] flex-row items-center gap-[8px]">
          {/* TODO: 동아리 칭호
          <CrownIcon /> 
          <div className="text-bold12 h-[16px]">동아리 최대 참석자</div> */}
        </div>
        <div className="flex flex-row items-center justify-between">
          <div className="flex flex-col gap-[8px]">
            <div className="flex flex-row gap-[8px]">
              <div className="text-bold16">{clubInfo?.name}</div>
              <div className="text-regular12 flex h-[24px] w-[56px] flex-row items-center justify-center gap-[2px] rounded-[4px] border border-gray0">
                <PeopleIcon />
                {members?.length}명
              </div>
            </div>
            <div className="text-regular12 w-[210px] overflow-hidden truncate whitespace-nowrap text-gray3">
              {clubInfo?.location}
            </div>
          </div>
          <button
            type="button"
            className="text-regular12 flex h-[40px] w-[89px] flex-row items-center justify-center gap-[8px] rounded-[4px] border border-primary"
          >
            <CheckIcon3 />
            출석하기
          </button>
        </div>
      </div>
      {clubInfo ? (
        <Image
          src={clubInfo?.logo}
          alt="로고"
          width={70}
          height={70}
          style={{
            position: 'absolute',
            top: 0,
            left: '22px',
            objectFit: 'cover',
            width: '70px',
            height: '70px',
            borderRadius: '16px',
            border: '1px solid #F9F9F9',
          }}
        />
      ) : (
        <div className="absolute left-[22px] top-0 h-[70px] w-[70px] rounded-[16px] border border-background bg-gray0" />
      )}
    </div>
  );
}

export default ClubProfile;
