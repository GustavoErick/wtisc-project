import express from 'express';
import { verifyAdmin, verifyToken } from '../middleware/verifyToken.js';
import { addLecture, deleteLecture, getLecture, getLectures, presenceLecture, updateLecture } from '../controllers/lecture.controller.js';

const router = express.Router();

// RETORNA UMA LISTA DE PALESTRAS
router.get('/', getLectures);

// RETORNA UMA PALESTRA ESPECIFICADO POR UM ID
router.get('/:id', getLecture);

// CRIA UMA NOVA PALESTRA
router.post('/', verifyAdmin, addLecture);

// EDITA UMA PALESTRA ESPECIFICADO POR UM ID
router.put('/:id', verifyAdmin, updateLecture);

// DELETA UM MINICURSO ESPECIFICADO POR UM ID
router.delete('/:id', verifyAdmin, deleteLecture);

// DECLARA O USUÁRIO COMO PRESENTE NA PALESTRA
router.put('/auth/:id', verifyToken, presenceLecture);

export default router;