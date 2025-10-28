import { useEffect, useRef, useState } from 'react';
import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ClipLoader } from 'react-spinners';

import { fetchSession } from '@/lib/apis/auth';
import { addRootComment, fetchFeedCommentCount, fetchRootComment } from '@/lib/apis/feed/comment';
import loginModalStore from '@/stores/login-modal-store';
import { FeedType } from '@/types/feed-type';
import RightArrowIcon6 from '@/icons/right-arrow-icon6';
import CommentCard from './comment-card';

function CommentSection({ feed }: { feed: FeedType }) {
  const queryClient = useQueryClient();
  const [inputValue, setInputValue] = useState('');
  const setIsLoginModalOpen = loginModalStore((state) => state.setIsOpen);

  const observerElement = useRef(null);

  const bottomRef = useRef<HTMLDivElement>(null);

  const { data: session } = useQuery({
    queryKey: ['session'],
    queryFn: fetchSession,
    throwOnError: (error) => {
      if (window.ReactNativeWebView) {
        window.ReactNativeWebView.postMessage(
          JSON.stringify({
            type: 'error',
            headline: '세션 정보를 불러오는 데 실패했습니다. 다시 시도해주세요.',
            message: error.message,
          }),
        );
        return false;
      }
      alert(`세션 정보를 불러오는 데 실패했습니다. 다시 시도해주세요.\n\n${error.message}`);
      return false;
    },
  });

  const { data: commentCount, isPending: isCommentCountPending } = useQuery({
    queryKey: ['commentCount', feed.id],
    queryFn: () => fetchFeedCommentCount(feed.id),
    throwOnError: (error) => {
      if (window.ReactNativeWebView) {
        window.ReactNativeWebView.postMessage(
          JSON.stringify({
            type: 'error',
            headline: '댓글 수를 불러오는 데 실패했습니다. 다시 시도해주세요.',
            message: error.message,
          }),
        );
        return false;
      }

      alert(`댓글 수를 불러오는 데 실패했습니다. 다시 시도해주세요.\n\n${error.message}`);
      return false;
    },
  });

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isPending: isRootCommentListPending,
  } = useInfiniteQuery({
    initialPageParam: 0,
    queryKey: ['rootCommentList', feed.id],
    queryFn: ({ pageParam }) => fetchRootComment(feed.id, pageParam),
    getNextPageParam: (lastPage, allPages) => (lastPage?.length === 20 ? allPages.length : undefined),
    throwOnError: (error) => {
      if (window.ReactNativeWebView) {
        window.ReactNativeWebView.postMessage(
          JSON.stringify({
            type: 'error',
            headline: '댓글 목록을 불러오는 데 실패했습니다. 다시 시도해주세요.',
            message: error.message,
          }),
        );
        return false;
      }
      alert(`댓글 목록을 불러오는 데 실패했습니다. 다시 시도해주세요.\n\n${error.message}`);
      return false;
    },
  });

  useEffect(() => {
    const target = observerElement.current;
    if (!target) return undefined;

    const observerInstance = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && hasNextPage) {
            fetchNextPage();
          }
        });
      },
      { threshold: 1 },
    );

    observerInstance.observe(target);

    return () => observerInstance.unobserve(target);
  }, [fetchNextPage, hasNextPage]);

  const { mutate: hanldeAddRootComment } = useMutation({
    mutationFn: () => addRootComment(feed.id, inputValue),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['commentCount', feed.id] });
      queryClient.invalidateQueries({ queryKey: ['rootCommentList', feed.id] });
      setInputValue('');

      setTimeout(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    },
    onError: (error) => {
      if (window.ReactNativeWebView) {
        window.ReactNativeWebView.postMessage(
          JSON.stringify({
            type: 'error',
            headline: '댓글 작성에 실패했습니다. 다시 시도해주세요.',
            message: error.message,
          }),
        );
        return;
      }
      alert(`댓글 작성에 실패했습니다. 다시 시도해주세요.\n\n${error.message}`);
    },
  });

  if (isCommentCountPending || isRootCommentListPending) {
    return (
      <div className="flex w-full justify-center">
        <ClipLoader size={30} color="#F9A825" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-[12px] pb-[24px]">
      <div className="text-regular12">댓글 {(commentCount as number) > 0 && commentCount}</div>
      {(commentCount as number) > 0 ? (
        <div>{data?.pages[0].map((comment) => <CommentCard key={comment.id} comment={comment} />)}</div>
      ) : (
        <div className="mt-[28px] flex w-full flex-col items-center justify-center gap-[16px]">
          <div className="text-bold24">아직 등록된 댓글이 없어요</div>
          <div className="text-regular20 text-gray3">첫 댓글을 남겨보세요</div>
        </div>
      )}
      <div ref={bottomRef} />
      <div className="fixed bottom-0 left-1/2 z-10 w-screen max-w-[600px] -translate-x-1/2 border-t border-t-gray0 bg-white p-[8px]">
        <input
          value={inputValue}
          className="text-regular16 w-full rounded-[10px] border border-gray0 py-[8px] pl-[16px] pr-[40px] outline-none placeholder:text-gray2"
          placeholder="댓글을 입력해주세요."
          onChange={(event) => {
            setInputValue(event.target.value);
          }}
        />
        {inputValue !== '' && (
          <button
            type="button"
            className="absolute bottom-0 right-[16px] top-0"
            onClick={() => {
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
              hanldeAddRootComment();
            }}
          >
            <RightArrowIcon6 />
          </button>
        )}
      </div>
      {hasNextPage && (
        <div ref={observerElement} className="flex h-[40px] items-center justify-center text-[32px]">
          <ClipLoader size={30} color="#F9A825" />
        </div>
      )}
    </div>
  );
}

export default CommentSection;
