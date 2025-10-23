import Image from 'next/image';
import { useQuery } from '@tanstack/react-query';

import { fetchFeedLikedUsers } from '@/lib/apis/feed/like';

function LikesModal({ feedId }: { feedId: string }) {
  const { data: feedLikedUsers } = useQuery({
    queryKey: ['feedLikedUsers', feedId],
    queryFn: () => fetchFeedLikedUsers(feedId),
    throwOnError: (error) => {
      if (window.ReactNativeWebView) {
        window.ReactNativeWebView.postMessage(
          JSON.stringify({
            type: 'error',
            headline: '좋아요 유저 리스트를 불러오는 데 실패했습니다. 다시 시도해주세요.',
            message: error.message,
          }),
        );
        return false;
      }

      alert(`좋아요 유저 리스트를 불러오는 데 실패했습니다. 다시 시도해주세요.\n\n${error.message}`);
      return false;
    },
  });

  return (
    <div className="flex h-[66vh] w-full flex-col items-center px-[20px]">
      <div className="mb-[12px] mt-[12px] h-[2px] w-[37px] rounded-[10px] bg-gray1" />
      <div className="text-bold14 mb-[27px]">좋아요</div>
      <div className="scrollbar-hide mb-[20px] flex max-h-[66vh] w-full flex-col gap-[10px] overflow-y-scroll">
        {feedLikedUsers?.map((user) => (
          <button key={user.name} type="button" className="flex w-full items-center gap-[29px]">
            {user.avatar ? (
              <Image
                src={user.avatar}
                alt="아바타"
                width={40}
                height={40}
                style={{
                  objectFit: 'cover',
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                }}
              />
            ) : (
              <Image
                src="/images/none_avatar.png"
                alt="아바타"
                width={40}
                height={40}
                style={{
                  objectFit: 'cover',
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                }}
              />
            )}
            <div className="text-bold12">{user.name}</div>
          </button>
        ))}
      </div>
    </div>
  );
}

export default LikesModal;
