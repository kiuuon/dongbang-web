import { useRouter } from 'next/router';

import UserAvatar from '@/components/common/user-avatar';

function TaggedUserModal({
  tagedUsers,
  onClose,
}: {
  tagedUsers: { user: { id: string; name: string; avatar: string; nickname: string; deleted_at: string | null } }[];
  onClose: () => void;
}) {
  const router = useRouter();

  return (
    <div className="flex w-full flex-col items-center px-[20px]">
      <div className="mb-[12px] mt-[12px] h-[2px] w-[37px] rounded-[10px] bg-gray1" />
      <div className="text-bold14 mb-[27px]">피드에 태그된 사람</div>
      <div className="scrollbar-hide mb-[20px] flex max-h-[190px] w-full flex-col gap-[10px] overflow-y-scroll">
        {tagedUsers.map(({ user }) => (
          <button
            key={user.name}
            type="button"
            className="flex w-full items-center gap-[29px]"
            onClick={() => {
              if (user.deleted_at) {
                return;
              }

              sessionStorage.setItem(`scroll:${router.asPath}`, `${document.scrollingElement?.scrollTop || 0}`);

              router.push(`/profile/${user.nickname}`);
              onClose();
            }}
          >
            <UserAvatar avatar={user.avatar} size={40} />
            <div className={`text-bold12 ${user.deleted_at ? 'text-gray2' : 'text-black'}`}>
              {user.deleted_at ? '(알수없음)' : user.name}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

export default TaggedUserModal;
