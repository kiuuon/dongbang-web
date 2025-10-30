import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { useQuery } from '@tanstack/react-query';

import { fetchSession } from '@/lib/apis/auth';
import { handleQueryError } from '@/lib/utils';
import { ERROR_MESSAGE } from '@/lib/constants';
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

  const { data: session, isPending } = useQuery({
    queryKey: ['session'],
    queryFn: fetchSession,
    throwOnError: (error) => handleQueryError(error, ERROR_MESSAGE.SESSION.FETCH_FAILED),
  });

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
      window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'event', action: 'open navigation' }));
    } else {
      setIsBottomSheetOpen((prev) => !prev);
    }
  };

  const goToLoginPage = () => {
    if (window.ReactNativeWebView) {
      window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'event', action: 'go to login page' }));
    } else {
      router.push('/login');
    }
  };

  return (
    <header
      className={`fixed left-0 right-0 top-0 z-10 m-auto flex h-[60px] w-full max-w-[600px] items-center justify-between bg-white px-[20px] transition-transform duration-300 ${
        show ? 'translate-y-0' : '-translate-y-full'
      }`}
    >
      <div className="flex items-center gap-[8px]">
        <button type="button" className="flex cursor-pointer items-center gap-[8px]" onClick={handleNavigationOpen}>
          <div className="text-bold16">{clubTypeName}</div>
          <BottomArrowIcon />
        </button>
      </div>

      {/* eslint-disable-next-line no-nested-ternary */}
      {isPending ? null : session?.user ? (
        <div className="flex items-center gap-[20px]">
          <button type="button">
            <BellIcon />
          </button>
          <button type="button">
            <MessageIcon />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={goToLoginPage}
          className="text-bold16 rounded-[5px] bg-primary px-[8px] py-[5px] text-white"
        >
          로그인
        </button>
      )}
    </header>
  );
}

export default FeedHeader;
