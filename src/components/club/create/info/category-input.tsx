import BottomArrowIcon2 from '@/icons/bottom-arrow-icon2';
import { useEffect, useRef, useState } from 'react';

function CategoryInput({
  value,
  onChange,
  setDefaultCategory,
}: {
  value: string;
  onChange: (value: string) => void;
  setDefaultCategory: React.Dispatch<React.SetStateAction<string>>;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const categoryInputRef = useRef<HTMLDivElement>(null);
  const category = ['노래', '맛집', '여행', '운동', '자기개발', '취미', '친목'];

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

  return (
    <div className="relative" ref={categoryInputRef}>
      <div className="text-bold12 mb-[10px]">카테고리</div>
      <div className="relative h-[48px]">
        <button
          type="button"
          className={`text-regular14 flex h-[48px] w-full items-center rounded-[8px] border border-gray0 pl-[16px] outline-none ${value !== '' ? 'text-black' : 'text-gray1'}`}
          onClick={() => setIsOpen(!isOpen)}
        >
          {value !== '' ? value : '카테고리를 선택해주세요.'}
        </button>
        <div className="absolute right-[16px] top-0 flex h-[48px] items-center">
          <BottomArrowIcon2 />
        </div>
      </div>
      {isOpen && (
        <div className="text-regular14 absolute z-10 mt-[4px] w-full rounded-[8px] border border-gray0 bg-white">
          {category.map((item) => (
            <button
              type="button"
              className="w-full p-[8px] text-start"
              onClick={() => {
                onChange(item);
                setDefaultCategory(item);
                setIsOpen(false);
              }}
            >
              {item}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default CategoryInput;
