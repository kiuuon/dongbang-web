import CheckBox from '@/components/sign-up/terms/check-box';
import NextButton from '@/components/sign-up/terms/next-button';

function Terms() {
  return (
    <div className="flex min-h-screen flex-col bg-white px-[20px]">
      <div className="text-bold20 mb-[289px] mt-[68px]">
        어서오세요
        <br />
        <span className="text-primary">약관 동의</span>가 필요합니다
      </div>
      <CheckBox />
      <div className="mt-[40px] flex justify-center">
        <NextButton />
      </div>
    </div>
  );
}

export default Terms;
