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
    <nav className="fixed bottom-0 left-0 right-0 z-50 flex h-[62px] justify-around border-t border-gray0 bg-white">
      <Link href="/" className="mt-[12px] flex w-[40px] flex-col items-center">
        <HomeIcon color={router.pathname.startsWith('/post') ? '#FFE6A1' : '#B4B4B4'} />
        <div className={`text-regular10 ${router.pathname.startsWith('/post') ? 'text-secondary' : 'text-gray1'}`}>
          홈
        </div>
      </Link>
      <Link href="/explore" className="mt-[12px] flex w-[40px] flex-col items-center">
        <SearchIcon color={router.pathname === '/explore' ? '#FFE6A1' : '#B4B4B4'} />
        <div className={`text-regular10 ${router.pathname.startsWith('/explore') ? 'text-secondary' : 'text-gray1'}`}>
          검색
        </div>
      </Link>
      <Link href="/club" className="mt-[12px] flex w-[40px] flex-col items-center">
        <ClubIcon color={router.pathname === '/club' ? '#FFE6A1' : '#B4B4B4'} />
        <div className={`text-regular10 ${router.pathname.startsWith('/club') ? 'text-secondary' : 'text-gray1'}`}>
          동아리
        </div>
      </Link>
      <Link href="/interact" className="mt-[12px] flex w-[40px] flex-col items-center">
        <InteractIcon color={router.pathname === '/interact' ? '#FFE6A1' : '#B4B4B4'} />
        <div className={`text-regular10 ${router.pathname.startsWith('/interact') ? 'text-secondary' : 'text-gray1'}`}>
          교류
        </div>
      </Link>
      <Link href="/mypage" className="mt-[12px] flex w-[60px] flex-col items-center">
        <ProfileIcon color={router.pathname.startsWith('/mypage') ? '#FFE6A1' : '#B4B4B4'} />
        <div className={`text-regular10 ${router.pathname.startsWith('/mypage') ? 'text-secondary' : 'text-gray1'}`}>
          마이페이지
        </div>
      </Link>
    </nav>
  );
}

export default Tab;
