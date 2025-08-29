// src/routes/upload.routes.ts

import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.middleware';
import { 
  getSignedUrlForUploadController, 
  finalizeUploadController 
} from '../controllers/upload.controller';

const router = Router();

// Ya no se necesitan configuraciones especiales de Vercel ni de Multer aquí.

// Ruta para que el cliente solicite una URL para subir un archivo.
// Se protege con el middleware de autenticación.
router.post(
  '/request-upload-url', 
  authMiddleware,
  getSignedUrlForUploadController
);

// Ruta para que el cliente notifique que la subida ha terminado y envíe los metadatos.
// También se protege con el middleware de autenticación.
router.post(
  '/finalize-upload',
  authMiddleware,
  finalizeUploadController
);

export default router;