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
      .select(
        '*, author:User(name, avatar), club:Club(name, logo), taggedUsers:Feed_User(user:User(name, avatar)), taggedClubs:Feed_Club(club:Club(name, logo))',
      )
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
