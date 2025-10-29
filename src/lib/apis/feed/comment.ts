import { fetchUserId } from '../auth';
import { supabase } from '../supabaseClient';

export async function fetchFeedCommentCount(feedId: string) {
  const { data, error } = await supabase.from('Feed').select('comment_count').eq('id', feedId).single();

  if (error) throw error;

  if (!data) return 0;

  return data.comment_count as number;
}

export async function fetchRootComment(feedId: string, page: number) {
  const PAGE_SIZE = 20;
  const start = page * PAGE_SIZE;
  const end = start + PAGE_SIZE - 1;

  const { data, error } = await supabase
    .from('Comment')
    .select(
      `
    id, feed_id, parent_id, author_id, content, like_count, reply_count, created_at,
    author:User!Comment_author_id_fkey(id, name, nickname, avatar)
  `,
    )
    .eq('feed_id', feedId)
    .is('parent_id', null)
    .order('created_at', { ascending: true })
    .range(start, end);

  if (error) throw error;

  return data.map((comment) => ({
    ...comment,
    author: comment.author?.[0] || comment.author,
  }));
}

export async function addRootComment(feedId: string, content: string) {
  const userId = await fetchUserId();

  const { error } = await supabase.from('Comment').insert({
    feed_id: feedId,
    parent_id: null,
    author_id: userId,
    content,
  });

  if (error) throw error;
}

export async function fetchReplyComment(feedId: string, parentId: string, page: number) {
  const PAGE_SIZE = 5;
  const start = page * PAGE_SIZE;
  const end = start + PAGE_SIZE - 1;

  const { data, error } = await supabase
    .from('Comment')
    .select(
      `
    id, feed_id, parent_id, author_id, content, like_count, reply_count, created_at,
    author:User!Comment_author_id_fkey(id, name, nickname, avatar)
  `,
    )
    .eq('feed_id', feedId)
    .eq('parent_id', parentId)
    .order('created_at', { ascending: true })
    .range(start, end);

  if (error) throw error;

  return data.map((comment) => ({
    ...comment,
    author: comment.author?.[0] || comment.author,
  }));
}

export async function addReplyComment(feedId: string, parentId: string, content: string) {
  const userId = await fetchUserId();

  const { error } = await supabase.from('Comment').insert({
    feed_id: feedId,
    parent_id: parentId,
    author_id: userId,
    content,
  });

  if (error) throw error;
}

export async function deleteComment(commentId: string) {
  const { error } = await supabase.from('Comment').delete().eq('id', commentId);

  if (error) throw error;
}

export async function fetchCommentLikeCount(commentId: string) {
  const { data, error } = await supabase.from('Comment').select('like_count').eq('id', commentId).single();

  if (error) throw error;

  if (!data) return 0;

  return data.like_count as number;
}

export async function fetchMyCommentLike(commentId: string) {
  const userId = await fetchUserId();

  if (!userId) return false;

  const { data, error } = await supabase
    .from('Comment_Like')
    .select('*')
    .eq('comment_id', commentId)
    .eq('user_id', userId)
    .maybeSingle();

  if (error) throw error;

  return !!data;
}

export async function addCommentLike(commentId: string) {
  const userId = await fetchUserId();

  const { error } = await supabase.from('Comment_Like').insert({
    comment_id: commentId,
    user_id: userId,
  });

  if (error) throw error;
}

export async function removeCommentLike(commentId: string) {
  const userId = await fetchUserId();

  const { error } = await supabase.from('Comment_Like').delete().eq('comment_id', commentId).eq('user_id', userId);

  if (error) throw error;
}

type LikedUser = {
  id: string;
  name: string;
  avatar: string | null;
};

export async function fetchCommentLikedUsers(commentId: string): Promise<LikedUser[] | null> {
  const { data, error } = await supabase
    .from('Comment_Like')
    .select(
      `
      User!inner (
        id,
        name,
        avatar
      )
    `,
    )
    .eq('comment_id', commentId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  if (!data) return [];

  return data.flatMap((like) =>
    (Array.isArray(like.User) ? like.User : [like.User]).map((user) => ({
      id: user.id,
      name: user.name,
      avatar: user.avatar,
    })),
  );
}
