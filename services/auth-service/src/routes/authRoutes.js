import { Router } from 'express';
const router = Router();
import { validateLogin } from '../middlewares/validateRequest.js';
import authenticateToken from '../middlewares/authMiddleware.js';
import { login, logout, profile } from '../controllers/authController.js';

// Ensure route paths are valid and do not contain syntax errors
router.post('/login', validateLogin, login);
router.post('/logout', authenticateToken, logout);
router.get('/profile', authenticateToken, profile);

export default router;