function CampusClubTypeInput({
  value,
  onChange,
  setDefaultCampusClubType,
}: {
  value: string;
  onChange: (value: string) => void;
  setDefaultCampusClubType: React.Dispatch<React.SetStateAction<string>>;
}) {
  const handleClick = (type: string) => {
    onChange(type);
    setDefaultCampusClubType(type);
  };
  return (
    <div className="mt-[80px] flex flex-col text-[16px]">
      <div className="mt-[8px] flex flex-col gap-[8px]">
        <div className="flex gap-[8px]">
          <button
            type="button"
            className={`h-[32px] w-[104px] rounded-[5px] ${value === '총동아리연합회' ? 'text-[#080808]' : 'text-[#969696]'} ${value === '총동아리연합회' ? 'bg-[#BCBBBB]' : 'bg-[#D9D9D9]'}`}
            onClick={() => handleClick('총동아리연합회')}
          >
            총동아리연합회
          </button>
          <button
            type="button"
            className={`h-[32px] w-[104px] rounded-[5px] ${value === '중앙 동아리' ? 'text-[#080808]' : 'text-[#969696]'} ${value === '중앙 동아리' ? 'bg-[#BCBBBB]' : 'bg-[#D9D9D9]'}`}
            onClick={() => handleClick('중앙 동아리')}
          >
            중앙 동아리
          </button>
          <button
            type="button"
            className={`h-[32px] w-[104px] rounded-[5px] ${value === '단과대 동아리' ? 'text-[#080808]' : 'text-[#969696]'} ${value === '단과대 동아리' ? 'bg-[#BCBBBB]' : 'bg-[#D9D9D9]'}`}
            onClick={() => handleClick('단과대 동아리')}
          >
            단과대 동아리
          </button>
        </div>
        <div className="flex gap-[8px]">
          <button
            type="button"
            className={`h-[32px] w-[104px] rounded-[5px] ${value === '과동아리' ? 'text-[#080808]' : 'text-[#969696]'} ${value === '과동아리' ? 'bg-[#BCBBBB]' : 'bg-[#D9D9D9]'}`}
            onClick={() => handleClick('과동아리')}
          >
            과동아리
          </button>
          <button
            type="button"
            className={`h-[32px] w-[104px] rounded-[5px] ${value === '소모임' ? 'text-[#080808]' : 'text-[#969696]'} ${value === '소모임' ? 'bg-[#BCBBBB]' : 'bg-[#D9D9D9]'}`}
            onClick={() => handleClick('소모임')}
          >
            소모임
          </button>
        </div>
      </div>
    </div>
  );
}

export default CampusClubTypeInput;
