import { supabase } from './supabaseClient';

export async function login(provider: 'kakao' | 'google') {
  await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: `${window.location.origin}/login/callback`,
    },
  });
}

export async function fetchSession() {
  const { data, error } = await supabase.auth.getUser();

  if (error && error.status !== 400) {
    throw error;
  }

  return data;
}

export async function fetchUserId() {
  const { data, error } = await supabase.auth.getUser();

  if (error && error.status !== 400) {
    throw error;
  }

  return data?.user?.id;
}

export async function logout() {
  await supabase.auth.signOut();
}
