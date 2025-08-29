import { supabaseAdmin } from '../supabaseAdminClient';

// Obtener todas las canciones de un usuario
export const getSongsByUserId = async (userId: string) => {
  const { data, error } = await supabaseAdmin
    .from('songs')
    .select('*')
    .eq('user_id', userId);

  if (error) throw new Error(error.message);
  return data;
};

// Obtener una canción específica por ID, asegurando que pertenezca al usuario
export const getSongById = async (songId: string, userId: string) => {
  const { data, error } = await supabaseAdmin
    .from('songs')
    .select('*')
    .eq('id', songId)
    .eq('user_id', userId)
    .single();

  if (error) throw new Error(error.message);
  return data;
};

// Actualizar los metadatos de una canción
export const updateSongById = async (songId: string, userId: string, updates: any) => {
  const { data, error } = await supabaseAdmin
    .from('songs')
    .update(updates)
    .eq('id', songId)
    .eq('user_id', userId)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
};

// Eliminar una canción (archivo y registro en la BD)
export const deleteSongById = async (songId: string, userId: string) => {
  // 1. Obtener la ruta del archivo para asegurarse de que la canción pertenece al usuario
  const { data: song, error: fetchError } = await supabaseAdmin
    .from('songs')
    .select('storage_path')
    .eq('id', songId)
    .eq('user_id', userId)
    .single();

  if (fetchError || !song) {
    throw new Error('Song not found or user does not have permission.');
  }

  // 2. Eliminar el archivo de Supabase Storage
  const { error: storageError } = await supabaseAdmin.storage
    .from('music_files')
    .remove([song.storage_path]);

  if (storageError) {
    // Podríamos decidir si detenernos aquí o continuar para eliminar el registro de la BD
    console.error('Storage Error:', storageError.message);
    throw new Error(`Failed to delete file from storage: ${storageError.message}`);
  }

  // 3. Eliminar el registro de la tabla 'songs'
  const { error: dbError } = await supabaseAdmin
    .from('songs')
    .delete()
    .eq('id', songId);

  if (dbError) {
    throw new Error(`Failed to delete song from database: ${dbError.message}`);
  }

  return { message: 'Song deleted successfully' };
};
