import Image from 'next/image';
import { useRouter } from 'next/router';
import { useQuery } from '@tanstack/react-query';

import { fetchCommentLikedUsers } from '@/lib/apis/feed/comment';
import { handleQueryError } from '@/lib/utils';
import { ERROR_MESSAGE } from '@/lib/constants';
import BackButton from '@/components/common/back-button';
import Header from '@/components/layout/header';

function CommentLikesPage() {
  const router = useRouter();
  const { commentId } = router.query;

  const { data: feedLikedUsers } = useQuery({
    queryKey: ['commentLikedUsers', commentId],
    queryFn: () => fetchCommentLikedUsers(commentId as string),
    throwOnError: (error) => handleQueryError(error, ERROR_MESSAGE.LIKE.USERS_FETCH_FAILED),
  });

  return (
    <div className="flex min-h-screen flex-col gap-[10px] px-[20px] pb-[30px] pt-[80px]">
      <Header>
        <BackButton />
        <span className="text-bold16">좋아요</span>
        <div />
      </Header>
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
  );
}

export default CommentLikesPage;
