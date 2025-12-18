import { fetchUserId } from '../auth';
import { supabase } from '../supabaseClient';

export async function toggleFeedLike(feedId: string) {
  const { error } = await supabase.rpc('toggle_feed_like', {
    p_feed_id: feedId,
  });

  if (error) {
    throw error;
  }
}

export async function fetchFeedLikeCount(feedId: string) {
  const { data, error } = await supabase.from('Feed').select('like_count').eq('id', feedId).single();

  if (error) throw error;

  if (!data) return 0;

  return data.like_count as number;
}

export async function fetchMyFeedLike(feedId: string) {
  const userId = await fetchUserId();

  if (!userId) return false;

  const { data, error } = await supabase
    .from('Feed_Like')
    .select('id')
    .eq('feed_id', feedId)
    .eq('user_id', userId)
    .is('deleted_at', null)
    .maybeSingle();

  if (error) throw error;

  return !!data;
}

type LikedUser = {
  id: string;
  name: string;
  avatar: string | null;
  nickname: string;
  deleted_at: string | null;
};

export async function fetchFeedLikedUsers(feedId: string): Promise<LikedUser[] | null> {
  const { data, error } = await supabase
    .from('Feed_Like')
    .select(
      `
      User!inner (
        id,
        name,
        nickname,
        avatar,
        deleted_at
      )
    `,
    )
    .eq('feed_id', feedId)
    .is('deleted_at', null)
    .order('created_at', { ascending: false });

  if (error) throw error;
  if (!data) return [];

  return data.flatMap((like) =>
    (Array.isArray(like.User) ? like.User : [like.User]).map((user) => ({
      id: user.id,
      name: user.name,
      avatar: user.avatar,
      nickname: user.nickname,
      deleted_at: user.deleted_at,
    })),
  );
}
