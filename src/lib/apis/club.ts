import { ClubType } from '@/types/club-type';
import { supabase } from './supabaseClient';
import { fetchUserId } from './auth';

export async function createClub(body: ClubType) {
  if (body.type === 'campus') {
    const userId = await fetchUserId();
    const { data } = await supabase.from('User').select('university_id').eq('id', userId).single();
    const newBody = {
      ...body,
      university_id: data?.university_id,
    };
    await supabase.from('Club').insert([newBody]);
  } else {
    const newBody = {
      ...body,
      university_id: null,
    };
    await supabase.from('Club').insert([newBody]);
  }
}
