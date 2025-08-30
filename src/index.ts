import 'dotenv/config'; // Mantenemos la importación de dotenv para la carga local
import express from 'express';
import cors from 'cors';
import uploadRouter from './routes/upload.routes';
import songsRouter from './routes/songs.routes';
import playlistsRouter from './routes/playlists.routes';
import authRouter from './routes/auth.routes'; // Importar las nuevas rutas de autenticación

const app = express();

// Configuración de CORS (ya estaba bien, la mantenemos)
const allowedOrigins = ['http://localhost:3000', process.env.FRONTEND_URL].filter(Boolean);
const corsOptions: cors.CorsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());

// --- CAMBIO IMPORTANTE: AÑADIMOS DE NUEVO EL PREFIJO /api ---
app.use('/api/upload', uploadRouter);
app.use('/api/songs', songsRouter);
app.use('/api/playlists', playlistsRouter);
app.use('/api/auth', authRouter); // Usar las nuevas rutas de autenticación

// Creamos una ruta base para verificar que la API funciona
app.get('/api', (req, res) => {
  res.json({ message: 'API is alive!' });
});

export default app;