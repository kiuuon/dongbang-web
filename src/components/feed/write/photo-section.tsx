import { useEffect, useRef } from 'react';
import Sortable from 'sortablejs';

import CameraIcon from '@/icons/camera-icon';
import XIcon4 from '@/icons/x-icon4';

function PhotoSection({
  photos,
  setPhotos,
  previewUrls,
  setPreviewUrls,
  setDeletedUrls,
  previewRef,
}: {
  photos: File[];
  setPhotos: React.Dispatch<React.SetStateAction<File[]>>;
  previewUrls: string[];
  setPreviewUrls: React.Dispatch<React.SetStateAction<string[]>>;
  setDeletedUrls: React.Dispatch<React.SetStateAction<string[]>>;
  previewRef: any;
}) {
  const photosLatestRef = useRef<File[]>([]);

  useEffect(() => {
    photosLatestRef.current = photos;
  }, [photos]);

  useEffect(() => {
    if (previewRef.current && !previewRef.current.dataset.initialized) {
      Sortable.create(previewRef.current, {
        animation: 150,
        delay: 300,
        chosenClass: 'chosen',
        onEnd: () => {
          if (!previewRef.current) return;

          const items = Array.from(previewRef.current.children);
          const newPhotos: File[] = [];

          // DataURL과 File 매핑
          const dataUrlMap = new Map<string, File>();
          photosLatestRef.current.forEach((file) => {
            const reader = new FileReader();
            reader.onload = () => {
              const url = reader.result as string;
              dataUrlMap.set(url, file);
            };
            reader.readAsDataURL(file);
          });

          setTimeout(() => {
            items.forEach((el) => {
              const bgUrl = (el as HTMLElement).style.backgroundImage
                .replace(/^url\(["']?/, '')
                .replace(/["']?\)$/, '');
              // DataURL일 경우 dataUrlMap에서 대응되는 File 찾아서 추가
              if (bgUrl.startsWith('data:image')) {
                const file = dataUrlMap.get(bgUrl);
                if (file) newPhotos.push(file);
              }
            });

            setPhotos(newPhotos);
          }, 50);
        },
      });
      // eslint-disable-next-line no-param-reassign
      previewRef.current.dataset.initialized = 'true';
    }
  }, [previewUrls, setPreviewUrls, setPhotos, photos, previewRef]);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = event.target;
    if (!files) return;

    const newFiles = Array.from(files);
    const totalCount = previewUrls.length + newFiles.length;
    if (totalCount > 10) {
      alert('사진은 최대 10장까지 등록할 수 있습니다.');
      return;
    }

    setPhotos((prev) => [...prev, ...newFiles]);

    const readFiles = async () => {
      const results = await Promise.all(
        Array.from(files).map(
          (file) =>
            new Promise<string>((resolve) => {
              const reader = new FileReader();
              reader.onload = () => resolve(reader.result as string);
              reader.readAsDataURL(file);
            }),
        ),
      );
      setPreviewUrls((prev) => [...prev, ...results]);
    };

    readFiles();

    // eslint-disable-next-line no-param-reassign
    event.target.value = '';
  };

  const handleRemove = (index: number) => {
    const removed = previewUrls[index];

    // 기존 URL인 경우 deletedUrls에 추가
    if (typeof removed === 'string' && removed.startsWith('http')) {
      setDeletedUrls((prev) => [...prev, removed]);
    } else {
      // 새로 추가한 파일일 경우 photos에서도 제거
      const newPhotos = photos.filter((_, i) => i !== index);
      setPhotos(newPhotos);
    }

    // preview에서는 항상 제거
    const newPreview = previewUrls.filter((_, i) => i !== index);
    setPreviewUrls(newPreview);
  };

  return (
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
          className="absolute h-[70px] w-[70px] cursor-pointer opacity-0"
        />
        <CameraIcon />
        <div className="text-regular12 text-gray0">
          (<span className={previewUrls.length > 0 ? 'text-primary' : ''}>{previewUrls.length}</span>/10)
        </div>
      </label>
      <div
        ref={previewRef}
        className="scrollbar-hide flex h-full w-full flex-nowrap items-center gap-[9px] overflow-x-scroll"
      >
        {previewUrls?.map((prev, index) => (
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
