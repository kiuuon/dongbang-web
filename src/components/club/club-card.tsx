import Image from 'next/image';
import { useQuery } from '@tanstack/react-query';

import { ClubType } from '@/types/club-type';
import { fetchMyRole } from '@/lib/apis/club';

function ClubCard({ club }: { club: ClubType }) {
  const { data: role } = useQuery({
    queryKey: ['club', club.id],
    queryFn: () => fetchMyRole(club.id),
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
    <div className="flex h-[124px] w-full items-center rounded-[12px] bg-white px-[20px] shadow-[0px_1px_24px_0px_rgba(0,0,0,0.08)]">
      <Image
        src={club.logo}
        alt="로고"
        width={60}
        height={60}
        style={{
          objectFit: 'cover',
          width: '60px',
          height: '60px',
          borderRadius: '16px',
        }}
      />
      <div className="ml-[20px] flex flex-col justify-center gap-[5px]">
        <div className="text-bold16">{club.name}</div>
        <div className="text-bold12 h-[18px] text-gray2">{getRole()}</div>
        <div className="flex flex-row gap-[8px]">
          {club.tags.map(
            (tag, idx: number) =>
              idx < 2 && (
                <div key={tag} className="text-bold10 rounded-[8px] bg-primary px-[5px] py-[2px] text-white">
                  {tag}
                </div>
              ),
          )}
        </div>
      </div>
    </div>
  );
}

export default ClubCard;
