import { supabase } from './supabaseClient';

export async function sendInquiry(title: string, content: string, replyToEmail: string, photos: string[]) {
  const { error } = await supabase.from('inquiry').insert({
    title,
    content,
    reply_to_email: replyToEmail,
    photos,
  });

  if (error) throw error;
}
