import { useRouter } from 'next/router';
import Image from 'next/image';

import { FeedType } from '@/types/feed-type';
import { formatKoreanDate } from '@/lib/utils';
import LikesIcon2 from '@/icons/likes-icon2';

function FeedCard({ feed }: { feed: FeedType }) {
  const router = useRouter();

  return (
    <button
      type="button"
      className="flex max-w-[170px] flex-col"
      onClick={() => {
        router.push(`/feed/detail/${feed.id}`);
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
      <div>
        <div className="text-bold14 mb-[3px] w-full truncate text-start">{feed.title ? feed.title : feed.content}</div>
        <div className="flex justify-between">
          <div className="text-regular12">{formatKoreanDate(feed.created_at)}</div>
          <div className="flex items-center gap-[4px]">
            <LikesIcon2 />
            <span className="text-regular12">21</span>
          </div>
        </div>
      </div>
    </button>
  );
}

export default FeedCard;
