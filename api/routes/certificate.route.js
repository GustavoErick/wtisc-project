import express from 'express';
import { verifyToken } from '../middleware/verifyToken.js';
import { addCertificate, deleteCertificate, getCertificate, getCertificates, updateCertificate } from '../controllers/certificate.controller.js';

const router = express.Router();

router.get('/', verifyToken, getCertificates);

router.get('/:id', verifyToken, getCertificate);

router.post('/', verifyToken, addCertificate);

router.put('/:id', verifyToken, updateCertificate);

router.delete('/:id', verifyToken, deleteCertificate);

export default router;