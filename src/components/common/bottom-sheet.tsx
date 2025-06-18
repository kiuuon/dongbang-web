import { useEffect, useRef, useState, useCallback } from 'react';
import { motion, useMotionValue, animate } from 'framer-motion';

function BottomSheet({
  children,
  setIsBottomSheetOpen,
  onRequestClose,
  dragEnabled = true,
}: {
  children: React.ReactNode;
  setIsBottomSheetOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onRequestClose?: (close: () => void) => void;
  dragEnabled?: boolean;
}) {
  const modalRef = useRef<HTMLDivElement>(null);
  const y = useMotionValue(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    setIsVisible(true);
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  const closeModal = useCallback(() => {
    setIsVisible(false);
    setTimeout(() => setIsBottomSheetOpen(false), 300);
  }, [setIsBottomSheetOpen]);

  const handleDragEnd = (_: any, info: { offset: { y: number } }) => {
    if (info.offset.y > 150) {
      closeModal();
    } else {
      animate(y, 0, { duration: 0.3, ease: 'easeInOut' });
    }
  };

  const handleOutsideClick = (event: React.MouseEvent | React.KeyboardEvent) => {
    if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
      closeModal();
    }
  };

  useEffect(() => {
    if (onRequestClose) {
      onRequestClose(() => closeModal());
    }
  }, [onRequestClose, closeModal]);

  return (
    <div
      tabIndex={0}
      role="button"
      className="fixed bottom-0 left-0 z-50 flex h-screen w-screen items-end bg-black bg-opacity-60"
      onClick={handleOutsideClick}
      onKeyDown={handleOutsideClick}
    >
      <motion.div
        ref={modalRef}
        className="flex w-full flex-col items-center rounded-t-[24px] bg-white px-[20px]"
        initial={{ y: 400 }}
        animate={{ y: isVisible ? 0 : 400 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        style={{ y }}
        drag="y"
        dragListener={dragEnabled}
        dragConstraints={{ top: 0 }}
        dragElastic={0}
        onDragEnd={handleDragEnd}
      >
        {children}
      </motion.div>
    </div>
  );
}

BottomSheet.defaultProps = {
  onRequestClose: undefined,
};

export default BottomSheet;
