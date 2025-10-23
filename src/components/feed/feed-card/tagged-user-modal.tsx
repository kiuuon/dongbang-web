import Image from 'next/image';

function TaggedUserModal({ tagedUsers }: { tagedUsers: { user: { name: string; avatar: string } }[] }) {
  return (
    <div className="flex w-full flex-col items-center px-[20px]">
      <div className="mb-[12px] mt-[12px] h-[2px] w-[37px] rounded-[10px] bg-gray1" />
      <div className="text-bold14 mb-[27px]">피드에 태그된 사람</div>
      <div className="scrollbar-hide mb-[20px] flex max-h-[190px] w-full flex-col gap-[10px] overflow-y-scroll">
        {tagedUsers.map(({ user }) => (
          <button key={user.name} type="button" className="flex w-full items-center gap-[29px]">
            {user.avatar ? (
              <Image
                src={user.avatar}
                alt="아바타"
                width={40}
                height={40}
                style={{
                  objectFit: 'cover',
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                }}
              />
            ) : (
              <Image
                src="/images/none_avatar.png"
                alt="아바타"
                width={40}
                height={40}
                style={{
                  objectFit: 'cover',
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                }}
              />
            )}
            <div className="text-bold12">{user.name}</div>
          </button>
        ))}
      </div>
    </div>
  );
}

export default TaggedUserModal;
