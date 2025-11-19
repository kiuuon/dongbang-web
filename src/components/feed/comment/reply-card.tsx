import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { fetchSession, fetchUserId } from '@/lib/apis/auth';
import { deleteComment, fetchMyCommentLike, toggleCommentLike } from '@/lib/apis/feed/comment';
import { fetchFeedDetail } from '@/lib/apis/feed/feed';
import { handleMutationError, handleQueryError } from '@/lib/utils';
import { ERROR_MESSAGE } from '@/lib/constants';
import loginModalStore from '@/stores/login-modal-store';
import { CommentType } from '@/types/feed-type';
import MoreHorizontalIcon from '@/icons/more-horizontal-icon';
import LikesIcon3 from '@/icons/likes-icon3';
import TrashIcon2 from '@/icons/trash-icon2';
import ReportIcon2 from '@/icons/report-icon2';

export default function ReplyCard({ reply, parentId }: { reply: CommentType; parentId: string }) {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { feedId } = router.query;
  const setIsLoginModalOpen = loginModalStore((state) => state.setIsOpen);

  const [isDropDownOpen, setIsDropDownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const moreButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        moreButtonRef.current &&
        !moreButtonRef.current?.contains(event.target as Node)
      ) {
        setIsDropDownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const { data: session } = useQuery({
    queryKey: ['session'],
    queryFn: fetchSession,
    throwOnError: (error) => handleQueryError(error, ERROR_MESSAGE.SESSION.FETCH_FAILED),
  });

  const { data: userId } = useQuery({
    queryKey: ['userId'],
    queryFn: fetchUserId,
    throwOnError: (error) => handleQueryError(error, ERROR_MESSAGE.USER.ID_FETCH_FAILED),
  });

  const { data: feed } = useQuery({
    queryKey: ['feedDetail', feedId],
    queryFn: () => fetchFeedDetail(feedId as string),
    throwOnError: (error) => handleQueryError(error, ERROR_MESSAGE.FEED.DETAIL_FETCH_FAILED),
  });

  const { data: isLike } = useQuery({
    queryKey: ['isCommentLike', reply.id],
    queryFn: () => fetchMyCommentLike(reply.id),
    throwOnError: (error) => handleQueryError(error, ERROR_MESSAGE.LIKE.MY_LIKE_FETCH_FAILED),
  });

  const { mutate: handleToggleFeedLike } = useMutation({
    mutationFn: () => toggleCommentLike(reply.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['isCommentLike', reply.id] });
      queryClient.invalidateQueries({ queryKey: ['replyCommentList', parentId] });
    },
    onError: (error) => handleMutationError(error, ERROR_MESSAGE.LIKE.TOGGLE_FAILED),
  });

  const { mutate: handleDeleteComment } = useMutation({
    mutationFn: () => deleteComment(reply.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rootCommentList', feedId] });
      queryClient.invalidateQueries({ queryKey: ['replyCommentList', parentId] });
    },
    onError: (error) => handleMutationError(error, ERROR_MESSAGE.COMMENT.DELETE_FAILED),
  });

  const toggleLike = () => {
    if (!session?.user) {
      if (window.ReactNativeWebView) {
        window.ReactNativeWebView.postMessage(
          JSON.stringify({
            type: 'event',
            action: 'open login modal',
          }),
        );
        return;
      }

      setIsLoginModalOpen(true);
      return;
    }

    handleToggleFeedLike();
  };

  const report = () => {
    if (!session?.user) {
      if (window.ReactNativeWebView) {
        window.ReactNativeWebView.postMessage(
          JSON.stringify({
            type: 'event',
            action: 'open login modal',
          }),
        );
        return;
      }

      setIsLoginModalOpen(true);
    }

    // TODO: 신고하기
  };

  function getTimeAgo(dateString: string) {
    const now = new Date();
    const created = new Date(dateString);

    const diff = (now.getTime() - created.getTime()) / 1000; // 초 단위 차이

    const minutes = diff / 60;
    const hours = diff / 3600;
    const days = diff / 86400;
    const months = diff / (86400 * 30);
    const years = diff / (86400 * 365);

    if (years >= 1) return `${Math.floor(years)}년 전`;
    if (months >= 1) return `${Math.floor(months)}개월 전`;
    if (days >= 1) return `${Math.floor(days)}일 전`;
    if (hours >= 1) return `${Math.floor(hours)}시간 전`;
    if (minutes >= 1) return `${Math.floor(minutes)}분 전`;
    return '방금 전';
  }

  return (
    <div className="mb-[16px] flex flex-row justify-between">
      <div className="flex flex-row gap-[12px]">
        <button
          type="button"
          onClick={() => {
            if (window.ReactNativeWebView) {
              window.ReactNativeWebView.postMessage(
                JSON.stringify({
                  type: 'event',
                  action: 'go to profile page',
                  payload: reply.author_id,
                }),
              );
              return;
            }

            router.push(`/profile/${reply.author_id}`);
          }}
          className="flex items-start"
        >
          {reply.author.avatar ? (
            <Image
              src={reply.author.avatar}
              alt="아바타"
              width={32}
              height={32}
              style={{
                objectFit: 'cover',
                width: '32px',
                height: '32px',
                borderRadius: '50%',
              }}
            />
          ) : (
            <Image
              src="/images/none_avatar.png"
              alt="아바타"
              width={32}
              height={32}
              style={{
                objectFit: 'cover',
                width: '32px',
                height: '32px',
                borderRadius: '50%',
              }}
            />
          )}
        </button>

        <div className="flex flex-col gap-[4px]">
          <div className="flex items-center gap-[6px]">
            <button
              type="button"
              onClick={() => {
                if (window.ReactNativeWebView) {
                  window.ReactNativeWebView.postMessage(
                    JSON.stringify({
                      type: 'event',
                      action: 'go to profile page',
                      payload: reply.author_id,
                    }),
                  );
                  return;
                }
                router.push(`/profile/${reply.author_id}`);
              }}
              className="text-bold14"
            >
              {reply.author.name}
            </button>
            <div className="text-regular10 text-gray2">{getTimeAgo(reply.created_at)}</div>
          </div>
          <div className="text-regular14">{reply.content}</div>
          <button type="button" className="text-regular12 text-start text-gray3">
            답글 달기
          </button>
        </div>
      </div>

      <div className="relative flex flex-col gap-[4px]">
        <button ref={moreButtonRef} type="button" onClick={() => setIsDropDownOpen((prev) => !prev)}>
          <MoreHorizontalIcon />
        </button>
        <button type="button" onClick={toggleLike}>
          <LikesIcon3 isActive={isLike || false} />
        </button>
        {(reply.like_count as number) > 0 && (
          <button
            type="button"
            className="text-bold12 text-gray3"
            onClick={() => {
              if (window.ReactNativeWebView) {
                window.ReactNativeWebView.postMessage(
                  JSON.stringify({ type: 'event', action: 'go to comment likes page', payload: reply.id }),
                );
                return;
              }

              router.push(`/feed/detail/${feedId}/comment/${reply.id}/likes`);
            }}
          >
            {reply.like_count}
          </button>
        )}
        {isDropDownOpen && (
          <div
            ref={dropdownRef}
            className="absolute right-0 top-[24px] z-10 flex flex-col gap-[11px] rounded-[4px] bg-white p-[10px] shadow-[0px_1px_4px_0px_rgba(0,0,0,0.25)]"
          >
            {(feed?.author_id === userId || reply.author_id === userId) && (
              <button
                type="button"
                className="flex w-full items-center gap-[9px]"
                onClick={() => {
                  handleDeleteComment();
                }}
              >
                <TrashIcon2 />
                <span className="text-regular16 whitespace-nowrap text-gray3">삭제</span>
              </button>
            )}
            {(!session?.user || reply.author_id !== userId) && (
              <button type="button" className="flex w-full items-center gap-[9px]" onClick={report}>
                <ReportIcon2 />
                <span className="text-regular16 whitespace-nowrap text-error">신고</span>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
