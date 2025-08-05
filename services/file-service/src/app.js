import express, { json } from 'express';
const app = express();
import fileRoutes from './routes/fileRoutes.js';

app.use(json());
app.use(express.urlencoded({ extended: true }));
app.use('/api', fileRoutes);

app.all('/{*any}', (req, res) => { // /{*any} fixes the parameter 1 missing argument bug, it has been placed instead of "*"
  res.status(404).json({ message: `${req.originalUrl} est introuvable sur ce serveur.` });
});

export default app;