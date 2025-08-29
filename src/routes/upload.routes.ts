import { Router } from 'express';
import { uploadMusicFilesController } from '../controllers/upload.controller';
import multer from 'multer';

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post('/', upload.array('musicFiles', 100), uploadMusicFilesController);

export default router;
