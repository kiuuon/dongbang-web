import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

import { FeedType } from '@/types/feed-type';
import MoreVertIcon from '@/icons/more-vert-icon';
import LikesIcon from '@/icons/likes-icon';
import CommentsIcon from '@/icons/comments-icon';
import InteractIcon from '@/icons/interact-icon';
import TwinkleIcon from '@/icons/twinkle-icon';
import FeedContent from './feed-content';

function FeedCard({ feed }: { feed: FeedType }) {
  const date = new Date(feed.created_at);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  const [[page, direction], setPage] = useState([0, 0]);

  const maxIndicatorShiftX = Math.max(feed.photos.length - 5, 0) * 13;
  const currentIndicatorShiftX = Math.min(Math.max(page - 2, 0) * 13, maxIndicatorShiftX);

  const variants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 300 : -300,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (dir: number) => ({
      x: dir > 0 ? -300 : 300,
      opacity: 0,
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

  return (
    <div key={feed.id} className="flex flex-col border-b border-gray0 pb-[30px]">
      <div className="flex h-[40px] items-center justify-between">
        <div className="flex h-full items-center gap-[12px]">
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

          <div className="flex h-full flex-col justify-between">
            <div className="text-bold16 flex h-[19px] items-center">{feed.club.name}</div>
            <div className="text-regular14 flex h-[18px] items-center text-gray3">
              {year}년 {month}월 {day}일
            </div>
          </div>
        </div>
        <button type="button">
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
              opacity: { duration: 0.2 },
            }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            onTouchStart={() => {
              document.body.style.overflow = 'hidden';
            }}
            onTouchEnd={() => {
              document.body.style.overflow = '';
            }}
            onDragEnd={(_, { offset }) => {
              if (offset.x < -50) {
                goToPage(page + 1, 1);
              } else if (offset.x > 50) {
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
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-[10px]">
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
          <button type="button" className="flex items-center">
            <InteractIcon color="#000" />
          </button>
        </div>
        <div>
          {/* <div></div> */}
          {feed.is_nickname_visible && (
            <div className="text-regular12 flex items-center rounded-[4px] border border-gray0 p-[3px] text-gray2">
              <TwinkleIcon />
              {feed.author.name} | {getRole(feed.author.role)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default FeedCard;
