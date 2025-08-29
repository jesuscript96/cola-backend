import multer from 'multer';

// Configura multer para usar la memoria como almacenamiento
const storage = multer.memoryStorage();

// Crea el middleware de multer
const upload = multer({ storage });

// Exporta el middleware configurado para aceptar múltiples archivos bajo el campo 'musicFiles'
export const uploadFiles = upload.array('musicFiles');
