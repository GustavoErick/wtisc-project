import express from 'express';

import { verifyToken } from '../middleware/verifyToken.js';
import { getMinicourse, getMinicourses, addMinicourse, updateMinicourse, deleteMinicourse, presenceMinicourse } from '../controllers/minicourse.controller.js';

const router = express.Router();

// RETORNA UMA LISTA DE MINICURSOS
router.get('/', getMinicourses);

// RETORNA UM MINICURSO ESPECIFICADO POR UM ID
router.get('/:id', getMinicourse);

// CRIA UM NOVO MINICURSO
router.post('/', verifyToken, addMinicourse);

// EDITA UM MINICURSO ESPECIFICADO POR UM ID
router.put('/:id', verifyToken, updateMinicourse);

// DELETA UM MINICURSO ESPECIFICADO POR UM ID
router.delete('/:id', verifyToken, deleteMinicourse);

// DECLARA O USUÁRIO COMO PRESENTE NO MINICURSO
router.put('/auth/:id', verifyToken, presenceMinicourse);

export default router;