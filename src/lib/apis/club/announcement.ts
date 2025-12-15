import { supabase } from '../supabaseClient';

export async function fetchLatestAnnouncement(clubId: string) {
  const { data, error } = await supabase
    .from('club_announcement')
    .select('*')
    .eq('club_id', clubId)
    .is('deleted_at', null)
    .order('created_at', { ascending: false })
    .limit(1);

  if (error) throw error;

  return data ?? null;
}

export async function fetchAnnouncement(announcementId: string) {
  const { data, error } = await supabase
    .from('club_announcement')
    .select('*, author:User(id, name, nickname, avatar, role:Club_User(role))')
    .eq('id', announcementId)
    .is('deleted_at', null)
    .maybeSingle();

  if (error) throw error;

  return data ?? null;
}

export async function fetchAnnouncements(clubId: string, page: number) {
  const PAGE_SIZE = 15;
  const start = page * PAGE_SIZE;
  const end = start + PAGE_SIZE - 1;

  const { data, error } = await supabase
    .from('club_announcement')
    .select(
      `
      id,
      title,
      created_at,
      author:User(name)
    `,
    )
    .eq('club_id', clubId)
    .is('deleted_at', null)
    .order('created_at', { ascending: false })
    .range(start, end);

  if (error) throw error;

  return data;
}

export async function writeAnnouncement(photos: string[], title: string, content: string, clubId: string) {
  const { error } = await supabase.from('club_announcement').insert({
    club_id: clubId,
    title,
    content,
    photos,
  });

  if (error) throw error;
}

export async function editAnnouncement(announcementId: string, title: string, content: string, photos: string[]) {
  const { error } = await supabase.rpc('update_announcement', {
    p_announcement_id: announcementId,
    p_title: title,
    p_content: content,
    p_photos: photos,
  });

  if (error) throw error;
}

export async function deleteAnnouncement(announcementId: string) {
  const { error } = await supabase.rpc('delete_announcement', {
    p_announcement_id: announcementId,
  });

  if (error) throw error;
}
