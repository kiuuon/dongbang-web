import { NewClubType } from '@/types/club-type';
import { Filters } from '@/stores/filter-store';
import { supabase } from '../supabaseClient';
import { fetchUserId } from '../auth';
import { shuffleArray } from '../../utils';

export async function createClub(body: NewClubType) {
  const { error } = await supabase.rpc('create_club_with_recruitment_transaction', {
    club: body,
  });

  if (error) throw error;
}

export async function editClubInfo(body: NewClubType, clubId: string) {
  const { error } = await supabase.from('Club').update([body]).eq('id', clubId);

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
  if (!userId) {
    return [];
  }

  const { data: clubData, error: fetchClubDataError } = await supabase
    .from('Club_User')
    .select('club_id')
    .eq('user_id', userId)
    .is('deleted_at', null);

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

export async function fetchClubsByUserId(userId: string) {
  const { data: clubData, error: fetchClubDataError } = await supabase
    .from('Club_User')
    .select('club_id')
    .eq('user_id', userId)
    .is('deleted_at', null);

  if (fetchClubDataError) {
    throw fetchClubDataError;
  }

  const clubIds = clubData?.map((club) => club.club_id) || [];

  const { data: clubs, error: fetchClubsError } = await supabase
    .from('Club')
    .select('*, role:Club_User(role)')
    .in('id', clubIds)
    .is('role.deleted_at', null);

  if (fetchClubsError) {
    throw fetchClubsError;
  }

  return clubs;
}

export async function fetchMyRole(clubId: string) {
  const userId = await fetchUserId();

  if (!userId) return null;

  const { data, error } = await supabase
    .from('Club_User')
    .select('role')
    .eq('user_id', userId)
    .eq('club_id', clubId)
    .is('deleted_at', null)
    .maybeSingle();

  if (error) {
    throw error;
  }

  if (!data) {
    return null;
  }

  return data?.role;
}

export async function fetchClubInfo(clubId: string) {
  const { data, error } = await supabase.from('Club').select('*').eq('id', clubId).maybeSingle();

  if (error) {
    throw error;
  }

  if (!data) return null;

  return data;
}

export async function fetchClubMembers(clubId: string) {
  const { data, error } = (await supabase
    .from('Club_User')
    .select('user_id, User(name, nickname, avatar), role')
    .eq('club_id', clubId)
    .is('deleted_at', null)) as unknown as {
    data: {
      user_id: string;
      role: string;
      User: { name: string; nickname: string; avatar: string } | null;
    }[];
    error: Error | null;
  };

  if (error) {
    throw error;
  }

  return data?.map((member) => ({
    userId: member.user_id,
    name: member.User?.name,
    nickname: member.User?.nickname,
    avatar: member.User?.avatar,
    role: member.role,
  }));
}

export async function joinClub(clubId: string, code: string) {
  const { error } = await supabase.rpc('join_club', {
    p_invite_code: code,
  });

  if (error) throw error;
}

export async function checkIsClubMember(clubId: string) {
  const userId = await fetchUserId();

  if (!userId) return false;

  const { data, error } = await supabase
    .from('Club_User')
    .select('club_id')
    .eq('club_id', clubId)
    .eq('user_id', userId)
    .is('deleted_at', null)
    .maybeSingle();

  if (error) throw error;

  return !!data;
}

export async function fetchMyApply(clubId: string) {
  const userId = await fetchUserId();

  if (!userId) return false;

  const { data, error } = await supabase
    .from('club_applications')
    .select('id, status')
    .eq('user_id', userId)
    .eq('club_id', clubId)
    .maybeSingle();

  if (error) {
    throw error;
  }

  if (!data) {
    return null;
  }

  return data;
}

export async function fetchApplicants(clubId: string) {
  const { data, error } = await supabase
    .from('club_applications')
    .select(
      `
      status,
      created_at,
      user:User (
        id,
        name,
        nickname,
        avatar
      )
    `,
    )
    .eq('club_id', clubId)
    .in('status', ['pending'])
    .order('created_at', { ascending: true });

  if (error) {
    throw error;
  }

  return data;
}

export async function applyToClub(clubId: string) {
  const userId = await fetchUserId();

  const { data: existing, error: fetchError } = await supabase
    .from('club_applications')
    .select('id, status')
    .eq('user_id', userId)
    .eq('club_id', clubId)
    .maybeSingle();

  if (fetchError) {
    throw fetchError;
  }

  if (!existing) {
    const { error } = await supabase.from('club_applications').insert({
      club_id: clubId,
      status: 'pending',
    });

    if (error) {
      throw error;
    }
  } else if (existing.status === 'cancelled' || existing.status === 'rejected') {
    const { error } = await supabase.from('club_applications').update({ status: 'pending' }).eq('id', existing.id);

    if (error) {
      throw error;
    }
  }
}

export async function cancelApplication(clubId: string) {
  const userId = await fetchUserId();

  const { error } = await supabase
    .from('club_applications')
    .update({
      status: 'cancelled',
    })
    .eq('user_id', userId)
    .eq('club_id', clubId)
    .eq('status', 'pending');

  if (error) {
    throw error;
  }
}

export async function approveApplication(clubId: string, approvedIds: string[]) {
  const { error } = await supabase.rpc('approve_applications', {
    p_club_id: clubId,
    p_approved_ids: approvedIds,
  });

  if (error) throw error;

  return true;
}

export async function rejectApplication(clubId: string, rejectedIds: string[]) {
  const { error } = await supabase
    .from('club_applications')
    .update({ status: 'rejected' })
    .in('user_id', rejectedIds)
    .eq('club_id', clubId);

  if (error) {
    throw error;
  }
}

export async function fetchClubMember(clubId: string, userId: string) {
  const { data, error } = (await supabase
    .from('Club_User')
    .select(
      `
      role,
      info:User (
        id,
        name,
        nickname,
        avatar
      )
    `,
    )
    .eq('club_id', clubId)
    .eq('user_id', userId)
    .is('deleted_at', null)) as unknown as {
    data: {
      role: string;
      info: { id: string; name: string; nickname: string; avatar: string };
    }[];
    error: Error | null;
  };

  if (error) throw error;

  if (!data || data.length === 0) {
    return null;
  }

  return data[0];
}

export async function changeMemberRole(
  clubId: string,
  userId: string,
  newRole: 'president' | 'officer' | 'member' | 'on_leave' | 'graduate',
) {
  const { error } = await supabase
    .from('Club_User')
    .update({ role: newRole })
    .eq('club_id', clubId)
    .eq('user_id', userId);

  if (error) {
    throw error;
  }
}

export async function transferPresident(clubId: string, targetUserId: string) {
  const userId = await fetchUserId();

  const { error: promoteError } = await supabase
    .from('Club_User')
    .update({ role: 'president' })
    .eq('club_id', clubId)
    .eq('user_id', targetUserId);

  if (promoteError) throw promoteError;

  // B. 현재 회장을 officer 로 변경
  const { error: demoteError } = await supabase
    .from('Club_User')
    .update({ role: 'officer' })
    .eq('club_id', clubId)
    .eq('user_id', userId);

  if (demoteError) throw demoteError;
}

export async function expelMember(clubId: string, userId: string, expelReason: string | null) {
  const { error } = await supabase.rpc('expel_member', {
    p_club_id: clubId,
    p_user_id: userId,
    p_expel_reason: expelReason,
  });

  if (error) throw error;
}
