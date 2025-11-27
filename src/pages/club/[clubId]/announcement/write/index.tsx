import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import { useMutation, useQuery } from '@tanstack/react-query';

import { upload } from '@/lib/apis/image';
import { fetchMyRole } from '@/lib/apis/club/club';
import { writeAnnouncement } from '@/lib/apis/club/announcement';
import { handleMutationError, handleQueryError } from '@/lib/utils';
import { ERROR_MESSAGE } from '@/lib/constants';
import useClubPageValidation from '@/hooks/useClubPageValidation';
import Header from '@/components/layout/header';
import BackButton from '@/components/common/back-button';
import Loading from '@/components/common/loading';
import PhotoInput from '@/components/club/[clubId]/announcement/photo-input';
import { hasPermission } from '@/lib/club/service';

function AnnouncementWritePage() {
  const uuid = crypto.randomUUID();
  const router = useRouter();
  const { clubId } = router.query as { clubId: string };

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [photos, setPhotos] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [, setDeletedUrls] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const previewRef = useRef<HTMLDivElement>(null);

  const { isValid, ErrorComponent } = useClubPageValidation();

  const { data: myRole, isSuccess } = useQuery({
    queryKey: ['myRole', clubId],
    queryFn: () => fetchMyRole(clubId as string),
    throwOnError: (error) => handleQueryError(error, ERROR_MESSAGE.USER.ROLE_FETCH_FAILED),
  });

  useEffect(() => {
    if (isSuccess && (!myRole || !hasPermission(myRole, 'manage_announcement'))) {
      router.replace(`/club`);
    }
  }, [myRole, router, clubId, isSuccess]);

  const { mutateAsync: uploadPhoto } = useMutation({
    mutationFn: ({ file, fileName }: { file: File; fileName: string }) => upload(file, fileName, 'announcement-image'),
    onError: (error) => handleMutationError(error, ERROR_MESSAGE.IMAGE.PHOTO_UPLOAD_FAILED, () => setIsLoading(false)),
  });

  const { mutate: handleWriteAnnouncement } = useMutation({
    mutationFn: async (photoUrls: string[]) => writeAnnouncement(photoUrls, title, content, clubId as string),
    onSuccess: () => {
      if (window.ReactNativeWebView) {
        window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'event', action: 'back button click' }));
      } else {
        router.back();
      }
    },
    onError: (error) =>
      handleMutationError(error, ERROR_MESSAGE.CLUB.WRITE_ANNOUNCEMENT_FAILED, () => setIsLoading(false)),
  });

  if (!isValid) {
    return ErrorComponent;
  }

  const handleWriteButton = async () => {
    try {
      if (title.trim() === '') {
        alert('제목을 입력해주세요.');
        return;
      }

      if (content.trim() === '') {
        alert('내용을 입력해주세요.');
        return;
      }

      let finalImages: string[] = [];

      if (photos.length !== 0) {
        setIsLoading(true);

        const orderedUrls: string[] = Array.from(previewRef.current?.children ?? []).map((child) =>
          (child as HTMLElement).style.backgroundImage.replace(/^url\(["']?/, '').replace(/["']?\)$/, ''),
        );

        const uploadedUrls = await Promise.all(
          photos.map((photo, index) => uploadPhoto({ file: photo, fileName: `announcement/${uuid}/${index}.png` })),
        ).then((res) => res.map((r) => r.publicUrl));

        let uploadIndex = 0;
        finalImages = orderedUrls.map((url) => {
          if (url.startsWith('http')) return url;
          const newUrl = uploadedUrls[uploadIndex];
          uploadIndex += 1;
          return newUrl;
        });
      }

      handleWriteAnnouncement(finalImages);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error uploading files:', error);
    }
  };

  return (
    <div className="flex h-screen flex-col justify-between px-[20px] pt-[60px]">
      <Header>
        <div className="flex flex-row items-center gap-[10px]">
          <BackButton />
          <div className="text-bold16">공지 작성하기</div>
        </div>
      </Header>

      <div className="flex flex-col">
        <div className="flex flex-col gap-[10px]">
          <div className="text-bold12 user-select-none">제목</div>
          <input
            type="text"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="제목을 입력해주세요."
            className="text-regular14 h-[48px] w-full rounded-[8px] border border-gray0 px-[16px] placeholder:text-gray2"
          />
        </div>

        <div className="mt-[16px] flex flex-col gap-[10px]">
          <div className="text-bold12 user-select-none">내용</div>
          <textarea
            value={content}
            onChange={(event) => setContent(event.target.value)}
            placeholder="공지 내용을 입력해주세요."
            className="text-regular14 h-[155px] w-full resize-none rounded-[8px] border border-gray0 px-[16px] py-[18px] placeholder:text-gray2"
          />
        </div>

        <div className="mt-[16px] flex flex-col">
          <div className="text-bold12 user-select-none">사진</div>
          <PhotoInput
            photos={photos}
            setPhotos={setPhotos}
            previewUrls={previewUrls}
            setPreviewUrls={setPreviewUrls}
            setDeletedUrls={setDeletedUrls}
            previewRef={previewRef}
          />
        </div>
      </div>

      <button
        type="button"
        className="text-bold16 mb-[20px] mt-[20px] flex h-[56px] min-h-[56px] w-full items-center justify-center rounded-[24px] bg-primary text-white"
        onClick={handleWriteButton}
      >
        완료
      </button>

      {isLoading && <Loading />}
    </div>
  );
}

export default AnnouncementWritePage;
