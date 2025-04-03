import CheckBox from '@/components/sign-up/terms/check-box';
import NextButton from '@/components/sign-up/terms/next-button';

function Terms() {
  return (
    <div className="flex min-h-screen flex-col bg-[#F5F5F5] px-[20px]">
      <div className="text-bold24 mb-[10px] mt-[56px] text-tertiary_dark">이용 약관 동의</div>
      <div className="text-bold16 mb-[350px] text-tertiary_dark">
        서비스 이용에 필요한 약관 동의 사항입니다. 정책 및 약관을 확인해주세요.
      </div>
      <CheckBox />
      <div className="mt-[40px] flex justify-center">
        <NextButton />
      </div>
    </div>
  );
}

export default Terms;
