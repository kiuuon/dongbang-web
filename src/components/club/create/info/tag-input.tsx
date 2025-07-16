import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

import XIcon2 from '@/icons/x-icon2';

function TagInput({
  value,
  onChange,
  defaultCampusClubType,
  defaultCategory,
  defaultLocation,
}: {
  value: string[];
  onChange: (value: string[]) => void;
  defaultCampusClubType: string;
  defaultCategory: string;
  defaultLocation: string;
}) {
  const router = useRouter();
  const { clubType } = router.query;
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    const newTag = [...value];
    if (clubType !== 'union') {
      newTag[1] = defaultCampusClubType;
    } else {
      newTag[1] = defaultLocation;
    }
    newTag[2] = defaultCategory;

    onChange(newTag);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultCampusClubType, defaultCategory, defaultLocation]);

  const handleAddTag = () => {
    if (inputValue === '') {
      return;
    }

    if (value.includes(inputValue)) {
      alert('이미 추가된 태그입니다.');
      return;
    }

    const maxTagCount = 5;
    if (value.length >= maxTagCount) {
      alert('최대 태그 수를 초과했습니다.');
      return;
    }
    const newTag = [...value, inputValue];
    onChange(newTag);
    setInputValue('');
  };

  const handleRemoveTag = (index: number) => {
    const newTag = value.filter((_, i) => i !== index);
    onChange(newTag);
  };

  return (
    <div className="flex flex-col">
      <div className="text-bold12 mb-[10px]">동아리 태그</div>
      <div className="relative mb-[16px] flex gap-[12px]">
        <input
          type="text"
          value={inputValue}
          placeholder="태그를 입력해 주세요."
          className="text-regular14 flex h-[48px] w-full rounded-[8px] border border-gray0 pl-[16px] outline-none placeholder:text-gray1"
          onChange={(event) => setInputValue(event.target.value)}
          maxLength={10}
        />
        <button
          type="button"
          className="text-bold12 absolute right-[16px] top-0 flex h-[48px] items-center text-primary"
          onClick={handleAddTag}
        >
          추가
        </button>
      </div>
      <div className="mb-[8px] flex flex-wrap gap-[16px]">
        {Array.from(value).map((tag, index) =>
          tag === '' ? null : (
            <span
              key={tag}
              className="text-bold12 flex gap-[8px] rounded-[24px] border border-primary px-[14px] py-[9px] text-primary"
            >
              {tag}
              {index > 2 && (
                <button type="button" onClick={() => handleRemoveTag(index)}>
                  <XIcon2 />
                </button>
              )}
            </span>
          ),
        )}
      </div>
    </div>
  );
}

export default TagInput;
