import dotenv from 'dotenv';

import express from 'express';
import cors from 'cors';

import uploadRouter from './routes/upload.routes';
import songsRouter from './routes/songs.routes';
import playlistsRouter from './routes/playlists.routes';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

// Configuración de CORS
const allowedOrigins = ['http://localhost:3000', process.env.FRONTEND_URL].filter(Boolean);

const corsOptions: cors.CorsOptions = {
  origin: (origin, callback) => {
    // Permitir peticiones sin 'origin' (como Postman, apps móviles, etc.)
    if (!origin) {
      return callback(null, true);
    }
    // Permitir peticiones desde los orígenes autorizados
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true, // Permitir cookies y cabeceras de autorización
};

app.use(cors(corsOptions));
app.use(express.json());

app.use('/upload', uploadRouter);
app.use('/songs', songsRouter);
app.use('/playlists', playlistsRouter);

app.get('/', (req, res) => {
  res.json({ message: 'API is running' });
});

export default app;
