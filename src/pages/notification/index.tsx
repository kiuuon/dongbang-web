import { useEffect, useRef, useState } from 'react';
import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { fetchNotifications, markAllNotificationsAsRead } from '@/lib/apis/notifications';
import { handleQueryError } from '@/lib/utils';
import { ERROR_MESSAGE } from '@/lib/constants';
import Header from '@/components/layout/header';
import BackButton from '@/components/common/back-button';
import NotificationCard from '@/components/notification/notification-card';

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

  return (
    <div className="flex min-h-screen flex-col pt-[78px]">
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
            <NotificationCard key={notification.id} notification={notification} />
          ))}
        </div>
      )}

      {selectedCategory === 'activities' && (
        <div className="flex flex-col">
          {flatData?.map((notification) => {
            if (NOTIFICATION_CATEGORY.activities.includes(notification.type as keyof typeof NOTIFICATION_CATEGORY)) {
              return <NotificationCard key={notification.id} notification={notification} />;
            }
            return null;
          })}
        </div>
      )}

      {selectedCategory === 'news' && (
        <div className="flex flex-col">
          {flatData?.map((notification) => {
            if (NOTIFICATION_CATEGORY.news.includes(notification.type as keyof typeof NOTIFICATION_CATEGORY)) {
              return <NotificationCard key={notification.id} notification={notification} />;
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
