import { supabase } from './supabaseClient';
import { fetchUserId } from './auth';

export async function fetchUser() {
  const userId = await fetchUserId();

  const { data, error } = await supabase.from('User').select('*, University(name)').eq('id', userId);

  if (error) {
    throw error;
  }

  if (!data) {
    return null;
  }

  return data[0];
}
