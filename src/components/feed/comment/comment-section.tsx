import { useEffect, useRef, useState } from 'react';
import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ClipLoader } from 'react-spinners';

import { fetchSession } from '@/lib/apis/auth';
import { fetchUserListByMention } from '@/lib/apis/user';
import { addReplyComment, addRootComment, fetchFeedCommentCount, fetchRootComment } from '@/lib/apis/feed/comment';
import { handleMutationError, handleQueryError } from '@/lib/utils';
import { ERROR_MESSAGE } from '@/lib/constants';
import useDebounce from '@/hooks/useDebounce';
import loginModalStore from '@/stores/login-modal-store';
import { FeedType } from '@/types/feed-type';
import RightArrowIcon6 from '@/icons/right-arrow-icon6';
import UserAvatar from '@/components/common/user-avatar';
import CommentCard from './comment-card';

function CommentSection({ feed }: { feed: FeedType }) {
  const queryClient = useQueryClient();
  const [inputValue, setInputValue] = useState('');
  const [replyTargetId, setReplyTargetId] = useState('');
  const setIsLoginModalOpen = loginModalStore((state) => state.setIsOpen);

  const [keyword, setKeyword] = useState('');
  const debouncedKeyword = useDebounce(keyword, 300);

  const [isActive, setIsActive] = useState(false);

  const observerElement = useRef(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
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
    getNextPageParam: (lastPage, allPages) => (lastPage?.length === 20 ? allPages.length : undefined),
    throwOnError: (error) => handleQueryError(error, ERROR_MESSAGE.COMMENT.LIST_FETCH_FAILED),
  });

  const { data: mentionUsers = [] } = useQuery({
    queryKey: ['mentionSearch', debouncedKeyword],
    enabled: isActive && debouncedKeyword.length > 0,
    queryFn: () => fetchUserListByMention(debouncedKeyword),
    throwOnError: (error) => handleQueryError(error, ERROR_MESSAGE.USER.LIST_FETCH_FAILED),
  });

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [isCommentCountPending, isRootCommentListPending, data]);

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

      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }

      setTimeout(() => {
        bottomCommentRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    },
    onError: (error) => handleMutationError(error, ERROR_MESSAGE.COMMENT.WRITE_FAILED),
  });

  const { mutate: hanldeAddReplyComment } = useMutation({
    mutationFn: () => addReplyComment(feed.id, replyTargetId, inputValue),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rootCommentList', feed.id] });
      queryClient.invalidateQueries({ queryKey: ['replyCommentList', replyTargetId] });

      const ref = bottomReplyRefs.current[replyTargetId];
      if (ref) {
        setTimeout(() => {
          ref.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 100);
      }

      setInputValue('');
      setReplyTargetId('');

      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    },
    onError: (error) => handleMutationError(error, ERROR_MESSAGE.COMMENT.WRITE_FAILED),
  });

  const handleInput = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = event.target.value;
    const cursor = event.target.selectionStart;

    const before = text.slice(0, cursor);

    const match = before.match(/(?:^|\s)@([\w가-힣]*)$/);

    if (match) {
      setIsActive(true);
      setKeyword(match[1]);
    } else {
      setIsActive(false);
      setKeyword('');
    }

    setInputValue(text);

    if (!textareaRef.current) return;
    textareaRef.current.style.height = 'auto';
    textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
  };

  const handleSelect = (user: { name: string; nickname: string; avatar: string }) => {
    if (!textareaRef.current) return;

    const cursor = textareaRef.current.selectionStart;
    const before = inputValue.slice(0, cursor);
    const after = inputValue.slice(cursor);

    const newBefore = before.replace(
      /(?:^|\s)@[\w가-힣]*$/,
      (match) => `${match.startsWith(' ') ? ' ' : ''}@${user.nickname} `,
    );

    const newValue = newBefore + after;
    setInputValue(newValue);

    const newCursor = newBefore.length;
    requestAnimationFrame(() => {
      textareaRef.current!.selectionStart = newCursor;
      textareaRef.current!.selectionEnd = newCursor;
      textareaRef.current!.focus();
    });

    setIsActive(false);
    setKeyword('');
  };

  if (isCommentCountPending || isRootCommentListPending) {
    return (
      <div className="flex w-full justify-center">
        <ClipLoader size={30} color="#F9A825" />
        <div className="fixed bottom-0 left-1/2 z-10 w-screen max-w-[600px] -translate-x-1/2 border-t border-t-gray0 bg-white p-[8px]">
          <textarea
            ref={textareaRef}
            rows={1}
            value={inputValue}
            className="text-regular14 leading box-border w-full resize-none overflow-hidden rounded-[8px] border border-gray0 py-[9px] pl-[21px] pr-[52px] leading-normal outline-none placeholder:text-gray2"
            placeholder="댓글을 입력해주세요."
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                event.preventDefault();
              }
            }}
            onChange={handleInput}
          />
          {inputValue !== '' && (
            <button
              type="button"
              className="absolute bottom-[21px] right-[15px]"
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
                if (replyTargetId === '') {
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
                    replyTargetId={replyTargetId}
                    setReplyTargetId={setReplyTargetId}
                    setInputValue={setInputValue}
                    textareaRef={textareaRef}
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
      <div className="fixed bottom-0 left-1/2 z-10 flex w-screen max-w-[600px] -translate-x-1/2 flex-col">
        {isActive && mentionUsers.length > 0 && (
          <div className="flex w-full flex-col gap-[4px] border-t border-t-gray0 bg-white p-[8px]">
            {mentionUsers.map((user) => (
              <button
                type="button"
                className="flex items-center gap-[12px] p-[8px]"
                onMouseDown={(e) => {
                  // textarea blur 막기
                  e.preventDefault();
                }}
                onClick={() => {
                  handleSelect(user);
                }}
              >
                <UserAvatar avatar={user.avatar} size={32} />
                <div className="flex flex-col items-start">
                  <div className="text-bold14 h-[17px]">{user.name}</div>
                  <div className="text-regular12 h-[14px] text-gray2">{user.nickname}</div>
                </div>
              </button>
            ))}
          </div>
        )}
        <div className="relative border-t border-t-gray0 bg-white p-[8px]">
          <textarea
            ref={textareaRef}
            rows={1}
            value={inputValue}
            className="text-regular14 leading box-border w-full resize-none overflow-hidden rounded-[8px] border border-gray0 py-[9px] pl-[21px] pr-[52px] leading-normal outline-none placeholder:text-gray2"
            placeholder="댓글을 입력해주세요."
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                event.preventDefault();
              }
            }}
            onChange={handleInput}
          />
          {inputValue !== '' && (
            <button
              type="button"
              className="absolute bottom-[21px] right-[15px]"
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
                if (replyTargetId === '') {
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
      {hasNextPage && (
        <div ref={observerElement} className="flex h-[40px] items-center justify-center text-[32px]">
          <ClipLoader size={30} color="#F9A825" />
        </div>
      )}
    </div>
  );
}

export default CommentSection;
