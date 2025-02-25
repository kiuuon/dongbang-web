import userInfoStore from '@/stores/sign-up/user-info-store';

function ClubCountInput() {
  const clubCount = userInfoStore((state) => state.clubCount);
  const setClubCount = userInfoStore((state) => state.setClubCount);

  return (
    <div>
      <div className="text-[14px] text-[#969696]">가입한 동아리 수</div>
      <div className="mb-[10px] mt-[5px] flex gap-[10px]">
        <button
          type="button"
          className={`h-[16px] w-[30px] rounded-[5px] text-[10px] ${clubCount === '1' ? 'text-[#080808]' : 'text-[#969696]'} ${clubCount === '1' ? 'bg-[#BCBBBB]' : 'bg-[#D9D9D9]'}`}
          onClick={() => {
            setClubCount('1');
          }}
        >
          1개
        </button>
        <button
          type="button"
          className={`h-[16px] w-[30px] rounded-[5px] text-[10px] ${clubCount === '2' ? 'text-[#080808]' : 'text-[#969696]'} ${clubCount === '2' ? 'bg-[#BCBBBB]' : 'bg-[#D9D9D9]'}`}
          onClick={() => {
            setClubCount('2');
          }}
        >
          2개
        </button>
        <button
          type="button"
          className={`h-[16px] w-[30px] rounded-[5px] text-[10px] ${clubCount === '3' ? 'text-[#080808]' : 'text-[#969696]'} ${clubCount === '3' ? 'bg-[#BCBBBB]' : 'bg-[#D9D9D9]'}`}
          onClick={() => {
            setClubCount('3');
          }}
        >
          3개
        </button>
        <button
          type="button"
          className={`h-[16px] w-[50px] rounded-[5px] text-[10px] ${clubCount === '4+' ? 'text-[#080808]' : 'text-[#969696]'} ${clubCount === '4+' ? 'bg-[#BCBBBB]' : 'bg-[#D9D9D9]'}`}
          onClick={() => {
            setClubCount('4+');
          }}
        >
          4개 이상
        </button>
        <button
          type="button"
          className={`h-[16px] w-[30px] rounded-[5px] text-[10px] ${clubCount === '0' ? 'text-[#080808]' : 'text-[#969696]'} ${clubCount === '0' ? 'bg-[#BCBBBB]' : 'bg-[#D9D9D9]'}`}
          onClick={() => {
            setClubCount('0');
          }}
        >
          없음
        </button>
      </div>
    </div>
  );
}

export default ClubCountInput;
