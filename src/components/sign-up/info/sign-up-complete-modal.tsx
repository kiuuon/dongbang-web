import { useRouter } from 'next/router';

function SignUpCompleteModal() {
  const router = useRouter();

  const goToHome = () => {
    router.push('/');
  };

  return (
    <div className="fixed left-0 top-0 z-50 flex h-screen w-screen items-center justify-center bg-[rgba(0,0,0,0.5)]">
      <div className="flex h-[150px] w-[220px] flex-col items-center justify-center gap-[25px] rounded-[8px] bg-[#ECF5BD] shadow-modal">
        <div className="flex w-[150px] text-center text-[14px] text-[#8C8C8C]">
          가입이 완료되었습니다 <br /> 즐거운 동아리 활동하세요
        </div>
        <button
          type="button"
          className="h-[35px] w-[100px] rounded-[8px] bg-[#DEE8B7] text-[14px] text-[#8C8C8C]"
          onClick={goToHome}
        >
          확인
        </button>
      </div>
    </div>
  );
}

export default SignUpCompleteModal;
