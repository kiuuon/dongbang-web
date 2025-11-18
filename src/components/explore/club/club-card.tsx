import Image from 'next/image';

import { ClubType } from '@/types/club-type';
import { useRouter } from 'next/router';

function ClubCard({ club, scrollRef }: { club: ClubType; scrollRef: React.RefObject<HTMLDivElement | null> }) {
  const router = useRouter();

  return (
    <div className="relative flex items-center">
      <button
        type="button"
        className="relative z-10 flex w-full rounded-[8px] border-b-gray0 bg-white px-[10px] pb-[9px] pt-[20px] shadow-[0_0_12px_0_rgba(0,0,0,0.08)]"
        onClick={() => {
          sessionStorage.setItem(`scroll:${router.asPath}`, `${scrollRef.current?.scrollTop || 0}`);

          router.push(`/club/${club.id}`);
        }}
      >
        <div className="mr-[20px] min-w-[60px]">
          <Image
            src={club.logo}
            alt="로고"
            width={60}
            height={60}
            style={{
              objectFit: 'cover',
              width: '60px',
              height: '60px',
              borderRadius: '5px',
              border: '1px solid #F9F9F9',
            }}
          />
        </div>
        <div className="flex w-full flex-col items-start">
          <div className="flex w-full justify-between">
            <div className="mr-[10px] flex flex-col">
              <div className="text-bold16 mb-[6px] text-start">{club.name}</div>
              <div className="text-regular12 mb-[15px] text-start">{club.bio}</div>
            </div>
          </div>
          <div className="flex gap-[4px]">
            {club.tags.map(
              (tag, index: number) =>
                index < 3 && (
                  <div key={tag} className="text-regular12 rounded-[8px] bg-gray0 px-[5px] py-[2px] text-gray2">
                    {tag}
                  </div>
                ),
            )}
          </div>
        </div>
      </button>
    </div>
  );
}

export default ClubCard;
