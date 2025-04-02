import { useState, useEffect } from 'react';

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
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    const newTag = [...value];
    newTag[0] = defaultCampusClubType;
    newTag[1] = defaultCategory;

    onChange(newTag);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultCampusClubType, defaultCategory]);

  const handleAddTag = () => {
    if (inputValue === '') {
      return;
    }

    if (value.length >= 5) {
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
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap gap-2">
        {Array.from(value).map((tag, index) =>
          tag === '' ? null : (
            <span key={tag} className="flex gap-2 rounded-[5px] bg-[#D9D9D9] p-2">
              {tag}
              {index !== 0 && index !== 1 && (
                <button type="button" onClick={() => handleRemoveTag(index)}>
                  x
                </button>
              )}
            </span>
          ),
        )}
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="태그"
          value={inputValue}
          className="rounded border p-2"
          onChange={(event) => setInputValue(event.target.value)}
          maxLength={10}
        />
        <button type="button" className="rounded bg-[#D9D9D9] p-2 text-white" onClick={handleAddTag}>
          추가
        </button>
      </div>
    </div>
  );
}

export default TagInput;
