import { supabase } from './supabaseClient';

export async function upload(file: File | string, fileName: string, storageName: string) {
  const { error: uploadError } = await supabase.storage.from(storageName).upload(fileName, file);

  if (uploadError) throw uploadError;

  const { data } = supabase.storage.from(storageName).getPublicUrl(fileName);

  return data;
}
