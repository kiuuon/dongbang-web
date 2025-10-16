import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useMutation, useQuery } from '@tanstack/react-query';

import ToggleIcon from '@/icons/toggle-icon';
import PersonIcon from '@/icons/person-icon';
import RightArrowIcon5 from '@/icons/right-arrow-icon5';
import Header from '@/components/layout/header';
import BackButton from '@/components/common/back-button';
import Loading from '@/components/common/loading';
import PhotoSection from '@/components/feed/write/photo-section';
import TagModal from '@/components/feed/write/tag-modal/tag-modal';
import { upload } from '@/lib/apis/image';
import { writeFeed } from '@/lib/apis/feed';
import { fetchClubInfo } from '@/lib/apis/club';

function WriteFeedPage() {
  const uuid = crypto.randomUUID();
  const router = useRouter();
  const { clubId } = router.query;
  const [photos, setPhotos] = useState<File[]>([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isNicknameVisible, setIsNicknameVisible] = useState(false);
  const [isPrivate, setIsPrivate] = useState(false);
  const [isTagModalOpen, setIsTagModalOpen] = useState(false);
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [selectedClubs, setSelectedClubs] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const { data: clubInfo } = useQuery({
    queryKey: ['club', clubId],
    queryFn: () => fetchClubInfo(clubId as string),
    throwOnError: (error) => {
      if (window.ReactNativeWebView) {
        window.ReactNativeWebView.postMessage(
          JSON.stringify({
            type: 'error',
            headline: '동아리 정보를 불러오는 데 실패했습니다. 다시 시도해주세요.',
            message: error.message,
          }),
        );
        return false;
      }
      alert(`동아리 정보를 불러오는 데 실패했습니다. 다시 시도해주세요.\n\n${error.message}`);
      return false;
    },
  });

  const { mutateAsync: uploadPhoto } = useMutation({
    mutationFn: ({ file, fileName }: { file: File; fileName: string }) => upload(file, fileName, 'feed-image'),
    onError: (error) => {
      if (window.ReactNativeWebView) {
        window.ReactNativeWebView.postMessage(
          JSON.stringify({
            type: 'error',
            headline: '사진 업로드에 실패했습니다. 다시 시도해주세요.',
            message: error.message,
          }),
        );
        return;
      }
      alert(`사진 업로드에 실패했습니다. 다시 시도해주세요.\n\n${error.message}`);
      setIsLoading(false);
    },
  });

  const { mutate: handleWriteFeed } = useMutation({
    mutationFn: async (photoUrls: string[]) =>
      writeFeed(
        photoUrls,
        title,
        content,
        isNicknameVisible,
        isPrivate,
        clubId as string,
        clubInfo?.type,
        selectedMembers,
        selectedClubs,
      ),
    onSuccess: () => {
      router.back();
    },
    onError: (error) => {
      if (window.ReactNativeWebView) {
        window.ReactNativeWebView.postMessage(
          JSON.stringify({
            type: 'error',
            headline: '피드를 작성하는 데 실패했습니다. 다시 시도해주세요.',
            message: error.message,
          }),
        );
        return;
      }
      alert(`'피드를 작성하는데 실패했습니다. 다시 시도해주세요.'\n${error.message}`);
      setIsLoading(false);
    },
  });

  const handleWriteButton = async () => {
    try {
      if (photos.length === 0) {
        alert('사진을 추가해주세요.');
        return;
      }

      setIsLoading(true);
      const photosUploadPromises = photos.map((photo, index) => {
        const fileName = `feed/${uuid}/${index}.png`;
        return uploadPhoto({ file: photo, fileName });
      });
      const photosResults = await Promise.all(photosUploadPromises);
      const photoUrls = photosResults.map((result) => result.publicUrl);

      if (window.ReactNativeWebView) {
        window.ReactNativeWebView.postMessage(
          JSON.stringify({
            photos: photoUrls,
            title,
            content,
            isNicknameVisible,
            isPrivate,
            clubType: clubInfo?.type,
          }),
        );
      } else {
        handleWriteFeed(photoUrls);
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error uploading files:', error);
    }
  };

  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  return (
    <div className="flex h-screen min-h-screen flex-col justify-between px-[20px] pt-[68px]">
      <Header>
        <BackButton />
      </Header>
      <div className="flex flex-col gap-[24px]">
        <div className="flex flex-col">
          <div className="flex flex-col">
            <div className="text-bold12 user-select-none">사진</div>
            <PhotoSection photos={photos} setPhotos={setPhotos} />
          </div>
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
              placeholder={
                '동아리 활동을 자유롭게 자랑해주세요!\n#동아리 #모임 #연합\n등등의 해쉬태그를 통해 더 많은 사람들에게 홍보해보세요'
              }
              className="text-regular14 h-[155px] w-full resize-none rounded-[8px] border border-gray0 px-[16px] py-[18px] placeholder:text-gray2"
            />
          </div>
        </div>
        <div className="flex flex-col gap-[8px]">
          <div className="flex items-start justify-between">
            <div className="flex h-[35px] flex-col justify-between">
              <div className="text-bold16">작성자 이름도 함께 표시</div>
              <div className="text-bold10 text-primary">동아리 이름 옆에 작성자의 이름도 함께 표시됩니다</div>
            </div>
            <button type="button" onClick={() => setIsNicknameVisible((prev) => !prev)}>
              <ToggleIcon active={isNicknameVisible} />
            </button>
          </div>
          <div className="flex items-start justify-between">
            <div>
              <div className="text-bold16">비공개</div>
              <div className="text-bold10 text-primary">부원들만 볼 수 있습니다</div>
            </div>
            <button type="button" onClick={() => setIsPrivate((prev) => !prev)}>
              <ToggleIcon active={isPrivate} />
            </button>
          </div>
          <button
            type="button"
            className="flex items-center justify-between"
            onClick={() => {
              if (window.ReactNativeWebView) {
                window.ReactNativeWebView.postMessage('open tag modal');
                return;
              }
              setIsTagModalOpen(true);
            }}
          >
            <div className="text-bold16 flex items-center gap-[4px]">
              <PersonIcon />
              태그
            </div>
            <RightArrowIcon5 />
          </button>
        </div>
      </div>
      <button
        type="button"
        className="text-bold16 mb-[20px] mt-[20px] flex h-[56px] min-h-[56px] w-full items-center justify-center rounded-[24px] bg-primary text-white"
        onClick={handleWriteButton}
      >
        게시
      </button>
      {isTagModalOpen && (
        <TagModal
          setIsBottomSheetOpen={setIsTagModalOpen}
          selectedMembers={selectedMembers}
          setSelectedMembers={setSelectedMembers}
          selectedClubs={selectedClubs}
          setSelectedClubs={setSelectedClubs}
        />
      )}
      {isLoading && <Loading />}
    </div>
  );
}

export default WriteFeedPage;
