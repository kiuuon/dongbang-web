import { useState } from 'react';

import AdjustmentsIcon from '@/icons/adjustments-icon';
import useDebounce from '@/hooks/useDebounce';
import ClubSection from '@/components/explore/club/club-section';
import FeedSection from '@/components/explore/feed/feed-section';
import HashtagSection from '@/components/explore/hastag/hastag-section';

function Explore() {
  const [searchTarget, setSearchTarget] = useState('feed');
  const [keyword, setKeyword] = useState('');
  const debouncedKeyword = useDebounce(keyword, 300);

  return (
    <div className="flex h-screen w-full flex-col pt-[19px]">
      <div className="px-[20px]">
        <input
          placeholder="검색"
          value={keyword}
          onChange={(event) => setKeyword(event.target.value)}
          className="text-regular16 h-[39px] w-full rounded-[10px] bg-gray0 px-[12px] py-[10px] placeholder:text-gray2"
        />
        <div className="mb-[17px] mt-[12px] flex flex-row gap-[14px]">
          <button
            type="button"
            className={`text-bold16 flex h-[29px] w-[52px] items-center justify-center border-b-[2px] ${searchTarget === 'feed' ? 'border-b-primary text-black' : 'border-b-white text-gray2'}`}
            onClick={() => {
              setKeyword('');
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
              setSearchTarget('hashtag');
            }}
          >
            해시태그
          </button>
        </div>
        {searchTarget === 'club' && (
          <div className="flex flex-row items-center justify-between">
            <div />
            <button type="button">
              <AdjustmentsIcon />
            </button>
          </div>
        )}
      </div>
      {searchTarget === 'club' && <div className="-mx-[20px] mt-[7px] h-[6px] w-[calc(100%+20px)] bg-background" />}
      {searchTarget === 'feed' && <FeedSection keyword={debouncedKeyword} />}
      {searchTarget === 'club' && <ClubSection />}
      {searchTarget === 'hashtag' && <HashtagSection />}
    </div>
  );
}

export default Explore;
