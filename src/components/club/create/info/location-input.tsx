import { useEffect, useRef, useState } from 'react';

function LocationInput({ value, onChange }: { value: string; onChange: (value: string) => void }) {
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
      <div className="text-bold16 mb-[2px] flex text-gray2">동아리 활동 지역</div>
      <button
        type="button"
        className="text-bold16 flex h-[50px] w-full items-center rounded-[5px] border border-gray0 pl-[8px] text-gray3"
        onClick={() => setIsOpen(!isOpen)}
      >
        {value !== '' && value}
      </button>
      {isOpen && (
        <div className="text-regular16 absolute z-10 mt-[4px] w-full rounded border border-gray0 bg-white text-gray3">
          {location.map((item) => (
            <button
              type="button"
              className="w-full p-[8px] text-start"
              onClick={() => {
                onChange(item);
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
