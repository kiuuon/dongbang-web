import { useState } from 'react';

import { useRouter } from 'next/router';
import { useQuery } from '@tanstack/react-query';

import { fetchClubInfo } from '@/lib/apis/club/club';
import { handleQueryError } from '@/lib/utils';
import { ERROR_MESSAGE } from '@/lib/constants';
import LocationMarkerIcon from '@/icons/location-marker-icon';

function ClubProfile() {
  const router = useRouter();
  const { clubId } = router.query;

  const [desciptionType, setDescriptionType] = useState('bio');

  const { data: clubInfo } = useQuery({
    queryKey: ['club', clubId],
    queryFn: () => fetchClubInfo(clubId as string),
    throwOnError: (error) => handleQueryError(error, ERROR_MESSAGE.CLUB.INFO_FETCH_FAILED),
  });

  return (
    <div className="flex flex-col gap-[14px] bg-white">
      <div className="flex w-full flex-col gap-[12px] px-[12px]">
        {/* 이름, 위치 */}
        <div className="flex flex-col gap-[3px]">
          <div className="flex items-center gap-[16px]">
            <div className="text-bold24 h-[29px]">{clubInfo?.name}</div>
          </div>
          {clubInfo?.type === 'campus' && (
            <div className="text-regular14 flex h-[17px] items-center gap-[3px] text-gray3">
              <LocationMarkerIcon />
              {clubInfo?.location}
            </div>
          )}
        </div>

        {/* 동아리 태그 */}
        <div className="flex flex-wrap gap-[8px]">
          <div className="text-bold10 rounded-[8px] bg-gray0 p-[5px] text-gray2">
            {clubInfo?.type === 'campus' ? '교내' : '연합'}
          </div>
          {clubInfo?.tags.map((tag: string) => (
            <div className="text-bold10 rounded-[8px] bg-gray0 p-[5px] text-gray2">{tag}</div>
          ))}
        </div>
      </div>

      {/* 동아리 소개 */}
      <div className="flex flex-col items-start rounded-[8px] p-[12px] shadow-[0px_1px_4px_0px_rgba(0,0,0,0.15)]">
        <div className="text-regular12 whitespace-pre-line break-all text-gray2">
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
