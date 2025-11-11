import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

import {
  SPORTS_CATEGORIES,
  ART_CATEGORIES,
  HOBBY_CATEGORIES,
  SOCIETY_CATEGORIES,
  ACADEMIC_CATEGORIES,
} from '@/lib/constants';
import BottomArrowIcon2 from '@/icons/bottom-arrow-icon2';

function CategoryInput({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTopCategory, setSelectedTopCategory] = useState('');
  const categoryInputRef = useRef<HTMLDivElement>(null);
  const topCategory = ['운동', '예술', '취미', '사회', '학술', '기타'];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (categoryInputRef.current && !categoryInputRef.current.contains(target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  const renderCategoryOptions = () => {
    switch (selectedTopCategory) {
      case '운동':
        return SPORTS_CATEGORIES.map((item) => (
          <button
            type="button"
            tabIndex={-1}
            key={item}
            className="w-full p-[8px] text-start"
            onClick={() => {
              onChange(item);
              setIsOpen(false);
            }}
          >
            {item}
          </button>
        ));
      case '예술':
        return ART_CATEGORIES.map((item) => (
          <button
            type="button"
            tabIndex={-1}
            key={item}
            className="w-full p-[8px] text-start"
            onClick={() => {
              onChange(item);
              setIsOpen(false);
            }}
          >
            {item}
          </button>
        ));
      case '취미':
        return HOBBY_CATEGORIES.map((item) => (
          <button
            type="button"
            tabIndex={-1}
            key={item}
            className="w-full p-[8px] text-start"
            onClick={() => {
              onChange(item);
              setIsOpen(false);
            }}
          >
            {item}
          </button>
        ));
      case '사회':
        return SOCIETY_CATEGORIES.map((item) => (
          <button
            type="button"
            tabIndex={-1}
            key={item}
            className="w-full p-[8px] text-start"
            onClick={() => {
              onChange(item);
              setIsOpen(false);
            }}
          >
            {item}
          </button>
        ));
      case '학술':
        return ACADEMIC_CATEGORIES.map((item) => (
          <button
            type="button"
            tabIndex={-1}
            key={item}
            className="w-full p-[8px] text-start"
            onClick={() => {
              onChange(item);
              setIsOpen(false);
            }}
          >
            {item}
          </button>
        ));
      default:
        return null;
    }
  };

  return (
    <div className="relative" ref={categoryInputRef}>
      <div className="text-bold12 mb-[10px]">카테고리</div>
      <div className="relative h-[48px]">
        <button
          type="button"
          className={`text-regular14 flex h-[48px] w-full items-center rounded-[8px] border border-gray0 pl-[16px] outline-none ${value !== '' ? 'text-black' : 'text-gray1'}`}
          onClick={() => {
            setIsOpen(!isOpen);
            setSelectedTopCategory('');
          }}
        >
          {value !== '' ? value : '카테고리를 선택해주세요.'}
        </button>
        <div className="absolute right-[16px] top-0 flex h-[48px] items-center">
          <BottomArrowIcon2 />
        </div>
      </div>
      {isOpen && (
        <div className="text-regular14 scrollbar-hide absolute z-10 mt-[4px] max-h-[224px] w-full overflow-y-scroll rounded-[8px] border border-gray0 bg-white">
          <AnimatePresence mode="wait">
            {selectedTopCategory === '' ? (
              <motion.div key="top" exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.25 }}>
                {topCategory.map((item) => (
                  <button
                    key={item}
                    type="button"
                    className="w-full p-[8px] text-start"
                    onClick={() => {
                      if (item === '기타') {
                        onChange(item);

                        setIsOpen(false);
                      } else {
                        setSelectedTopCategory(item);
                      }
                    }}
                  >
                    {item}
                  </button>
                ))}
              </motion.div>
            ) : (
              <motion.div
                key="sub"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.25 }}
              >
                {renderCategoryOptions()}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}

export default CategoryInput;
