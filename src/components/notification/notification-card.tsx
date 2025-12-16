/* eslint-disable no-nested-ternary */
import Image from 'next/image';
import { useRouter } from 'next/router';

import { fetchAnnouncement } from '@/lib/apis/club/announcement';
import CommentNotificationIcon from '@/icons/comment-notification-icon';
import { formatToTimeAgo } from '@/lib/utils';
import { NotificationType } from '@/types/notification-type';
import LikeNotificationIcon from '@/icons/like-notification-icon';
import FeedNotificationIcon from '@/icons/feed-notification';

const NOTIFICATION_TYPE = {
  comment: '댓글',
  reply: '대댓글',
  mention: '언급',
  like: '좋아요',
  application: '가입 신청',
  approval: '가입 승인',
  rejection: '가입 거절',
  role_change: '직위 변경',
  expel: '추방',
  leave: '탈퇴',
  join: '초대',
  announcement: '공지',
  inquiry: '문의',
  inquiry_reply: '문의 답변',
  tag: '태그',
};

function NotificationCard({ notification }: { notification: NotificationType }) {
  const router = useRouter();

  return (
    <button
      type="button"
      className={`flex flex-row items-start gap-[12px] border-b border-gray0 px-[20px] py-[16px] ${notification.read_at ? 'bg-white' : 'bg-secondary'}`}
      onClick={async () => {
        if (window.ReactNativeWebView) {
          if (notification.navigation_type === 'announcement') {
            const announcement = await fetchAnnouncement(notification.navigation_id as string);
            window.ReactNativeWebView.postMessage(
              JSON.stringify({
                type: 'event',
                action: 'click announcement notification',
                payload: {
                  navigationType: notification.navigation_type,
                  navigationId: notification.navigation_id,
                  clubId: announcement?.club_id,
                },
              }),
            );
            return;
          }

          window.ReactNativeWebView.postMessage(
            JSON.stringify({
              type: 'event',
              action: 'click notification',
              payload: {
                navigationType: notification.navigation_type,
                navigationId: notification.navigation_id,
              },
            }),
          );

          return;
        }

        if (notification.navigation_type === 'feed') {
          router.push(`/feed/detail/${notification.navigation_id}`);
        } else if (notification.navigation_type === 'club') {
          router.push(`/club/${notification.navigation_id}`);
        } else if (notification.navigation_type === 'application') {
          router.push(`/club/${notification.navigation_id}/members/manage/application`);
        } else if (notification.navigation_type === 'announcement') {
          const announcement = await fetchAnnouncement(notification.navigation_id as string);
          router.push(`/club/${announcement?.club_id}/announcement/${notification.navigation_id}`);
        } else if (notification.navigation_type === 'inquiry') {
          router.push(`/club/${notification.navigation_id}`);
        }
      }}
    >
      {notification.logo ? (
        <Image
          src={notification.logo}
          alt="notification logo"
          width={40}
          height={40}
          style={{ objectFit: 'cover', width: '40px', height: '40px', borderRadius: '40px' }}
        />
      ) : notification.type === 'like' ? (
        <LikeNotificationIcon />
      ) : notification.type === 'tag' ? (
        <FeedNotificationIcon />
      ) : (
        <CommentNotificationIcon />
      )}
      <div className="flex flex-col items-start gap-[4px]">
        <div className="text-bold16 min-h-[19px] break-all text-start">{notification.title}</div>
        {notification.description && (
          <div className="text-regular14 min-h-[17px] break-all text-start text-gray2">{notification.description}</div>
        )}
        <div className="flex flex-row items-center gap-[4px]">
          <div className="text-regular12 text-gray2">{formatToTimeAgo(notification.created_at)}</div>
          <div className="text-bold10 rounded-[16px] bg-gray0 p-[4px] text-gray2">
            {NOTIFICATION_TYPE[notification.type as keyof typeof NOTIFICATION_TYPE]}
          </div>
        </div>
      </div>
    </button>
  );
}

export default NotificationCard;
