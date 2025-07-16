import React, { useEffect, useRef, useState } from 'react';

import BottomArrowIcon2 from '@/icons/bottom-arrow-icon2';

function LocationInput({
  value,
  onChange,
  setDefaultLocation,
}: {
  value: string;
  onChange: (value: string) => void;
  setDefaultLocation: React.Dispatch<React.SetStateAction<string>>;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const loactionInputRef = useRef<HTMLDivElement>(null);
  const location = [
    '전국',
    '서울',
    '경기',
    '인천',
    '강원',
    '충북',
    '충남',
    '대전',
    '세종',
    '전북',
    '전남',
    '광주',
    '경북',
    '경남',
    '대구',
    '부산',
    '울산',
    '제주',
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (loactionInputRef.current && !loactionInputRef.current.contains(target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={loactionInputRef}>
      <div className="text-bold12 mb-[10px]">동아리 활동 지역</div>
      <div className="relative h-[48px]">
        <button
          type="button"
          className={`text-regular14 flex h-[48px] w-full items-center rounded-[8px] border border-gray0 pl-[16px] outline-none ${value !== '' ? 'text-black' : 'text-gray1'}`}
          onClick={() => setIsOpen(!isOpen)}
        >
          {value !== '' ? value : '활동 지역을 선택해주세요.'}
        </button>
        <div className="absolute right-[16px] top-0 flex h-[48px] items-center">
          <BottomArrowIcon2 />
        </div>
      </div>
      {isOpen && (
        <div className="text-regular14 scrollbar-hide absolute z-10 mt-[4px] max-h-[224px] w-full overflow-y-scroll rounded-[8px] border border-gray0 bg-white">
          {location.map((item) => (
            <button
              type="button"
              className="w-full p-[8px] text-start"
              onClick={() => {
                onChange(item);
                setDefaultLocation(item);
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

export default LocationInput;
