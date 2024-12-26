import Image from 'next/image';

function GoogleLoginButton() {
  return (
    <button
      type="button"
      className="flex h-[50px] w-[295px] items-center gap-[32px] rounded-[10px] bg-white pl-[8px] text-[12px]"
    >
      <Image src="/images/google_logo.png" alt="구글 로고" width={50} height={50} />
      구글 계정으로으로 시작하기
    </button>
  );
}

export default GoogleLoginButton;
