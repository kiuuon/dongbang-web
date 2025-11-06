import { supabase } from './supabaseClient';
import { fetchUserId } from './auth';

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
