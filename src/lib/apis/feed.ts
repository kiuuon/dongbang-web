import { supabase } from './supabaseClient';
import { fetchUserId } from './auth';

export async function writeFeed(
  photos: string[],
  title: string,
  content: string,
  isNicknameVisible: boolean,
  isPrivate: boolean,
  clubId: string,
  clubType: 'campus' | 'union',
  selectedMembers: string[],
  selectedClubs: string[],
) {
  const userId = await fetchUserId();

  const { data: feedData } = await supabase
    .from('Feed')
    .insert({
      photos,
      title,
      content,
      is_nickname_visible: isNicknameVisible,
      is_private: isPrivate,
      club_id: clubId,
      club_type: clubType,
      author_id: userId,
    })
    .select('id')
    .single();

  if (!feedData) {
    throw new Error('Failed to create feed');
  }

  await supabase.from('Feed_User').insert(
    selectedMembers.map((memberId) => ({
      feed_id: feedData.id,
      user_id: memberId,
    })),
  );

  await supabase.from('Feed_Club').insert(
    selectedClubs.map((selectedClubId) => ({
      feed_id: feedData.id,
      club_id: selectedClubId,
    })),
  );
}

export async function fetchFeedsByClubType(clubType: 'my' | 'campus' | 'union', page: number) {
  const PAGE_SIZE = 5;
  const start = page * PAGE_SIZE;
  const end = start + PAGE_SIZE - 1;

  if (clubType === 'my') {
    const userId = await fetchUserId();
    const { data: clubData } = await supabase.from('Club_User').select('club_id').eq('user_id', userId);

    if (!clubData || clubData.length === 0) {
      return null;
    }

    const clubIds = clubData.map((club) => club.club_id);

    const { data: feeds } = await supabase
      .from('Feed')
      .select('*, author:User(name, avatar), club:Club(name, logo)')
      .in('club_id', clubIds)
      .order('created_at', { ascending: false })
      .range(start, end);

    if (!feeds) {
      return [];
    }

    const feedsWithRole = await Promise.all(
      feeds.map(async (feed) => {
        const { data: clubUser } = await supabase
          .from('Club_User')
          .select('role')
          .eq('user_id', feed.author_id)
          .eq('club_id', feed.club_id)
          .single();

        return {
          ...feed,
          author: {
            ...feed.author,
            role: clubUser?.role ?? null,
          },
        };
      }),
    );

    return feedsWithRole;
  }

  if (clubType === 'union' || clubType === 'campus') {
    const { data: feeds } = await supabase
      .from('Feed')
      .select('*, author:User(name, avatar), club:Club(name, logo)')
      .eq('club_type', clubType)
      .order('created_at', { ascending: false })
      .range(start, end);

    if (!feeds) {
      return [];
    }

    const feedsWithRole = await Promise.all(
      feeds.map(async (feed) => {
        const { data: clubUser } = await supabase
          .from('Club_User')
          .select('role')
          .eq('user_id', feed.author_id)
          .eq('club_id', feed.club_id)
          .single();

        return {
          ...feed,
          author: {
            ...feed.author,
            role: clubUser?.role ?? null,
          },
        };
      }),
    );

    return feedsWithRole;
  }

  return [];
}
