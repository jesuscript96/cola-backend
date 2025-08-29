import dotenv from 'dotenv';

import express from 'express';
import cors from 'cors';

import uploadRouter from './routes/upload.routes';
import songsRouter from './routes/songs.routes';
import playlistsRouter from './routes/playlists.routes';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use('/api/upload', uploadRouter);
app.use('/api/songs', songsRouter);
app.use('/api/playlists', playlistsRouter);

app.get('/', (req, res) => {
  res.json({ message: 'API is running' });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
