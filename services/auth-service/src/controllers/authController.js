import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Agence, User, Role } from '../models/relations.js';
import { addTokenToBlacklist } from '../middlewares/tokenBlacklist.js';

dotenv.config();

export const login = async (req, res) => {
    try {
      const { username, mdp } = req.body;
      if (!mdp) return res.status(400).json({ message: 'Mot de passe manquant' });

      const user = await User.findOne({ where: { username, bloquer: false } });
      if (!user) return res.status(401).json({ message: 'Identifiants incorrects' });

      const isMatch = await bcrypt.compare(mdp, user.mdp);
      if (!isMatch) return res.status(401).json({ message: 'Identifiants incorrects' });
  
      const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET);
      res.json({ token });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
};

export const profile = async (req, res) => {
    try {
      // req.user set by authenticateToken middleware
      const user = await User.findByPk(req.user.id, {
        attributes: { exclude: ['id_role', 'id_agence', 'mdp', 'bloquer', 'createdAt', 'updatedAt'] }, // exclude
        include: [{
          model: Agence, // modèle Agence lié à User par id_agence
          attributes: ['nom', 'type', 'departement'] // champs souhaités de la table agences
        }]
      });
      if (!user) return res.status(404).json({ message: 'Utilisateur non trouvé' });
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
};

export const logout = (req, res) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.status(400).json({ message: 'Jeton manquant' });
  
    addTokenToBlacklist(token);
    res.json({ message: 'Vous avez été déconnecté avec succès.' });
};