import Link from 'next/link';
import { useRouter } from 'next/router';

import HomeIcon from '@/icons/home-icon';
import SearchIcon from '@/icons/search-icon';
import ClubIcon from '@/icons/club-icon';
import InteractIcon from '@/icons/interact-icon';
import ProfileIcon from '@/icons/profile-icon';

function Tab() {
  const router = useRouter();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 flex h-[70px] justify-around border-t border-gray0 bg-primary">
      <Link href="/" className="mt-[12px] flex w-[40px] flex-col items-center">
        <HomeIcon color={router.pathname.startsWith('/post') ? '#5C4A25' : '#A17C4A'} />
        <div
          className={`text-regular12 ${router.pathname.startsWith('/post') ? 'text-tertiary_dark' : 'text-tertiary'}`}
        >
          홈
        </div>
      </Link>
      <Link href="/explore" className="mt-[12px] flex w-[40px] flex-col items-center">
        <SearchIcon color={router.pathname === '/explore' ? '#5C4A25' : '#A17C4A'} />
        <div
          className={`text-regular12 ${router.pathname.startsWith('/explore') ? 'text-tertiary_dark' : 'text-tertiary'}`}
        >
          검색
        </div>
      </Link>
      <Link href="/club" className="mt-[12px] flex w-[40px] flex-col items-center">
        <ClubIcon color={router.pathname === '/club' ? '#5C4A25' : '#A17C4A'} />
        <div
          className={`text-regular12 ${router.pathname.startsWith('/club') ? 'text-tertiary_dark' : 'text-tertiary'}`}
        >
          동아리
        </div>
      </Link>
      <Link href="/interact" className="mt-[12px] flex w-[40px] flex-col items-center">
        <InteractIcon color={router.pathname === '/interact' ? '#5C4A25' : '#A17C4A'} />
        <div
          className={`text-regular12 ${router.pathname.startsWith('/interact') ? 'text-tertiary_dark' : 'text-tertiary'}`}
        >
          교류
        </div>
      </Link>
      <Link href="/mypage" className="mt-[12px] flex w-[60px] flex-col items-center">
        <ProfileIcon color={router.pathname.startsWith('/mypage') ? '#5C4A25' : '#A17C4A'} />
        <div
          className={`text-regular12 ${router.pathname.startsWith('/mypage') ? 'text-tertiary_dark' : 'text-tertiary'}`}
        >
          마이페이지
        </div>
      </Link>
    </nav>
  );
}

export default Tab;
