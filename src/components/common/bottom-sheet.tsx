import { useEffect, useRef, useState, useCallback } from 'react';
import { motion, useMotionValue } from 'framer-motion';

function BottomSheet({
  children,
  setIsBottomSheetOpen,
  onRequestClose,
}: {
  children: React.ReactNode;
  setIsBottomSheetOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onRequestClose?: (close: () => void) => void;
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
      className="fixed bottom-0 left-0 right-0 z-50 m-auto flex h-screen w-screen max-w-[400px] items-end bg-black bg-opacity-60"
      onClick={handleOutsideClick}
      onKeyDown={handleOutsideClick}
    >
      <motion.div
        ref={modalRef}
        className="flex w-full flex-col items-center rounded-t-[24px] bg-white"
        initial={{ y: 400 }}
        animate={{ y: isVisible ? 0 : 400 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        style={{ y }}
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
