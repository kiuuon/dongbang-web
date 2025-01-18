import { supabase } from './supabaseClient';

export async function fetchUser(userId: string) {
  const { data } = await supabase.from('User').select('*').eq('id', userId);

  return data;
}
