import { UserType } from '@/types/user-type';
import { supabase } from './supabaseClient';
import { fetchUserId } from './auth';

export async function isNicknameExists(nickname: string) {
  const { data, error } = await supabase.from('User').select('id').eq('nickname', nickname);

  if (error) {
    throw error;
  }

  return (data?.length as number) > 0;
}

export async function fetchUniversityList() {
  const { data, error } = await supabase.from('University').select('*');

  if (error) {
    throw error;
  }

  return data;
}

export async function signUp(body: UserType) {
  const { error } = await supabase.from('User').insert([body]);

  if (error) {
    throw error;
  }
}

export async function editProfile(body: UserType) {
  const userId = await fetchUserId();

  const { error } = await supabase.from('User').update([body]).eq('id', userId);

  if (error) {
    throw error;
  }
}
