import { supabase } from './supabaseClient';

export async function fetchAnnouncements() {
  const { data, error } = await supabase.from('announcement').select('*');

  if (error) throw error;

  return data;
}

export async function fetchAnnouncement(announcementId: string) {
  const { data, error } = await supabase.from('announcement').select('*').eq('id', announcementId).maybeSingle();

  if (error) throw error;

  return data;
}
