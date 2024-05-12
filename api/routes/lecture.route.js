import express from 'express';
import { verifyToken } from '../middleware/verifyToken.js';
import { addLecture, deleteLecture, getLecture, getLectures, presenceLecture, updateLecture } from '../controllers/lecture.controller.js';

const router = express.Router();

// RETORNA UMA LISTA DE MINICURSOS
router.get('/', getLectures);

// RETORNA UM MINICURSO ESPECIFICADO POR UM ID
router.get('/:id', getLecture);

// CRIA UM NOVO MINICURSO
router.post('/', verifyToken, addLecture);

// EDITA UM MINICURSO ESPECIFICADO POR UM ID
router.put('/:id', verifyToken, updateLecture);

// DELETA UM MINICURSO ESPECIFICADO POR UM ID
router.delete('/:id', verifyToken, deleteLecture);

router.put('/auth/:id', verifyToken, presenceLecture);

export default router;