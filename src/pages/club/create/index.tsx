import { useRouter } from 'next/router';

function CreateClub() {
  const router = useRouter();

  const goToClubCreate = (clubType: string) => {
    router.push(`/club/create/${clubType}`);
  };

  return (
    <div className="mt-[160px] flex flex-col items-start justify-center gap-[100px] px-[32px]">
      <button type="button" className="flex h-[40px] flex-col items-start" onClick={() => goToClubCreate('campus')}>
        <div className="text-[16px]">교내 동아리</div>
        <div className="text-[12px] text-[#D5E488]">학교내에서 활동하는 동아리</div>
      </button>
      <button type="button" className="flex h-[40px] flex-col items-start" onClick={() => goToClubCreate('union')}>
        <div className="text-[16px]">연합 동아리</div>
        <div className="text-[12px] text-[#D5E488]">전국/지역에서 다른 학교 학생들과 활동하는 동아리</div>
      </button>
    </div>
  );
}

export default CreateClub;
