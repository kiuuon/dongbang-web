import { supabase } from './supabaseClient';
import { fetchUserId } from './auth';

export async function writeFeed(
  photos: string[],
  title: string,
  content: string,
  isNicknameVisible: boolean,
  isPrivate: boolean,
  clubId: string,
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

export async function fetchPostsByClubType(clubType: 'my' | 'campus' | 'union', page: number) {
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

    const { data } = await supabase
      .from('Post')
      .select('*, author:User(name)')
      .in('club_id', clubIds)
      .order('created_at', { ascending: false })
      .range(start, end);

    return data;
  }

  if (clubType === 'campus') {
    const userId = await fetchUserId();
    const { data: userData } = await supabase.from('User').select('university_id').eq('id', userId).single();

    const userUniversityId = userData?.university_id;

    const { data } = await supabase
      .from('Post')
      .select('*, author:User(name), club:Club(university_id)')
      .not('club', 'is', null)
      .eq('club.university_id', userUniversityId)
      .order('created_at', { ascending: false })
      .range(start, end);

    return data;
  }

  if (clubType === 'union') {
    const { data } = await supabase
      .from('Post')
      .select('*, author:User(name)')
      .eq('club_type', clubType)
      .order('created_at', { ascending: false })
      .range(start, end);

    return data;
  }

  return [];
}
