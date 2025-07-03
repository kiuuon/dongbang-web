function TaggedUserModal({ tagedUsers }: { tagedUsers: { user: { name: string; avatar: string } }[] }) {
  return (
    <div className="flex w-full flex-col items-center">
      <div className="mb-[17px] mt-[10px] h-[4px] w-[37px] rounded-[10px] bg-gray1" />
      <div className="text-bold14 mb-[28px]">게시글에 태그된 사람</div>
      <div className="scrollbar-hide mb-[20px] flex max-h-[190px] w-full flex-col gap-[10px] overflow-y-scroll">
        {tagedUsers.map(({ user }) => (
          <button key={user.name} type="button" className="flex w-full items-center gap-[29px]">
            {user.avatar ? '' : <div className="h-[40px] w-[40px] rounded-full bg-black" />}
            <div className="text-bold12">{user.name}</div>
          </button>
        ))}
      </div>
    </div>
  );
}

export default TaggedUserModal;
