import { useState } from 'react';

import CameraIcon from '@/icons/camera-icon';
import XIcon4 from '@/icons/x-icon4';

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

      <div className="flex items-center gap-[9px]">
        <label
          htmlFor="file-upload"
          className="relative flex h-[70px] w-[70px] min-w-[70px] cursor-pointer flex-col items-center justify-center rounded-[8px] border border-gray0"
        >
          <input
            id="file-upload"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="absolute h-[70px] w-[70px] opacity-0"
          />
          <CameraIcon />
          <div className="text-regular12 text-gray0">
            (<span className={`${preview && 'text-primary'}`}>{preview ? 1 : 0}</span>/1)
          </div>
        </label>

        {preview && (
          <div
            className="relative h-[70px] w-[70px] min-w-[70px] rounded-[8px]"
            style={{
              backgroundImage: `url(${preview})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            <button type="button" onClick={handleRemove} className="absolute right-1 top-1 z-10">
              <XIcon4 />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default LogoInput;
