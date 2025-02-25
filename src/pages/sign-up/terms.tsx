import CheckBox from '@/components/sign-up/terms/check-box';
import NextButton from '@/components/sign-up/terms/next-button';

function Terms() {
  return (
    <div className="flex min-h-screen flex-col bg-[#F5F5F5] p-[40px]">
      <div className="mb-[12px] mt-[50px] text-[20px] font-black">이용 약관 동의</div>
      <div className="mb-[370px] text-[16px]">
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
