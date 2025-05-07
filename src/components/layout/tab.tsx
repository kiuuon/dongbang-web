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
    <nav className="fixed bottom-0 left-0 right-0 z-50 flex h-[60px] items-center justify-between bg-white px-[34px]">
      <Link href="/" className="flex flex-col items-center gap-[3px]">
        <HomeIcon color={router.pathname.startsWith('/post') ? '#F9A825' : '#989898'} />
        <div className={`text-regular10 ${router.pathname.startsWith('/post') ? 'text-primary' : 'text-gray2'}`}>
          홈
        </div>
      </Link>
      <Link href="/explore" className="flex flex-col items-center gap-[3px]">
        <SearchIcon color={router.pathname === '/explore' ? '#F9A825' : '#989898'} />
        <div className={`text-regular10 ${router.pathname.startsWith('/explore') ? 'text-primary' : 'text-gray2'}`}>
          검색
        </div>
      </Link>
      <Link href="/club" className="flex flex-col items-center gap-[3px]">
        <ClubIcon color={router.pathname === '/club' ? '#F9A825' : '#989898'} />
        <div className={`text-regular10 ${router.pathname.startsWith('/club') ? 'text-primary' : 'text-gray2'}`}>
          동아리
        </div>
      </Link>
      <Link href="/interact" className="flex flex-col items-center gap-[3px]">
        <InteractIcon color={router.pathname === '/interact' ? '#F9A825' : '#989898'} />
        <div className={`text-regular10 ${router.pathname.startsWith('/interact') ? 'text-primary' : 'text-gray2'}`}>
          교류
        </div>
      </Link>
      <Link href="/mypage" className="flex flex-col items-center gap-[3px]">
        <ProfileIcon color={router.pathname.startsWith('/mypage') ? '#F9A825' : '#989898'} />
        <div className={`text-regular10 ${router.pathname.startsWith('/mypage') ? 'text-primary' : 'text-gray2'}`}>
          프로필
        </div>
      </Link>
    </nav>
  );
}

export default Tab;
