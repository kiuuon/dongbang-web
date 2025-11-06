import Image from 'next/image';
import { useRouter } from 'next/router';
import { useQuery } from '@tanstack/react-query';

import { fetchFeedLikedUsers } from '@/lib/apis/feed/like';
import { handleQueryError } from '@/lib/utils';
import { ERROR_MESSAGE } from '@/lib/constants';

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
              router.push(`/profile/${user.id}`);
            }}
          >
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
