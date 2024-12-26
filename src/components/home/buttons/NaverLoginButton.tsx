import Image from 'next/image';

function NaverLoginButton() {
  return (
    <button
      type="button"
      className="flex h-[50px] w-[295px] items-center gap-[32px] rounded-[10px] bg-[#00C73C] pl-[8px] text-[12px]"
    >
      <Image src="/images/naver_logo.png" alt="네이버 로고" width={50} height={50} />
      네이버 계정으로으로 시작하기
    </button>
  );
}

export default NaverLoginButton;
