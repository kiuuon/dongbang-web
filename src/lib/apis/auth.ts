import { supabase } from './supabaseClient';

export async function login() {
  await supabase.auth.signInWithOAuth({
    provider: 'kakao',
  });
}

export async function fetchSession() {
  const { data } = await supabase.auth.getSession();
  if (!data) {
    return false;
  }

  return true;
}

export async function fetchUser() {
  const { data } = await supabase.auth.getUser();

  return data.user?.email;
}
