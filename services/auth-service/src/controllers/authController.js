import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Agence, User } from '../models/relations.js';
import { addUserToken, blacklistUserTokens } from '../middlewares/tokens.js';

dotenv.config();

const URLMapper = {
  1: "http://localhost:3004/responsable",
  2: "http://localhost:3004/admin",
  3: "http://localhost:3004/employer"
}

export const login = async (req, res) => {
    try {
      const { username, mdp } = req.body;
      if (!mdp) return res.status(400).json({ message: 'Mot de passe manquant' });

      const user = await User.findOne({ where: { username, bloquer: false } });
      if (!user) return res.status(401).json({ message: 'Identifiants incorrects' });

      const isMatch = await bcrypt.compare(mdp, user.mdp);
      if (!isMatch) return res.status(401).json({ message: 'Identifiants incorrects' });
  
      const token = jwt.sign({
        id: user.id,
        id_role: user.id_role,
        id_agence: user.id_agence
      }, process.env.JWT_SECRET,
      {
        expiresIn: '1h'
      }
      );

      addUserToken(user.id, token);
      
      const redirectURL = URLMapper[user.id_role];
      
      res.json({ token, redirectURL });
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
          attributes: ['nom', 'type'] // champs souhaités de la table agences
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
  
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    blacklistUserTokens(userId);
    res.json({ message: 'Vous avez été déconnecté avec succès.' });
};