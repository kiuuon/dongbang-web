import { ClubType } from '@/types/club-type';
import { supabase } from './supabaseClient';
import { fetchUserId } from './auth';
import { shuffleArray } from '../utils';

export async function createClub(body: ClubType) {
  const userId = await fetchUserId();
  let universityId: number | null = null;

  if (body.type === 'campus') {
    const { data } = await supabase.from('User').select('university_id').eq('id', userId).single();
    universityId = data?.university_id;
  }

  const newBody = {
    ...body,
    university_id: universityId,
    creator_id: userId,
  };

  const { data } = await supabase.from('Club').insert([newBody]).select();

  const clubId = data?.[0]?.id;

  await supabase.from('Club_User').insert([
    {
      user_id: userId,
      club_id: clubId,
      role: 'president',
    },
  ]);
}

export async function fetchRecommendedClubs() {
  const userId = await fetchUserId();
  const { data: userData } = await supabase.from('User').select('university_id').eq('id', userId).single();
  const userUniversityId = userData?.university_id;

  const { data: campusClubs } = await supabase
    .from('Club')
    .select('*')
    .eq('type', 'campus')
    .eq('university_id', userUniversityId);

  const shuffledCampusCount = shuffleArray(campusClubs || []).slice(0, 2).length || 0;
  const unionLimit = 4 - shuffledCampusCount;

  const { data: unionClubs } = await supabase.from('Club').select('*').eq('type', 'union');

  const clubList = [
    ...(shuffleArray(campusClubs || []).slice(0, 2) || []),
    ...(shuffleArray(unionClubs || []).slice(0, unionLimit) || []),
  ];

  return shuffleArray(clubList);
}
