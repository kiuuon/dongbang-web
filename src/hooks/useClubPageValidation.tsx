import { useRouter } from 'next/router';
import { useQuery } from '@tanstack/react-query';

import { fetchClubInfo } from '@/lib/apis/club';
import { isValidUUID, handleQueryError } from '@/lib/utils';
import { ERROR_MESSAGE } from '@/lib/constants';
import AccessDeniedPage from '@/components/common/access-denied-page';

function useClubPageValidation() {
  const router = useRouter();
  const { clubId } = router.query;
  const isValid = isValidUUID(clubId as string);

  const {
    data: clubInfo,
    isPending: isClubInfoPending,
    isSuccess,
  } = useQuery({
    queryKey: ['club', clubId],
    queryFn: () => fetchClubInfo(clubId as string),
    enabled: isValid,
    throwOnError: (error) => handleQueryError(error, ERROR_MESSAGE.CLUB.INFO_FETCH_FAILED),
  });

  // 유효하지 않은 clubId이거나 존재하지 않는 클럽인 경우
  if ((clubId && !isValid) || (isSuccess && !clubInfo && !isClubInfoPending)) {
    return {
      isValid: false,
      clubId: clubId as string,
      clubInfo: null,
      isPending: false,
      ErrorComponent: <AccessDeniedPage title="동아리를 찾을 수 없어요." content="존재하지 않는 동아리입니다." />,
    };
  }

  return {
    isValid: true,
    clubId: clubId as string,
    clubInfo,
    isPending: isClubInfoPending,
    ErrorComponent: null,
  };
}

export default useClubPageValidation;
