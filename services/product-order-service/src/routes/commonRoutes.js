import { Router } from 'express';
const router = Router();
import authenticateToken from '../middlewares/verifyToken.js';
import { authorizeRoles } from '../middlewares/checkRole.js';
import {
    createProduct,
    deleteProduct,
    getAllProducts,
    getProductById,
    updateProduct
} from '../controllers/productController.js';
import checkType from '../middlewares/checkType.js';
import {
    acceptOrderByDirector,
    acceptOrderByResponsable,
    createOrder,
    deleteOrder,
    getAllOrders,
    getAllOrdersByStatut,
    getAllOrdersForDirecteur,
    getAllOrdersForResponsable,
    getOrderById,
    refuseOrder,
    updateOrder
} from '../controllers/orderController.js';

// ==================== BASIC Product CRUD ====================
router.get(
    '/product',
    authenticateToken,
    authorizeRoles(1),
    getAllProducts
);

router.get(
    '/product/:id',
    authenticateToken,
    authorizeRoles(1),
    getProductById
);

router.post(
    '/product',
    authenticateToken,
    authorizeRoles(1),
    checkType,
    createProduct
);

router.put(
    '/product/:id',
    authenticateToken,
    authorizeRoles(1),
    checkType,
    updateProduct
);

router.delete(
    '/product/:id',
    authenticateToken,
    authorizeRoles(1),
    deleteProduct
);

// ==================== BASIC Order CRUD ====================
router.get(
    '/order',
    authenticateToken,
    authorizeRoles(1),
    getAllOrders
);

router.get(
    '/order/:id',
    authenticateToken,
    getOrderById
);

router.post(
    '/router',
    authenticateToken,
    createOrder
);

router.put(
    '/order/:id',
    authenticateToken,
    updateOrder
);

router.delete(
    '/order/:id',
    authenticateToken,
    deleteOrder
);

// ==================== OTHERS ====================
router.get(
    '/order/directeur',
    authenticateToken,
    authorizeRoles(2),
    getAllOrdersForDirecteur
);

router.get(
    '/order/responsable',
    authenticateToken,
    authorizeRoles(1),
    getAllOrdersForResponsable
);

router.get(
    '/order/custom',
    authenticateToken,
    authorizeRoles(1,2),
    getAllOrdersByStatut
);

router.patch(
    '/order/:id/accept-by-responsable',
    authenticateToken,
    authorizeRoles(1),
    acceptOrderByResponsable
);

router.patch(
    '/order/:id/accept-by-director',
    authenticateToken,
    authorizeRoles(2),
    acceptOrderByDirector
);

router.post(
    '/order/:id/reject',
    authenticateToken,
    authorizeRoles(1,2),
    refuseOrder
);

export default router;