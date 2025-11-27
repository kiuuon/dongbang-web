import { useRouter } from 'next/router';
import { useQuery } from '@tanstack/react-query';

import { fetchFeedDetail } from '@/lib/apis/feed/feed';
import { fetchComment, fetchCommentLikedUsers } from '@/lib/apis/feed/comment';
import { handleQueryError, isValidUUID } from '@/lib/utils';
import { ERROR_MESSAGE } from '@/lib/constants';
import BackButton from '@/components/common/back-button';
import Header from '@/components/layout/header';
import AccessDeniedPage from '@/components/common/access-denied-page';
import UserAvatar from '@/components/common/user-avatar';

function CommentLikesPage() {
  const router = useRouter();
  const { feedId, commentId } = router.query;

  const isFeedValid = isValidUUID(feedId as string);
  const isCommentValid = isValidUUID(commentId as string);

  const {
    data: feed,
    isPending: isFeedPending,
    isSuccess: isFeedSuccess,
  } = useQuery({
    queryKey: ['feedDetail', feedId],
    queryFn: () => fetchFeedDetail(feedId as string),
    enabled: isFeedValid,
    throwOnError: (error) => handleQueryError(error, ERROR_MESSAGE.FEED.DETAIL_FETCH_FAILED),
  });

  const {
    data: comment,
    isPending: isCommentPending,
    isSuccess: isCommentSuccess,
  } = useQuery({
    queryKey: ['commentDetail', commentId],
    queryFn: () => fetchComment(commentId as string),
    enabled: isCommentValid,
    throwOnError: (error) => handleQueryError(error, ERROR_MESSAGE.COMMENT.FETCH_FAILED),
  });

  const { data: feedLikedUsers } = useQuery({
    queryKey: ['commentLikedUsers', commentId],
    queryFn: () => fetchCommentLikedUsers(commentId as string),
    enabled: !!comment,
    throwOnError: (error) => handleQueryError(error, ERROR_MESSAGE.LIKE.USERS_FETCH_FAILED),
  });

  if (
    (feedId && !isFeedValid) ||
    (isFeedSuccess && !feed && !isFeedPending) ||
    (commentId && !isCommentValid) ||
    (isCommentSuccess && !comment && !isCommentPending)
  ) {
    return <AccessDeniedPage title="좋아요 목록을 볼 수 없어요." content="확인할 수 없는 댓글입니다." />;
  }

  return (
    <div className="flex min-h-screen flex-col gap-[10px] px-[20px] pb-[30px] pt-[80px]">
      <Header>
        <BackButton />
        <span className="text-bold16">좋아요</span>
        <div />
      </Header>
      {feedLikedUsers?.map((user) => (
        <button
          key={user.name}
          type="button"
          className="flex w-full items-center gap-[29px]"
          onClick={() => {
            if (window.ReactNativeWebView) {
              window.ReactNativeWebView.postMessage(
                JSON.stringify({
                  type: 'event',
                  action: 'go to profile page',
                  payload: user.id,
                }),
              );
              return;
            }
            router.push(`/profile/${user.nickname}`);
          }}
        >
          <UserAvatar avatar={user.avatar} size={40} />
          <div className="text-bold12">{user.name}</div>
        </button>
      ))}
    </div>
  );
}

export default CommentLikesPage;
