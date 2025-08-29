import { Request, Response } from 'express';
import * as playlistService from '../services/playlists.service';

export const getPlaylists = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const playlists = await playlistService.getPlaylistsForUser(userId);
    res.status(200).json(playlists);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    res.status(500).json({ message: 'Error fetching playlists', error: errorMessage });
  }
};

export const createPlaylist = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ message: 'Playlist name is required' });
    }
    const newPlaylist = await playlistService.createPlaylistForUser(name, userId);
    res.status(201).json(newPlaylist);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    res.status(500).json({ message: 'Error creating playlist', error: errorMessage });
  }
};

export const getPlaylistById = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const playlistId = req.params.id;
    const playlist = await playlistService.getPlaylistDetails(playlistId, userId);
    if (!playlist) {
      return res.status(404).json({ message: 'Playlist not found' });
    }
    res.status(200).json(playlist);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    res.status(500).json({ message: 'Error fetching playlist details', error: errorMessage });
  }
};

export const deletePlaylist = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const playlistId = req.params.id;
    await playlistService.deletePlaylistForUser(playlistId, userId);
    res.status(204).send();
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    res.status(500).json({ message: 'Error deleting playlist', error: errorMessage });
  }
};

export const addSongToPlaylist = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const playlistId = req.params.id;
    const { songId } = req.body;
    if (!songId) {
      return res.status(400).json({ message: 'songId is required' });
    }
    const result = await playlistService.addSongToPlaylist(playlistId, songId, userId);
    res.status(201).json(result);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    res.status(500).json({ message: 'Error adding song to playlist', error: errorMessage });
  }
};

export const removeSongFromPlaylist = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const { id: playlistId, songId } = req.params;
    await playlistService.removeSongFromPlaylist(playlistId, songId, userId);
    res.status(204).send();
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    res.status(500).json({ message: 'Error removing song from playlist', error: errorMessage });
  }
};
