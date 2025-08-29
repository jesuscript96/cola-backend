import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.middleware';
import { getSongs, getSongById, updateSong, deleteSong } from '../controllers/songs.controller';

const router = Router();

// Aplicar el middleware de autenticación a todas las rutas de canciones
router.use(authMiddleware);

router.get('/', getSongs);
router.get('/:id', getSongById);
router.put('/:id', updateSong);
router.delete('/:id', deleteSong);

export default router;
