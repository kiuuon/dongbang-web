import { useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { ClipLoader } from 'react-spinners';

import { fetchAnnouncements, fetchMyRole } from '@/lib/apis/club';
import { formatKoreanDate, handleQueryError } from '@/lib/utils';
import { ERROR_MESSAGE } from '@/lib/constants';
import { hasPermission } from '@/lib/club/service';
import useClubPageValidation from '@/hooks/useClubPageValidation';
import PlusIcon2 from '@/icons/plus-icon2';
import Header from '@/components/layout/header';
import BackButton from '@/components/common/back-button';

function AnnouncementPage() {
  const router = useRouter();
  const { clubId } = router.query as { clubId: string };

  const observerElement = useRef(null);

  const { isValid, ErrorComponent } = useClubPageValidation();

  const { data: myRole } = useQuery({
    queryKey: ['myRole', clubId],
    queryFn: () => fetchMyRole(clubId as string),
    enabled: isValid,
    throwOnError: (error) => handleQueryError(error, ERROR_MESSAGE.USER.ROLE_FETCH_FAILED),
  });

  const { data, fetchNextPage, hasNextPage, isPending } = useInfiniteQuery({
    initialPageParam: 0,
    queryKey: ['announcements', clubId],
    queryFn: ({ pageParam }) => fetchAnnouncements(clubId, pageParam),
    enabled: isValid,
    getNextPageParam: (lastPage, allPages) => (lastPage?.length === 15 ? allPages.length : undefined),
    throwOnError: (error) => handleQueryError(error, ERROR_MESSAGE.CLUB.FETCH_ANNOUNCEMENTS_FAILED),
  });

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

  if (!isValid) {
    return ErrorComponent;
  }

  return (
    <div className="flex h-screen flex-col pt-[60px]">
      <Header>
        <div className="flex flex-row items-center gap-[10px]">
          <BackButton />
          <div className="text-bold16">공지</div>
        </div>

        {hasPermission(myRole, 'manage_announcement') && (
          <button
            type="button"
            onClick={() => {
              if (window.ReactNativeWebView) {
                window.ReactNativeWebView.postMessage(
                  JSON.stringify({
                    type: 'event',
                    action: 'write announcement',
                  }),
                );
                return;
              }
              router.push(`/club/${clubId}/announcement/write`);
            }}
          >
            <PlusIcon2 />
          </button>
        )}
      </Header>

      {!isPending && (
        <div>
          {data?.pages[0].length === 0 ? (
            <div className="mt-[211px] flex w-full justify-center">
              <div className="text-bold20 text-gray1">공지사항이 없습니다.</div>
            </div>
          ) : (
            <div className="flex flex-col gap-[12px] border-t border-gray0">
              {data?.pages.map((page) =>
                page.map((announcement: any) => (
                  <button
                    type="button"
                    key={announcement.id}
                    className="flex w-full flex-col items-start gap-[5px] border-b border-gray0 px-[24px] py-[8px]"
                    onClick={() => {
                      router.push(`/club/${clubId}/announcement/${announcement.id}`);
                    }}
                  >
                    <div className="text-regular14 h-[17px] w-full truncate text-start">{announcement.title}</div>
                    <div className="flex flex-row items-center gap-[6px]">
                      <div className="text-regular10 text-gray2">{formatKoreanDate(announcement.created_at)}</div>
                      <div className="text-regular10 text-gray2">· {announcement.author.name}</div>
                    </div>
                  </button>
                )),
              )}
            </div>
          )}
        </div>
      )}

      {hasNextPage && (
        <div ref={observerElement} className="flex h-[40px] items-center justify-center text-[32px]">
          <ClipLoader size={30} color="#F9A825" />
        </div>
      )}
    </div>
  );
}

export default AnnouncementPage;
