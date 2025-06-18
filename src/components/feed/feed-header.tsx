import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';

import BottomArrowIcon from '@/icons/bottom-arrow-icon';
import BellIcon from '@/icons/bell-icon';
import MessageIcon from '@/icons/message-icon';

function FeedHeader({ setIsBottomSheetOpen }: { setIsBottomSheetOpen: React.Dispatch<React.SetStateAction<boolean>> }) {
  const router = useRouter();
  const { clubType } = router.query;
  const clubTypeName = {
    my: '내 동아리',
    campus: '교내 동아리',
    union: '연합 동아리',
  }[clubType as string];
  const [show, setShow] = useState(true);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;

      if (currentY > lastScrollY.current && currentY > 50) {
        setShow(false);
      } else {
        setShow(true);
      }

      lastScrollY.current = currentY;
    };

    window.addEventListener('scroll', handleScroll);

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavigationOpen = () => {
    if (window.ReactNativeWebView) {
      window.ReactNativeWebView.postMessage('openNavigation');
    } else {
      setIsBottomSheetOpen((prev) => !prev);
    }
  };

  return (
    <header
      className={`fixed left-0 top-0 flex h-[60px] w-full items-center justify-between bg-white px-[20px] transition-transform duration-300 ${
        show ? 'translate-y-0' : '-translate-y-full'
      }`}
    >
      <div className="flex items-center gap-[8px]">
        <button type="button" className="flex cursor-pointer items-center gap-[8px]" onClick={handleNavigationOpen}>
          <div className="text-bold16">{clubTypeName}</div>
          <BottomArrowIcon />
        </button>
      </div>

      <div className="flex items-center gap-[20px]">
        <button type="button">
          <BellIcon />
        </button>
        <button type="button">
          <MessageIcon />
        </button>
      </div>
    </header>
  );
}

export default FeedHeader;
