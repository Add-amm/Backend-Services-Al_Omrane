import dotenv from 'dotenv';

dotenv.config();

import app from "./app.js";
import { authenticate, sync } from './config/database.js';

const PORT = process.env.PORT || 4005;

const startServer = async () => {
    try {
      await authenticate();
      await sync();
      console.log('Base de données connectée et modèles synchronisés avec succès.');

      app.listen(PORT, () => console.log(`users-management service running on port ${PORT}`));
    } catch (err) {
      console.error('Impossible de se connecter :', err);
    }
  };
  
startServer();