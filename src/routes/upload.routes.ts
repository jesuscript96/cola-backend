import { Router } from 'express';
import { uploadMusicFilesController } from '../controllers/upload.controller';
import { authMiddleware } from '../middleware/auth.middleware'; // 1. IMPORTAMOS EL MIDDLEWARE DE AUTH
import { upload } from '../middleware/upload'; // 2. IMPORTAMOS LA CONFIGURACIÓN DE MULTER DESDE SU ARCHIVO

// Esta configuración le dice a Vercel que no procese el cuerpo de la petición.
export const config = {
  api: {
    bodyParser: false,
  },
};

const router = Router();

// 3. APLICAMOS LOS MIDDLEWARES EN EL ORDEN CORRECTO
// La petición primero pasa por la autenticación, luego por multer, y finalmente llega al controlador.
router.post(
  '/', 
  authMiddleware, // Primero, verificamos que el usuario está autenticado.
  upload.array('musicFiles', 100), // Segundo, si está autenticado, procesamos los archivos.
  uploadMusicFilesController // Tercero, ejecutamos la lógica del controlador.
);

export default router;