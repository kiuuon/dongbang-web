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

export async function fetchUserById(userId: string, showUniversity: boolean) {
  if (!showUniversity) {
    const { data } = await supabase.from('User').select('id, name, nickname, avatar').eq('id', userId);

    if (!data) {
      return null;
    }

    if (data.length === 0) {
      return null;
    }

    return data[0];
  }

  const { data } = await supabase.from('User').select('*, University(name)').eq('id', userId);

  if (!data) {
    return null;
  }

  if (data.length === 0) {
    return null;
  }

  return data[0];
}

export async function fetchUserListByMention(keyword: string) {
  const { data, error } = await supabase
    .from('User')
    .select('avatar, nickname, name')
    .or(`nickname.ilike.%${keyword}%,name.ilike.%${keyword}%`);

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

export async function updateUserProfileVisibility(body: {
  show_university: boolean;
  show_clubs: boolean;
  show_feed: boolean;
}) {
  const userId = await fetchUserId();

  const { error } = await supabase.from('user_profile_visibility').update(body).eq('user_id', userId);

  if (error) throw error;
}
