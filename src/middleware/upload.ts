import multer from 'multer';

// Configura multer para usar la memoria como almacenamiento
const storage = multer.memoryStorage();

// Ahora el middleware se exporta y otros archivos pueden importarlo
export const upload = multer({
  storage: multer.memoryStorage()
});

// Exporta el middleware configurado para aceptar múltiples archivos bajo el campo 'musicFiles'
export const uploadFiles = upload.array('musicFiles');
