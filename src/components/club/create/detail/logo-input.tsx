import { useState } from 'react';

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
    <div className="flex flex-col gap-[8px]">
      <p>로고</p>
      {!preview && (
        <label
          htmlFor="file-upload"
          className="relative flex h-[144px] w-[144px] cursor-pointer items-center justify-center rounded-lg border-2 border-dashed bg-gray-100"
        >
          <input
            id="file-upload"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="absolute h-full w-full cursor-pointer opacity-0"
          />
          <span className="text-gray-500">추가하기</span>
        </label>
      )}

      {preview && (
        <div
          className="relative h-[144px] w-[144px] rounded-lg border bg-gray-100"
          style={{
            backgroundImage: `url(${preview})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <button
            type="button"
            onClick={handleRemove}
            className="absolute -right-2 -top-2 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-white text-gray-500 shadow hover:bg-red-500 hover:text-white"
          >
            x
          </button>
        </div>
      )}
    </div>
  );
}

export default LogoInput;
