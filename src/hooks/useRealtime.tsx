import { useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/apis/supabaseClient';

import { fetchSession } from '@/lib/apis/auth';
import { fetchMyChatRooms, updateLastReadAt } from '@/lib/apis/chats';
import { handleQueryError } from '@/lib/utils';
import { ERROR_MESSAGE } from '@/lib/constants';
import { MessageType } from '@/types/message-type';

export function useRealtime(
  onNotification: (
    message: MessageType & { chat_room_name: string; club_logo: string; notification_enabled: boolean },
  ) => void,
) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const chatRoomChannelsRef = useRef<Map<string, any>>(new Map());
  const notificationChannelsRef = useRef<any>(null);

  const currentChatRoomIdRef = useRef<string | undefined>(undefined);
  const currentPathRef = useRef<string | undefined>(undefined);

  useEffect(() => {
    currentChatRoomIdRef.current = router.query.chatRoomId as string | undefined;
    currentPathRef.current = router.pathname;
  }, [router.query.chatRoomId, router.pathname]);

  const { data: session } = useQuery({
    queryKey: ['session'],
    queryFn: fetchSession,
    throwOnError: (error) => handleQueryError(error, ERROR_MESSAGE.SESSION.FETCH_FAILED),
  });

  // 내가 속한 채팅방 목록 가져오기
  const { data: chatRooms } = useQuery({
    queryKey: ['chatRooms'],
    queryFn: fetchMyChatRooms,
    enabled: !!session?.user,
    throwOnError: (error) => handleQueryError(error, ERROR_MESSAGE.CHATS.FETCH_FAILED),
  });

  useEffect(() => {
    if (!chatRooms || chatRooms.length === 0) return;

    // 각 채팅방에 대해 구독
    chatRooms.forEach((chatRoom: { chat_room_id: string }) => {
      const chatRoomId = chatRoom.chat_room_id;

      // 이미 구독 중이면 스킵
      if (chatRoomChannelsRef.current.has(chatRoomId)) return;

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

            if (newMessage.sender_id === currentUserId && newMessage.message_type === 'text') {
              return;
            }

            // sender 정보 가져오기
            const { data: senderData } = await supabase
              .from('User')
              .select('id, name, nickname, avatar, deleted_at')
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
                    deleted_at: senderData.deleted_at,
                    club_nickname: clubNickname,
                  }
                : undefined,
              isMine: newMessage.sender_id === currentUserId,
              is_unread: currentChatRoomIdRef.current !== chatRoomId, // 현재 채팅방이면 false
            };

            // 현재 채팅방이 아니면 알림 표시
            if (currentChatRoomIdRef.current !== chatRoomId) {
              onNotification({
                ...message,
                chat_room_name: chatRoomData?.name,
                club_logo: clubLogo,
                notification_enabled: notificationEnabled,
              });
              queryClient.invalidateQueries({ queryKey: ['chatRooms'] });
              queryClient.invalidateQueries({ queryKey: ['chatRoomInfo', chatRoomId] });
            } else {
              // 채팅 페이지가 처리할 수 있도록 전역 이벤트 발행
              window.dispatchEvent(
                new CustomEvent('chat:new-message', {
                  detail: { message },
                }),
              );

              updateLastReadAt(chatRoomId);
            }
          },
        )
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: 'chat_message',
            filter: `chat_room_id=eq.${chatRoomId}`,
          },
          async (payload) => {
            const updatedMessage = payload.new as any;
            const oldMessage = payload.old as any;

            // unread_count가 업데이트된 경우
            if (updatedMessage.unread_count !== oldMessage.unread_count) {
              // 현재 채팅방이면 React Query 캐시에서 해당 메시지의 unread_count 업데이트
              if (currentChatRoomIdRef.current === chatRoomId) {
                queryClient.setQueryData(['chatMessages', chatRoomId], (oldData: any) => {
                  if (!oldData) return oldData;

                  // 모든 페이지에서 해당 메시지의 unread_count 업데이트
                  const updatedPages = oldData.pages.map((page: any[]) =>
                    page.map((msg: any) => {
                      if (msg.id === updatedMessage.id) {
                        return {
                          ...msg,
                          unread_count: updatedMessage.unread_count,
                        };
                      }
                      return msg;
                    }),
                  );

                  return {
                    ...oldData,
                    pages: updatedPages,
                  };
                });
              }
            }
          },
        )
        .subscribe();

      chatRoomChannelsRef.current.set(chatRoomId, channel);
    });

    const notificationChannel = supabase
      .channel('notification')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notification',
          filter: `recipient_id=eq.${session?.user?.id}`,
        },
        async () => {
          if (currentPathRef.current === '/notification') {
            queryClient.invalidateQueries({ queryKey: ['notifications'] });
          } else {
            queryClient.invalidateQueries({ queryKey: ['hasUnreadNotifications'] });
          }
        },
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'notification',
        },
        async () => {
          if (currentPathRef.current !== '/notification') {
            queryClient.invalidateQueries({ queryKey: ['hasUnreadNotifications'] });
          }
        },
      )
      .subscribe();

    notificationChannelsRef.current = notificationChannel;

    // cleanup: 구독 해제
    // eslint-disable-next-line consistent-return
    return () => {
      chatRoomChannelsRef.current.forEach((channel) => {
        channel.unsubscribe();
      });
      // eslint-disable-next-line react-hooks/exhaustive-deps
      chatRoomChannelsRef.current.clear();
    };
  }, [chatRooms, onNotification, queryClient, session?.user?.id]);
}
