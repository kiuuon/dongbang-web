import { useEffect, useRef } from 'react';
import Sortable from 'sortablejs';

import CameraIcon from '@/icons/camera-icon';
import XIcon4 from '@/icons/x-icon4';

function PhotoSection({
  photos,
  setPhotos,
}: {
  photos: string[];
  setPhotos: React.Dispatch<React.SetStateAction<string[]>>;
}) {
  const previewRef = useRef<HTMLDivElement>(null);
  const photosLatestRef = useRef<string[]>([]);

  useEffect(() => {
    photosLatestRef.current = photos;
  }, [photos]);

  useEffect(() => {
    if (previewRef.current && !previewRef.current.dataset.initialized) {
      Sortable.create(previewRef.current, {
        animation: 150,
        delay: 1000,
        chosenClass: 'chosen',
        onEnd: (event) => {
          if (!photos) return;
          const newOrder = [...photosLatestRef.current];
          const [removed] = newOrder.splice(event.oldIndex!, 1);
          newOrder.splice(event.newIndex!, 0, removed);
          setPhotos(newOrder);
        },
      });

      previewRef.current.dataset.initialized = 'true';
    }
  }, []);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = event.target;
    if (!files) return;

    if (photos && photos.length + files.length > 10) {
      alert('사진은 최대 10장까지 등록할 수 있습니다.');
      return;
    }

    const newPreviews: string[] = [];

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          newPreviews.push(reader.result);

          if (newPreviews.length === files.length) {
            setPhotos([...newPreviews]);
          }
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemove = (index: number) => {
    const newPreviews = photos?.filter((_, idx) => idx !== index);
    setPhotos(newPreviews || []);
  };

  return (
    <div className="flex w-full gap-[9px]">
      <label
        htmlFor="file-upload"
        className="relative flex h-[70px] w-[70px] min-w-[70px] cursor-pointer flex-col items-center justify-center rounded-[8px] border border-gray0"
      >
        <input
          id="file-upload"
          type="file"
          accept="image/*"
          multiple
          onChange={handleImageChange}
          className="absolute h-[70px] w-[70px] opacity-0"
        />
        <CameraIcon />
        <div className="text-regular12 text-gray0">
          (<span className="text-primary">{photos ? photos.length : 0}</span>/10)
        </div>
      </label>
      <div ref={previewRef} className="scrollbar-hide flex w-full flex-nowrap items-center gap-[9px] overflow-x-scroll">
        {photos?.map((prev, index) => (
          <div
            key={prev}
            className="relative h-[70px] w-[70px] min-w-[70px] rounded-[8px]"
            style={{
              backgroundImage: `url(${prev})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            <button type="button" onClick={() => handleRemove(index)} className="absolute right-1 top-1 z-10">
              <XIcon4 />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PhotoSection;
