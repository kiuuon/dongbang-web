import BackButton from '@/components/common/back-button';
import Header from '@/components/layout/header';
import { fetchCommentLikedUsers } from '@/lib/apis/feed/comment';
import { useQuery } from '@tanstack/react-query';
import Image from 'next/image';
import { useRouter } from 'next/router';

function CommentLikesPage() {
  const router = useRouter();
  const { commentId } = router.query;

  const { data: feedLikedUsers } = useQuery({
    queryKey: ['commentLikedUsers', commentId],
    queryFn: () => fetchCommentLikedUsers(commentId as string),
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
