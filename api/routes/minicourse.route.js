import express from 'express';

import { verifyAdmin, verifyToken } from '../middleware/verifyToken.js';
import { getMinicourse, getMinicourses, addMinicourse, updateMinicourse, deleteMinicourse, presenceMinicourse } from '../controllers/minicourse.controller.js';

const router = express.Router();

// RETORNA UMA LISTA DE MINICURSOS
router.get('/', getMinicourses);

// RETORNA UM MINICURSO ESPECIFICADO POR UM ID
router.get('/:id', getMinicourse);

// CRIA UM NOVO MINICURSO
router.post('/', verifyAdmin, addMinicourse);

// EDITA UM MINICURSO ESPECIFICADO POR UM ID
router.put('/:id', verifyAdmin, updateMinicourse);

// DELETA UM MINICURSO ESPECIFICADO POR UM ID
router.delete('/:id', verifyAdmin, deleteMinicourse);

// DECLARA O USUÁRIO COMO PRESENTE NO MINICURSO
router.put('/auth/:id', verifyToken, presenceMinicourse);

export default router;