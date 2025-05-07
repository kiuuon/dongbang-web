import Header from '@/components/layout/header';
import BackButton from '@/components/common/back-button';
import ProgressBar from '@/components/club/create/progress-bar';
import DetailForm from '@/components/club/create/detail/detail-form';

function Detail() {
  return (
    <div className="flex flex-col px-[20px] pt-[68px]">
      <Header>
        <BackButton />
      </Header>
      <ProgressBar />
      <DetailForm />
    </div>
  );
}

export default Detail;
