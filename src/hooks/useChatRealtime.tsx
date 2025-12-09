import { useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/apis/supabaseClient';
import { fetchMyChatRooms, updateLastReadAt } from '@/lib/apis/chats';
import { MessageType } from '@/types/message-type';

export function useChatRealtime(
  onNotification: (
    message: MessageType & { chat_room_name: string; club_logo: string; notification_enabled: boolean },
  ) => void,
) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const channelsRef = useRef<Map<string, any>>(new Map());

  // 내가 속한 채팅방 목록 가져오기
  const { data: chatRooms } = useQuery({
    queryKey: ['chatRooms'],
    queryFn: fetchMyChatRooms,
  });

  useEffect(() => {
    if (!chatRooms || chatRooms.length === 0) return;

    const currentChatRoomId = router.query.chatRoomId as string | undefined;

    // 각 채팅방에 대해 구독
    chatRooms.forEach((chatRoom: { chat_room_id: string }) => {
      const chatRoomId = chatRoom.chat_room_id;

      // 이미 구독 중이면 스킵
      if (channelsRef.current.has(chatRoomId)) return;

      const channel = supabase
        .channel(`chat_room_${chatRoomId}`)
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'chat_message',
            filter: `chat_room_id=eq.${chatRoomId}`,
          },
          async (payload) => {
            const newMessage = payload.new as any;

            // 현재 사용자 ID 가져오기
            const {
              data: { user },
            } = await supabase.auth.getUser();
            const currentUserId = user?.id;

            // sender 정보 가져오기
            const { data: senderData } = await supabase
              .from('User')
              .select('id, name, nickname, avatar')
              .eq('id', newMessage.sender_id)
              .single();

            // club_nickname 가져오기
            const { data: chatRoomData } = await supabase
              .from('chat_room')
              .select('club_id, name')
              .eq('id', chatRoomId)
              .single();

            let clubNickname = '';
            let clubLogo = '';
            let notificationEnabled = true;
            if (chatRoomData) {
              const { data: clubUserData } = await supabase
                .from('Club_User')
                .select('club_nickname')
                .eq('club_id', chatRoomData.club_id)
                .eq('user_id', newMessage.sender_id)
                .is('deleted_at', null)
                .maybeSingle();

              clubNickname = clubUserData?.club_nickname || '';

              // club 정보 가져오기
              const { data: clubData } = await supabase
                .from('Club')
                .select('logo, name')
                .eq('id', chatRoomData?.club_id)
                .single();

              clubLogo = clubData?.logo || '';

              const { data: userNotificationData } = await supabase
                .from('chat_room_member')
                .select('notification_enabled')
                .eq('chat_room_id', chatRoomId)
                .eq('user_id', currentUserId)
                .is('left_at', null)
                .maybeSingle();

              notificationEnabled = userNotificationData?.notification_enabled ?? true;
            }

            // 메시지 객체 생성
            const message: MessageType = {
              ...newMessage,
              sender: senderData
                ? {
                    id: senderData.id,
                    name: senderData.name,
                    nickname: senderData.nickname,
                    avatar: senderData.avatar,
                    club_nickname: clubNickname,
                  }
                : undefined,
              isMine: newMessage.sender_id === currentUserId,
              is_unread: currentChatRoomId !== chatRoomId, // 현재 채팅방이면 false
            };

            // 현재 채팅방이 아니면 알림 표시
            if (currentChatRoomId !== chatRoomId) {
              onNotification({
                ...message,
                chat_room_name: chatRoomData?.name,
                club_logo: clubLogo,
                notification_enabled: notificationEnabled,
              });
              queryClient.invalidateQueries({ queryKey: ['chatRooms'] });
            } else {
              // 현재 채팅방이면 React Query 캐시에 추가
              queryClient.setQueryData(['chatMessages', chatRoomId], (oldData: any) => {
                if (!oldData) return oldData;

                const lastPage = oldData.pages[oldData.pages.length - 1];
                const newLastPage = [...lastPage, message];

                return {
                  ...oldData,
                  pages: [...oldData.pages.slice(0, -1), newLastPage],
                };
              });

              // 현재 채팅방에 있을 때 last_read_at 갱신
              updateLastReadAt(chatRoomId);
            }
          },
        )
        .subscribe();

      channelsRef.current.set(chatRoomId, channel);
    });

    // cleanup: 구독 해제
    // eslint-disable-next-line consistent-return
    return () => {
      channelsRef.current.forEach((channel) => {
        channel.unsubscribe();
      });
      // eslint-disable-next-line react-hooks/exhaustive-deps
      channelsRef.current.clear();
    };
  }, [chatRooms, router.query.chatRoomId, onNotification, queryClient]);
}
