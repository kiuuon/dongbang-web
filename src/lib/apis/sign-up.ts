import { supabase } from './supabaseClient';

export async function isNicknameExists(nickname: string) {
  const { data } = await supabase.from('User').select('id').eq('nickname', nickname);

  return (data?.length as number) > 0;
}

export async function fetchUniversityList() {
  const { data } = await supabase.from('University').select('*');

  return data;
}

export async function signUp(body: any) {
  await supabase.from('User').insert([body]);
}
