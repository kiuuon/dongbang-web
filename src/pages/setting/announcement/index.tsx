import { useRouter } from 'next/router';
import { useQuery } from '@tanstack/react-query';

import { fetchAnnouncements } from '@/lib/apis/announcement';
import { formatKoreanDate, handleQueryError } from '@/lib/utils';
import { ERROR_MESSAGE } from '@/lib/constants';
import RightArrowIcon2 from '@/icons/right-arrow-icon2';
import Header from '@/components/layout/header';
import BackButton from '@/components/common/back-button';

function AnnouncementPage() {
  const router = useRouter();

  const { data: announcements } = useQuery({
    queryKey: ['announcements'],
    queryFn: () => fetchAnnouncements(),
    throwOnError: (error) => handleQueryError(error, ERROR_MESSAGE.ANNOUNCEMENT.FETCH_FAILED),
  });

  return (
    <div className="h-screen pt-[82px]">
      <div className="px-[20px]">
        <Header>
          <div className="flex items-center gap-[10px]">
            <BackButton />
            <div className="text-bold16">공지사항</div>
          </div>
        </Header>
      </div>
      <div className="border-t border-gray0">
        {announcements?.map((announcement) => (
          <button
            type="button"
            key={announcement.id}
            className="text-regular14 flex w-full items-center justify-between border-b border-gray0 py-[18px] pl-[24px] pr-[20px]"
            onClick={() => {
              if (window.ReactNativeWebView) {
                window.ReactNativeWebView.postMessage(
                  JSON.stringify({ type: 'event', action: 'go to announcement detail page', payload: announcement.id }),
                );
              } else {
                router.push(`/setting/announcement/${announcement.id}`);
              }
            }}
          >
            <div className="flex flex-col items-start gap-[1px]">
              <div className="text-regular14">{announcement.title}</div>
              <div className="text-regular12 text-gray1">{formatKoreanDate(announcement.created_at)}</div>
            </div>
            <RightArrowIcon2 />
          </button>
        ))}
      </div>
    </div>
  );
}

export default AnnouncementPage;
