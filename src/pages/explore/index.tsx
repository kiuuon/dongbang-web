import { useState } from 'react';
import { motion } from 'framer-motion';

import useDebounce from '@/hooks/useDebounce';
import exploreStore from '@/stores/explore-store';
import AdjustmentsIcon from '@/icons/adjustments-icon';
import FilterList from '@/components/explore/club/filter-list';
import ClubSection from '@/components/explore/club/club-section';
import FeedSection from '@/components/explore/feed/feed-section';
import HashtagSection from '@/components/explore/hastag/hastag-section';

function ExplorePage() {
  const searchTarget = exploreStore((state) => state.searchTarget);
  const setSearchTarget = exploreStore((state) => state.setSearchTarget);
  const keyword = exploreStore((state) => state.keyword);
  const setKeyword = exploreStore((state) => state.setKeyword);
  const selectedHashtag = exploreStore((state) => state.selectedHashtag);
  const setSelectedHashtag = exploreStore((state) => state.setSelectedHashtag);

  const [isDetailSearchModalOpen, setIsDetailSearchModalOpen] = useState(false);

  const debouncedKeyword = useDebounce(keyword, 300);

  return (
    <div
      className={`flex h-screen w-full flex-col ${searchTarget === 'hashtag' && selectedHashtag === '' ? 'bg-white' : 'bg-background'}`}
    >
      <div
        className={`bg-white px-[20px] pt-[19px] ${searchTarget !== 'hashtag' || selectedHashtag !== '' ? 'rounded-b-[16px] shadow-[0_2px_20px_0_rgba(0,0,0,0.16)]' : ''}`}
      >
        <input
          placeholder="검색"
          value={keyword}
          onChange={(event) => {
            setKeyword(event.target.value);
          }}
          onFocus={() => {
            setSelectedHashtag('');
          }}
          className="text-regular16 h-[39px] w-full rounded-[10px] bg-gray0 px-[12px] py-[10px] placeholder:text-gray2"
        />
        <div className="mb-[12px] mt-[12px] flex flex-row gap-[14px]">
          <button
            type="button"
            className={`text-bold16 flex h-[29px] w-[52px] items-center justify-center border-b-[2px] ${searchTarget === 'feed' ? 'border-b-primary text-black' : 'border-b-white text-gray2'}`}
            onClick={() => {
              setKeyword('');
              setSelectedHashtag('');
              setSearchTarget('feed');
            }}
          >
            피드
          </button>
          <button
            type="button"
            className={`text-bold16 flex h-[29px] w-[52px] items-center justify-center border-b-[2px] ${searchTarget === 'club' ? 'border-b-primary text-black' : 'border-b-white text-gray2'}`}
            onClick={() => {
              setKeyword('');
              setSelectedHashtag('');
              setSearchTarget('club');
            }}
          >
            동아리
          </button>
          <button
            type="button"
            className={`text-bold16 flex h-[29px] w-[60px] items-center justify-center border-b-[2px] ${searchTarget === 'hashtag' ? 'border-b-primary text-black' : 'border-b-white text-gray2'}`}
            onClick={() => {
              setKeyword('');
              setSelectedHashtag('');
              setSearchTarget('hashtag');
            }}
          >
            해시태그
          </button>
        </div>
        <motion.div
          initial={false}
          animate={{
            height: searchTarget === 'club' ? 'auto' : 0,
            opacity: searchTarget === 'club' ? 1 : 0,
          }}
          transition={{
            height: { duration: 0.25, ease: 'easeOut' },
          }}
          className="overflow-hidden"
          style={{ originY: 0 }}
        >
          <div className="flex flex-row items-center justify-between rounded-b-[16px] bg-white pb-[12px]">
            <FilterList />
            <button type="button" onClick={() => setIsDetailSearchModalOpen(true)}>
              <AdjustmentsIcon />
            </button>
          </div>
        </motion.div>
      </div>

      {searchTarget === 'feed' && <FeedSection keyword={debouncedKeyword} />}
      {searchTarget === 'club' && (
        <ClubSection
          keyword={debouncedKeyword}
          isDetailSearchModalOpen={isDetailSearchModalOpen}
          setIsDetailSearchModalOpen={setIsDetailSearchModalOpen}
        />
      )}
      {searchTarget === 'hashtag' && <HashtagSection keyword={debouncedKeyword} />}
    </div>
  );
}

export default ExplorePage;
