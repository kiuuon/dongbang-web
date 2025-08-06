import { supabase } from './supabaseClient';
import { fetchUserId } from './auth';

export async function sendFeedback(feedback: string) {
  const userId = await fetchUserId();
  const { error } = await supabase.from('Feedback').insert([{ user_id: userId, feedback }]);
  if (error) {
    throw error;
  }
}
