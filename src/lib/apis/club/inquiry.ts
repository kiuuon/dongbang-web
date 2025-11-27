import { supabase } from '../supabaseClient';

export async function fetchClubInquiries(
  clubId: string,
  onlyMine: boolean,
  excludePrivate: boolean,
  filter: string,
  page: number,
) {
  const PAGE_SIZE = 20;

  const { data, error } = await supabase.rpc('get_club_inquiries_offset', {
    p_club_id: clubId,
    p_only_mine: onlyMine,
    p_exclude_private: excludePrivate,
    p_filter: filter,
    p_limit_count: PAGE_SIZE,
    p_offset_count: page * PAGE_SIZE,
  });

  if (error) throw error;

  return data ?? [];
}

export async function writeInquiry(clubId: string, content: string, isPrivate: boolean) {
  const { error } = await supabase.from('club_inquiry').insert({
    club_id: clubId,
    content,
    is_private: isPrivate,
  });

  if (error) {
    throw error;
  }
}

export async function deleteInquiry(inquiryId: string) {
  const { data, error } = await supabase.rpc('delete_club_inquiry', {
    p_inquiry_id: inquiryId,
  });

  if (error) throw error;
  return data;
}

export async function writeInquiryComment(inquiryId: string, content: string) {
  const { error } = await supabase.from('club_inquiry_comment').insert({
    inquiry_id: inquiryId,
    content,
  });

  if (error) throw error;
}
