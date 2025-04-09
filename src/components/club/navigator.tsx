import { useRouter } from 'next/router';

function Navigator() {
  const router = useRouter();

  const goToSelectedClubType = (clubType: string) => {
    router.push(`/post/${clubType}`);
  };

  return (
    <div className="mt-4 flex justify-around">
      <div className="flex flex-col items-center gap-[4px]">
        <button
          type="button"
          aria-label="내 동아리로 이동"
          onClick={() => goToSelectedClubType('my')}
          className="h-[50px] w-[50px] rounded-[32px] border-[1px] border-[#569879] bg-[#CAEABA]"
        />
        <p className="text-[10px] text-[#569879]">내 동아리</p>
      </div>
      <div className="flex flex-col items-center gap-[4px]">
        <button
          type="button"
          aria-label="교내 동아리로 이동"
          onClick={() => goToSelectedClubType('campus')}
          className="h-[50px] w-[50px] rounded-[32px] border-[1px] border-[#569879] bg-[#CAEABA]"
        />
        <p className="text-[10px] text-[#569879]">교내 동아리</p>
      </div>
      <div className="flex flex-col items-center gap-[4px]">
        <button
          type="button"
          aria-label="연합 동아리로 이동"
          onClick={() => goToSelectedClubType('union')}
          className="h-[50px] w-[50px] rounded-[32px] border-[1px] border-[#569879] bg-[#CAEABA]"
        />
        <p className="text-[10px] text-[#569879]">연합 동아리</p>
      </div>
    </div>
  );
}

export default Navigator;
