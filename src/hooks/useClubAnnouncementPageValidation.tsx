import { useRouter } from 'next/router';
import { useQuery } from '@tanstack/react-query';

import { fetchClubInfo } from '@/lib/apis/club/club';
import { fetchAnnouncement } from '@/lib/apis/club/announcement';
import { isValidUUID, handleQueryError } from '@/lib/utils';
import { ERROR_MESSAGE } from '@/lib/constants';
import AccessDeniedPage from '@/components/common/access-denied-page';

function useClubAnnouncementPageValidation() {
  const router = useRouter();
  const { clubId, announcementId } = router.query as { clubId: string; announcementId: string };
  const isClubValid = isValidUUID(clubId);
  const isAnnouncementValid = isValidUUID(announcementId);

  const {
    data: clubInfo,
    isPending: isClubInfoPending,
    isSuccess: isClubInfoSuccess,
  } = useQuery({
    queryKey: ['club', clubId],
    queryFn: () => fetchClubInfo(clubId as string),
    enabled: isClubValid,
    throwOnError: (error) => handleQueryError(error, ERROR_MESSAGE.CLUB.INFO_FETCH_FAILED),
  });

  const {
    data: announcement,
    isPending: isAnnouncementPending,
    isSuccess: isAnnouncementSuccess,
  } = useQuery({
    queryKey: ['announcement', announcementId],
    queryFn: () => fetchAnnouncement(announcementId, clubId),
    enabled: isAnnouncementValid,
    throwOnError: (error) => handleQueryError(error, ERROR_MESSAGE.CLUB.FETCH_ANNOUNCEMENT_FAILED),
  });

  if (
    (clubId && !isClubValid) ||
    (isClubInfoSuccess && !clubInfo && !isClubInfoPending) ||
    (announcementId && !isAnnouncementValid) ||
    (isAnnouncementSuccess && !announcement && !isAnnouncementPending)
  ) {
    return {
      isValid: false,
      clubId: clubId as string,
      announcementId: announcementId as string,
      clubInfo: null,
      announcement: null,
      isPending: isClubInfoPending || isAnnouncementPending,
      isSuccess: isClubInfoSuccess && isAnnouncementSuccess,
      ErrorComponent: (
        <AccessDeniedPage title="공지를 찾을 수 없어요." content="존재하지 않는 동아리 또는 공지입니다." />
      ),
    };
  }

  return {
    isValid: true,
    clubId: clubId as string,
    announcementId: announcementId as string,
    clubInfo,
    announcement,
    isPending: isClubInfoPending || isAnnouncementPending,
    isSuccess: isClubInfoSuccess && isAnnouncementSuccess,
    ErrorComponent: null,
  };
}

export default useClubAnnouncementPageValidation;
