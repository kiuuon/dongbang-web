import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/router';

import { fetchMyRole } from '@/lib/apis/club';
import PlusPersonIcon from '@/icons/plus-person-icon';
import PencilIcon2 from '@/icons/pencil-icon2';
import FeedIcon from '@/icons/feed-icon';

function WriteModal({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  const { clubId } = router.query;
  const { data: role } = useQuery({
    queryKey: ['myRole', clubId],
    queryFn: () => fetchMyRole(clubId as string),
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
      window.ReactNativeWebView.postMessage('comingSoon');
      return;
    }
    router.push('/coming-soon');
  };

  const writeFeed = () => {
    if (window.ReactNativeWebView) {
      window.ReactNativeWebView.postMessage('writeFeed');
      return;
    }
    router.push(`/feed/write/${clubId}`);
  };

  return (
    <div
      role="button"
      tabIndex={0}
      className="fixed bottom-0 left-0 z-40 h-screen w-screen bg-black bg-opacity-60"
      onClick={handleOutSideClick}
      onKeyDown={(event) => {
        if (event.key === 'Escape') {
          handleOutSideClick(event);
        }
      }}
    >
      <div className="absolute bottom-[140px] right-[20px] flex w-[181px] flex-col gap-[18px] rounded-[8px] bg-white px-[14px] py-[16px] shadow-[0px_1px_4px_0px_rgba(0,0,0,0.1)]">
        {role === 'president' && (
          <button type="button" className="text-regular16 flex items-center gap-[8px]" onClick={goToCommingSoon}>
            <PlusPersonIcon />
            부원 모집하기
          </button>
        )}
        <button type="button" className="text-regular16 flex items-center gap-[8px]" onClick={goToCommingSoon}>
          <PencilIcon2 />
          게시글 작성
        </button>
        <button type="button" className="text-regular16 flex items-center gap-[8px]" onClick={writeFeed}>
          <FeedIcon />
          피드 작성
        </button>
      </div>
    </div>
  );
}

export default WriteModal;
