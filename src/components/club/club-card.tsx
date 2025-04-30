import Image from 'next/image';

import { ClubType } from '@/types/club-type';

function ClubCard({ club }: { club: ClubType }) {
  return (
    <div className="relative flex w-[158px] flex-col items-center gap-[16px]">
      <Image src="/images/light.png" alt="조명" width={40} height={46} priority />
      <Image src="/images/door.png" alt="문" width={140} height={230} priority />
      <div className="absolute flex h-full w-full flex-col items-center justify-end gap-[19px]">
        <Image
          src={club.logo}
          alt="로고"
          width={50}
          height={50}
          style={{
            objectFit: 'cover',
            width: '50px',
            height: '50px',
            borderRadius: '5px',
            border: '0.5px solid #E0E0E0',
          }}
        />
        <div className="mb-[22px] flex h-[74px] w-[99px] flex-col items-center">
          <div className="text-regular16 mt-[5px] text-gray3">{club.name}</div>
        </div>
      </div>
    </div>
  );
}

export default ClubCard;
