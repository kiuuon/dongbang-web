import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import { motion, useMotionValue, animate } from 'framer-motion';

function NavigationModal({
  setIsNavigationOpen,
}: {
  setIsNavigationOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const router = useRouter();
  const { clubType } = router.query;
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

  const closeModal = () => {
    setIsVisible(false);
    setTimeout(() => setIsNavigationOpen(false), 200);
  };

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

  const goToSelectedClubType = (selectedClubType: string) => {
    router.push(`/post/${selectedClubType}`);
    closeModal();
  };

  return (
    <div
      tabIndex={0}
      role="button"
      className="fixed left-0 top-0 z-50 flex h-screen w-screen items-end bg-black/50"
      onClick={handleOutsideClick}
      onKeyDown={handleOutsideClick}
    >
      <motion.div
        ref={modalRef}
        className="flex h-[337px] w-full flex-col items-center rounded-t-[24px] bg-white px-[20px]"
        initial={{ y: 400 }}
        animate={{ y: isVisible ? 0 : 400 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        style={{ y }}
        drag="y"
        dragConstraints={{ top: 0 }}
        dragElastic={0}
        onDragEnd={handleDragEnd}
      >
        <div className="mb-[24px] mt-[5px] h-[2px] w-[37px] rounded-[10px] bg-black" />
        {clubType !== 'my' && (
          <button
            type="button"
            className="text-bold20 flex h-[76px] w-full items-center border-b border-b-gray0"
            onClick={() => goToSelectedClubType('my')}
          >
            내 동아리
          </button>
        )}
        {clubType !== 'campus' && (
          <button
            type="button"
            className="text-bold20 flex h-[76px] w-full items-center border-b border-b-gray0"
            onClick={() => goToSelectedClubType('campus')}
          >
            교내 동아리
          </button>
        )}
        {clubType !== 'union' && (
          <button
            type="button"
            className="text-bold20 flex h-[76px] w-full items-center border-b border-b-gray0"
            onClick={() => goToSelectedClubType('union')}
          >
            연합 동아리
          </button>
        )}
      </motion.div>
    </div>
  );
}

export default NavigationModal;
