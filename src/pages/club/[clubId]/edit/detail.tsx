import { useEffect } from 'react';

import Header from '@/components/layout/header';
import BackButton from '@/components/common/back-button';
import ProgressBar from '@/components/club/edit/progress-bar';
import DetailForm from '@/components/club/edit/detail/detail-form';

function Detail() {
  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

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
