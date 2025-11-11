import CameraIcon from '@/icons/camera-icon';
import XIcon7 from '@/icons/x-icon7';

function LogoInput({
  onChange,
  logoPreview,
  setLogoPreview,
}: {
  onChange: (value: File | null) => void;
  logoPreview: string;
  setLogoPreview: React.Dispatch<React.SetStateAction<string>>;
}) {
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    onChange(file as File);
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setLogoPreview(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleRemove = () => {
    onChange(null);
    setLogoPreview('');
  };

  return (
    <div>
      {logoPreview ? (
        <div
          className="relative h-[80px] w-[80px] min-w-[80px] rounded-[16px]"
          style={{
            backgroundImage: `url(${logoPreview})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <button
            type="button"
            onClick={handleRemove}
            className="absolute right-[-6] top-[-6] z-10 flex h-[20px] w-[20px] items-center justify-center rounded-full bg-white"
          >
            <XIcon7 />
          </button>
        </div>
      ) : (
        <label
          htmlFor="file-upload"
          className="relative flex h-[80px] w-[80px] min-w-[80px] cursor-pointer flex-col items-center justify-center rounded-[16px] bg-gray0"
        >
          <input
            id="file-upload"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="absolute h-[80px] w-[80px] cursor-pointer opacity-0"
          />
          <CameraIcon />
        </label>
      )}
    </div>
  );
}

export default LogoInput;
