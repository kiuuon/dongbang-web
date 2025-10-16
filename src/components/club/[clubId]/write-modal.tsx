import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/router';

import { fetchMyRole } from '@/lib/apis/club';
import PlusPersonIcon from '@/icons/plus-person-icon';
import PencilIcon2 from '@/icons/pencil-icon2';
import FeedIcon from '@/icons/feed-icon';
import PersonIcon2 from '@/icons/person-icon2';
import EditIcon from '@/icons/edit-icon';

function WriteModal({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  const { clubId } = router.query;
  const { data: role } = useQuery({
    queryKey: ['myRole', clubId],
    queryFn: () => fetchMyRole(clubId as string),
    throwOnError: (error) => {
      if (window.ReactNativeWebView) {
        window.ReactNativeWebView.postMessage(
          JSON.stringify({
            type: 'error',
            headline: '내 역할을 불러오는 데 실패했습니다. 다시 시도해주세요.',
            message: error.message,
          }),
        );
        return false;
      }
      alert(`내 역할을 불러오는 데 실패했습니다. 다시 시도해주세요.\n\n${error.message}`);
      return false;
    },
  });

  useEffect(() => {
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  const handleOutSideClick = (event: React.MouseEvent<HTMLDivElement> | React.KeyboardEvent<HTMLDivElement>) => {
    if (event.type === 'click' && event.target === event.currentTarget) {
      onClose();
    }
  };

  const goToCommingSoon = () => {
    if (window.ReactNativeWebView) {
      onClose();
      window.ReactNativeWebView.postMessage('comingSoon');
      return;
    }
    router.push('/coming-soon');
  };

  const writeFeed = () => {
    if (window.ReactNativeWebView) {
      onClose();
      window.ReactNativeWebView.postMessage('go to write feed page');
      return;
    }
    router.push(`/feed/write/${clubId}`);
  };

  const goToRecruitPage = () => {
    if (window.ReactNativeWebView) {
      onClose();
      window.ReactNativeWebView.postMessage('go to recruit page');
      return;
    }

    onClose();
    router.push(`/club/${clubId}/recruit`);
  };

  return (
    <div
      role="button"
      tabIndex={0}
      className="fixed bottom-0 left-0 right-0 z-40 m-auto h-screen w-screen max-w-[600px] bg-black bg-opacity-60"
      onClick={handleOutSideClick}
      onKeyDown={(event) => {
        if (event.key === 'Escape') {
          handleOutSideClick(event);
        }
      }}
    >
      <div className="absolute bottom-[140px] right-[20px] flex w-[181px] flex-col gap-[18px] rounded-[8px] bg-white px-[14px] py-[16px] shadow-[0px_1px_4px_0px_rgba(0,0,0,0.1)]">
        <button type="button" className="text-regular16 flex items-center gap-[8px]" onClick={goToCommingSoon}>
          <PencilIcon2 />
          게시글 작성
        </button>
        <button type="button" className="text-regular16 flex items-center gap-[8px]" onClick={writeFeed}>
          <FeedIcon />
          피드 작성
        </button>
      </div>
      {role === 'president' && (
        <div className="absolute bottom-[249px] right-[20px] flex w-[181px] flex-col gap-[18px] rounded-[8px] bg-white px-[14px] py-[16px] shadow-[0px_1px_4px_0px_rgba(0,0,0,0.1)]">
          <button type="button" className="text-regular16 flex items-center gap-[8px]" onClick={goToRecruitPage}>
            <PlusPersonIcon />
            부원 모집하기
          </button>
          <button type="button" className="text-regular16 flex items-center gap-[8px]" onClick={goToCommingSoon}>
            <PersonIcon2 />
            부원 관리하기
          </button>
          <button type="button" className="text-regular16 flex items-center gap-[8px]" onClick={goToCommingSoon}>
            <EditIcon color="#F9A825" />
            동아리 소개 수정
          </button>
        </div>
      )}
    </div>
  );
}

export default WriteModal;
