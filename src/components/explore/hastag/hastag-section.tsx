import { useEffect, useState } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';

import { fetchHashtags } from '@/lib/apis/feed';
import exploreStore from '@/stores/explore-store';
import FeedSection from '../feed/feed-section';

function HashtagSection({ keyword }: { keyword: string }) {
  const selectedHashtag = exploreStore((state) => state.selectedHashtag);
  const setSelectedHashtag = exploreStore((state) => state.setSelectedHashtag);

  const { data: hashtags } = useInfiniteQuery({
    initialPageParam: 0,
    queryKey: ['hashtags', keyword],
    queryFn: ({ pageParam }) => fetchHashtags(keyword, pageParam),
    getNextPageParam: (lastPage, allPages) => (lastPage?.length ? allPages.length : undefined),
    placeholderData: (prev) => prev,
    throwOnError: (error) => {
      alert(`해시태그를 불러오는 데 실패했습니다. 다시 시도해주세요.\n\n${error.message}`);
      return false;
    },
  });

  const [isWebView, setIsWebView] = useState(true);

  useEffect(() => {
    if (!window.ReactNativeWebView) {
      setIsWebView(false);
    }
  }, []);

  return (
    <div>
      {selectedHashtag === '' ? (
        <div
          className={`scrollbar-hide flex max-h-[calc(100vh-120px)] flex-col overflow-y-scroll px-[20px] ${!isWebView && 'pb-[60px]'}`}
        >
          {hashtags?.pages.map((page) =>
            page.map((hashtag) => (
              <button
                key={hashtag.id}
                type="button"
                className="text-regular14 flex h-[43px] min-h-[43px] items-center"
                onClick={() => setSelectedHashtag(hashtag.name)}
              >
                #{hashtag.name}
              </button>
            )),
          )}
        </div>
      ) : (
        <FeedSection keyword={selectedHashtag} />
      )}
    </div>
  );
}

export default HashtagSection;
