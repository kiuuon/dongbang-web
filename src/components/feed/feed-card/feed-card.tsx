import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import 'keen-slider/keen-slider.min.css';
import { useKeenSlider } from 'keen-slider/react';

import { fetchSession } from '@/lib/apis/auth';
import { fetchFeedCommentCount } from '@/lib/apis/feed/comment';
import { addFeedLike, fetchFeedLikeCount, fetchMyFeedLike, removeFeedLike } from '@/lib/apis/feed/like';
import { formatKoreanDate } from '@/lib/utils';
import loginModalStore from '@/stores/login-modal-store';
import { FeedType } from '@/types/feed-type';
import MoreVertIcon from '@/icons/more-vert-icon';
import LikesIcon from '@/icons/likes-icon';
import CommentsIcon from '@/icons/comments-icon';
import ProfileIcon2 from '@/icons/profile-icon2';
import BottomSheet from '@/components/common/bottom-sheet';
import FeedContent from './feed-content';
import TaggedClubModal from './tagged-club-modal';
import TaggedUserModal from './tagged-user-modal';
import InteractModal from './interact-modal';
import SettingModal from './setting-modal';
import LikesModal from './likes-modal';

function FeedCard({ feed, scrollRef }: { feed: FeedType; scrollRef: React.RefObject<HTMLDivElement | null> }) {
  const queryClient = useQueryClient();
  const router = useRouter();
  const [page, setPage] = useState(0);
  const [isTaggedUserModalOpen, setIsTaggedUserModalOpen] = useState(false);
  const [isTaggedClubModalOpen, setIsTaggedClubModalOpen] = useState(false);
  const [isInteractModalOpen, setIsInteractModalOpen] = useState(false);
  const [isSettingModalOpen, setIsSettingModalOpen] = useState(false);
  const [isLikesModalOpen, setIsLikesModalOpen] = useState(false);
  const setIsLoginModalOpen = loginModalStore((state) => state.setIsOpen);

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

  const { data: isLike } = useQuery({
    queryKey: ['isLike', feed.id],
    queryFn: () => fetchMyFeedLike(feed.id),
    throwOnError: (error) => {
      if (window.ReactNativeWebView) {
        window.ReactNativeWebView.postMessage(
          JSON.stringify({
            type: 'error',
            headline: '내 좋아요 여부를 불러오는 데 실패했습니다. 다시 시도해주세요.',
            message: error.message,
          }),
        );
        return false;
      }

      alert(`내 좋아요 여부를 불러오는 데 실패했습니다. 다시 시도해주세요.\n\n${error.message}`);
      return false;
    },
  });

  const { data: likeCount } = useQuery({
    queryKey: ['likeCount', feed.id],
    queryFn: () => fetchFeedLikeCount(feed.id),
    throwOnError: (error) => {
      if (window.ReactNativeWebView) {
        window.ReactNativeWebView.postMessage(
          JSON.stringify({
            type: 'error',
            headline: '좋아요 수를 불러오는 데 실패했습니다. 다시 시도해주세요.',
            message: error.message,
          }),
        );
        return false;
      }

      alert(`좋아요 수를 불러오는 데 실패했습니다. 다시 시도해주세요.\n\n${error.message}`);
      return false;
    },
  });

  const { data: commentCount } = useQuery({
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

  const { mutate: addLike } = useMutation({
    mutationFn: () => addFeedLike(feed.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['likeCount', feed.id] });
      queryClient.invalidateQueries({ queryKey: ['isLike', feed.id] });
    },
    onError: (error) => {
      if (window.ReactNativeWebView) {
        window.ReactNativeWebView.postMessage(
          JSON.stringify({
            type: 'error',
            headline: '좋아요 추가에 실패했습니다. 다시 시도해주세요.',
            message: error.message,
          }),
        );
        return;
      }
      alert(`좋아요 추가에 실패했습니다. 다시 시도해주세요.\n\n${error.message}`);
    },
  });

  const { mutate: removeLike } = useMutation({
    mutationFn: () => removeFeedLike(feed.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['likeCount', feed.id] });
      queryClient.invalidateQueries({ queryKey: ['isLike', feed.id] });
    },
    onError: (error) => {
      if (window.ReactNativeWebView) {
        window.ReactNativeWebView.postMessage(
          JSON.stringify({
            type: 'error',
            headline: '좋아요 삭제에 실패했습니다. 다시 시도해주세요.',
            message: error.message,
          }),
        );
        return;
      }
      alert(`좋아요 삭제에 실패했습니다. 다시 시도해주세요.\n\n${error.message}`);
    },
  });

  const maxIndicatorShiftX = Math.max(feed.photos.length - 5, 0) * 13;
  const currentIndicatorShiftX = Math.min(Math.max(page - 2, 0) * 13, maxIndicatorShiftX);

  const [sliderRef] = useKeenSlider({
    slideChanged(slider) {
      setPage(slider.track.details.rel);
    },
  });

  const handleClubClick = () => {
    if (feed.taggedClubs.length > 0) {
      if (window.ReactNativeWebView) {
        window.ReactNativeWebView.postMessage(
          JSON.stringify({ type: 'event', action: 'tagged club click', payload: feed.taggedClubs }),
        );
        return;
      }
      setIsTaggedClubModalOpen(true);
    } else {
      // TODO: 클럽 소개 페이지로 이동하는 로직
    }
  };

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

  return (
    <div key={feed.id} className="flex flex-col pb-[20px]">
      {/* 피드 헤더 */}
      <div className="flex h-[40px] items-center justify-between">
        <button type="button" className="flex h-full items-center gap-[12px]" onClick={handleClubClick}>
          {/* 피드 작성 동아리 로고 */}
          {feed.taggedClubs.length > 0 ? (
            <div className="relative h-[40px] w-[40px]">
              <Image
                src={feed.club.logo}
                alt="logo"
                width={25}
                height={25}
                style={{
                  position: 'absolute',
                  top: 6,
                  left: 0,
                  objectFit: 'cover',
                  width: '25px',
                  height: '25px',
                  minWidth: '25px',
                  minHeight: '25px',
                  borderRadius: '5px',
                  border: '1px solid #F9F9F9',
                  zIndex: 1,
                  transform: 'rotate(-15deg)',
                }}
              />
              <Image
                src={feed.taggedClubs[0].club.logo}
                alt="logo"
                width={25}
                height={25}
                style={{
                  position: 'absolute',
                  top: 6,
                  left: '18px',
                  objectFit: 'cover',
                  width: '25px',
                  height: '25px',
                  minWidth: '25px',
                  minHeight: '25px',
                  borderRadius: '5px',
                  border: '1px solid #F9F9F9',
                  transform: 'rotate(15deg)',
                }}
              />
            </div>
          ) : (
            <Image
              src={feed.club.logo}
              alt="logo"
              width={40}
              height={40}
              style={{
                objectFit: 'cover',
                width: '40px',
                height: '40px',
                minWidth: '40px',
                minHeight: '40px',
                borderRadius: '5px',
                border: '1px solid #F9F9F9',
              }}
            />
          )}

          {/* 피드 작성 정보 */}
          <div className="flex h-full flex-col justify-between">
            <div className="text-bold16 flex h-[19px] items-center">
              {feed.club.name}
              {feed.taggedClubs.length > 0 && ` & ${feed.taggedClubs[0].club.name}`}
            </div>
            <div className="text-regular12 flex h-[18px] items-center text-gray3">
              {formatKoreanDate(feed.created_at)} {feed.is_nickname_visible && `by ${feed.author.name}`}
            </div>
          </div>
        </button>

        {/* 설정 버튼 */}
        <button
          type="button"
          onClick={() => {
            if (window.ReactNativeWebView) {
              window.ReactNativeWebView.postMessage(
                JSON.stringify({
                  type: 'event',
                  action: 'setting click',
                  payload: { feedId: feed.id, authorId: feed.author_id },
                }),
              );
              return;
            }
            setIsSettingModalOpen(true);
          }}
        >
          <MoreVertIcon />
        </button>
      </div>

      {/* 피드 이미지 */}
      <div ref={sliderRef} className="keen-slider mb-[12px] mt-[16px] aspect-square w-full">
        {feed.photos.map((photo) => (
          <div key={photo} className="keen-slider__slide">
            <Image
              src={photo}
              alt="피드 이미지"
              fill
              style={{
                objectFit: 'cover',
                borderRadius: '8px',
                border: '1px solid #F9F9F9',
              }}
            />
          </div>
        ))}
      </div>

      {/* 인디케이터 */}
      {feed.photos.length > 1 && (
        <div className="mb-[8px] flex h-[7px] w-full items-center justify-center">
          <div className="flex max-w-[65px] gap-1 overflow-hidden">
            <div
              className="flex transition-transform duration-300"
              style={{ transform: `translateX(-${currentIndicatorShiftX}px)` }}
            >
              {feed.photos.map((photo, index) => (
                <div
                  key={photo}
                  className={`mx-[3px] h-[7px] w-[7px] rounded-full transition-colors duration-200 ${index === page ? 'bg-primary' : 'bg-gray0'}`}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 피드 버튼 박스 */}
      <div className="mb-[10px] flex flex-row items-center justify-between">
        <div className="flex w-full items-center gap-[10px]">
          {/* 좋아요 버튼 */}
          <div className="flex items-center gap-[4px]">
            <button type="button" onClick={toggleLike}>
              <LikesIcon isActive={isLike as boolean} />
            </button>
            {(likeCount as number) > 0 && (
              <button
                type="button"
                className="text-regular16"
                onClick={() => {
                  if (window.ReactNativeWebView) {
                    window.ReactNativeWebView.postMessage(
                      JSON.stringify({ type: 'event', action: 'open likes modal', payload: feed.id }),
                    );
                    return;
                  }
                  setIsLikesModalOpen(true);
                }}
              >
                {likeCount}
              </button>
            )}
          </div>
          {/* 댓글 버튼 */}
          <button
            type="button"
            className="text-regular16 flex items-center gap-[4px]"
            onClick={() => {
              if (window.ReactNativeWebView) {
                window.ReactNativeWebView.postMessage(
                  JSON.stringify({ type: 'event', action: 'open comments bottom sheet', payload: feed.id }),
                );
                return;
              }
              router.push({
                pathname: `/feed/detail/${feed.id}`,
                query: { scroll: scrollRef.current?.scrollTop || 0 },
              });
            }}
          >
            <CommentsIcon />
            {(commentCount as number) > 0 && <span>{commentCount}</span>}
          </button>
        </div>
        {/* 태그된 사람 버튼 */}
        {feed.taggedUsers.length > 0 && (
          <button
            type="button"
            className="text-regular12 flex items-center gap-[4px] whitespace-nowrap rounded-[4px] border border-gray0 px-[5px] py-[3px] text-gray2"
            onClick={() => {
              if (window.ReactNativeWebView) {
                window.ReactNativeWebView.postMessage(
                  JSON.stringify({ type: 'event', action: 'tagged user click', payload: feed.taggedUsers }),
                );
                return;
              }
              setIsTaggedUserModalOpen(true);
            }}
          >
            <ProfileIcon2 />
            {feed.taggedUsers[0].user.name} 외 {feed.taggedUsers.length - 1}명
          </button>
        )}
      </div>

      {/* 피드 제목 */}
      {feed.title && <div className="text-bold16 mb-[4px]">{feed.title}</div>}

      {/* 피드 내용 */}
      {feed.content && <FeedContent content={feed.content} />}

      {/* 바텀 시트 */}
      {isLikesModalOpen && (
        <BottomSheet setIsBottomSheetOpen={setIsLikesModalOpen}>
          <LikesModal feedId={feed.id} />
        </BottomSheet>
      )}
      {isTaggedClubModalOpen && (
        <BottomSheet setIsBottomSheetOpen={setIsTaggedClubModalOpen}>
          <TaggedClubModal taggedClubs={feed.taggedClubs} />
        </BottomSheet>
      )}
      {isTaggedUserModalOpen && (
        <BottomSheet setIsBottomSheetOpen={setIsTaggedUserModalOpen}>
          <TaggedUserModal tagedUsers={feed.taggedUsers} />
        </BottomSheet>
      )}
      {isInteractModalOpen && (
        <BottomSheet setIsBottomSheetOpen={setIsInteractModalOpen}>
          <InteractModal />
        </BottomSheet>
      )}
      {isSettingModalOpen && (
        <BottomSheet setIsBottomSheetOpen={setIsSettingModalOpen}>
          <SettingModal authorId={feed.author_id} feedId={feed.id} onClose={() => setIsSettingModalOpen(false)} />
        </BottomSheet>
      )}
    </div>
  );
}

export default FeedCard;
