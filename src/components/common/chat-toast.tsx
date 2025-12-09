// components/ChatToast.js
import { useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { motion, AnimatePresence } from 'framer-motion';

function ChatToast({
  chatRoomId,
  chatRoomName,
  clubLogo,
  message,
  isVisible,
  onClose,
  duration = 3000,
}: {
  chatRoomId: string;
  chatRoomName: string;
  clubLogo: string;
  message: string;
  isVisible: boolean;
  onClose: () => void;
  duration: number;
}) {
  const router = useRouter();

  // 1. 타이머 설정 (duration 후 자동 닫힘)
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer); // 컴포넌트가 사라지거나 재렌더링 될 때 타이머 정리
    }
    return () => {};
  }, [isVisible, duration, onClose]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          // 2. 위치 및 스타일 (Tailwind를 안 쓴다면 style 객체 사용 가능)
          style={{
            position: 'fixed',
            top: 68,
            left: 0,
            right: 0,
            margin: '0 auto',
            width: '90%',
            maxWidth: '400px',
            zIndex: 9999,
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '16px 20px 16px 20px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            display: 'flex',
            alignItems: 'center',
            cursor: 'grab',
          }}
          // 3. 등장/퇴장 애니메이션 (위에서 내려옴)
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          // 4. 드래그 로직 (핵심)
          drag="y" // Y축으로만 드래그 가능
          dragConstraints={{ top: -100, bottom: 0 }} // 아래로는 못 당기게, 위로는 자유롭게
          dragElastic={0.7} // 당길 때 텐션감
          onDragEnd={(event, info) => {
            // 위로 일정 거리(-50px) 이상 드래그하거나, 위로 빠르게 던지면 닫기
            if (info.offset.y < -50 || info.velocity.y < -500) {
              onClose();
            }
          }}
          onClick={() => {
            onClose();

            router.push(`/chats/${chatRoomId}`);
          }}
        >
          {/* 로고 및 내용 */}
          <div className="flex items-center gap-[16px]">
            <Image
              src={clubLogo}
              alt="club logo"
              width={40}
              height={40}
              style={{
                objectFit: 'cover',
                borderRadius: '16px',
                width: '40px',
                height: '40px',
                minWidth: '40px',
                minHeight: '40px',
              }}
            />
            <div className="flex flex-col">
              <div className="text-bold14">{chatRoomName}</div>
              <div className="text-regular12 text-gray3">{message}</div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default ChatToast;
