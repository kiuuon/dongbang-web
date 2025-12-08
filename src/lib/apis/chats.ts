import { supabase } from './supabaseClient';

export async function fetchMyChatRooms() {
  const { data, error } = await supabase.rpc('get_my_chat_rooms');

  if (error) throw error;

  return data;
}

export async function fetchChatRoomInfo(chatRoomId: string) {
  const { data, error } = await supabase.rpc('get_chat_room_info', {
    p_chat_room_id: chatRoomId,
  });

  if (error) throw error;

  return data;
}

export async function getChatRoomIdByClubId(clubId: string) {
  const { data, error } = await supabase.rpc('get_chat_room_id_by_club_id', {
    p_club_id: clubId,
  });

  if (error) throw error;

  return data;
}

export async function fetchChatMessages(
  chatRoomId: string,
  pageParam: { cursor: string | null; direction: 'initial' | 'past' | 'future' },
) {
  const PAGE_SIZE_TOTAL = 20;

  const { cursor, direction } = pageParam;

  // 초기 로드 (Last Read Message 기준 Centering)
  if (direction === 'initial') {
    const { data, error } = await supabase.rpc('fetch_chat_messages', {
      p_chat_room_id: chatRoomId,
      p_limit: PAGE_SIZE_TOTAL,
    });
    if (error) throw error;
    // RPC에서 이미 오름차순(ASC)으로 정렬되어 반환됩니다.
    return data;
  }

  // 과거 로드 (Scroll Up) -> Previous Page
  if (direction === 'past') {
    const { data, error } = await supabase.rpc('fetch_chat_messages_bidirectional', {
      p_chat_room_id: chatRoomId,
      p_limit: PAGE_SIZE_TOTAL,
      p_cursor: cursor, // 가장 오래된 메시지의 created_at
      p_direction: 'past',
    });
    if (error) throw error;
    // DB에서 DESC로 가져왔으므로, 배열 순서 유지를 위해 다시 reverse
    return data.reverse();
  }

  // 최신 로드 (Scroll Down) -> Next Page
  if (direction === 'future') {
    const { data, error } = await supabase.rpc('fetch_chat_messages_bidirectional', {
      p_chat_room_id: chatRoomId,
      p_limit: PAGE_SIZE_TOTAL,
      p_cursor: cursor, // 가장 최신 메시지의 created_at
      p_direction: 'future',
    });
    if (error) throw error;
    // DB에서 ASC로 가져왔으므로, 그대로 사용
    return data;
  }

  return [];
}

export async function deactivateChatRoom(chatRoomId: string) {
  const { error } = await supabase.rpc('deactivate_chat_room', {
    p_chat_room_id: chatRoomId,
  });

  if (error) throw error;
}

export async function activateChatRoom(chatRoomId: string) {
  const { error } = await supabase.rpc('activate_chat_room', {
    p_chat_room_id: chatRoomId,
  });

  if (error) throw error;
}

export async function sendTextMessage(chatRoomId: string, content: string) {
  const { error } = await supabase.rpc('send_text_message', {
    p_chat_room_id: chatRoomId,
    p_content: content,
  });

  if (error) throw error;
}
