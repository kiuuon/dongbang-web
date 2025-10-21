import Link from 'next/link';
import { useRouter } from 'next/router';

import HomeIcon from '@/icons/home-icon';
import SearchIcon from '@/icons/search-icon';
import ClubIcon from '@/icons/club-icon';
import InteractIcon from '@/icons/interact-icon';
import ProfileIcon from '@/icons/profile-icon';
import { useQuery } from '@tanstack/react-query';
import { fetchSession } from '@/lib/apis/auth';

function Tab() {
  const router = useRouter();

  const { data: session } = useQuery({
    queryKey: ['session'],
    queryFn: fetchSession,
    throwOnError: (error) => {
      if (window.ReactNativeWebView) {
        window.ReactNativeWebView.postMessage(
          JSON.stringify({
            type: 'error',
            headline: '세션 정보를 불러오는 데 실패했습니다. 다시 시도해주세요.',
            message: error.message,
          }),
        );
        return false;
      }
      alert(`세션 정보를 불러오는 데 실패했습니다. 다시 시도해주세요.\n\n${error.message}`);
      return false;
    },
  });

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 m-auto flex h-[60px] max-w-[600px] items-center justify-between border-t-[0.5px] border-t-background bg-white px-[34px]">
      <Link href={session?.user ? '/feed/my' : '/feed/union'} replace className="flex flex-col items-center gap-[3px]">
        <HomeIcon color={router.pathname.startsWith('/feed') ? '#F9A825' : '#989898'} />
        <div className={`text-regular10 ${router.pathname.startsWith('/feed') ? 'text-primary' : 'text-gray2'}`}>
          홈
        </div>
      </Link>
      <Link href="/explore" replace className="flex flex-col items-center gap-[3px]">
        <SearchIcon color={router.pathname === '/explore' ? '#F9A825' : '#989898'} />
        <div className={`text-regular10 ${router.pathname.startsWith('/explore') ? 'text-primary' : 'text-gray2'}`}>
          검색
        </div>
      </Link>
      <Link href="/club" replace className="flex flex-col items-center gap-[3px]">
        <ClubIcon color={router.pathname === '/club' ? '#F9A825' : '#989898'} />
        <div className={`text-regular10 ${router.pathname.startsWith('/club') ? 'text-primary' : 'text-gray2'}`}>
          동아리
        </div>
      </Link>
      <Link href="/interact" replace className="flex flex-col items-center gap-[3px]">
        <InteractIcon color={router.pathname === '/interact' ? '#F9A825' : '#989898'} />
        <div className={`text-regular10 ${router.pathname.startsWith('/interact') ? 'text-primary' : 'text-gray2'}`}>
          교류
        </div>
      </Link>
      <Link href="/mypage" replace className="flex flex-col items-center gap-[3px]">
        <ProfileIcon color={router.pathname.startsWith('/mypage') ? '#F9A825' : '#989898'} />
        <div className={`text-regular10 ${router.pathname.startsWith('/mypage') ? 'text-primary' : 'text-gray2'}`}>
          프로필
        </div>
      </Link>
    </nav>
  );
}

export default Tab;
