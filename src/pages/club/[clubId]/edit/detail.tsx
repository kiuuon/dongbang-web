import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useQuery } from '@tanstack/react-query';

import { fetchMyRole } from '@/lib/apis/club/club';
import { handleQueryError } from '@/lib/utils';
import { ERROR_MESSAGE } from '@/lib/constants';
import { hasPermission } from '@/lib/club/service';
import useClubPageValidation from '@/hooks/useClubPageValidation';
import Header from '@/components/layout/header';
import BackButton from '@/components/common/back-button';
import ProgressBar from '@/components/club/edit/progress-bar';
import DetailForm from '@/components/club/edit/detail/detail-form';

function Detail() {
  const router = useRouter();
  const { clubId } = router.query;

  const { isValid, ErrorComponent } = useClubPageValidation();

  const {
    data: role,
    isPending,
    isSuccess,
  } = useQuery({
    queryKey: ['myRole', clubId],
    queryFn: () => fetchMyRole(clubId as string),
    enabled: isValid,
    throwOnError: (error) => handleQueryError(error, ERROR_MESSAGE.USER.ROLE_FETCH_FAILED),
  });

  useEffect(() => {
    if (isSuccess && (!role || !hasPermission(role, 'edit_club_page'))) {
      router.replace('/');
    }
  }, [role, router, isSuccess]);

  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  if (!isValid) {
    return ErrorComponent;
  }

  if (isPending) {
    return null;
  }

  return (
    <div className="flex min-h-screen flex-col pt-[68px]">
      <Header>
        <BackButton />
      </Header>
      <ProgressBar />
      <DetailForm isClubIdValid={isValid} />
    </div>
  );
}

export default Detail;
