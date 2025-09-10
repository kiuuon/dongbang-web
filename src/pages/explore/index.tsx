import useDebounce from '@/hooks/useDebounce';
import exploreStore from '@/stores/explore-store';
import ClubSection from '@/components/explore/club/club-section';
import FeedSection from '@/components/explore/feed/feed-section';
import HashtagSection from '@/components/explore/hastag/hastag-section';

function Explore() {
  const searchTarget = exploreStore((state) => state.searchTarget);
  const setSearchTarget = exploreStore((state) => state.setSearchTarget);
  const keyword = exploreStore((state) => state.keyword);
  const setKeyword = exploreStore((state) => state.setKeyword);
  const setSelectedHashtag = exploreStore((state) => state.setSelectedHashtag);

  const debouncedKeyword = useDebounce(keyword, 300);

  return (
    <div className="flex h-screen w-full flex-col pt-[19px]">
      <div className="px-[20px]">
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
        <div className="mb-[17px] mt-[12px] flex flex-row gap-[14px]">
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
      </div>

      {searchTarget === 'feed' && <FeedSection keyword={debouncedKeyword} />}
      {searchTarget === 'club' && <ClubSection keyword={debouncedKeyword} />}
      {searchTarget === 'hashtag' && <HashtagSection keyword={debouncedKeyword} />}
    </div>
  );
}

export default Explore;
