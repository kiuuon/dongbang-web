import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

import PlusIcon from '@/icons/plus-icon';

function TagInput({
  value,
  onChange,
  defaultCampusClubType,
  defaultCategory,
}: {
  value: string[];
  onChange: (value: string[]) => void;
  defaultCampusClubType: string;
  defaultCategory: string;
}) {
  const router = useRouter();
  const { clubType } = router.query;
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    const newTag = [...value];
    if (clubType !== 'union') {
      newTag[0] = defaultCampusClubType;
    }
    newTag[1] = defaultCategory;

    onChange(newTag);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultCampusClubType, defaultCategory]);

  const handleAddTag = () => {
    if (inputValue === '') {
      return;
    }

    if (value.includes(inputValue)) {
      alert('이미 추가된 태그입니다.');
      return;
    }

    const maxTagCount = clubType === 'campus' ? 5 : 6;
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
      <div className="text-bold16 mb-[2px] flex text-gray2">태그</div>
      <div className="mb-[8px] flex flex-wrap gap-2">
        {Array.from(value).map((tag, index) =>
          tag === '' ? null : (
            <span
              key={tag}
              className="text-bold16 flex gap-[12px] rounded-[5px] border border-gray0 bg-secondary_light px-[16px] py-[6px] text-tertiary_dark"
            >
              {tag}
              {index !== 0 && index !== 1 && (
                <button type="button" className="text-regular12 text-error" onClick={() => handleRemoveTag(index)}>
                  x
                </button>
              )}
            </span>
          ),
        )}
      </div>
      <div className="flex gap-[12px]">
        <input
          type="text"
          value={inputValue}
          className="h-[50px] w-[172px] rounded-[5px] border border-gray0 p-[8px]"
          onChange={(event) => setInputValue(event.target.value)}
          maxLength={10}
        />
        <button type="button" onClick={handleAddTag}>
          <PlusIcon />
        </button>
      </div>
    </div>
  );
}

export default TagInput;
