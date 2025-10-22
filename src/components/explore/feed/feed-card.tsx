import { useRouter } from 'next/router';
import Image from 'next/image';
import { useQuery } from '@tanstack/react-query';

import { fetchFeedLikeCount } from '@/lib/apis/feed/like';
import { FeedType } from '@/types/feed-type';
import { formatKoreanDate } from '@/lib/utils';
import LikesIcon2 from '@/icons/likes-icon2';

function FeedCard({ feed, scrollRef }: { feed: FeedType; scrollRef: React.RefObject<HTMLDivElement | null> }) {
  const router = useRouter();

  const { data: likeCount } = useQuery({
    queryKey: ['likeCount', feed.id],
    queryFn: () => fetchFeedLikeCount(feed.id),
    throwOnError: (error) => {
      if (window.ReactNativeWebView) {
        window.ReactNativeWebView.postMessage(
          JSON.stringify({
            type: 'error',
            headline: '좋아요 수를 불러오는 데 실패했습니다. 다시 시도해주세요.',
            message: error.message,
          }),
        );
        return false;
      }

      alert(`좋아요 수를 불러오는 데 실패했습니다. 다시 시도해주세요.\n\n${error.message}`);
      return false;
    },
  });

  return (
    <button
      type="button"
      className="flex flex-col"
      onClick={() => {
        router.push({ pathname: `/feed/detail/${feed.id}`, query: { scroll: scrollRef.current?.scrollTop || 0 } });
      }}
    >
      <div className="flex items-center gap-[4px]">
        <Image
          src={feed.club.logo}
          alt="클럽 로고"
          width={20}
          height={20}
          style={{
            objectFit: 'cover',
            width: '20px',
            height: '20px',
            minWidth: '20px',
            minHeight: '20px',
            borderRadius: '5px',
            border: '1px solid #F9F9F9',
          }}
        />
        <span className="text-regular12 w-full truncate text-start">{feed.club.name}</span>
      </div>
      <div className="relative my-[4px] aspect-[170/227] w-full">
        <Image
          src={feed.photos[0]}
          alt="피드 이미지"
          fill
          style={{
            objectFit: 'cover',
            borderRadius: '8px',
            border: '1px solid #F9F9F9',
          }}
        />
      </div>
      <div className="w-full">
        <div className="text-bold14 mb-[3px] w-full truncate text-start">{feed.title ? feed.title : feed.content}</div>
        <div className="flex w-full justify-between pr-[4px]">
          <div className="text-regular12">{formatKoreanDate(feed.created_at)}</div>
          <div className="flex items-center gap-[4px]">
            <LikesIcon2 />
            <span className="text-regular12">{likeCount}</span>
          </div>
        </div>
      </div>
    </button>
  );
}

export default FeedCard;
