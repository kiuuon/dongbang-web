import { useRouter } from 'next/router';
import { useQuery } from '@tanstack/react-query';

import { fetchLatestAnnouncement } from '@/lib/apis/club/announcement';
import { handleQueryError } from '@/lib/utils';
import { ERROR_MESSAGE } from '@/lib/constants';
import SpeakerPhoneIcon from '@/icons/speaker-phone-icon';
import RightArrowIcon4 from '@/icons/right-arrow-icon4';

function AnnouncementButton() {
  const router = useRouter();
  const { clubId } = router.query as { clubId: string };

  const { data: latestAnnouncement } = useQuery({
    queryKey: ['latestAnnouncement', clubId],
    queryFn: () => fetchLatestAnnouncement(clubId),
    throwOnError: (error) => handleQueryError(error, ERROR_MESSAGE.CLUB.FETCH_ANNOUNCEMENTS_FAILED),
  });

  const goToAnnouncementPage = () => {
    if (window.ReactNativeWebView) {
      window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'event', action: 'go to announcement page' }));
      return;
    }
    router.push(`/club/${clubId}/announcement`);
  };

  return (
    <button
      type="button"
      className="mb-[16px] mt-[18px] flex h-[40px] w-full flex-row items-center justify-between rounded-[8px] bg-secondary pl-[10px] pr-[16px]"
      onClick={goToAnnouncementPage}
    >
      <div className="flex w-full flex-row items-center gap-[8px]">
        <div className="min-w-[20px]">
          <SpeakerPhoneIcon />
        </div>
        <div className="text-bold12 truncate">{latestAnnouncement?.title || '공지사항이 없습니다.'}</div>
      </div>
      <RightArrowIcon4 />
    </button>
  );
}

export default AnnouncementButton;
