import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';

import BottomArrowIcon from '@/icons/bottom-arrow-icon';
import BellIcon from '@/icons/bell-icon';
import MessageIcon from '@/icons/message-icon';

function FeedHeader({
  scrollRef,
  setIsBottomSheetOpen,
}: {
  scrollRef: React.RefObject<HTMLDivElement | null>;
  setIsBottomSheetOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
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
    const container = scrollRef.current;
    if (!container) return undefined;

    const handleScroll = () => {
      const currentY = container.scrollTop;

      if (currentY > lastScrollY.current && currentY > 50) {
        setShow(false);
      } else {
        setShow(true);
      }

      lastScrollY.current = currentY;
    };

    container.addEventListener('scroll', handleScroll);

    return () => container.removeEventListener('scroll', handleScroll);
  }, [scrollRef]);

  const handleNavigationOpen = () => {
    if (window.ReactNativeWebView) {
      window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'open navigation' }));
    } else {
      setIsBottomSheetOpen((prev) => !prev);
    }
  };

  return (
    <header
      className={`fixed left-0 top-0 z-10 flex h-[60px] w-full items-center justify-between bg-white px-[20px] transition-transform duration-300 ${
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
