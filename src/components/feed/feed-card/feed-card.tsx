import { useRef, useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

import { FeedType } from '@/types/feed-type';
import MoreVertIcon from '@/icons/more-vert-icon';
import LikesIcon from '@/icons/likes-icon';
import CommentsIcon from '@/icons/comments-icon';
import InteractIcon from '@/icons/interact-icon';
import ProfileIcon2 from '@/icons/profile-icon2';
import TwinkleIcon from '@/icons/twinkle-icon';
import BottomSheet from '@/components/common/bottom-sheet';
import FeedContent from './feed-content';
import TaggedClubModal from './tagged-club-modal';
import TaggedUserModal from './tagged-user-modal';
import InteractModal from './interact-modal';
import SettingModal from './setting-modal';

function FeedCard({ feed, scrollRef }: { feed: FeedType; scrollRef: React.RefObject<HTMLDivElement | null> }) {
  const date = new Date(feed.created_at);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  const [[page, direction], setPage] = useState([0, 0]);
  const [isTaggedUserModalOpen, setIsTaggedUserModalOpen] = useState(false);
  const [isTaggedClubModalOpen, setIsTaggedClubModalOpen] = useState(false);
  const [isInteractModalOpen, setIsInteractModalOpen] = useState(false);
  const [isSettingModalOpen, setIsSettingModalOpen] = useState(false);

  const maxIndicatorShiftX = Math.max(feed.photos.length - 5, 0) * 13;
  const currentIndicatorShiftX = Math.min(Math.max(page - 2, 0) * 13, maxIndicatorShiftX);

  const variants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 300 : -300,
    }),
    center: {
      x: 0,
    },
    exit: (dir: number) => ({
      x: dir > 0 ? -300 : 300,
    }),
  };

  const goToPage = (newPage: number, dir: number) => {
    if (newPage < 0 || newPage >= feed.photos.length) return;
    setPage([newPage, dir]);
  };

  const getRole = (role: string | null) => {
    if (role === 'president') {
      return '회장';
    }
    if (role === 'member') {
      return '부원';
    }
    return '';
  };

  const dragStartRef = useRef<{ x: number; y: number } | null>(null);
  const directionLockedRef = useRef<'horizontal' | 'vertical' | null>(null);

  const handleClubClick = () => {
    if (feed.taggedClubs.length > 0) {
      if (window.ReactNativeWebView) {
        window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'tagged club click', payload: feed.taggedClubs }));
        return;
      }
      setIsTaggedClubModalOpen(true);
    } else {
      // TODO: 클럽 소개 페이지로 이동하는 로직
    }
  };

  return (
    <div key={feed.id} className="flex flex-col border-b border-gray0 pb-[18px]">
      <div className="flex h-[40px] items-center justify-between">
        <button type="button" className="flex h-full items-center gap-[12px]" onClick={handleClubClick}>
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
                borderRadius: '5px',
                border: '1px solid #F9F9F9',
              }}
            />
          )}

          <div className="flex h-full flex-col justify-between">
            <div className="text-bold16 flex h-[19px] items-center">
              {feed.club.name}
              {feed.taggedClubs.length > 0 && ` & ${feed.taggedClubs[0].club.name}`}
            </div>
            <div className="text-regular14 flex h-[18px] items-center text-gray3">
              {year}년 {month}월 {day}일
            </div>
          </div>
        </button>
        <button
          type="button"
          onClick={() => {
            if (window.ReactNativeWebView) {
              window.ReactNativeWebView.postMessage(
                JSON.stringify({ type: 'setting click', payload: { feedId: feed.id, authorId: feed.author_id } }),
              );
              return;
            }
            setIsSettingModalOpen(true);
          }}
        >
          <MoreVertIcon />
        </button>
      </div>

      <div className="relative mb-[12px] mt-[16px] aspect-square w-full">
        <AnimatePresence initial={false} custom={direction}>
          <motion.img
            key={page}
            src={feed.photos[page]}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: 'easing' },
            }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            onPointerDown={(event) => {
              dragStartRef.current = { x: event.clientX, y: event.clientY };
              directionLockedRef.current = null;
            }}
            onPointerMove={(e) => {
              if (!dragStartRef.current || directionLockedRef.current) return;

              const dx = e.clientX - dragStartRef.current.x;
              const dy = e.clientY - dragStartRef.current.y;

              if (Math.abs(dx) > 5 || Math.abs(dy) > 5) {
                directionLockedRef.current = Math.abs(dx) > Math.abs(dy) ? 'horizontal' : 'vertical';

                if (directionLockedRef.current === 'horizontal') {
                  // eslint-disable-next-line no-param-reassign
                  scrollRef.current!.style.overflow = 'hidden';
                }
              }
            }}
            onPointerUp={() => {
              if (scrollRef.current) {
                // eslint-disable-next-line no-param-reassign
                scrollRef.current.style.overflow = 'auto';
              }
              dragStartRef.current = null;
              directionLockedRef.current = null;
            }}
            onDragEnd={(_, { offset }) => {
              if (scrollRef.current) {
                // eslint-disable-next-line no-param-reassign
                scrollRef.current.style.overflow = 'auto';
              }
              if (offset.x < -30) {
                goToPage(page + 1, 1);
              } else if (offset.x > 30) {
                goToPage(page - 1, -1);
              }
            }}
            className="absolute left-0 top-0 aspect-square w-full cursor-pointer select-none rounded-[8px] object-cover"
          />
        </AnimatePresence>
      </div>

      <div className="mb-[12px] flex h-[7px] w-full items-center justify-center">
        {feed.photos.length > 1 && (
          <div className="flex max-w-[65px] gap-1 overflow-hidden">
            <div
              className="flex transition-transform duration-300"
              style={{ transform: `translateX(-${currentIndicatorShiftX}px)` }}
            >
              {feed.photos.map((photo, i) => (
                <div
                  key={photo}
                  className={`mx-[3px] h-[7px] w-[7px] rounded-full transition-colors duration-200 ${i === page ? 'bg-primary' : 'bg-gray0'}`}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {feed.title && <div className="text-bold16 mb-[4px]">{feed.title}</div>}
      {feed.content && <FeedContent content={feed.content} />}

      <div className="flex flex-col items-center gap-[16px]">
        {(feed.is_nickname_visible || feed.taggedUsers.length > 0) && (
          <div className="flex w-full items-center gap-[4px]">
            {feed.taggedUsers.length > 0 && (
              <button
                type="button"
                className="text-regular12 flex items-center gap-[4px] rounded-[4px] border border-gray0 px-[5px] py-[3px] text-gray2"
                onClick={() => {
                  if (window.ReactNativeWebView) {
                    window.ReactNativeWebView.postMessage(
                      JSON.stringify({ type: 'tagged user click', payload: feed.taggedUsers }),
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
            {feed.is_nickname_visible && (
              <div className="text-regular12 flex items-center gap-[4px] rounded-[4px] border border-gray0 px-[5px] py-[3px] text-gray2">
                <TwinkleIcon />
                {feed.author.name} | {getRole(feed.author.role) || '탈퇴'}
              </div>
            )}
          </div>
        )}

        <div className="flex w-full items-center gap-[10px]">
          <div className="flex items-center gap-[4px]">
            <button type="button">
              <LikesIcon />
            </button>
            <button type="button">3</button>
          </div>
          <button type="button" className="flex items-center gap-[4px]">
            <CommentsIcon />
            <span>5</span>
          </button>
          <button
            type="button"
            className="flex items-center"
            onClick={() => {
              if (window.ReactNativeWebView) {
                window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'interact click', payload: feed.id }));
                return;
              }
              setIsInteractModalOpen(true);
            }}
          >
            <InteractIcon color="#000" />
          </button>
        </div>
      </div>

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
          <SettingModal authorId={feed.author_id} />
        </BottomSheet>
      )}
    </div>
  );
}

export default FeedCard;
