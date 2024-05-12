import express from 'express';
import { addProduct, deleteProduct, getProduct, getProducts, updateProduct } from '../controllers/product.controller.js';

const router = express.Router();

router.get('/', getProducts);

router.get('/:id', getProduct);

router.put('/:id', updateProduct);

router.post('/', addProduct);

router.delete('/:id', deleteProduct);

export default router;