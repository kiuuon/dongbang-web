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

export async function fetchUserById(userId: string) {
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
