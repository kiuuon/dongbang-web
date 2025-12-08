import Image from 'next/image';
import { useRouter } from 'next/router';
import { useQuery } from '@tanstack/react-query';

import { fetchMyChatRooms } from '@/lib/apis/chats';
import { formatChatTime, handleQueryError } from '@/lib/utils';
import { ERROR_MESSAGE } from '@/lib/constants';
import { ChatRoomType } from '@/types/chat-room-type';
import Header from '@/components/layout/header';
import BackButton from '@/components/common/back-button';

function ChatsPage() {
  const router = useRouter();

  const { data: chatRooms } = useQuery({
    queryKey: ['chatRooms'],
    queryFn: fetchMyChatRooms,
    throwOnError: (error) => handleQueryError(error, ERROR_MESSAGE.CHATS.FETCH_FAILED),
  });

  return (
    <div className="flex h-screen flex-col gap-[8px] px-[20px] pt-[83px]">
      <Header>
        <div className="flex flex-row items-center gap-[10px]">
          <BackButton />
          <div className="text-bold16">채팅</div>
        </div>
      </Header>

      {chatRooms?.map((chatRoom: ChatRoomType) => (
        <button
          type="button"
          key={chatRoom.chat_room_id}
          className="flex items-center gap-[16px] rounded-[12px] py-[16px] pl-[20px] pr-[13px] shadow-[0_1px_24px_0_rgba(0,0,0,0.08)]"
          onClick={() => {
            if (window.ReactNativeWebView) {
              window.ReactNativeWebView.postMessage(
                JSON.stringify({ type: 'event', action: 'go to chat room page', payload: chatRoom.chat_room_id }),
              );
            } else {
              router.push(`/chats/${chatRoom.chat_room_id}`);
            }
          }}
        >
          <Image
            src={chatRoom.club_logo}
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
          <div className="flex w-full min-w-0 flex-col gap-[3px]">
            <div className="text-bold14 h-[17px] truncate text-start">{chatRoom.chat_room_name}</div>
            {chatRoom.latest_message_content ? (
              <div className="text-regular12 h-[14px] truncate text-start text-gray3">
                {chatRoom.latest_message_content}
              </div>
            ) : (
              <div className="h-[14px] w-full" />
            )}
          </div>
          <div className="flex h-full flex-col items-center justify-start gap-[4px]">
            {chatRoom.latest_message_created_at && (
              <div className="text-regular10 whitespace-nowrap text-gray1">
                {formatChatTime(chatRoom.latest_message_created_at)}
              </div>
            )}
            {chatRoom.unread_count > 0 && (
              <div className="text-regular12 flex h-[16px] min-w-[16px] items-center justify-center rounded-full bg-error px-[5px] py-[1px] text-white">
                {chatRoom.unread_count > 99 ? '99+' : chatRoom.unread_count}
              </div>
            )}
          </div>
        </button>
      ))}
    </div>
  );
}

export default ChatsPage;
