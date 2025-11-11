import { useEffect } from 'react';

import clubInfoStore from '@/stores/club-info-store';
import Header from '@/components/layout/header';
import BackButton from '@/components/common/back-button';
import ProgressBar from '@/components/club/edit/progress-bar';
import InfoForm from '@/components/club/edit/info/info-form';

function Info() {
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
