import { useEffect } from 'react';

import Header from '@/components/layout/header';
import BackButton from '@/components/common/back-button';
import InfoForm from '@/components/sign-up/info/info-form';

function Info() {
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
    <div className="flex min-h-screen flex-col items-start px-[20px] pt-[66px]">
      <Header>
        <BackButton />
      </Header>
      <InfoForm />
    </div>
  );
}

export default Info;
