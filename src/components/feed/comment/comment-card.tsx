import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { fetchSession, fetchUserId } from '@/lib/apis/auth';
import {
  addCommentLike,
  deleteComment,
  fetchMyCommentLike,
  fetchReplyComment,
  removeCommentLike,
} from '@/lib/apis/feed/comment';
import { fetchFeedDetail } from '@/lib/apis/feed/feed';
import { handleMutationError, handleQueryError } from '@/lib/utils';
import { ERROR_MESSAGE } from '@/lib/constants';
import loginModalStore from '@/stores/login-modal-store';
import { CommentType } from '@/types/feed-type';
import MoreHorizontalIcon from '@/icons/more-horizontal-icon';
import LikesIcon3 from '@/icons/likes-icon3';
import TrashIcon2 from '@/icons/trash-icon2';
import ReportIcon2 from '@/icons/report-icon2';
import TopArrowIcon from '@/icons/top-arrow-icon';
import BottomArrowIcon4 from '@/icons/bottom-arrow-icon4';
import ReplyCard from './reply-card';

export default function CommentCard({
  comment,
  reply,
  setReply,
  inputRef,
}: {
  comment: CommentType;
  reply: string;
  setReply: any;
  inputRef: any;
}) {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { feedId } = router.query;
  const setIsLoginModalOpen = loginModalStore((state) => state.setIsOpen);

  const [isDropDownOpen, setIsDropDownOpen] = useState(false);
  const [isReplyOpen, setIsReplyOpen] = useState(false);
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
    queryKey: ['isCommentLike', comment.id],
    queryFn: () => fetchMyCommentLike(comment.id),
    throwOnError: (error) => handleQueryError(error, ERROR_MESSAGE.LIKE.MY_LIKE_FETCH_FAILED),
  });

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery({
    initialPageParam: 0,
    queryKey: ['replyCommentList', comment.id],
    queryFn: ({ pageParam }) => fetchReplyComment(feed.id, comment.id, pageParam),
    getNextPageParam: (lastPage, allPages) => (lastPage?.length === 5 ? allPages.length : undefined),
    throwOnError: (error) => {
      if (window.ReactNativeWebView) {
        window.ReactNativeWebView.postMessage(
          JSON.stringify({
            type: 'error',
            headline: '답글 목록을 불러오는 데 실패했습니다. 다시 시도해주세요.',
            message: error.message,
          }),
        );
        return false;
      }
      alert(`답글 목록을 불러오는 데 실패했습니다. 다시 시도해주세요.\n\n${error.message}`);
      return false;
    },
  });

  const { mutate: addLike } = useMutation({
    mutationFn: () => addCommentLike(comment.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['isCommentLike', comment.id] });
      queryClient.invalidateQueries({ queryKey: ['rootCommentList', feedId] });
    },
    onError: (error) => handleMutationError(error, ERROR_MESSAGE.LIKE.ADD_FAILED),
  });

  const { mutate: removeLike } = useMutation({
    mutationFn: () => removeCommentLike(comment.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['isCommentLike', comment.id] });
      queryClient.invalidateQueries({ queryKey: ['rootCommentList', feedId] });
    },
    onError: (error) => handleMutationError(error, ERROR_MESSAGE.LIKE.DELETE_FAILED),
  });

  const { mutate: handleDeleteComment } = useMutation({
    mutationFn: () => deleteComment(comment.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['commentCount', feedId] });
      queryClient.invalidateQueries({ queryKey: ['rootCommentList', feed.id] });
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

    if (isLike) {
      removeLike();
    } else {
      addLike();
    }
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
    <div className="flex flex-col">
      <div
        className={`relative mb-[16px] flex flex-row justify-between ${reply === comment.id ? 'before:absolute before:-bottom-[8px] before:-top-[8px] before:left-1/2 before:-z-10 before:w-screen before:-translate-x-1/2 before:bg-background before:content-[""]' : ''} `}
      >
        <div className="flex flex-row gap-[12px]">
          <button
            type="button"
            onClick={() => {
              if (window.ReactNativeWebView) {
                window.ReactNativeWebView.postMessage(
                  JSON.stringify({
                    type: 'event',
                    action: 'go to profile page',
                    payload: comment.author_id,
                  }),
                );
                return;
              }

              sessionStorage.setItem(`scroll:${router.asPath}`, `${document.scrollingElement?.scrollTop || 0}`);

              router.push(`/profile/${comment.author_id}`);
            }}
            className="flex items-start"
          >
            {comment.author.avatar ? (
              <Image
                src={comment.author.avatar}
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
                        payload: comment.author_id,
                      }),
                    );
                    return;
                  }

                  router.push(`/profile/${comment.author_id}`);
                }}
                className="text-bold14"
              >
                {comment.author.name}
              </button>
              <div className="text-regular10 text-gray2">{getTimeAgo(comment.created_at)}</div>
            </div>
            <div className="text-regular14">{comment.content}</div>
            <button
              type="button"
              className="text-regular12 text-start text-gray3"
              onClick={() => {
                if (reply === '') {
                  setReply(comment.id);
                } else {
                  setReply('');
                }
                inputRef.current?.focus();
              }}
            >
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
          {(comment.like_count as number) > 0 && (
            <button
              type="button"
              className="text-bold12 text-gray3"
              onClick={() => {
                if (window.ReactNativeWebView) {
                  window.ReactNativeWebView.postMessage(
                    JSON.stringify({ type: 'event', action: 'go to comment likes page', payload: comment.id }),
                  );
                  return;
                }

                sessionStorage.setItem(`scroll:${router.asPath}`, `${document.scrollingElement?.scrollTop || 0}`);

                router.push(`/feed/detail/${feedId}/comment/${comment.id}/likes`);
              }}
            >
              {comment.like_count}
            </button>
          )}

          {isDropDownOpen && (
            <div
              ref={dropdownRef}
              className="absolute right-0 top-[24px] z-10 flex flex-col gap-[11px] rounded-[4px] bg-white p-[10px] shadow-[0px_1px_4px_0px_rgba(0,0,0,0.25)]"
            >
              {(feed?.author_id === userId || comment.author_id === userId) && (
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
              {(!session?.user || comment.author_id !== userId) && (
                <button type="button" className="flex w-full items-center gap-[9px]" onClick={report}>
                  <ReportIcon2 />
                  <span className="text-regular16 whitespace-nowrap text-error">신고</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {comment.reply_count > 0 && (
        <div className="mb-[16px] flex flex-col pl-[44px]">
          <button type="button" className="flex items-center gap-[4px]" onClick={() => setIsReplyOpen((prev) => !prev)}>
            <div className="h-[1px] w-[21px] bg-gray3" />
            <div className="text-regular12 text-gray3">답글 {comment.reply_count}개</div>
            {isReplyOpen ? <TopArrowIcon /> : <BottomArrowIcon4 />}
          </button>

          {isReplyOpen && (
            <div className="mt-[20px]">
              {data?.pages.map((page) => page.map((rp) => <ReplyCard key={rp.id} reply={rp} parentId={comment.id} />))}
            </div>
          )}
          {isReplyOpen && hasNextPage && (
            <button
              type="button"
              className="flex items-center gap-[4px]"
              onClick={() => {
                fetchNextPage();
              }}
              disabled={isFetchingNextPage}
            >
              <div className="h-[1px] w-[21px] bg-gray3" />
              <div className="text-regular12 text-gray3">답글 더보기</div>
            </button>
          )}
        </div>
      )}
    </div>
  );
}
