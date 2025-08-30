// src/services/upload.service.ts

import { supabaseAdmin } from '../supabaseAdminClient';

interface SongMetadata {
  storagePath: string;
  title: string;
  artist: string;
  album: string;
  durationSeconds: number;
  relativePath?: string[]; // <-- Nueva propiedad
}

/**
 * Genera una URL firmada para subir un archivo directamente a Supabase Storage.
 */
export const createSignedUploadUrl = async (userId: string, fileName: string) => {
  // Sanitizamos el nombre del archivo para hacerlo seguro para la URL
  const sanitizedFileName = fileName
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9.\-]/g, '');

  const filePath = `${userId}/${Date.now()}-${sanitizedFileName}`;

  // Generamos la URL firmada que será válida por 5 minutos (300 segundos)
  const { data, error } = await supabaseAdmin.storage
    .from('music-files')
    .createSignedUploadUrl(filePath);

  if (error) {
    throw new Error(`Could not create signed URL: ${error.message}`);
  }

  // Devolvemos la URL y la ruta para que el cliente las use
  return {
    signedUrl: data.signedUrl,
    path: data.path,
  };
};

/**
 * Guarda los metadatos de una canción en la base de datos después de una subida exitosa.
 */
export const saveSongMetadata = async (userId: string, metadata: SongMetadata) => {
  const { storagePath, title, artist, album, durationSeconds, relativePath } = metadata;

  let folderId: string | null = null;

  // Llamamos a la función RPC si nos han pasado una ruta
  if (relativePath && relativePath.length > 0) {
    const { data: rpcData, error: rpcError } = await supabaseAdmin.rpc('get_or_create_folder_path', {
      p_user_id: userId,
      p_folder_path: relativePath
    });

    if (rpcError) {
      throw new Error(`Failed to process folder path: ${rpcError.message}`);
    }
    folderId = rpcData; // El resultado es el ID de la carpeta
  }

  // Incluimos el folder_id en la inserción
  const { data, error } = await supabaseAdmin.from('songs').insert({
    user_id: userId,
    storage_path: storagePath,
    title: title || 'Unknown Title',
    artist: artist || 'Unknown Artist',
    album: album || 'Unknown Album',
    duration_seconds: durationSeconds || 0,
    folder_id: folderId,
  }).select().single();

  if (error) {
    await supabaseAdmin.storage.from('music-files').remove([storagePath]);
    throw new Error(`Could not save song metadata: ${error.message}`);
  }

  return data;
};