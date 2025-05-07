import Header from '@/components/layout/header';
import BackButton from '@/components/common/back-button';
import ProgressBar from '@/components/club/create/progress-bar';
import InfoForm from '@/components/club/create/info/info-form';

function Info() {
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
