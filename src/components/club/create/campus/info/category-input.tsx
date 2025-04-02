import { useState } from 'react';

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

  return (
    <div className="relative">
      <button
        type="button"
        className={`w-full rounded border p-2 text-start ${value === '' ? 'text-[#AAB0BB]' : 'text-black'}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        {value === '' ? '카테고리' : value}
      </button>
      {isOpen && (
        <div className="absolute mt-1 w-full rounded border bg-white">
          <button
            type="button"
            className="w-full p-2 text-start"
            onClick={() => {
              onChange('운동');
              setDefaultCategory('운동');
              setIsOpen(false);
            }}
          >
            운동
          </button>
          <button
            type="button"
            className="w-full p-2 text-start"
            onClick={() => {
              onChange('취미');
              setDefaultCategory('취미');
              setIsOpen(false);
            }}
          >
            취미
          </button>
          <button
            type="button"
            className="w-full p-2 text-start"
            onClick={() => {
              onChange('자기개발');
              setDefaultCategory('자기개발');
              setIsOpen(false);
            }}
          >
            자기개발
          </button>
          <button
            type="button"
            className="w-full p-2 text-start"
            onClick={() => {
              onChange('맛집');
              setDefaultCategory('맛집');
              setIsOpen(false);
            }}
          >
            맛집
          </button>
          <button
            type="button"
            className="w-full p-2 text-start"
            onClick={() => {
              onChange('친목');
              setDefaultCategory('친목');
              setIsOpen(false);
            }}
          >
            친목
          </button>
          <button
            type="button"
            className="w-full p-2 text-start"
            onClick={() => {
              onChange('노래');
              setDefaultCategory('노래');
              setIsOpen(false);
            }}
          >
            노래
          </button>
          <button
            type="button"
            className="w-full p-2 text-start"
            onClick={() => {
              onChange('여행');
              setDefaultCategory('여행');
              setIsOpen(false);
            }}
          >
            여행
          </button>
        </div>
      )}
    </div>
  );
}

export default CategoryInput;
