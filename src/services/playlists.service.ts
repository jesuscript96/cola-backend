import { supabaseAdmin } from '../supabaseAdminClient';

// Crear una nueva playlist para un usuario
export const createPlaylistForUser = async (name: string, userId: string) => {
  const { data, error } = await supabaseAdmin
    .from('playlists')
    .insert({ name, user_id: userId })
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data;
};

// Obtener todas las playlists de un usuario
export const getPlaylistsForUser = async (userId: string) => {
  const { data, error } = await supabaseAdmin
    .from('playlists')
    .select('id, name, created_at')
    .eq('user_id', userId);
  if (error) throw new Error(error.message);
  return data;
};

// Obtener los detalles de una playlist, incluyendo sus canciones
export const getPlaylistDetails = async (playlistId: string, userId: string) => {
  const { data, error } = await supabaseAdmin
    .from('playlists')
    .select('id, name, created_at, playlist_songs(position, songs(*))')
    .eq('id', playlistId)
    .eq('user_id', userId)
    .order('position', { foreignTable: 'playlist_songs', ascending: true })
    .single();
  if (error) throw new Error(error.message);
  return data;
};

// Eliminar una playlist de un usuario
export const deletePlaylistForUser = async (playlistId: string, userId: string) => {
  const { error } = await supabaseAdmin
    .from('playlists')
    .delete()
    .eq('id', playlistId)
    .eq('user_id', userId);
  if (error) throw new Error(error.message);
  return { message: 'Playlist deleted successfully' };
};

// Añadir una canción a una playlist
export const addSongToPlaylist = async (playlistId: string, songId: string, userId: string) => {
  // Asegurarse de que tanto la playlist como la canción pertenezcan al usuario
  const { data: playlist } = await supabaseAdmin.from('playlists').select('id').eq('id', playlistId).eq('user_id', userId).single();
  const { data: song } = await supabaseAdmin.from('songs').select('id').eq('id', songId).eq('user_id', userId).single();

  if (!playlist || !song) {
    throw new Error('Playlist or song not found, or user does not have permission.');
  }

  // Determinar la siguiente posición
  const { count, error: countError } = await supabaseAdmin
    .from('playlist_songs')
    .select('*' , { count: 'exact', head: true })
    .eq('playlist_id', playlistId);

  if (countError) throw new Error(countError.message);
  const newPosition = (count ?? 0) + 1;

  const { data, error } = await supabaseAdmin
    .from('playlist_songs')
    .insert({ playlist_id: playlistId, song_id: songId, position: newPosition })
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
};

// Eliminar una canción de una playlist
export const removeSongFromPlaylist = async (playlistId: string, songId: string, userId: string) => {
  // Verificar que la playlist pertenece al usuario antes de eliminar la canción
  const { data: playlist } = await supabaseAdmin.from('playlists').select('id').eq('id', playlistId).eq('user_id', userId).single();
  if (!playlist) {
    throw new Error('Playlist not found or user does not have permission.');
  }

  const { error } = await supabaseAdmin
    .from('playlist_songs')
    .delete()
    .eq('playlist_id', playlistId)
    .eq('song_id', songId);

  if (error) throw new Error(error.message);
  return { message: 'Song removed from playlist successfully' };
};
