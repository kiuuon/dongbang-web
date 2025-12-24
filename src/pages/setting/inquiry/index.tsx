import { useRef, useState } from 'react';
import { useRouter } from 'next/router';
import { useMutation } from '@tanstack/react-query';

import { upload } from '@/lib/apis/image';
import { sendInquiry } from '@/lib/apis/inquiry';
import { handleMutationError } from '@/lib/utils';
import { ERROR_MESSAGE } from '@/lib/constants';
import Header from '@/components/layout/header';
import BackButton from '@/components/common/back-button';
import Loading from '@/components/common/loading';
import PhotoInput from '@/components/club/[clubId]/announcement/photo-input';

function InquiryPage() {
  const uuid = crypto.randomUUID();
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [replyToEmail, setReplyToEmail] = useState('');
  const [photos, setPhotos] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [isAgreed, setIsAgreed] = useState(false);
  const [, setDeletedUrls] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const previewRef = useRef<HTMLDivElement>(null);

  const { mutateAsync: uploadPhoto } = useMutation({
    mutationFn: ({ file, fileName }: { file: File; fileName: string }) => upload(file, fileName, 'inquiry-image'),
    onError: (error) => handleMutationError(error, ERROR_MESSAGE.IMAGE.PHOTO_UPLOAD_FAILED, () => setIsLoading(false)),
  });

  const { mutate: handleWriteAnnouncement } = useMutation({
    mutationFn: async (photoUrls: string[]) => sendInquiry(title, content, replyToEmail, photoUrls),
    onSuccess: () => {
      if (window.ReactNativeWebView) {
        window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'event', action: 'back button click' }));
      } else {
        router.back();
      }
    },
    onError: (error) => handleMutationError(error, ERROR_MESSAGE.INQUIRY.SEND_FAILED, () => setIsLoading(false)),
  });

  const handleWriteButton = async () => {
    try {
      if (title.trim() === '') {
        alert('제목을 입력해주세요.');
        return;
      }

      if (replyToEmail.trim() === '') {
        alert('답변 받을 이메일을 입력해주세요.');
        return;
      }

      if (!replyToEmail.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
        alert('올바른 이메일 형식이 아닙니다.');
        return;
      }

      if (content.trim() === '') {
        alert('내용을 입력해주세요.');
        return;
      }

      if (!isAgreed) {
        alert('개인정보 수집 및 이용동의를 동의해주세요.');
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
          <div className="text-bold16">문의하기</div>
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
          <div className="text-bold12 user-select-none">답변 받을 이메일</div>
          <input
            type="text"
            value={replyToEmail}
            onChange={(event) => setReplyToEmail(event.target.value)}
            placeholder="user@example.com"
            className="text-regular14 h-[48px] w-full rounded-[8px] border border-gray0 px-[16px] placeholder:text-gray2"
          />
        </div>

        <div className="mt-[16px] flex flex-col gap-[10px]">
          <div className="text-bold12 user-select-none">내용</div>
          <textarea
            value={content}
            onChange={(event) => setContent(event.target.value)}
            placeholder="겪으신 문제나 건의사항을 자세히 적어주세요."
            className="text-regular14 h-[155px] w-full resize-none rounded-[8px] border border-gray0 px-[16px] py-[18px] placeholder:text-gray2"
          />
        </div>

        <div className="mt-[16px] flex flex-col">
          <div className="text-bold12 user-select-none">이미지 첨부</div>
          <PhotoInput
            photos={photos}
            setPhotos={setPhotos}
            previewUrls={previewUrls}
            setPreviewUrls={setPreviewUrls}
            setDeletedUrls={setDeletedUrls}
            previewRef={previewRef}
          />
        </div>

        <div className="flex flex-col gap-[4px]">
          <button type="button" className="flex items-center gap-[8px]" onClick={() => setIsAgreed((prev) => !prev)}>
            <div
              className={`h-[24px] w-[24px] rounded-full border border-gray0 ${isAgreed ? 'bg-primary' : 'bg-white'}`}
            />
            <div className="text-bold14">개인정보 수집 및 이용동의(필수)</div>
          </button>
          <div className="flex items-center gap-[8px]">
            <div className="h-[24px] min-w-[24px]" />
            <div className="text-regular14 rounded-[8px] bg-gray0 px-[10px] py-[8px] text-gray2">
              문의 답변 완료 및 처리를 위해 이메일 주소와 문의 내용을 수집하며, 답변 완료 후 개인정보처리 방침에 따라
              3년 후 파기됩니다.
            </div>
          </div>
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

export default InquiryPage;
