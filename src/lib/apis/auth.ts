import { supabase } from './supabaseClient';

export async function login(provider: 'kakao' | 'google' | 'apple') {
  await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: `${window.location.origin}/login/callback`,
    },
  });
}

export async function loginAndRedirect(provider: 'kakao' | 'google' | 'apple', redirectTo: string) {
  await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: `${window.location.origin}${redirectTo}`,
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

  if (!data?.user) return '';

  return data?.user?.id;
}

export async function logout() {
  const { error } = await supabase.auth.signOut();

  if (error) {
    throw error;
  }
}
