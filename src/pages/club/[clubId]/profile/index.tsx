import Header from '@/components/layout/header';
import BackButton from '@/components/common/back-button';

function ClubMemberProfile() {
  return (
    <div className="flex h-screen flex-col justify-between px-[20px] pt-[68px]">
      <Header>
        <div className="flex flex-row items-center gap-[10px]">
          <BackButton />
          <div className="text-bold16">활동명 변경</div>
        </div>
      </Header>
      <div className="flex flex-col gap-[10px]">
        <div className="text-bold12 user-select-none">동아리 활동명</div>
        <input
          type="text"
          className="text-regular14 w-full rounded-[8px] border border-gray0 p-[16px] placeholder:text-gray2"
        />
        <div className="text-regular12 text-primary user-select-none">동아리 내부에서 표시되는 이름입니다</div>
      </div>
      <button
        type="button"
        className="text-bold16 mb-[20px] mt-[20px] flex h-[56px] min-h-[56px] w-full items-center justify-center rounded-[24px] bg-primary text-white"
      >
        저장
      </button>
    </div>
  );
}

export default ClubMemberProfile;
