import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { fetchNotifications, markAllNotificationsAsRead } from '@/lib/apis/notifications';
import { formatToTimeAgo, handleQueryError } from '@/lib/utils';
import { ERROR_MESSAGE } from '@/lib/constants';
import CommentNotificationIcon from '@/icons/comment-notification-icon';
import LikeNotificationIcon from '@/icons/like-notification-icon';
import Header from '@/components/layout/header';
import BackButton from '@/components/common/back-button';
import { fetchAnnouncement } from '@/lib/apis/club/announcement';

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
};

const NOTIFICATION_CATEGORY = {
  activities: ['comment', 'like', 'reply', 'mention'],
  news: [
    'application',
    'approval',
    'rejection',
    'role_change',
    'expel',
    'leave',
    'join',
    'announcement',
    'inquiry',
    'inquiry_reply',
  ],
};

function NotificationPage() {
  const queryClient = useQueryClient();
  const router = useRouter();

  const [selectedCategory, setSelectedCategory] = useState<'all' | 'activities' | 'news'>('all');

  const observerElement = useRef(null);

  const { data, fetchNextPage, hasNextPage } = useInfiniteQuery({
    initialPageParam: 0,
    queryKey: ['notifications'],
    queryFn: ({ pageParam }) => fetchNotifications(pageParam),
    getNextPageParam: (lastPage, allPages) => (lastPage?.length > 0 ? allPages.length : undefined),
    throwOnError: (error) => handleQueryError(error, ERROR_MESSAGE.NOTIFICATION.FETCH_FAILED),
  });

  const { mutate: handleMarkAllNotificationsAsRead } = useMutation({
    mutationFn: markAllNotificationsAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hasUnreadNotifications'] });
    },
    onError: (error) => {
      handleQueryError(error, ERROR_MESSAGE.NOTIFICATION.MARK_NOTIFICATIONS_AS_READ_FAILED);
    },
  });

  useEffect(() => {
    handleMarkAllNotificationsAsRead();

    return () => {
      handleMarkAllNotificationsAsRead();
    };
  }, [handleMarkAllNotificationsAsRead]);

  useEffect(() => {
    const target = observerElement.current;
    if (!target) return undefined;

    const observerInstance = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && hasNextPage) {
            fetchNextPage();
          }
        });
      },
      { threshold: 1 },
    );

    observerInstance.observe(target);

    return () => observerInstance.unobserve(target);
  }, [fetchNextPage, hasNextPage]);

  const flatData = data?.pages.flat();

  // console.log(flatData);

  return (
    <div className="flex h-screen flex-col pt-[78px]">
      <Header>
        <div className="flex flex-row items-center gap-[10px]">
          <BackButton />
          <div className="text-bold16">알림</div>
        </div>
      </Header>
      <div className="mb-[25px] px-[20px]">
        <div className="flex flex-row rounded-[24px] bg-gray0">
          <button
            type="button"
            className={`text-bold14 relative -mr-[15px] flex-1 rounded-[24px] py-[12px] text-white ${selectedCategory === 'all' && 'bg-primary'}`}
            onClick={() => setSelectedCategory('all')}
          >
            전체
          </button>

          <button
            type="button"
            className={`text-bold14 relative -mx-[15px] flex-1 rounded-[24px] py-[12px] text-white ${selectedCategory === 'activities' && 'bg-primary'}`}
            onClick={() => setSelectedCategory('activities')}
          >
            활동
          </button>

          <button
            type="button"
            className={`text-bold14 relative -ml-[15px] flex-1 rounded-[24px] py-[12px] text-white ${selectedCategory === 'news' && 'bg-primary'}`}
            onClick={() => setSelectedCategory('news')}
          >
            뉴스
          </button>
        </div>
      </div>

      {selectedCategory === 'all' && (
        <div className="flex flex-col">
          {flatData?.map((notification) => (
            <button
              key={notification.id}
              type="button"
              className={`flex flex-row items-start gap-[12px] border-b border-gray0 px-[20px] py-[16px] ${notification.read_at ? 'bg-white' : 'bg-secondary'}`}
              onClick={async () => {
                if (window.ReactNativeWebView) {
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
                } else if (notification.navigation_type === 'application') {
                  router.push(`/club/${notification.navigation_id}/members/manage/application`);
                } else if (notification.navigation_type === 'club') {
                  router.push(`/club/${notification.navigation_id}`);
                } else if (notification.navigation_type === 'announcement') {
                  const announcement = await fetchAnnouncement(notification.navigation_id);
                  router.push(`/club/${announcement?.club_id}/announcement/${notification.navigation_id}`);
                } else if (notification.navigation_type === 'inquiry') {
                  router.push(`/club/${notification.navigation_id}`);
                }
              }}
            >
              {/* eslint-disable-next-line no-nested-ternary */}
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
              ) : (
                <CommentNotificationIcon />
              )}

              <div className="flex flex-col items-start gap-[4px]">
                <div className="text-bold16 min-h-[19px] break-all text-start">{notification.title}</div>
                {notification.description && (
                  <div className="text-regular14 min-h-[17px] break-all text-start text-gray2">
                    {notification.description}
                  </div>
                )}
                <div className="flex flex-row items-center gap-[4px]">
                  <div className="text-regular12 text-gray2">{formatToTimeAgo(notification.created_at)}</div>
                  <div className="text-bold10 rounded-[16px] bg-gray0 p-[4px] text-gray2">
                    {NOTIFICATION_TYPE[notification.type as keyof typeof NOTIFICATION_TYPE]}
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {selectedCategory === 'activities' && (
        <div className="flex flex-col">
          {flatData?.map((notification) => {
            if (NOTIFICATION_CATEGORY.activities.includes(notification.type as keyof typeof NOTIFICATION_CATEGORY)) {
              return (
                <button
                  key={notification.id}
                  type="button"
                  className={`flex flex-row items-start gap-[12px] border-b border-gray0 px-[20px] py-[16px] ${notification.read_at ? 'bg-white' : 'bg-secondary'}`}
                  onClick={async () => {
                    if (window.ReactNativeWebView) {
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
                    } else if (notification.navigation_type === 'application') {
                      router.push(`/club/${notification.navigation_id}/members/manage/application`);
                    } else if (notification.navigation_type === 'club') {
                      router.push(`/club/${notification.navigation_id}`);
                    } else if (notification.navigation_type === 'announcement') {
                      const announcement = await fetchAnnouncement(notification.navigation_id);
                      router.push(`/club/${announcement?.club_id}/announcement/${notification.navigation_id}`);
                    }
                  }}
                >
                  {/* eslint-disable-next-line no-nested-ternary */}
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
                  ) : (
                    <CommentNotificationIcon />
                  )}
                  <div className="flex flex-col items-start gap-[4px]">
                    <div className="text-bold16 min-h-[19px] break-all text-start">{notification.title}</div>
                    {notification.description && (
                      <div className="text-regular14 min-h-[17px] break-all text-start text-gray2">
                        {notification.description}
                      </div>
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
            return null;
          })}
        </div>
      )}

      {selectedCategory === 'news' && (
        <div className="flex flex-col">
          {flatData?.map((notification) => {
            if (NOTIFICATION_CATEGORY.news.includes(notification.type as keyof typeof NOTIFICATION_CATEGORY)) {
              return (
                <button
                  key={notification.id}
                  type="button"
                  className="flex flex-row items-start gap-[12px] border-b border-gray0 px-[20px] py-[16px]"
                  onClick={async () => {
                    if (window.ReactNativeWebView) {
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
                      const announcement = await fetchAnnouncement(notification.navigation_id);
                      router.push(`/club/${announcement?.club_id}/announcement/${notification.navigation_id}`);
                    }
                  }}
                >
                  {/* eslint-disable-next-line no-nested-ternary */}
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
                  ) : (
                    <CommentNotificationIcon />
                  )}
                  <div className="flex flex-col items-start gap-[4px]">
                    <div className="text-bold16 min-h-[19px] break-all text-start">{notification.title}</div>
                    {notification.description && (
                      <div className="text-regular14 min-h-[17px] break-all text-start text-gray2">
                        {notification.description}
                      </div>
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
            return null;
          })}
        </div>
      )}

      {hasNextPage && <div ref={observerElement} className="h-[40px]" />}
    </div>
  );
}

export default NotificationPage;
