import { NewClubType } from '@/types/club-type';
import { supabase } from './supabaseClient';
import { fetchUserId } from './auth';
import { shuffleArray } from '../utils';

export async function createClub(body: NewClubType) {
  const userId = await fetchUserId();
  let universityId: number | null = null;

  if (body.type === 'campus') {
    const { data, error } = await supabase.from('User').select('university_id').eq('id', userId).single();
    if (error) {
      throw error;
    }
    universityId = data?.university_id;
  }

  const newBody = {
    ...body,
    university_id: universityId,
    creator_id: userId,
  };

  const { data, error } = await supabase.from('Club').insert([newBody]).select();

  if (error) {
    throw error;
  }

  const clubId = data?.[0]?.id;

  await supabase.from('Club_User').insert([
    {
      user_id: userId,
      club_id: clubId,
      role: 'president',
    },
  ]);
}

export async function fetchAllClubs() {
  const { data: clubs, error } = await supabase.from('Club').select('*');

  if (error) {
    throw error;
  }

  return clubs;
}

export async function fetchRecommendedClubs() {
  const userId = await fetchUserId();
  const { data: userData, error: fetchuserDataError } = await supabase
    .from('User')
    .select('university_id')
    .eq('id', userId)
    .single();
  const userUniversityId = userData?.university_id;

  if (fetchuserDataError) {
    throw fetchuserDataError;
  }

  const { data: campusClubs, error: fetchCampusClubsError } = await supabase
    .from('Club')
    .select('*')
    .eq('type', 'campus')
    .eq('university_id', userUniversityId);

  if (fetchCampusClubsError) {
    throw fetchCampusClubsError;
  }

  const shuffledCampusCount = shuffleArray(campusClubs || []).slice(0, 2).length || 0;
  const unionLimit = 4 - shuffledCampusCount;

  const { data: unionClubs, error: fetchUnionClubsError } = await supabase.from('Club').select('*').eq('type', 'union');

  if (fetchUnionClubsError) {
    throw fetchUnionClubsError;
  }

  const clubList = [
    ...(shuffleArray(campusClubs || []).slice(0, 2) || []),
    ...(shuffleArray(unionClubs || []).slice(0, unionLimit) || []),
  ];

  return shuffleArray(clubList);
}

export async function fetchMyClubs() {
  const userId = await fetchUserId();
  const { data: clubData, error: fetchClubDataError } = await supabase
    .from('Club_User')
    .select('club_id')
    .eq('user_id', userId);

  if (fetchClubDataError) {
    throw fetchClubDataError;
  }

  const clubIds = clubData?.map((club) => club.club_id) || [];

  const { data: clubs, error: fetchClubsError } = await supabase.from('Club').select('*').in('id', clubIds);

  if (fetchClubsError) {
    throw fetchClubsError;
  }

  return clubs;
}

export async function fetchMyRole(clubId: string) {
  const userId = await fetchUserId();
  const { data, error } = await supabase
    .from('Club_User')
    .select('role')
    .eq('user_id', userId)
    .eq('club_id', clubId)
    .single();

  if (error) {
    throw error;
  }

  return data?.role;
}

export async function fetchClubInfo(clubId: string) {
  const { data, error } = await supabase.from('Club').select('*').eq('id', clubId).single();

  if (error) {
    throw error;
  }

  return data;
}

export async function fetchClubMembers(clubId: string) {
  const { data, error } = (await supabase
    .from('Club_User')
    .select('user_id, User(name, avatar), role')
    .eq('club_id', clubId)) as unknown as {
    data: {
      user_id: string;
      role: string;
      User: { name: string; avatar: string } | null;
    }[];
    error: Error | null;
  };

  if (error) {
    throw error;
  }

  return data?.map((member) => ({
    userId: member.user_id,
    name: member.User?.name,
    avatar: member.User?.avatar,
    role: member.role,
  }));
}
