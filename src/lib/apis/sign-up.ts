import { supabase } from './supabaseClient';

export async function isNicknameExists(nickname: string) {
  const { data } = await supabase.from('User').select('id').eq('nickname', nickname);

  return (data?.length as number) > 0;
}
