import { Request, Response } from 'express';
import { processAndUploadFiles } from '../services/upload.service';
import { supabase } from '../supabaseClient';

export const uploadMusicFilesController = async (req: Request, res: Response) => {
  try {
    // 1. Extraer y validar el token de autorización
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Unauthorized: Missing or invalid token.' });
    }
    const token = authHeader.split(' ')[1];

    // 2. Validar el token con Supabase y obtener el usuario
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);

    if (userError || !user) {
      return res.status(401).json({ message: 'Unauthorized: Invalid token.', error: userError?.message });
    }

    // 3. Verificar si se recibieron archivos
    if (!req.files || (req.files as Express.Multer.File[]).length === 0) {
      return res.status(400).json({ message: 'No files were uploaded.' });
    }

    const files = req.files as Express.Multer.File[];
    const userId = user.id;

    // 4. Llamar al servicio para procesar y subir los archivos
    const result = await processAndUploadFiles(files, userId);

    // 5. Devolver una respuesta exitosa
    return res.status(201).json({ message: 'Files uploaded and processed successfully', data: result });

  } catch (error) {
    console.error('Error uploading files:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    // 6. Manejar errores y devolver una respuesta de error
    return res.status(500).json({ message: 'An error occurred while processing the files.', error: errorMessage });
  }
};
