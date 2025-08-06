import { Router } from 'express';
import multer, { memoryStorage } from 'multer';
import authenticateToken from '../middlewares/verifyToken.js';
import { authorizeRoles } from '../middlewares/checkRole.js';
import { validateSupplierInput } from '../middlewares/validateSupplier.js';
import {
    getAllSuppliers,
    getSupplierById,
    createSupplier
} from '../controllers/supplierController.js';

const router = Router();

const storage = memoryStorage();
const upload = multer({ storage });

// ==================== BASIC CRUD ====================
router.get(
    '/supplier',
    authenticateToken,
    authorizeRoles(1),
    getAllSuppliers
);

router.get(
    '/supplier/:id',
    authenticateToken,
    authorizeRoles(1),
    getSupplierById
);

router.post(
    '/supplier',
    upload.single('contrat'),
    authenticateToken,
    authorizeRoles(1),
    validateSupplierInput,
    createSupplier
);


export default router;