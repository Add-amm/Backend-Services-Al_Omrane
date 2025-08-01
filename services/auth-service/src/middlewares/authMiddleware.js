import jwt from 'jsonwebtoken';
import { isTokenBlacklisted } from './tokenBlacklist.js';

const { verify } = jwt;

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ message: "Jeton d'accès manquant" });

  if (isTokenBlacklisted(token)) {
    return res.status(401).json({ message: 'Jeton révoqué' });
  }

  verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ message: 'Jeton invalide' });
    req.user = decoded;
    next();
  });
}

export default authenticateToken;