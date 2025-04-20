import BackButton from '@/components/common/back-button';
import InfoForm from '@/components/sign-up/info/info-form';

function Info() {
  return (
    <div className="flex min-h-screen flex-col items-start px-[20px]">
      <div className="fixed left-0 top-0 z-10 flex h-[36px] w-full bg-white px-[20px] pt-[12px]">
        <BackButton />
      </div>
      <InfoForm />
    </div>
  );
}

export default Info;
