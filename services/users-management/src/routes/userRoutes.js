import { Router } from 'express';
const router = Router();
import { authorizeRoles } from '../middlewares/checkRole.js';
import { validateFields } from '../middlewares/validateRequiredFields.js';
import authenticateToken from '../middlewares/verifyToken.js';
import {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    updateThisUserPassword,
    deleteUser
} from '../controllers/userController.js';



// ==================== BASIC CRUD ====================
router.get(
    '/user',
    authenticateToken,
    authorizeRoles(1),
    getAllUsers
);

router.get(
    '/user/:id',
    authenticateToken,
    authorizeRoles(1),
    getUserById
);

router.post(
    '/user',
    authenticateToken,
    authorizeRoles(1),
    validateFields,
    createUser
);

router.put(
    '/user/:id',
    authenticateToken,
    authorizeRoles(1),
    validateFields,
    updateUser
);

router.delete(
    '/user/:id',
    authenticateToken,
    authorizeRoles(1),
    deleteUser
);

// ==================== ADDITIONAL ====================
router.post(
    '/user/changepassword',
    authenticateToken,
    updateThisUserPassword
);

export default router;