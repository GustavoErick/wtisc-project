import express from 'express';
import { addProduct, deleteProduct, getProduct, getProducts, updateProduct } from '../controllers/product.controller.js';
import { verifyAdmin } from '../middleware/verifyToken.js';

const router = express.Router();

router.get('/', getProducts);

router.get('/:id', getProduct);

router.put('/:id', verifyAdmin, updateProduct);

router.post('/', verifyAdmin, addProduct);

router.delete('/:id', verifyAdmin, deleteProduct);

export default router;