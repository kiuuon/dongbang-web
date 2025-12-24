import { useRouter } from 'next/router';
import { useQuery } from '@tanstack/react-query';
import ReactMarkdown, { Components } from 'react-markdown';
import { ClipLoader } from 'react-spinners';

import { fetchAnnouncement } from '@/lib/apis/announcement';
import { formatKoreanDate, handleQueryError } from '@/lib/utils';
import { ERROR_MESSAGE } from '@/lib/constants';
import Header from '@/components/layout/header';
import BackButton from '@/components/common/back-button';

const MarkdownComponents: Components = {
  img: ({ ...props }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      {...props}
      style={{
        display: 'block',
        margin: '20px 0',
        maxWidth: '100%',
        borderRadius: '8px',
      }}
      alt={props.alt || '공지사항 이미지'}
    />
  ),
};

function AnnouncementDetailPage() {
  const router = useRouter();
  const { announcementId } = router.query as { announcementId: string };

  const { data: announcement, isPending } = useQuery({
    queryKey: ['announcement', announcementId],
    queryFn: () => fetchAnnouncement(announcementId),
    throwOnError: (error) => handleQueryError(error, ERROR_MESSAGE.ANNOUNCEMENT.FETCH_FAILED),
  });

  if (isPending)
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <ClipLoader size={30} color="#F9A825" />
      </div>
    );

  return (
    <div className="flex h-screen flex-col px-[20px] pt-[82px]">
      <Header>
        <div className="flex items-center gap-[10px]">
          <BackButton />
          <div className="text-bold16">공지사항</div>
        </div>
      </Header>
      <div className="text-bold24">{announcement?.title}</div>
      <div className="text-regular10 mb-[12px] text-gray2">{formatKoreanDate(announcement?.created_at)}</div>
      <div className="pretendard">
        <ReactMarkdown components={MarkdownComponents}>{announcement?.content}</ReactMarkdown>
      </div>
    </div>
  );
}

export default AnnouncementDetailPage;
