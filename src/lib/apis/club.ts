import { NewClubType } from '@/types/club-type';
import { Filters } from '@/stores/filter-store';
import { supabase } from './supabaseClient';
import { fetchUserId } from './auth';
import { shuffleArray } from '../utils';

export async function createClub(body: NewClubType) {
  const { error } = await supabase.rpc('create_club_with_recruitment_transaction', {
    club: body,
  });

  if (error) throw error;
}

export async function fetchClubs(keyword: string, filters: Filters, page: number) {
  const PAGE_SIZE = 10;

  const { data, error } = await supabase.rpc('search_clubs_detailed', {
    p_keyword: keyword ?? '',
    p_club_type: filters.clubType ?? null,
    p_university_name: filters.universityName ?? null,
    p_detail_types: filters.detailTypes ?? [],
    p_location: filters.location ?? null,
    p_categories: filters.categories ?? [],
    p_recruitment_statuses: filters.recruitmentStatuses ?? [],
    p_end_date_option: filters.endDateOption ?? null,
    p_dues_option: filters.duesOption ?? null,
    p_meeting: filters.meeting ?? null,
    p_limit_count: PAGE_SIZE,
    p_offset_count: page * PAGE_SIZE,
  });

  if (error) throw error;

  return data ?? [];
}

export async function fetchClubsCount(keyword: string, filters: Filters) {
  const { data, error } = await supabase.rpc('count_clubs_detailed', {
    p_keyword: keyword ?? '',
    p_club_type: filters.clubType ?? null,
    p_university_name: filters.universityName ?? null,
    p_detail_types: filters.detailTypes ?? [],
    p_location: filters.location ?? null,
    p_categories: filters.categories ?? [],
    p_recruitment_statuses: filters.recruitmentStatuses ?? [],
    p_end_date_option: filters.endDateOption ?? null,
    p_dues_option: filters.duesOption ?? null,
    p_meeting: filters.meeting ?? null,
  });
  if (error) throw error;

  return data ?? 0;
}

export async function fetchAllClubs() {
  const { data: clubs, error } = await supabase.from('Club').select('*, Recruitment(recruitment_status, end_date)');

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

export async function joinClub(clubId: string) {
  const userId = await fetchUserId();
  const { error } = await supabase.from('Club_User').insert([{ club_id: clubId, user_id: userId, role: 'member' }]);

  if (error) throw error;
}

export async function checkIsClubMember(clubId: string) {
  const userId = await fetchUserId();
  const { data, error } = await supabase
    .from('Club_User')
    .select('club_id')
    .eq('club_id', clubId)
    .eq('user_id', userId)
    .single();

  if (error) throw error;

  return !!data;
}
