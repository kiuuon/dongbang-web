function CampusClubTypeInput({
  value,
  onChange,
  setDefaultCampusClubType,
}: {
  value: string | undefined;
  onChange: (value: string) => void;
  setDefaultCampusClubType: React.Dispatch<React.SetStateAction<string>>;
}) {
  const handleClick = (type: string) => {
    onChange(type);
    setDefaultCampusClubType(type);
  };
  return (
    <div className="flex flex-col text-[16px]">
      <div className="mt-[8px] flex flex-col gap-[8px]">
        <div className="text-bold16 mb-[2px] flex text-gray2">동아리</div>
        <div className="flex w-full gap-[8px]">
          <button
            type="button"
            className={`h-[32px] w-full rounded-[5px] ${value === '총동아리' ? 'text-tertiary_dark' : 'text-gray2'} ${value === '총동아리' ? 'bg-secondary_light' : 'bg-white'} border border-gray0`}
            onClick={() => handleClick('총동아리')}
          >
            총동아리
          </button>
          <button
            type="button"
            className={`h-[32px] w-full rounded-[5px] ${value === '중앙 동아리' ? 'text-tertiary_dark' : 'text-gray2'} ${value === '중앙 동아리' ? 'bg-secondary_light' : 'bg-white'} border border-gray0`}
            onClick={() => handleClick('중앙 동아리')}
          >
            중앙 동아리
          </button>
          <button
            type="button"
            className={`h-[32px] w-full rounded-[5px] ${value === '단과대 동아리' ? 'text-tertiary_dark' : 'text-gray2'} ${value === '단과대 동아리' ? 'bg-secondary_light' : 'bg-white'} border border-gray0`}
            onClick={() => handleClick('단과대 동아리')}
          >
            단과대 동아리
          </button>
        </div>
        <div className="flex gap-[8px]">
          <button
            type="button"
            className={`h-[32px] w-full rounded-[5px] ${value === '과 동아리' ? 'text-tertiary_dark' : 'text-gray2'} ${value === '과 동아리' ? 'bg-secondary_light' : 'bg-white'} border border-gray0`}
            onClick={() => handleClick('과 동아리')}
          >
            과 동아리
          </button>
          <button
            type="button"
            className={`h-[32px] w-full rounded-[5px] ${value === '소모임' ? 'text-tertiary_dark' : 'text-gray2'} ${value === '소모임' ? 'bg-secondary_light' : 'bg-white'} border border-gray0`}
            onClick={() => handleClick('소모임')}
          >
            소모임
          </button>
          <div className="w-full" />
        </div>
      </div>
    </div>
  );
}

export default CampusClubTypeInput;
