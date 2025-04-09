import { useRouter } from 'next/router';

function SignUpCompleteModal() {
  const router = useRouter();

  const goToHome = () => {
    router.push('/');
  };

  return (
    <div className="fixed left-0 top-0 z-50 flex h-screen w-screen items-center justify-center bg-[rgba(0,0,0,0.5)]">
      <div className="flex h-[147px] w-[220px] flex-col items-center gap-[35px] rounded-[5px] bg-primary shadow-modal">
        <div className="text-bold16 mt-[46px] h-[19px] w-[160px] text-center text-tertiary_dark">
          가입이 완료되었습니다
        </div>
        <button
          type="button"
          className="text-bold16 text-white h-[34px] w-[106px] rounded-[7px] bg-tertiary"
          onClick={goToHome}
        >
          확인
        </button>
      </div>
    </div>
  );
}

export default SignUpCompleteModal;
