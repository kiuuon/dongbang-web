import { useState } from 'react';

import CameraIcon from '@/icons/camera-icon';
import XIcon7 from '@/icons/x-icon7';

function AvatarInput({ onChange }: { onChange: (value: File | null) => void }) {
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
    <div>
      {preview ? (
        <div
          className="relative h-[70px] w-[70px] min-w-[70px] rounded-full"
          style={{
            backgroundImage: `url(${preview})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <button
            type="button"
            onClick={handleRemove}
            className="absolute right-[-1] top-[-1] z-10 flex h-[20px] w-[20px] items-center justify-center rounded-full bg-white"
          >
            <XIcon7 />
          </button>
        </div>
      ) : (
        <label
          htmlFor="file-upload"
          className="relative flex h-[70px] w-[70px] min-w-[70px] cursor-pointer flex-col items-center justify-center rounded-full bg-gray0"
        >
          <input
            id="file-upload"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="absolute h-[70px] w-[70px] cursor-pointer opacity-0"
          />
          <CameraIcon />
        </label>
      )}
    </div>
  );
}

export default AvatarInput;
