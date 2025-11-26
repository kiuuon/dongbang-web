import { useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useQuery } from '@tanstack/react-query';

import { fetchClubsByUserId } from '@/lib/apis/club';
import { handleQueryError } from '@/lib/utils';
import { ERROR_MESSAGE } from '@/lib/constants';
import { getRole } from '@/lib/club/service';

function ClubsModal({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  const { userId } = router.query;

  const { data: clubs } = useQuery({
    queryKey: ['clubs', userId],
    queryFn: () => fetchClubsByUserId(userId as string),
    throwOnError: (error) => handleQueryError(error, ERROR_MESSAGE.CLUB.LIST_FETCH_FAILED),
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
      <div className="scrollbar-hide flex h-[420px] w-full flex-col gap-[32px] overflow-y-auto rounded-[20px] bg-white p-[32px]">
        <div className="text-bold14 w-full text-center">소속 동아리</div>
        <div className="flex flex-col gap-[30px]">
          {clubs?.map((club) => (
            <button
              type="button"
              className="flex items-center gap-[20px]"
              onClick={() => {
                router.push(`/club/${club.id}`);
              }}
            >
              <Image
                src={club.logo}
                alt="동아리 로고"
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
              <div className="flex flex-col items-start gap-[5px]">
                <div className="text-bold16 h-[19px]">{club.name}</div>
                <div className="text-bold12 h-[14px] text-gray2">{getRole(club.role[0].role)}</div>
                <div className="flex gap-[4px]">
                  {club.tags.map(
                    (tag: string, index: number) =>
                      index < 3 && (
                        <div key={tag} className="text-bold10 rounded-[8px] bg-gray0 px-[5px] py-[2px] text-gray2">
                          {tag}
                        </div>
                      ),
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ClubsModal;
