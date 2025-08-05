import dotenv from 'dotenv';
dotenv.config();

import app from "./app.js";
import cors from "cors";
import { authenticate, sync } from './config/database.js';

const PORT = process.env.PORT || 3003;

app.use(cors({
    origin: "*", // "http://localhost:3000" URL of the service or frontend it will exchange with
    credentials: true,
  }));

const startServer = async () => {
    try {
      await authenticate();
      await sync();
      console.log('Base de données connectée et modèles synchronisés avec succès.');

      app.listen(PORT, () => console.log(`auth-service running on port ${PORT}`));
    } catch (err) {
      console.error('Impossible de se connecter :', err);
    }
  };
  
  startServer();