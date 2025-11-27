import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';

import clubPageStore from '@/stores/club-page-store';
import GridIcon from '@/icons/grid-icon';
import ListIcon from '@/icons/list-icon';
import FeedSection from './feed-section';
import InteractSection from './interact-section';
import IquirySection from './inquiry-section';

function BoardSummary() {
  const router = useRouter();
  const { clubId } = router.query as { clubId: string };
  const sentinelRef = useRef<HTMLDivElement>(null);
  const [isHeaderOnTop, setIsHeaderOnTop] = useState(false);

  const [isWebView, setIsWebView] = useState(true);

  const clubPageTop = clubPageStore((state) => state.clubPageTop);

  useEffect(() => {
    if (!window.ReactNativeWebView) {
      setIsWebView(false);
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const top = sentinelRef.current?.getBoundingClientRect().top ?? Infinity;
      const headerTop = isWebView ? clubPageTop + 60 : 60;
      if (top <= headerTop) {
        setIsHeaderOnTop(true);
      } else {
        setIsHeaderOnTop(false);
      }
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isWebView, clubPageTop]);

  const viewType = clubPageStore((state) => state.viewType[clubId] ?? 'grid');
  const selectedTab = clubPageStore((state) => state.selectedTab[clubId] ?? 'feed');
  const setViewType = clubPageStore((state) => state.setViewType);
  const setSelectedTab = clubPageStore((state) => state.setSelectedTab);

  return (
    <div>
      <div ref={sentinelRef} />
      <div
        className={`${isHeaderOnTop && `fixed left-0 right-0 z-50 m-auto w-[calc(100vw-40px)] max-w-[600px] px-[20px]`} mb-[15px] flex w-full justify-between border-b border-b-gray0 bg-white`}
        style={{ top: isWebView ? clubPageTop + 60 : 60 }}
      >
        <div className="flex">
          <button
            type="button"
            className={`flex w-[75px] items-center justify-center ${selectedTab === 'feed' && 'border-b border-b-primary'} pb-[5px]`}
            onClick={() => setSelectedTab(clubId, 'feed')}
          >
            피드
          </button>
          <button
            type="button"
            className={`flex w-[75px] items-center justify-center ${selectedTab === 'interact' && 'border-b border-b-primary'} pb-[5px]`}
            onClick={() => setSelectedTab(clubId, 'interact')}
          >
            교류
          </button>
          <button
            type="button"
            className={`flex w-[75px] items-center justify-center ${selectedTab === 'inquiry' && 'border-b border-b-primary'} pb-[5px]`}
            onClick={() => setSelectedTab(clubId, 'inquiry')}
          >
            문의
          </button>
        </div>

        {selectedTab === 'feed' && (
          <div className="flex gap-[27px] pb-[5px]">
            <button type="button" onClick={() => setViewType(clubId, 'grid')}>
              <GridIcon isActive={viewType === 'grid'} />
            </button>
            <button type="button" onClick={() => setViewType(clubId, 'list')}>
              <ListIcon isActive={viewType === 'list'} />
            </button>
          </div>
        )}
      </div>

      <div className={`${isHeaderOnTop && 'mt-[65px]'}`}>
        {selectedTab === 'feed' && <FeedSection />}
        {selectedTab === 'interact' && <InteractSection />}
        {selectedTab === 'inquiry' && <IquirySection />}
      </div>
    </div>
  );
}

export default BoardSummary;
