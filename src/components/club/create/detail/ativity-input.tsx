import { useEffect, useRef, useState } from 'react';
import Sortable from 'sortablejs';

import CameraIcon from '@/icons/camera-icon';
import XIcon4 from '@/icons/x-icon4';

function ActivityInput({ value, onChange }: { value: File[]; onChange: (value: File[]) => void }) {
  const [preview, setPreview] = useState<string[]>([]);
  const previewRef = useRef<HTMLDivElement>(null);
  const photosLatestRef = useRef<string[]>([]);

  useEffect(() => {
    photosLatestRef.current = preview;
  }, [preview]);

  useEffect(() => {
    if (previewRef.current && !previewRef.current.dataset.initialized) {
      Sortable.create(previewRef.current, {
        animation: 150,
        delay: 500,
        chosenClass: 'chosen',
        onEnd: (event) => {
          if (!preview) return;
          const newOrder = [...photosLatestRef.current];
          const [removed] = newOrder.splice(event.oldIndex!, 1);
          newOrder.splice(event.newIndex!, 0, removed);
          setPreview(newOrder);
        },
      });

      previewRef.current.dataset.initialized = 'true';
    }
  }, [preview]);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = event.target;
    if (!files) return;

    if (preview && preview.length + files.length > 5) {
      alert('사진은 최대 5장까지 등록할 수 있습니다.');
      return;
    }

    onChange([...value, ...Array.from(files || [])]);
    const newPreviews: string[] = [...(preview || [])];

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          newPreviews.push(reader.result);

          setPreview([...newPreviews]);
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
      <div className="mb-[10px] flex items-center gap-[25px]">
        <div className="text-bold12">활동 사진</div>
        <div className="text-regular12 text-primary">최대 5장까지 업로드 가능합니다</div>
      </div>
      <div className="flex h-[98px] w-full items-center gap-[9px] user-select-none">
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
            (
            <span className={`${(!preview || preview?.length > 0) && 'text-primary'}`}>
              {preview ? preview.length : 0}
            </span>
            /5)
          </div>
        </label>

        <div
          ref={previewRef}
          className="scrollbar-hide flex h-full w-full flex-nowrap items-center gap-[9px] overflow-x-scroll"
        >
          {preview?.map((prev, index) => (
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
    </div>
  );
}

export default ActivityInput;
