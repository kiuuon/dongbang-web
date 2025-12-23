import { FeedType } from '@/types/feed-type';
import { supabase } from '../supabaseClient';
import { fetchUserId } from '../auth';
import { fetchUser } from '../user';

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
  const { error } = await supabase.rpc('write_feed_transaction', {
    p_photos: photos,
    p_title: title,
    p_content: content,
    p_is_nickname_visible: isNicknameVisible,
    p_is_private: isPrivate,
    p_club_id: clubId,
    p_club_type: clubType,
    p_selected_members: selectedMembers,
    p_selected_clubs: selectedClubs,
  });

  if (error) throw error;
}

export async function editFeed(
  feedId: string,
  photos: string[],
  title: string,
  content: string,
  isNicknameVisible: boolean,
  isPrivate: boolean,
  selectedMembers: string[],
  selectedClubs: string[],
) {
  const { error } = await supabase.rpc('edit_feed_transaction', {
    p_feed_id: feedId,
    p_photos: photos,
    p_title: title,
    p_content: content,
    p_is_nickname_visible: isNicknameVisible,
    p_is_private: isPrivate,
    p_selected_members: selectedMembers,
    p_selected_clubs: selectedClubs,
  });

  if (error) throw error;
}

export async function deleteFeed(feedId: string) {
  const { error } = await supabase.rpc('delete_feed', { p_feed_id: feedId });

  if (error) throw error;
}

export async function fetchFeedsByClubType(clubType: 'my' | 'campus' | 'union' | 'all', page: number) {
  const PAGE_SIZE = 5;
  const start = page * PAGE_SIZE;
  const end = start + PAGE_SIZE - 1;

  if (clubType === 'my') {
    const userId = await fetchUserId();

    const { data: feeds, error } = await supabase
      .rpc('fetch_my_feeds_transaction', {
        p_user_id: userId,
        p_limit_count: PAGE_SIZE,
        p_offset_count: page * PAGE_SIZE,
      })
      .select(
        `
      *,
      author:User(id, name, nickname, avatar, deleted_at),
      club:Club(name, logo),
      taggedUsers:Feed_User(user:User(id, name, nickname, avatar, deleted_at)),
      taggedClubs:Feed_Club(club:Club(id, name, logo))
    `,
      )
      .is('Feed_User.deleted_at', null)
      .is('Feed_Club.deleted_at', null);

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
          .is('deleted_at', null)
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

  if (clubType === 'union') {
    const { data: feeds, error: fetchFeedError } = await supabase
      .from('Feed')
      .select(
        '*, author:User(id, name, nickname, avatar, deleted_at), club:Club(name, logo), taggedUsers:Feed_User(user:User(id, name, nickname, avatar, deleted_at)), taggedClubs:Feed_Club(club:Club(id, name, logo))',
      )
      .eq('club_type', clubType)
      .is('deleted_at', null)
      .is('Feed_User.deleted_at', null)
      .is('Feed_Club.deleted_at', null)
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
          .is('deleted_at', null)
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

  if (clubType === 'campus') {
    const userInfo = await fetchUser();
    const universityId = userInfo?.university_id;

    const { data: feeds, error: fetchFeedError } = await supabase
      .from('Feed')
      .select(
        '*, author:User(id, name, nickname, avatar, deleted_at), club:Club(name, logo), taggedUsers:Feed_User(user:User(id, name, nickname, avatar, deleted_at)), taggedClubs:Feed_Club(club:Club(id, name, logo))',
      )
      .eq('club_type', clubType)
      .eq('university_id', universityId)
      .is('deleted_at', null)
      .is('Feed_User.deleted_at', null)
      .is('Feed_Club.deleted_at', null)
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
          .is('deleted_at', null)
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

  const { data: feeds, error: fetchFeedError } = await supabase
    .from('Feed')
    .select(
      '*, author:User(id, name, nickname, avatar, deleted_at), club:Club(name, logo), taggedUsers:Feed_User(user:User(id, name, avatar, deleted_at)), taggedClubs:Feed_Club(club:Club(id, name, logo))',
    )
    .order('created_at', { ascending: false })
    .is('deleted_at', null)
    .is('Feed_User.deleted_at', null)
    .is('Feed_Club.deleted_at', null)
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
        .is('deleted_at', null)
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

export async function fetchFeedDetail(feedId: string) {
  const { data: feed, error } = await supabase
    .from('Feed')
    .select(
      `
      *,
      author:User(id, name, nickname, avatar, deleted_at),
      club:Club(name, logo),
      taggedUsers:Feed_User(user:User(id, name, nickname, avatar, deleted_at)),
      taggedClubs:Feed_Club(club:Club(id, name, logo))
    `,
    )
    .eq('id', feedId)
    .is('deleted_at', null)
    .is('Feed_User.deleted_at', null)
    .is('Feed_Club.deleted_at', null)
    .single();

  if (!feed) return null;

  if (error) {
    throw error;
  }

  const { data: clubUser, error: fetchRoleError } = await supabase
    .from('Club_User')
    .select('role')
    .eq('user_id', feed.author_id)
    .eq('club_id', feed.club_id)
    .is('deleted_at', null)
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

  const { data, error } = await supabase
    .rpc('search_feeds_by_keyword', {
      keyword: keyword ?? '',
      limit_count: PAGE_SIZE,
      offset_count: page * PAGE_SIZE,
    })
    .select(
      `
      *,
      author:User(id, name, nickname, avatar, deleted_at),
      club:Club(name, logo),
      taggedUsers:Feed_User(user:User(id, name, nickname, avatar, deleted_at)),
      taggedClubs:Feed_Club(club:Club(id, name, logo))
    `,
    )
    .is('Feed_User.deleted_at', null)
    .is('Feed_Club.deleted_at', null);

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

export async function fetchFeedsByAuthor(userId: string, page: number) {
  const PAGE_SIZE = 15;
  const start = page * PAGE_SIZE;
  const end = start + PAGE_SIZE - 1;

  const { data, error } = await supabase
    .from('Feed')
    .select(
      `
      *,
      author:User(id, name, nickname, avatar, deleted_at),
      club:Club(id, name, logo),
      taggedUsers:Feed_User(user:User(id, name, nickname, avatar, deleted_at)),
      taggedClubs:Feed_Club(club:Club(id, name, logo))
    `,
    )
    .eq('author_id', userId)
    .is('deleted_at', null)
    .is('Feed_User.deleted_at', null)
    .is('Feed_Club.deleted_at', null)
    .order('created_at', { ascending: false })
    .range(start, end);

  if (error) throw error;

  return data;
}

export async function fetchFeedsTaggedUser(userId: string, page: number) {
  const PAGE_SIZE = 15;
  const start = page * PAGE_SIZE;
  const end = start + PAGE_SIZE - 1;

  const { data, error } = await supabase
    .from('Feed')
    .select(
      `
      *,
      author:User(id, name, nickname, avatar, deleted_at),
      Feed_User!inner(user_id),
      club:Club(id, name, logo),
      taggedUsers:Feed_User(user:User(id, name, nickname, avatar, deleted_at)),
      taggedClubs:Feed_Club(club:Club(id, name, logo))
    `,
    )
    .eq('Feed_User.user_id', userId)
    .is('deleted_at', null)
    .is('Feed_User.deleted_at', null)
    .is('Feed_Club.deleted_at', null)
    .order('created_at', { ascending: false })
    .range(start, end);

  if (error) throw error;

  return data;
}

export async function fetchFeedsByClub(clubId: string, page: number) {
  const PAGE_SIZE = 15;

  const { data, error } = await supabase.rpc('fetch_feeds_by_club', {
    p_club_id: clubId,
    p_limit_count: PAGE_SIZE,
    p_offset_count: page * PAGE_SIZE,
  });

  if (error) throw error;

  return data;
}

export async function checkIsMyFeed(feedId: string) {
  const userId = await fetchUserId();

  if (!userId) return false;

  const { data, error } = await supabase
    .from('Feed')
    .select('id')
    .eq('id', feedId)
    .eq('author_id', userId)
    .maybeSingle();

  if (error) throw error;

  return !!data;
}
