import Image from 'next/image';

function JoinClubPrompt() {
  return (
    <div className="flex w-full flex-grow flex-col items-center justify-center">
      <p className="my-[96px] h-[64px] w-[200px] text-center text-[24px]">더욱 즐거운 동아리 활동을 위한 모든 것</p>
      <button type="button" className="h-[36px] w-[135px] rounded-[5px] bg-[#D9D9D9] text-[20px]">
        가입하러가기
      </button>
      <div className="mt-[128px] flex flex-col gap-[32px]">
        <div>동아리 추천</div>
        <div className="flex gap-[16px]">
          <Image src="/images/logo.png" alt="로고" width={75} height={75} />
          <div className="flex flex-col gap-[8px]">
            <div className="text-[24px]">동방</div>
            <div className="text-[14px] text-[#969696]">더욱 즐거운 동아리 활동을 위한 모든 것!!</div>
            <button type="button" className="ml-auto h-[20px] w-[80px] rounded-[5px] bg-[#D9D9D9] text-[14px]">
              자세히 보기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default JoinClubPrompt;
