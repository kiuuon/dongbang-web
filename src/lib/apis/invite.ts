import { supabase } from './supabaseClient';
import { generateBase62Code } from '../utils';

export async function fetchInviteCode(clubId: string) {
  const { data, error } = await supabase.from('Invite').select('code, expires_at').eq('club_id', clubId).maybeSingle();

  if (error) throw error;

  if (!data) return null;

  const isExpired = new Date(data.expires_at) < new Date();

  if (isExpired) {
    const { error: deleteError } = await supabase.from('Invite').delete().eq('club_id', clubId);

    if (deleteError) throw deleteError;

    return null;
  }

  return data.code;
}

export async function createInviteCode(clubId: string, code: string) {
  const { data: existingCode } = await supabase.from('Invite').select('code').eq('code', code).maybeSingle();

  if (existingCode) {
    const newCode = generateBase62Code(8);
    return createInviteCode(clubId, newCode);
  }

  const { data: existingClub } = await supabase.from('Invite').select('code').eq('club_id', clubId).maybeSingle();

  if (existingClub) {
    throw new Error('An invite link already exists for this club.');
  }

  const { error } = await supabase
    .from('Invite')
    .insert([{ club_id: clubId, code }])
    .select()
    .single();

  if (error) throw error;

  return code;
}

export async function deleteInviteCode(clubId: string) {
  const { error } = await supabase.from('Invite').delete().eq('club_id', clubId);

  if (error) throw error;
}
