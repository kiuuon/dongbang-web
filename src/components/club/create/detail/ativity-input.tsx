import { useState } from 'react';

import PlusIcon from '@/icons/plus-icon';

function ActivityInput({ value, onChange }: { value: File[]; onChange: (value: File[]) => void }) {
  const [preview, setPreview] = useState<string[] | null>([]);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = event.target;
    onChange(Array.from(files || []));
    if (!files) return;

    const newPreviews: string[] = [];

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          newPreviews.push(reader.result);

          if (newPreviews.length === files.length) {
            setPreview([...newPreviews]);
          }
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemove = (index: number) => {
    const newPreviews = preview?.filter((_, idx) => idx !== index);
    setPreview(newPreviews || []);
    const newFiles = value.filter((_, idx) => idx !== index);
    onChange(newFiles);
  };

  return (
    <div className="flex flex-col">
      <div className="mb-[2px] flex items-center gap-[10px]">
        <div className="text-bold16 text-gray2">활동 사진</div>
        <div className="text-regular12 text-error">최대 5장까지 업로드 가능합니다</div>
      </div>
      {preview?.length === 0 && (
        <label
          htmlFor="file-upload"
          className="relative flex h-[70px] w-[70px] cursor-pointer items-center justify-center rounded-lg border border-gray0"
        >
          <input
            id="file-upload"
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageChange}
            className="absolute h-[70px] w-[70px] cursor-pointer opacity-0"
          />
          <PlusIcon />
        </label>
      )}

      <div className="w-full overflow-x-auto">
        <div className="flex w-max gap-[8px]">
          {preview?.map((prev, index) => (
            <div
              key={prev}
              className="relative h-[70px] w-[70px] rounded-lg border"
              style={{
                backgroundImage: `url(${prev})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            >
              <button
                type="button"
                onClick={() => handleRemove(index)}
                className="text-regular12 absolute -right-1 -top-1 z-10 flex h-[12px] w-[12px] items-center justify-center rounded-full bg-white shadow hover:text-white"
              >
                x
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ActivityInput;
