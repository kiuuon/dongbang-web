import { fetchUserId } from './auth';
import { supabase } from './supabaseClient';

export async function checkUnreadNotifications() {
  const userId = await fetchUserId();

  if (!userId) {
    return false;
  }

  const { data, error } = await supabase
    .from('notification')
    .select('id')
    .eq('recipient_id', userId)
    .is('deleted_at', null)
    .is('read_at', null)
    .limit(1)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return !!data;
}

export async function fetchNotifications(page: number) {
  const PAGE_SIZE = 20;
  const start = page * PAGE_SIZE;
  const end = start + PAGE_SIZE - 1;

  const { data, error } = await supabase
    .from('notification')
    .select('*')
    .order('created_at', { ascending: false })
    .range(start, end);

  if (error) throw error;

  return data;
}

export async function markAllNotificationsAsRead() {
  const { error } = await supabase.rpc('mark_all_notifications_as_read');

  if (error) throw error;
}

export async function fetchNotificationSettings(userId: string) {
  const { data, error } = await supabase
    .from('user_notification_settings')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle();

  if (error) throw error;

  return data;
}

export async function updateNotificationSettings(
  userId: string,
  commentNotification: boolean,
  likeNotification: boolean,
  mentionNotification: boolean,
  newsNotification: boolean,
) {
  const { error } = await supabase
    .from('user_notification_settings')
    .update({
      comment_notification: commentNotification,
      like_notification: likeNotification,
      mention_notification: mentionNotification,
      news_notification: newsNotification,
    })
    .eq('user_id', userId);

  if (error) throw error;
}
