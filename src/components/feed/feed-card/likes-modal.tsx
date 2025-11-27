import { useRouter } from 'next/router';
import { useQuery } from '@tanstack/react-query';

import { fetchFeedLikedUsers } from '@/lib/apis/feed/like';
import { handleQueryError } from '@/lib/utils';
import { ERROR_MESSAGE } from '@/lib/constants';
import UserAvatar from '@/components/common/user-avatar';

function LikesModal({ feedId }: { feedId: string }) {
  const router = useRouter();

  const { data: feedLikedUsers } = useQuery({
    queryKey: ['feedLikedUsers', feedId],
    queryFn: () => fetchFeedLikedUsers(feedId),
    throwOnError: (error) => handleQueryError(error, ERROR_MESSAGE.LIKE.USERS_FETCH_FAILED),
  });

  return (
    <div className="flex h-[66vh] w-full flex-col items-center px-[20px]">
      <div className="mb-[12px] mt-[12px] h-[2px] w-[37px] rounded-[10px] bg-gray1" />
      <div className="text-bold14 mb-[27px]">좋아요</div>
      <div className="scrollbar-hide mb-[20px] flex max-h-[66vh] w-full flex-col gap-[10px] overflow-y-scroll">
        {feedLikedUsers?.map((user) => (
          <button
            key={user.name}
            type="button"
            className="flex w-full items-center gap-[29px]"
            onClick={() => {
              sessionStorage.setItem(`scroll:${router.asPath}`, `${document.scrollingElement?.scrollTop || 0}`);

              router.push(`/profile/${user.nickname}`);
            }}
          >
            <UserAvatar avatar={user.avatar} size={40} />
            <div className="text-bold12">{user.name}</div>
          </button>
        ))}
      </div>
    </div>
  );
}

export default LikesModal;
