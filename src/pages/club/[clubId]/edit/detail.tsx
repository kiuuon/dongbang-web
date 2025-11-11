import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useQuery } from '@tanstack/react-query';

import { fetchMyRole } from '@/lib/apis/club';
import { handleQueryError } from '@/lib/utils';
import { ERROR_MESSAGE } from '@/lib/constants';
import Header from '@/components/layout/header';
import BackButton from '@/components/common/back-button';
import ProgressBar from '@/components/club/edit/progress-bar';
import DetailForm from '@/components/club/edit/detail/detail-form';

function Detail() {
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

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  if (isPending) {
    return null;
  }

  return (
    <div className="flex flex-col pt-[68px]">
      <Header>
        <BackButton />
      </Header>
      <ProgressBar />
      <DetailForm />
    </div>
  );
}

export default Detail;
