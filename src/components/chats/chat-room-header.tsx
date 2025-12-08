import Image from 'next/image';
import { useRouter } from 'next/router';
import { useQuery } from '@tanstack/react-query';

import { fetchChatRoomInfo } from '@/lib/apis/chats';
import { handleQueryError } from '@/lib/utils';
import { ERROR_MESSAGE } from '@/lib/constants';
import SearchIcon2 from '@/icons/search-icon2';
import MenuIcon from '@/icons/menu-icon';
import BackButton from '../common/back-button';

function ChatRoomHeader() {
  const router = useRouter();
  const { chatRoomId } = router.query as { chatRoomId: string };

  const { data: chatRoomInfo } = useQuery({
    queryKey: ['chatRoomInfo', chatRoomId],
    queryFn: () => fetchChatRoomInfo(chatRoomId),
    enabled: !!chatRoomId,
    throwOnError: (error) => handleQueryError(error, ERROR_MESSAGE.CHATS.FETCH_ROOM_INFO_FAILED),
  });

  return (
    <header className="fixed left-0 right-0 top-0 z-30 m-auto flex h-[60px] w-full max-w-[600px] items-center justify-between bg-tag px-[20px]">
      <BackButton />
      <div className="flex items-center gap-[7px]">
        <Image
          src={chatRoomInfo?.club?.logo}
          alt="club logo"
          width={40}
          height={40}
          style={{
            objectFit: 'cover',
            borderRadius: '16px',
            width: '40px',
            height: '40px',
            minWidth: '40px',
            minHeight: '40px',
          }}
        />
        <div>
          <div className="text-bold14">{chatRoomInfo?.club?.name}</div>
          <div className="text-regular12 text-gray1">{chatRoomInfo?.members.length}명</div>
        </div>
      </div>
      <div className="flex items-center gap-[20px]">
        <button type="button">
          <SearchIcon2 />
        </button>
        <button type="button">
          <MenuIcon />
        </button>
      </div>
    </header>
  );
}

export default ChatRoomHeader;
