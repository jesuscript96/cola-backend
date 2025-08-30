// src/controllers/upload.controller.ts

import { Request, Response } from 'express';
import { createSignedUploadUrl, saveSongMetadata } from '../services/upload.service';

/**
 * Controlador para generar una URL de subida firmada.
 */
export const getSignedUrlForUploadController = async (req: Request, res: Response) => {
  try {
    // El user.id ahora viene del authMiddleware
    const userId = (req as any).user.id;
    const { fileName } = req.body;

    if (!fileName) {
      return res.status(400).json({ message: 'fileName is required.' });
    }

    const data = await createSignedUploadUrl(userId, fileName);
    res.status(200).json(data);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'An unknown error occurred';
    res.status(500).json({ message });
  }
};

/**
 * Controlador para finalizar la subida y guardar los metadatos de la canción.
 */
export const finalizeUploadController = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { storagePath, title, artist, album, durationSeconds, relativePath } = req.body; // <-- Extraemos relativePath

    if (!storagePath) {
      return res.status(400).json({ message: 'storagePath is required.' });
    }

    // Pasamos relativePath al servicio
    const newSong = await saveSongMetadata(userId, { storagePath, title, artist, album, durationSeconds, relativePath });
    res.status(201).json(newSong);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'An unknown error occurred';
    res.status(500).json({ message });
  }
};