import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { fetchMyRole } from '@/lib/apis/club/club';
import { activateChatRoom, deactivateChatRoom } from '@/lib/apis/chats';
import { handleMutationError, handleQueryError } from '@/lib/utils';
import { ERROR_MESSAGE } from '@/lib/constants';
import { getRole, hasPermission } from '@/lib/club/service';
import useChatPageValidation from '@/hooks/useChatPageValidation';
import ToggleIcon2 from '@/icons/toggle-icon2';
import Header from '@/components/layout/header';
import BackButton from '@/components/common/back-button';
import UserAvatar from '@/components/common/user-avatar';

function ChatRoomMenu() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { chatRoomId } = router.query as { chatRoomId: string };

  const [expanded, setExpanded] = useState(false);
  const [isChatRoomActive, setIsChatRoomActive] = useState(true);

  const { isValid, chatRoomInfo, ErrorComponent } = useChatPageValidation();

  const { data: myRole } = useQuery({
    queryKey: ['myRole', chatRoomInfo?.club?.id],
    queryFn: () => fetchMyRole(chatRoomInfo?.club?.id),
    enabled: !!chatRoomInfo,
    throwOnError: (error) => handleQueryError(error, ERROR_MESSAGE.USER.ROLE_FETCH_FAILED),
  });

  const { mutate: handleDeactivateChatRoom } = useMutation({
    mutationFn: () => deactivateChatRoom(chatRoomId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chatRoomInfo', chatRoomId] });
    },
    onError: (error) => handleMutationError(error, ERROR_MESSAGE.CHATS.DEACTIVATE_ROOM_FAILED),
  });

  const { mutate: handleActivateChatRoom } = useMutation({
    mutationFn: () => activateChatRoom(chatRoomId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chatRoomInfo', chatRoomId] });
    },
    onError: (error) => handleQueryError(error, ERROR_MESSAGE.CHATS.ACTIVATE_ROOM_FAILED),
  });

  useEffect(() => {
    setIsChatRoomActive(chatRoomInfo?.is_active);
  }, [chatRoomInfo]);

  if (!isValid) {
    return ErrorComponent;
  }

  return (
    <div className="min-h-screen px-[20px] pb-[47px] pt-[83px]">
      <Header>
        <BackButton />
      </Header>
      <button
        type="button"
        className="flex w-full flex-col items-center gap-[13px]"
        onClick={() => {
          if (window.ReactNativeWebView) {
            window.ReactNativeWebView.postMessage(
              JSON.stringify({ type: 'event', action: 'go to club detail', payload: chatRoomInfo?.club?.id }),
            );
            return;
          }
          router.push(`/club/${chatRoomInfo?.club?.id}`);
        }}
      >
        <Image
          src={chatRoomInfo?.club?.logo}
          alt="club logo"
          width={80}
          height={80}
          style={{
            objectFit: 'cover',
            borderRadius: '16px',
            width: '80px',
            height: '80px',
            minWidth: '80px',
            minHeight: '80px',
          }}
        />
        <div className="text-bold20">{chatRoomInfo?.club?.name}</div>
      </button>

      <div className="mt-[20px] flex flex-col gap-[10px]">
        <div className="text-bold16">채팅방 멤버</div>
        <div className="flex flex-col gap-[16px] rounded-[8px] bg-white px-[27px] py-[16px] shadow-[0px_1px_24px_0px_rgba(0,0,0,0.08)]">
          {chatRoomInfo?.members
            .sort(
              (
                a: { role: 'president' | 'officer' | 'member' | 'on_leave' | 'graduate' },
                b: { role: 'president' | 'officer' | 'member' | 'on_leave' | 'graduate' },
              ) => {
                const roleOrder = { president: 1, officer: 2, member: 3, on_leave: 4, graduate: 5 };
                return (roleOrder[a.role] || 99) - (roleOrder[b.role] || 99);
              },
            )
            .slice(0, expanded ? chatRoomInfo?.members.length : 5)
            .map(
              (member: {
                id: string;
                name: string;
                nickname: string;
                avatar: string;
                role: 'president' | 'officer' | 'member' | 'on_leave' | 'graduate';
                club_nickname: string;
              }) => (
                <button
                  type="button"
                  key={member.id}
                  className="flex items-center gap-[12px]"
                  onClick={() => {
                    if (window.ReactNativeWebView) {
                      window.ReactNativeWebView.postMessage(
                        JSON.stringify({ type: 'event', action: 'go to profile page', payload: member.nickname }),
                      );
                      return;
                    }
                    router.push(`/profile/${member.nickname}`);
                  }}
                >
                  <UserAvatar avatar={member.avatar} size={32} />
                  <div className="flex flex-col items-start gap-[2px]">
                    <div className="text-bold16 h-[17px]">{member.club_nickname}</div>
                    <div className="text-regular12 h-[14px] text-gray2">{getRole(member.role)}</div>
                  </div>
                </button>
              ),
            )}
          {chatRoomInfo?.members.length > 5 && (
            <button type="button" className="text-bold16" onClick={() => setExpanded(!expanded)}>
              {expanded ? '접기' : '멤버 전체 보기'}
            </button>
          )}
        </div>
      </div>

      {hasPermission(myRole, 'manage_chat_room') && (
        <div className="mt-[20px] flex items-center gap-[8px]">
          <div className="text-bold16">채팅방 비활성화</div>
          <button
            type="button"
            onClick={() => {
              if (isChatRoomActive) {
                handleDeactivateChatRoom();
              } else {
                handleActivateChatRoom();
              }
            }}
          >
            <ToggleIcon2 active={!isChatRoomActive} />
          </button>
        </div>
      )}
    </div>
  );
}

export default ChatRoomMenu;
