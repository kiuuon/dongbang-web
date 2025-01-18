import { supabase } from './supabaseClient';

export async function login(provider: 'kakao' | 'google') {
  await supabase.auth.signInWithOAuth({
    provider,
  });
}

export async function fetchSession() {
  const { data } = await supabase.auth.getUser();

  return data;
}

export async function fetchUserId() {
  const { data } = await supabase.auth.getUser();

  return data?.user?.id;
}

export async function logout() {
  await supabase.auth.signOut();
}
