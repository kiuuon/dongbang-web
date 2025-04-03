import BackButton from '@/components/common/back-button';
import InfoForm from '@/components/sign-up/info/info-form';

function Info() {
  return (
    <div className="flex min-h-screen flex-col items-start px-[20px]">
      <BackButton />
      <InfoForm />
    </div>
  );
}

export default Info;
