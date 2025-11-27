import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { fetchUserId } from '@/lib/apis/auth';
import { upload } from '@/lib/apis/image';
import { editAnnouncement, fetchMyRole } from '@/lib/apis/club';
import { handleMutationError, handleQueryError } from '@/lib/utils';
import { ERROR_MESSAGE } from '@/lib/constants';
import Header from '@/components/layout/header';
import BackButton from '@/components/common/back-button';
import Loading from '@/components/common/loading';
import PhotoInput from '@/components/club/[clubId]/announcement/photo-input';
import { hasPermission } from '@/lib/club/service';
import useClubAnnouncementPageValidation from '@/hooks/useClubAnnouncementPageValidation';

function AnnouncementEditPage() {
  const uuid = crypto.randomUUID();
  const queryClient = useQueryClient();
  const router = useRouter();
  const { clubId, announcementId } = router.query as { clubId: string; announcementId: string };

  const { isValid, ErrorComponent, announcement } = useClubAnnouncementPageValidation();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [photos, setPhotos] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [deletedUrls, setDeletedUrls] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const previewRef = useRef<HTMLDivElement>(null);

  const { data: myRole } = useQuery({
    queryKey: ['myRole', clubId],
    queryFn: () => fetchMyRole(clubId as string),
    enabled: isValid,
    throwOnError: (error) => handleQueryError(error, ERROR_MESSAGE.USER.ROLE_FETCH_FAILED),
  });

  const { data: userId } = useQuery({
    queryKey: ['userId'],
    queryFn: fetchUserId,
    throwOnError: (error) => handleQueryError(error, ERROR_MESSAGE.USER.ID_FETCH_FAILED),
  });

  useEffect(() => {
    if (!hasPermission(myRole, 'manage_announcement') || userId !== announcement?.author.id) {
      router.replace(`/club`);
    }
  }, [myRole, userId, announcement, router, clubId]);

  useEffect(() => {
    if (announcement) {
      setTitle(announcement.title);
      setContent(announcement.content);
      setPreviewUrls(announcement.photos);
    }
  }, [announcement]);

  const { mutateAsync: uploadPhoto } = useMutation({
    mutationFn: ({ file, fileName }: { file: File; fileName: string }) => upload(file, fileName, 'announcement-image'),
    onError: (error) => handleMutationError(error, ERROR_MESSAGE.IMAGE.PHOTO_UPLOAD_FAILED, () => setIsLoading(false)),
  });

  const { mutate: handleEditAnnouncement } = useMutation({
    mutationFn: async (photoUrls: string[]) => editAnnouncement(announcementId, title, content, photoUrls),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['announcement', announcementId] });
      queryClient.invalidateQueries({ queryKey: ['announcements', clubId] });
      queryClient.invalidateQueries({ queryKey: ['latestAnnouncement', clubId] });

      if (window.ReactNativeWebView) {
        window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'event', action: 'back button click' }));
      } else {
        router.back();
      }
    },
    onError: (error) =>
      handleMutationError(error, ERROR_MESSAGE.CLUB.EDIT_ANNOUNCEMENT_FAILED, () => setIsLoading(false)),
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

      let filteredFinalImages: string[] = [];

      const orderedUrls: string[] = Array.from(previewRef.current?.children ?? []).map((child) =>
        (child as HTMLElement).style.backgroundImage.replace(/^url\(["']?/, '').replace(/["']?\)$/, ''),
      );

      if (orderedUrls.length !== 0) {
        setIsLoading(true);

        // 새로 추가된 파일 업로드
        const uploadedUrls = await Promise.all(
          photos.map((photo, index) => uploadPhoto({ file: photo, fileName: `feed/${uuid}/${index}.png` })),
        ).then((res) => res.map((r) => r.publicUrl));

        // 기존 URL은 그대로, DataURL은 업로드된 URL로 교체
        let uploadIndex = 0;
        const finalImages = orderedUrls.map((url) => {
          if (url.startsWith('http')) return url; // 기존 이미지
          const newUrl = uploadedUrls[uploadIndex];
          uploadIndex += 1;
          return newUrl; // 새 업로드 URL
        });

        // 삭제된 URL 제외
        filteredFinalImages = finalImages.filter((url) => !deletedUrls.includes(url));
      }

      handleEditAnnouncement(filteredFinalImages);
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

export default AnnouncementEditPage;
