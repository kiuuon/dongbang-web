import { useQuery } from '@tanstack/react-query';
import Image from 'next/image';

import Header from '@/components/layout/header';
import { fetchMyClubs } from '@/lib/apis/club';
import ClubCard from '@/components/club/club-card';
import CreateClubButton from '@/components/club/creat-club-button';

function Club() {
  const { data: myClubs } = useQuery({
    queryKey: ['myClubs'],
    queryFn: fetchMyClubs,
  });

  console.log(myClubs);

  if (!myClubs) {
    return null;
  }

  return (
    <div className="pb-[100px] pt-[88px]">
      <Header>
        <div className="text-regular24 text-tertiary_light">내 동아리 리스트</div>
      </Header>
      <div className="flex flex-col items-center gap-y-[40px]">
        {Array.from({ length: Math.ceil(myClubs.length / 2) }).map((_, rowIdx) => {
          const startIdx = rowIdx * 2;
          const pair = myClubs.slice(startIdx, startIdx + 2);

          return (
            // eslint-disable-next-line react/no-array-index-key
            <div key={rowIdx} className="w-full">
              <div className="flex justify-center gap-x-[20px]">
                {pair.map((club) => (
                  <ClubCard key={club.id} club={club} />
                ))}
                {pair.length === 1 && <CreateClubButton />}
              </div>

              <div className="relative left-1/2 h-[15px] w-screen -translate-x-1/2">
                <Image src="/images/floor.png" alt="바닥" fill />
              </div>
            </div>
          );
        })}
        {myClubs.length % 2 === 0 && (
          <div className="w-full">
            <div className="flex justify-center gap-x-[20px]">
              <CreateClubButton />
              <div className="w-[158px]" />
            </div>
            <div className="relative left-1/2 h-[15px] w-screen -translate-x-1/2">
              <Image src="/images/floor.png" alt="바닥" fill />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Club;
