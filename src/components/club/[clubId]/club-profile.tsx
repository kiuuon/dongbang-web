import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useQuery } from '@tanstack/react-query';

import { fetchClubInfo, fetchClubMembers } from '@/lib/apis/club';
import { handleQueryError } from '@/lib/utils';
import { ERROR_MESSAGE } from '@/lib/constants';
import LocationMarkerIcon from '@/icons/location-marker-icon';
import MembersIcon from '@/icons/members-icon';

function ClubProfile({
  setIsMembersModalOpen,
}: {
  setIsMembersModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const router = useRouter();
  const { clubId } = router.query;

  const [desciptionType, setDescriptionType] = useState('bio');

  const { data: clubInfo } = useQuery({
    queryKey: ['club', clubId],
    queryFn: () => fetchClubInfo(clubId as string),
    throwOnError: (error) => handleQueryError(error, ERROR_MESSAGE.CLUB.INFO_FETCH_FAILED),
  });

  const { data: members } = useQuery({
    queryKey: ['clubMembers', clubId],
    queryFn: () => fetchClubMembers(clubId as string),
    throwOnError: (error) => handleQueryError(error, ERROR_MESSAGE.CLUB.MEMBERS_FETCH_FAILED),
  });

  return (
    <div className="flex flex-col rounded-[8px] bg-white px-[12px] pb-[8px] pt-[12px] shadow-[0px_1px_4px_0px_rgba(0,0,0,0.15)]">
      <div className="flex gap-[14px]">
        {clubInfo ? (
          <Image
            src={clubInfo?.logo}
            alt="로고"
            width={80}
            height={80}
            style={{
              objectFit: 'cover',
              width: '80px',
              height: '80px',
              borderRadius: '16px',
              border: '1px solid #F9F9F9',
            }}
          />
        ) : (
          <div className="left-[22px] top-0 h-[80px] w-[80px] rounded-[16px] border border-background bg-gray0" />
        )}
        <div className="flex flex-col justify-center">
          <div className="flex items-center gap-[16px]">
            <div className="text-bold24">{clubInfo?.name}</div>
            <button
              type="button"
              className="text-regular12 flex items-center gap-[4px] rounded-[4px] border border-gray0 px-[8px] py-[5px]"
              onClick={() => {
                if (window.ReactNativeWebView) {
                  window.ReactNativeWebView.postMessage(
                    JSON.stringify({ type: 'event', action: 'open members modal' }),
                  );
                  return;
                }

                setIsMembersModalOpen((prev) => !prev);
              }}
            >
              <MembersIcon />
              {members?.length}명
            </button>
          </div>
          {clubInfo?.type === 'campus' && (
            <div className="text-regular14 flex items-center gap-[3px] text-gray3">
              <LocationMarkerIcon />
              {clubInfo?.location}
            </div>
          )}
        </div>
      </div>

      <div className="my-[8px] flex flex-wrap gap-[8px]">
        <div className="text-bold10 rounded-[8px] bg-gray1 p-[5px]">
          {clubInfo?.type === 'campus' ? '교내' : '연합'}
        </div>
        {clubInfo?.tags.map((tag: string) => <div className="text-bold10 rounded-[8px] bg-gray1 p-[5px]">{tag}</div>)}
      </div>

      <div className="flex flex-col items-start">
        <div className="text-regular12 whitespace-pre-line text-gray2">
          {desciptionType === 'bio' ? clubInfo?.bio : clubInfo?.description}
        </div>
        <button
          type="button"
          className="text-bold12 text-primary"
          onClick={() => {
            if (desciptionType === 'bio') {
              setDescriptionType('description');
            } else {
              setDescriptionType('bio');
            }
          }}
        >
          {desciptionType === 'bio' ? '더보기' : '숨기기'}
        </button>
      </div>
    </div>
  );
}

export default ClubProfile;
