import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/router';

import { fetchClubMembers } from '@/lib/apis/club';
import { handleQueryError } from '@/lib/utils';
import { ERROR_MESSAGE } from '@/lib/constants';
import Image from 'next/image';

function MembersModal({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  const { clubId } = router.query;

  const { data: members } = useQuery({
    queryKey: ['clubMembers', clubId],
    queryFn: () => fetchClubMembers(clubId as string),
    throwOnError: (error) => handleQueryError(error, ERROR_MESSAGE.CLUB.MEMBERS_FETCH_FAILED),
  });

  useEffect(() => {
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  const handleOutSideClick = (event: React.MouseEvent<HTMLDivElement> | React.KeyboardEvent<HTMLDivElement>) => {
    if (event.type === 'click' && event.target === event.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      role="button"
      tabIndex={0}
      className="fixed bottom-0 left-0 right-0 z-40 m-auto flex h-screen w-screen max-w-[600px] items-center justify-center bg-black bg-opacity-60 px-[32px]"
      onClick={handleOutSideClick}
      onKeyDown={(event) => {
        if (event.key === 'Escape') {
          handleOutSideClick(event);
        }
      }}
    >
      <div className="scrollbar-hide flex h-[420px] w-full flex-col gap-[16px] overflow-y-auto rounded-[20px] bg-white px-[16px] pb-[30px] pt-[40px]">
        <div className="flex flex-col gap-[8px]">
          <div className="text-bold14">회장</div>
          <div className="flex flex-col gap-[16px]">
            {members?.map(
              (member) =>
                member.role === 'president' && (
                  <button
                    type="button"
                    className="flex items-center gap-[12px]"
                    onClick={() => {
                      router.push(`/profile/${member.userId}`);
                    }}
                  >
                    {member.avatar ? (
                      <Image
                        src={member.avatar}
                        alt="아바타"
                        width={32}
                        height={32}
                        style={{
                          objectFit: 'cover',
                          width: '32px',
                          height: '32px',
                          borderRadius: '50%',
                        }}
                      />
                    ) : (
                      <Image
                        src="/images/none_avatar.png"
                        alt="아바타"
                        width={32}
                        height={32}
                        style={{
                          objectFit: 'cover',
                          width: '32px',
                          height: '32px',
                          borderRadius: '50%',
                        }}
                      />
                    )}
                    <div className="flex flex-col items-start">
                      <div className="text-bold14 h-[17px]">{member.name}</div>
                      <div className="text-regular12 h-[14px] text-gray2">{member.nickname}</div>
                    </div>
                  </button>
                ),
            )}
          </div>
        </div>

        <div className="flex flex-col gap-[8px]">
          <div className="text-bold14">임원</div>
          <div className="flex flex-col gap-[16px]">
            {members?.map(
              (member) =>
                member.role === 'officer' && (
                  <button
                    type="button"
                    className="flex items-center gap-[12px]"
                    onClick={() => {
                      router.push(`/profile/${member.userId}`);
                    }}
                  >
                    {member.avatar ? (
                      <Image
                        src={member.avatar}
                        alt="아바타"
                        width={32}
                        height={32}
                        style={{
                          objectFit: 'cover',
                          width: '32px',
                          height: '32px',
                          borderRadius: '50%',
                        }}
                      />
                    ) : (
                      <Image
                        src="/images/none_avatar.png"
                        alt="아바타"
                        width={32}
                        height={32}
                        style={{
                          objectFit: 'cover',
                          width: '32px',
                          height: '32px',
                          borderRadius: '50%',
                        }}
                      />
                    )}
                    <div className="flex flex-col items-start">
                      <div className="text-bold14 h-[17px]">{member.name}</div>
                      <div className="text-regular12 h-[14px] text-gray2">{member.nickname}</div>
                    </div>
                  </button>
                ),
            )}
          </div>
        </div>

        <div className="flex flex-col gap-[8px]">
          <div className="text-bold14">부원</div>
          <div className="flex flex-col gap-[16px]">
            {members?.map(
              (member) =>
                member.role === 'member' && (
                  <button
                    type="button"
                    className="flex items-center gap-[12px]"
                    onClick={() => {
                      router.push(`/profile/${member.userId}`);
                    }}
                  >
                    {member.avatar ? (
                      <Image
                        src={member.avatar}
                        alt="아바타"
                        width={32}
                        height={32}
                        style={{
                          objectFit: 'cover',
                          width: '32px',
                          height: '32px',
                          borderRadius: '50%',
                        }}
                      />
                    ) : (
                      <Image
                        src="/images/none_avatar.png"
                        alt="아바타"
                        width={32}
                        height={32}
                        style={{
                          objectFit: 'cover',
                          width: '32px',
                          height: '32px',
                          borderRadius: '50%',
                        }}
                      />
                    )}
                    <div className="flex flex-col items-start">
                      <div className="text-bold14 h-[17px]">{member.name}</div>
                      <div className="text-regular12 h-[14px] text-gray2">{member.nickname}</div>
                    </div>
                  </button>
                ),
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default MembersModal;
