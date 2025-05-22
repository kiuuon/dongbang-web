import Image from 'next/image';
import { useRouter } from 'next/router';
import { useQuery } from '@tanstack/react-query';

import Header from '@/components/layout/header';
import { fetchMyClubs } from '@/lib/apis/club';
import ClubCard from '@/components/club/club-card';
import PlusIcon2 from '@/icons/plus-icon2';

function Club() {
  const router = useRouter();
  const { data: myClubs } = useQuery({
    queryKey: ['myClubs'],
    queryFn: fetchMyClubs,
  });

  return (
    <div className={`${myClubs?.length !== 0 && 'bg-background pt-[108px]'} px-[20px]`}>
      <Header>
        <div className="text-bold16">내 동아리 리스트</div>
        <button
          type="button"
          onClick={() => {
            if (window.ReactNativeWebView) {
              window.ReactNativeWebView.postMessage('create club');
              return;
            }
            router.push('/club/create');
          }}
        >
          <PlusIcon2 />
        </button>
      </Header>
      {myClubs?.length === 0 ? (
        <div className="mt-[177px] flex w-full flex-col items-center gap-[25px]">
          <Image src="/images/join.gif" alt="post" width={70} height={70} priority />
          <p className="text-bold20 text-gray1">소속된 동아리가 없습니다</p>
        </div>
      ) : (
        <div className="flex min-h-[calc(100vh-108px)] flex-col gap-[16px]">
          {myClubs?.map((club) => <ClubCard key={club.id} club={club} />)}
        </div>
      )}
    </div>
  );
}

export default Club;
