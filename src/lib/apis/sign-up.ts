import { UserType } from '@/types/user-type';
import { supabase } from './supabaseClient';

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
  const { error } = await supabase.rpc('sign_up_user', {
    p_id: body.id,
    p_name: body.name,
    p_gender: body.gender,
    p_nickname: body.nickname,
    p_university_id: body.university_id,
    p_major: body.major,
    p_term_of_use: body.term_of_use,
    p_privacy_policy: body.privacy_policy,
    p_third_party_consent: body.third_party_consent,
    p_marketing: body.marketing,
    p_avatar: body.avatar ?? null,
  });

  if (error) {
    throw error;
  }
}

export async function editProfile(body: UserType) {
  const { error } = await supabase.rpc('edit_user_profile', {
    p_id: body.id,
    p_name: body.name,
    p_gender: body.gender,
    p_nickname: body.nickname,
    p_university_id: body.university_id,
    p_major: body.major,
    p_avatar: body.avatar ?? null,
  });

  if (error) {
    throw error;
  }
}
