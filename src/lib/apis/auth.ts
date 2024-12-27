import { supabase } from './supabaseClient';

export async function login() {
  await supabase.auth.signInWithOAuth({
    provider: 'kakao',
  });
}

export async function fetchSession() {
  const { data } = await supabase.auth.getSession();

  return data.session;
}

export async function logout() {
  await supabase.auth.signOut();
}
