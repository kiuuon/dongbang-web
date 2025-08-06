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
    const { data: clubData, error: fetchClubError } = await supabase
      .from('Club_User')
      .select('club_id')
      .eq('user_id', userId);

    if (fetchClubError) {
      throw fetchClubError;
    }

    if (!clubData || clubData.length === 0) {
      return null;
    }

    const clubIds = clubData.map((club) => club.club_id);

    const [feedByClub, feedByUserTag, feedByClubTag] = await Promise.all([
      // 1. 내가 속한 클럽의 글
      supabase
        .from('Feed')
        .select(
          '*, author:User(name, avatar), club:Club(name, logo), taggedUsers:Feed_User(user:User(name, avatar)), taggedClubs:Feed_Club(club:Club(name, logo))',
        )
        .in('club_id', clubIds)
        .order('created_at', { ascending: false }),

      // 2. 내가 태그된 글
      supabase
        .from('Feed_User')
        .select(
          'feed:Feed(*, author:User(name, avatar), club:Club(name, logo), taggedUsers:Feed_User(user:User(name, avatar)), taggedClubs:Feed_Club(club:Club(name, logo)))',
        )
        .eq('user_id', userId),

      // 3. 내 클럽이 태그된 글
      supabase
        .from('Feed_Club')
        .select(
          'feed:Feed(*, author:User(name, avatar), club:Club(name, logo), taggedUsers:Feed_User(user:User(name, avatar)), taggedClubs:Feed_Club(club:Club(name, logo)))',
        )
        .in('club_id', clubIds),
    ]);

    if (feedByClub.error) {
      throw feedByClub.error;
    }

    if (feedByUserTag.error) {
      throw feedByUserTag.error;
    }

    if (feedByClubTag.error) {
      throw feedByClubTag.error;
    }

    // 2, 3번은 관계 테이블에서 가져오므로 feed만 추출
    const feedsFromUserTag = feedByUserTag.data?.map((f) => f.feed) ?? [];
    const feedsFromClubTag = feedByClubTag.data?.map((f) => f.feed) ?? [];
    const feedsFromClub = feedByClub.data ?? [];

    // 모두 합쳐서 중복 제거
    const feedMap = new Map();
    [...feedsFromUserTag, ...feedsFromClubTag, ...feedsFromClub].forEach((feed) => {
      if (!feedMap.has(feed.id)) {
        feedMap.set(feed.id, feed);
      }
    });
    const mergedFeeds = Array.from(feedMap.values()).sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
    );

    const feedsWithRole = await Promise.all(
      mergedFeeds.map(async (feed) => {
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
