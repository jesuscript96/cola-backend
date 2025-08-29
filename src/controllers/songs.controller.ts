import { Request, Response } from 'express';
import * as songService from '../services/songs.service';

export const getSongs = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const songs = await songService.getSongsByUserId(userId);
    res.status(200).json(songs);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    res.status(500).json({ message: 'Error fetching songs', error: errorMessage });
  }
};

export const getSongById = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const songId = req.params.id;
    const song = await songService.getSongById(songId, userId);
    if (!song) {
      return res.status(404).json({ message: 'Song not found' });
    }
    res.status(200).json(song);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    res.status(500).json({ message: 'Error fetching song', error: errorMessage });
  }
};

export const updateSong = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const songId = req.params.id;
    const updates = req.body;
    const updatedSong = await songService.updateSongById(songId, userId, updates);
    if (!updatedSong) {
      return res.status(404).json({ message: 'Song not found or no changes made' });
    }
    res.status(200).json(updatedSong);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    res.status(500).json({ message: 'Error updating song', error: errorMessage });
  }
};

export const deleteSong = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const songId = req.params.id;
    await songService.deleteSongById(songId, userId);
    res.status(204).send(); // No Content
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    if (errorMessage.includes('not found')) {
      return res.status(404).json({ message: 'Song not found' });
    }
    res.status(500).json({ message: 'Error deleting song', error: errorMessage });
  }
};
