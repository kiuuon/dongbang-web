import { supabase } from './supabaseClient';
import { fetchUserId } from './auth';
import { sortMentionUsers } from '../comment/service';

export async function fetchUser() {
  const userId = await fetchUserId();

  const { data } = await supabase.from('User').select('*, University(name)').eq('id', userId);

  if (!data) {
    return null;
  }

  if (data.length === 0) {
    return null;
  }

  return data[0];
}

export async function fetchUserByNickname(nickname: string, showUniversity: boolean) {
  if (!showUniversity) {
    const { data } = await supabase.from('User').select('id, name, nickname, avatar').eq('nickname', nickname);

    if (!data) {
      return null;
    }

    if (data.length === 0) {
      return null;
    }

    return data[0];
  }

  const { data } = await supabase.from('User').select('*, University(name)').eq('nickname', nickname);

  if (!data) {
    return null;
  }

  if (data.length === 0) {
    return null;
  }

  return data[0];
}

export async function fetchUserListByMention(keyword: string) {
  if (!keyword.trim()) return [];

  const { data, error } = await supabase.rpc('search_mention_users', {
    p_keyword: keyword,
  });

  if (error) throw error;

  return sortMentionUsers(keyword, data).slice(0, 4);
}

export async function fetchUserListByNicknames(nicknames: string[]) {
  const { data, error } = await supabase.from('User').select('id, nickname, name').in('nickname', nicknames);

  if (error) throw error;

  return data;
}

export async function fetchUserProfileVisibility(userId: string) {
  const { data, error } = await supabase
    .from('user_profile_visibility')
    .select('show_university, show_clubs, show_feed')
    .eq('user_id', userId)
    .maybeSingle();

  if (error) throw error;

  return data;
}

export async function fetchUserProfileVisibilityByNickname(nickname: string) {
  const { data, error } = await supabase.rpc('get_user_profile_visibility_by_nickname', {
    p_nickname: nickname,
  });

  if (error) throw error;

  // RPC가 배열을 반환하므로 첫 번째 요소 반환 (없으면 null)
  return data?.[0] ?? null;
}

export async function updateUserProfileVisibility(body: {
  show_university: boolean;
  show_clubs: boolean;
  show_feed: boolean;
}) {
  const userId = await fetchUserId();

  const { error } = await supabase.from('user_profile_visibility').update(body).eq('user_id', userId);

  if (error) throw error;
}

export async function fetchBlockedUserList() {
  const userId = await fetchUserId();

  const { data, error } = await supabase
    .from('user_block')
    .select('*, blockedUser:User!User_Block_blocked_id_fkey(id, name, nickname, avatar)')
    .eq('blocker_id', userId);

  if (error) throw error;

  return data;
}

export async function blockUser(userId: string) {
  const { error } = await supabase.rpc('block_user', {
    p_blocked_id: userId,
  });

  if (error) throw error;
}

export async function unblockUser(userId: string) {
  const { error } = await supabase.rpc('unblock_user', {
    p_blocked_id: userId,
  });

  if (error) throw error;
}

export async function fetchBlockStatus(targetNickname: string) {
  const { data, error } = await supabase.rpc('check_block_status', {
    p_nickname: targetNickname,
  });

  if (error) throw error;

  return data;
}
