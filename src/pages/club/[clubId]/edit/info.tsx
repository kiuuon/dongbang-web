import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useQuery } from '@tanstack/react-query';

import { fetchMyRole } from '@/lib/apis/club/club';
import { handleQueryError } from '@/lib/utils';
import { ERROR_MESSAGE } from '@/lib/constants';
import { hasPermission } from '@/lib/club/service';
import useClubPageValidation from '@/hooks/useClubPageValidation';
import clubInfoStore from '@/stores/club-info-store';
import Header from '@/components/layout/header';
import BackButton from '@/components/common/back-button';
import ProgressBar from '@/components/club/edit/progress-bar';
import InfoForm from '@/components/club/edit/info/info-form';

function Info() {
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

    const handlePopState = () => {
      clubInfoStore.setState({
        campusClubType: undefined,
        name: '',
        category: '',
        location: '',
        bio: '',
        description: '',
        tags: [],
      });
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  if (!isValid) {
    return ErrorComponent;
  }

  if (isPending) {
    return null;
  }

  return (
    <div className="flex flex-col px-[20px] pt-[68px]">
      <Header>
        <BackButton />
      </Header>
      <ProgressBar />
      <InfoForm isClubIdValid={isValid} />
    </div>
  );
}

export default Info;
