import Image from 'next/image';

function TaggedClubModal({ taggedClubs }: { taggedClubs: { club: { name: string; logo: string } }[] }) {
  return (
    <div className="flex w-full flex-col items-center">
      <div className="mb-[17px] mt-[10px] h-[4px] w-[37px] rounded-[10px] bg-gray1" />
      <div className="text-bold14 mb-[28px]">피드에 태그된 동아리</div>
      <div className="scrollbar-hide mb-[20px] flex max-h-[190px] w-full flex-col gap-[10px] overflow-y-scroll">
        {taggedClubs.map(({ club }) => (
          <button key={club.logo} type="button" className="flex w-full items-center gap-[29px]">
            <Image
              src={club.logo}
              alt="로고"
              width={40}
              height={40}
              style={{
                objectFit: 'cover',
                width: '40px',
                height: '40px',
                borderRadius: '5px',
                border: '1px solid #F9F9F9',
              }}
            />
            <div className="text-bold12">{club.name}</div>
          </button>
        ))}
      </div>
    </div>
  );
}

export default TaggedClubModal;
