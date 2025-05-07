import { useState } from 'react';

import PlusIcon from '@/icons/plus-icon';

function LogoInput({ onChange }: { onChange: (value: File | null) => void }) {
  const [preview, setPreview] = useState<string | null>(null);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    onChange(file as File);
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setPreview(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleRemove = () => {
    onChange(null);
    setPreview(null);
  };

  return (
    <div className="flex flex-col">
      <div className="text-bold12 mb-[10px]">로고</div>
      {!preview && (
        <label
          htmlFor="file-upload"
          className="relative flex h-[70px] w-[70px] cursor-pointer items-center justify-center rounded-lg border border-gray0"
        >
          <input
            id="file-upload"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="absolute h-[70px] w-[70px] cursor-pointer opacity-0"
          />
          <PlusIcon />
        </label>
      )}

      {preview && (
        <div
          className="relative h-[70px] w-[70px] rounded-lg border border-gray0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${preview})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <button
            type="button"
            onClick={handleRemove}
            className="text-regular12 absolute -right-1 -top-1 z-10 flex h-[12px] w-[12px] items-center justify-center rounded-full bg-white shadow hover:text-white"
          >
            x
          </button>
        </div>
      )}
    </div>
  );
}

export default LogoInput;
