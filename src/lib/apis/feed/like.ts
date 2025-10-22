import { fetchUserId } from '../auth';
import { supabase } from '../supabaseClient';

export async function addFeedLike(feedId: string) {
  const userId = await fetchUserId();

  const { error } = await supabase.from('Feed_Like').insert({
    feed_id: feedId,
    user_id: userId,
  });

  if (error) throw error;
}

export async function removeFeedLike(feedId: string) {
  const userId = await fetchUserId();

  const { error } = await supabase.from('Feed_Like').delete().eq('feed_id', feedId).eq('user_id', userId);

  if (error) throw error;
}

export async function fetchFeedLikeCount(feedId: string) {
  const { data, error } = await supabase.from('Feed').select('like_count').eq('id', feedId).single();

  if (error) throw error;

  if (!data) return 0;

  return data.like_count as number;
}

export async function fetchMyFeedLike(feedId: string) {
  const userId = await fetchUserId();

  const { data, error } = await supabase
    .from('Feed_Like')
    .select('id')
    .eq('feed_id', feedId)
    .eq('user_id', userId)
    .maybeSingle();

  if (error) throw error;

  return !!data;
}

export async function fetchFeedLikedUsers(feedId: string) {
  const { data, error } = await supabase
    .from('Feed_Like')
    .select(
      `
      user_id,
      created_at,
      User (
        id,
        name,
        avatar
      )
    `,
    )
    .eq('feed_id', feedId)
    .order('created_at', { ascending: false });

  if (error) throw error;

  return data.map((like) => like.User);
}
