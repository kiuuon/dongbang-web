import { supabase } from './supabaseClient';

export async function login(provider: 'kakao' | 'google') {
  await supabase.auth.signInWithOAuth({
    provider,
  });
}

export async function fetchSession() {
  const { data } = await supabase.auth.getSession();

  return data.session;
}

export async function logout() {
  await supabase.auth.signOut();
}
