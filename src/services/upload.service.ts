// src/services/upload.service.ts

import { supabase } from '../supabaseClient';
import { supabaseAdmin } from '../supabaseAdminClient';
import * as musicMetadata from 'music-metadata';

export const processAndUploadFiles = async (files: Express.Multer.File[], userId: string) => {
  console.log(`\n--- INICIANDO PROCESO PARA ${files.length} ARCHIVOS ---`);
  console.log(`Usuario autenticado con ID: ${userId}`);

  const uploadPromises = files.map(async (file) => {
    try {
      console.log(`\nProcesando archivo: ${file.originalname}`);
      const metadata = await musicMetadata.parseBuffer(file.buffer, file.mimetype);
      const { title, artist, album } = metadata.common;
      const duration = metadata.format.duration;

      // Sanitizar el nombre del archivo
      const sanitizedFileName = file.originalname
        .toLowerCase()
        .normalize('NFD') // Descomponer caracteres acentuados
        .replace(/[\u0300-\u036f]/g, '') // Eliminar diacríticos
        .replace(/[^a-z0-9.]/g, '-') // Reemplazar caracteres no alfanuméricos por guiones
        .replace(/--+/g, '-'); // Colapsar múltiples guiones

      const storagePath = `${userId}/${Date.now()}-${sanitizedFileName}`;

      console.log('Subiendo archivo al Storage...');
      const { error: uploadError } = await supabaseAdmin.storage
        .from('music-files')
        .upload(storagePath, file.buffer, {
          contentType: file.mimetype,
          upsert: false,
        });

      if (uploadError) {
        throw new Error(`Supabase Storage Error: ${uploadError.message}`);
      }
      console.log('Archivo subido al Storage con éxito.');

      const songData = {
        user_id: userId,
        title: title || 'Unknown Title',
        artist: artist || 'Unknown Artist',
        album: album || 'Unknown Album',
        duration_seconds: duration ? Math.round(duration) : 0,
        storage_path: storagePath,
      };

      console.log('Intentando insertar en la base de datos con el cliente ADMIN...');
      console.log('Datos a insertar:', JSON.stringify(songData, null, 2));

      const { error: insertError } = await supabaseAdmin.from('songs').insert([songData]);

      if (insertError) {
        console.error('¡FALLO LA INSERCIÓN EN LA BASE DE DATOS!');
        await supabase.storage.from('music-files').remove([storagePath]);
        console.log('Archivo huérfano eliminado del Storage.');
        throw new Error(`Supabase DB Error: ${insertError.message}`);
      }

      console.log(`¡ÉXITO! Registro insertado en la base de datos para ${file.originalname}`);
      return { success: true, fileName: file.originalname };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      console.error(`Error procesando ${file.originalname}:`, errorMessage);
      return { success: false, fileName: file.originalname, error: errorMessage };
    }
  });

  // ... (el resto del código sigue igual)
  const results = await Promise.all(uploadPromises);
  const successfulUploads = results.filter(r => r.success);
  const failedUploads = results.filter(r => !r.success);
  return {
    message: `Processed ${files.length} files. ${successfulUploads.length} succeeded, ${failedUploads.length} failed.`,
    successfulUploads,
    failedUploads,
  };
};