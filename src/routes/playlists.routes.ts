import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.middleware';
import {
  getPlaylists,
  createPlaylist,
  getPlaylistById,
  deletePlaylist,
  addSongToPlaylist,
  removeSongFromPlaylist,
} from '../controllers/playlists.controller';

const router = Router();

// Proteger todas las rutas de playlists con el middleware de autenticación
router.use(authMiddleware);

router.get('/', getPlaylists);
router.post('/', createPlaylist);

router.get('/:id', getPlaylistById);
router.delete('/:id', deletePlaylist);

router.post('/:id/songs', addSongToPlaylist);
router.delete('/:id/songs/:songId', removeSongFromPlaylist);

export default router;
