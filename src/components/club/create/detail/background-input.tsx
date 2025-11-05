import { useState } from 'react';

import CameraIcon from '@/icons/camera-icon';
import XIcon7 from '@/icons/x-icon7';

function BackgroundInput({ onChange }: { onChange: (value: File | null) => void }) {
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
          className="relative h-[321px] w-full"
          style={{
            backgroundImage: `url(${preview})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <button
            type="button"
            onClick={handleRemove}
            className="absolute right-[5px] top-[10px] z-10 flex h-[20px] w-[20px] items-center justify-center rounded-full bg-white"
          >
            <XIcon7 />
          </button>
        </div>
      ) : (
        <label
          htmlFor="file-upload"
          className="relative flex h-[321px] w-full min-w-[64px] cursor-pointer flex-col items-center justify-center bg-secondary"
        >
          <input
            id="file-upload"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="absolute h-[64px] w-[64px] cursor-pointer opacity-0"
          />
          <CameraIcon />
        </label>
      )}
    </div>
  );
}

export default BackgroundInput;
