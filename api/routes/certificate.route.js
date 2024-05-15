import express from 'express';
import { verifyAdmin, verifyToken } from '../middleware/verifyToken.js';
import { addCertificate, deleteCertificate, getCertificate, getCertificates, issueCertificate, updateCertificate, viewCertificate } from '../controllers/certificate.controller.js';

const router = express.Router();

router.get('/', verifyAdmin, getCertificates);

router.get('/:id', verifyToken, getCertificate);

router.post('/', verifyToken, addCertificate);

// USUÁRIO ATUALIZAR CERTIFICADO?
router.put('/:id', verifyToken, updateCertificate);

router.delete('/:id', verifyToken, deleteCertificate);

router.get('/view/:id', verifyToken, viewCertificate);

router.get('/issue/:id', verifyToken, issueCertificate);

export default router;