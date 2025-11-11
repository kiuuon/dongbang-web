import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useQuery } from '@tanstack/react-query';

import { fetchMyRole } from '@/lib/apis/club';
import { handleQueryError } from '@/lib/utils';
import { ERROR_MESSAGE } from '@/lib/constants';
import clubInfoStore from '@/stores/club-info-store';
import Header from '@/components/layout/header';
import BackButton from '@/components/common/back-button';
import ProgressBar from '@/components/club/edit/progress-bar';
import InfoForm from '@/components/club/edit/info/info-form';

function Info() {
  const router = useRouter();
  const { clubId } = router.query;

  const { data: role, isPending } = useQuery({
    queryKey: ['myRole', clubId],
    queryFn: () => fetchMyRole(clubId as string),
    throwOnError: (error) => handleQueryError(error, ERROR_MESSAGE.USER.ROLE_FETCH_FAILED),
  });

  useEffect(() => {
    if (!role || (role !== 'officer' && role !== 'president')) {
      router.replace('/');
    }
  }, [role, router]);

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

  if (isPending) {
    return null;
  }

  return (
    <div className="flex flex-col px-[20px] pt-[68px]">
      <Header>
        <BackButton />
      </Header>
      <ProgressBar />
      <InfoForm />
    </div>
  );
}

export default Info;
