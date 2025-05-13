import { useRouter } from 'next/router';

function Complete() {
  const router = useRouter();

  const goToHome = () => {
    if (window.ReactNativeWebView) {
      window.ReactNativeWebView.postMessage('sign up complete');
      return;
    }
    router.push('/');
  };

  return (
    <div className="flex h-screen w-screen flex-col items-center justify-between px-[20px]">
      <div className="text-bold32 mt-[231px]">가입이 완료되었습니다</div>
      <button
        type="button"
        className="text-bold16 mb-[21px] h-[56px] w-full rounded-[24px] bg-primary text-white"
        onClick={goToHome}
      >
        확인
      </button>
    </div>
  );
}

export default Complete;
