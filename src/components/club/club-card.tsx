import Image from 'next/image';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/router';

import { ClubType } from '@/types/club-type';
import { fetchMyRole } from '@/lib/apis/club';

function ClubCard({ club }: { club: ClubType }) {
  const router = useRouter();
  const { data: role } = useQuery({
    queryKey: ['myRole', club.id],
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

  const goToClub = () => {
    if (window.ReactNativeWebView) {
      window.ReactNativeWebView.postMessage(`${club.id}`);
      return;
    }
    router.push(`/club/${club.id}`);
  };

  return (
    <button
      type="button"
      className="flex h-[124px] min-h-[124px] w-full items-center rounded-[12px] bg-white px-[20px] shadow-[0px_1px_24px_0px_rgba(0,0,0,0.08)]"
      onClick={() => {
        if (window.ReactNativeWebView) {
          window.ReactNativeWebView.postMessage(`${club.id}`);
          return;
        }
        goToClub();
      }}
    >
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
          border: '1px solid #F9F9F9',
        }}
      />
      <div className="ml-[20px] flex flex-col justify-center">
        <div className="text-bold16 text-start">{club.name}</div>
        <div className="text-bold12 mb-[6px] mt-[4px] h-[18px] text-start text-gray2">{getRole()}</div>
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
    </button>
  );
}

export default ClubCard;
