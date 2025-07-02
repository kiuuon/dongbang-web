import { supabase } from './supabaseClient';

export async function upload(file: File | string, fileName: string) {
  const { error: uploadError } = await supabase.storage.from('club-image').upload(fileName, file);

  if (uploadError) throw uploadError;

  const { data } = supabase.storage.from('club-image').getPublicUrl(fileName);

  return data;
}
