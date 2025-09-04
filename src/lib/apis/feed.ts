import { FeedType } from '@/types/feed-type';
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

  const { error } = await supabase.rpc('write_feed_transaction', {
    photos,
    title,
    content,
    is_nickname_visible: isNicknameVisible,
    is_private: isPrivate,
    club_id: clubId,
    club_type: clubType,
    author_id: userId,
    selected_members: selectedMembers,
    selected_clubs: selectedClubs,
  });

  if (error) {
    throw error;
  }
}

export async function fetchFeedsByClubType(clubType: 'my' | 'campus' | 'union', page: number) {
  const PAGE_SIZE = 5;
  const start = page * PAGE_SIZE;
  const end = start + PAGE_SIZE - 1;

  if (clubType === 'my') {
    const userId = await fetchUserId();

    const { data: feeds, error } = await supabase.rpc('fetch_my_feeds_transaction', {
      p_user_id: userId,
      p_limit: PAGE_SIZE,
      p_offset: page * PAGE_SIZE,
    }).select(`
      *,
      author:User(name, avatar),
      club:Club(name, logo),
      taggedUsers:Feed_User(user:User(name, avatar)),
      taggedClubs:Feed_Club(club:Club(name, logo))
    `);

    if (error) {
      throw error;
    }

    if (!feeds) {
      return [];
    }

    // 작성자의 role 붙이기
    const feedsWithRole = await Promise.all(
      feeds.map(async (feed: FeedType) => {
        const { data: clubUser, error: fetchRoleError } = await supabase
          .from('Club_User')
          .select('role')
          .eq('user_id', feed.author_id)
          .eq('club_id', feed.club_id)
          .maybeSingle();

        if (fetchRoleError) {
          throw fetchRoleError;
        }

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
    const { data: feeds, error: fetchFeedError } = await supabase
      .from('Feed')
      .select(
        '*, author:User(name, avatar), club:Club(name, logo), taggedUsers:Feed_User(user:User(name, avatar)), taggedClubs:Feed_Club(club:Club(name, logo))',
      )
      .eq('club_type', clubType)
      .order('created_at', { ascending: false })
      .range(start, end);

    if (fetchFeedError) {
      throw fetchFeedError;
    }

    if (!feeds) {
      return [];
    }

    const feedsWithRole = await Promise.all(
      feeds.map(async (feed) => {
        const { data: clubUser, error: fetchRoleError } = await supabase
          .from('Club_User')
          .select('role')
          .eq('user_id', feed.author_id)
          .eq('club_id', feed.club_id)
          .maybeSingle();

        if (fetchRoleError) {
          throw fetchRoleError;
        }

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

export async function fetchFeedDetail(feedId: string) {
  const { data: feed, error } = await supabase
    .from('Feed')
    .select(
      `
      *,
      author:User(name, avatar),
      club:Club(name, logo),
      taggedUsers:Feed_User(user:User(name, avatar)),
      taggedClubs:Feed_Club(club:Club(name, logo))
    `,
    )
    .eq('id', feedId)
    .single();

  if (error) {
    throw error;
  }

  const { data: clubUser, error: fetchRoleError } = await supabase
    .from('Club_User')
    .select('role')
    .eq('user_id', feed.author_id)
    .eq('club_id', feed.club_id)
    .maybeSingle();

  if (fetchRoleError) {
    throw fetchRoleError;
  }

  return {
    ...feed,
    author: {
      ...feed.author,
      role: clubUser?.role ?? null,
    },
  };
}

export async function searchFeeds(keyword: string, page: number) {
  const PAGE_SIZE = 10;

  const { data, error } = await supabase.rpc('search_feeds_by_keyword', {
    p_keyword: keyword ?? '',
    p_limit: PAGE_SIZE,
    p_offset: page * PAGE_SIZE,
  }).select(`
      *,
      author:User(name, avatar),
      club:Club(name, logo),
      taggedUsers:Feed_User(user:User(name, avatar)),
      taggedClubs:Feed_Club(club:Club(name, logo))
    `);

  if (error) {
    throw error;
  }

  return data;
}

export async function fetchHashtags(keyword: string, page: number) {
  if (!keyword.trim()) {
    return []; // 빈 문자열이면 바로 빈 배열 반환
  }

  const PAGE_SIZE = 20;
  const start = page * PAGE_SIZE;
  const end = start + PAGE_SIZE - 1;

  const { data, error } = await supabase
    .from('Hashtag')
    .select('id, name')
    .ilike('name', `%${keyword ?? ''}%`)
    .order('name', { ascending: true })
    .range(start, end);

  if (error) throw error;

  return data;
}
