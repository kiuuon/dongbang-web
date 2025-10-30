import { useEffect, useRef, useState } from 'react';
import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ClipLoader } from 'react-spinners';

import { fetchSession } from '@/lib/apis/auth';
import { addReplyComment, addRootComment, fetchFeedCommentCount, fetchRootComment } from '@/lib/apis/feed/comment';
import { handleMutationError, handleQueryError } from '@/lib/utils';
import { ERROR_MESSAGE } from '@/lib/constants';
import loginModalStore from '@/stores/login-modal-store';
import { FeedType } from '@/types/feed-type';
import RightArrowIcon6 from '@/icons/right-arrow-icon6';
import CommentCard from './comment-card';

function CommentSection({ feed }: { feed: FeedType }) {
  const queryClient = useQueryClient();
  const [inputValue, setInputValue] = useState('');
  const [reply, setReply] = useState('');
  const setIsLoginModalOpen = loginModalStore((state) => state.setIsOpen);

  const observerElement = useRef(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const bottomCommentRef = useRef<HTMLDivElement>(null);
  const bottomReplyRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  const { data: session } = useQuery({
    queryKey: ['session'],
    queryFn: fetchSession,
    throwOnError: (error) => handleQueryError(error, ERROR_MESSAGE.SESSION.FETCH_FAILED),
  });

  const { data: commentCount, isPending: isCommentCountPending } = useQuery({
    queryKey: ['commentCount', feed.id],
    queryFn: () => fetchFeedCommentCount(feed.id),
    throwOnError: (error) => handleQueryError(error, ERROR_MESSAGE.COMMENT.COUNT_FETCH_FAILED),
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
    getNextPageParam: (lastPage, allPages) => (lastPage?.length === 5 ? allPages.length : undefined),
    throwOnError: (error) => handleQueryError(error, ERROR_MESSAGE.COMMENT.LIST_FETCH_FAILED),
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
        bottomCommentRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    },
    onError: (error) => handleMutationError(error, ERROR_MESSAGE.COMMENT.WRITE_FAILED),
  });

  const { mutate: hanldeAddReplyComment } = useMutation({
    mutationFn: () => addReplyComment(feed.id, reply, inputValue),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rootCommentList', feed.id] });
      queryClient.invalidateQueries({ queryKey: ['replyCommentList', reply] });

      const ref = bottomReplyRefs.current[reply];
      if (ref) {
        setTimeout(() => {
          ref.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 100);
      }

      setInputValue('');
      setReply('');
    },
    onError: (error) => handleMutationError(error, ERROR_MESSAGE.COMMENT.WRITE_FAILED),
  });

  if (isCommentCountPending || isRootCommentListPending) {
    return (
      <div className="flex w-full justify-center">
        <ClipLoader size={30} color="#F9A825" />
        <div className="fixed bottom-0 left-1/2 z-10 w-screen max-w-[600px] -translate-x-1/2 border-t border-t-gray0 bg-white p-[8px]">
          <input
            ref={inputRef}
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
                if (reply === '') {
                  hanldeAddRootComment();
                } else {
                  hanldeAddReplyComment();
                }
              }}
            >
              <RightArrowIcon6 />
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-[12px] pb-[24px]">
      <div className="text-regular12">댓글 {(commentCount as number) > 0 && commentCount}</div>
      {(commentCount as number) > 0 ? (
        <div>
          {
            data?.pages.map((page) =>
              page.map((comment) => (
                <div>
                  <CommentCard
                    key={comment.id}
                    comment={comment}
                    reply={reply}
                    setReply={setReply}
                    inputRef={inputRef}
                  />
                  <div
                    ref={(el) => {
                      bottomReplyRefs.current[comment.id] = el;
                    }}
                  />
                </div>
              )),
            )[0]
          }
        </div>
      ) : (
        <div className="mt-[28px] flex w-full flex-col items-center justify-center gap-[16px]">
          <div className="text-bold24">아직 등록된 댓글이 없어요</div>
          <div className="text-regular20 text-gray3">첫 댓글을 남겨보세요</div>
        </div>
      )}
      <div ref={bottomCommentRef} />
      <div className="fixed bottom-0 left-1/2 z-10 w-screen max-w-[600px] -translate-x-1/2 border-t border-t-gray0 bg-white p-[8px]">
        <input
          ref={inputRef}
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
              if (reply === '') {
                hanldeAddRootComment();
              } else {
                hanldeAddReplyComment();
              }
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
