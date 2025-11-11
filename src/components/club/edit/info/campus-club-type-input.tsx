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
    <div className="flex flex-col">
      <div className="text-bold12 mb-[18px]">동아리</div>
      <div className="mb-[16px] flex w-full gap-[12px]">
        <button
          type="button"
          className={`h-[32px] rounded-[24px] px-[13px] ${value === '총동아리' ? 'text-bold12 bg-primary text-white' : 'text-regular12 bg-gray0 text-black'}`}
          onClick={() => handleClick('총동아리')}
        >
          총동아리
        </button>
        <button
          type="button"
          className={`h-[32px] rounded-[24px] px-[13px] ${value === '중앙 동아리' ? 'text-bold12 bg-primary text-white' : 'text-regular12 bg-gray0 text-black'}`}
          onClick={() => handleClick('중앙 동아리')}
        >
          중앙 동아리
        </button>
        <button
          type="button"
          className={`h-[32px] rounded-[24px] px-[13px] ${value === '단과대 동아리' ? 'text-bold12 bg-primary text-white' : 'text-regular12 bg-gray0 text-black'}`}
          onClick={() => handleClick('단과대 동아리')}
        >
          단과대 동아리
        </button>
        <button
          type="button"
          className={`h-[32px] rounded-[24px] px-[13px] ${value === '과 동아리' ? 'text-bold12 bg-primary text-white' : 'text-regular12 bg-gray0 text-black'}`}
          onClick={() => handleClick('과 동아리')}
        >
          과 동아리
        </button>
      </div>
      <div className="flex gap-[12px]">
        <button
          type="button"
          className={`h-[32px] rounded-[24px] px-[13px] ${value === '소모임' ? 'text-bold12 bg-primary text-white' : 'text-regular12 bg-gray0 text-black'}`}
          onClick={() => handleClick('소모임')}
        >
          소모임
        </button>
      </div>
    </div>
  );
}

export default CampusClubTypeInput;
