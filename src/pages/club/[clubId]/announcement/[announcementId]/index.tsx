import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useMutation, useQuery } from '@tanstack/react-query';

import { fetchUserId } from '@/lib/apis/auth';
import { fetchMyRole } from '@/lib/apis/club/club';
import { deleteAnnouncement } from '@/lib/apis/club/announcement';
import { formatKoreanDate, handleMutationError, handleQueryError } from '@/lib/utils';
import { ERROR_MESSAGE } from '@/lib/constants';
import { getRole, hasPermission } from '@/lib/club/service';
import useClubAnnouncementPageValidation from '@/hooks/useClubAnnouncementPageValidation';
import MoreVertIcon from '@/icons/more-vert-icon';
import TrashIcon3 from '@/icons/trash-icon3';
import EditIcon2 from '@/icons/edit-icon2';
import Header from '@/components/layout/header';
import BackButton from '@/components/common/back-button';
import UserAvatar from '@/components/common/user-avatar';

function AnnouncementDetailPage() {
  const router = useRouter();
  const { clubId, announcementId } = router.query as { clubId: string; announcementId: string };

  const dropdownRef = useRef<HTMLDivElement>(null);
  const moreButtonRef = useRef<HTMLButtonElement>(null);
  const [isDropDownOpen, setIsDropDownOpen] = useState(false);

  const { isValid, ErrorComponent, announcement, isPending } = useClubAnnouncementPageValidation();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        moreButtonRef.current &&
        !moreButtonRef.current?.contains(event.target as Node)
      ) {
        setIsDropDownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const { data: myRole } = useQuery({
    queryKey: ['myRole', clubId],
    queryFn: () => fetchMyRole(clubId as string),
    throwOnError: (error) => handleQueryError(error, ERROR_MESSAGE.USER.ROLE_FETCH_FAILED),
  });

  const { data: userId } = useQuery({
    queryKey: ['userId'],
    queryFn: fetchUserId,
    throwOnError: (error) => handleQueryError(error, ERROR_MESSAGE.USER.ID_FETCH_FAILED),
  });

  const { mutate: handleDeleteAnnouncement } = useMutation({
    mutationFn: () => deleteAnnouncement(announcementId),
    onSuccess: () => {
      router.replace(`/club/${clubId}/announcement`);
    },
    onError: (error) => handleMutationError(error, ERROR_MESSAGE.CLUB.DELETE_ANNOUNCEMENT_FAILED),
  });

  if (isPending) {
    return null;
  }

  if (!isValid) {
    return ErrorComponent;
  }

  return (
    <div className="flex h-screen flex-col pt-[60px]">
      <Header>
        <BackButton />
        <div className="flex items-center gap-[8px]">
          <button
            type="button"
            className="text-regular12"
            onClick={() => {
              if (window.ReactNativeWebView) {
                window.ReactNativeWebView.postMessage(
                  JSON.stringify({ type: 'event', action: 'go to announcement list page' }),
                );
                return;
              }
              router.push(`/club/${clubId}/announcement`);
            }}
          >
            공지 목록
          </button>
          {hasPermission(myRole, 'manage_announcement') && (
            <button ref={moreButtonRef} type="button" onClick={() => setIsDropDownOpen((prev) => !prev)}>
              <MoreVertIcon />
            </button>
          )}
        </div>
      </Header>

      {isDropDownOpen && (
        <div
          ref={dropdownRef}
          className="absolute right-[16px] top-[64px] z-10 flex flex-col gap-[11px] rounded-[4px] bg-white p-[10px] shadow-[0px_1px_4px_0px_rgba(0,0,0,0.25)]"
        >
          <button
            type="button"
            className="flex w-full items-center gap-[9px]"
            onClick={() => handleDeleteAnnouncement()}
          >
            <TrashIcon3 />
            <span className="text-regular16 whitespace-nowrap text-gray3">삭제</span>
          </button>
          {userId === announcement?.author.id && (
            <button
              type="button"
              className="flex w-full items-center gap-[9px]"
              onClick={() => {
                setIsDropDownOpen(false);

                if (window.ReactNativeWebView) {
                  window.ReactNativeWebView.postMessage(
                    JSON.stringify({
                      type: 'event',
                      action: 'go to announcement edit page',
                      payload: announcementId,
                    }),
                  );
                  return;
                }

                router.push(`/club/${clubId}/announcement/${announcementId}/edit`);
              }}
            >
              <EditIcon2 />
              <span className="text-regular16 whitespace-nowrap text-gray3">수정</span>
            </button>
          )}
        </div>
      )}

      <button
        type="button"
        className="flex justify-start gap-[12px] px-[24px]"
        onClick={() => {
          if (announcement?.author.deleted_at) {
            return;
          }

          if (window.ReactNativeWebView) {
            window.ReactNativeWebView.postMessage(
              JSON.stringify({ type: 'event', action: 'go to profile page', payload: announcement?.author.nickname }),
            );
            return;
          }

          router.push(`/profile/${announcement?.author.nickname}`);
        }}
      >
        <UserAvatar avatar={announcement?.author.avatar} size={32} />
        <div className="flex flex-col items-start">
          <div className="flex items-center gap-[2px]">
            <div className={`text-bold14 h-[17px] ${announcement?.author.deleted_at ? 'text-gray2' : 'text-black'}`}>
              {announcement?.author.deleted_at ? '(알수없음)' : announcement?.author.name}
            </div>
            <div className="text-regular12 h-[14px] text-gray2">· {getRole(announcement?.author.role[0].role)}</div>
          </div>
          <div className="text-regular12 h-[14px] text-gray2">{announcement?.author.nickname}</div>
        </div>
      </button>
      <div className="text-bold24 mb-[4px] mt-[16px] break-all px-[24px]">{announcement?.title}</div>
      <div className="text-regular10 px-[24px] text-gray2">{formatKoreanDate(announcement?.created_at)}</div>
      <div className="text-regular16 my-[12px] whitespace-pre-wrap break-all px-[24px]">{announcement?.content}</div>

      {announcement?.photos.length > 0 && (
        <div>
          {announcement?.photos.map((photoUrl: string) => (
            <Image
              src={photoUrl}
              alt="공지 이미지"
              width={600}
              height={321}
              style={{
                objectFit: 'cover',
                width: '100%',
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default AnnouncementDetailPage;
