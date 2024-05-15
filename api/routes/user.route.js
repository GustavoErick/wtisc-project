import express from 'express';
import { getUsers, getUser, updateUser, deleteUser, userSubscriptions, userCertificates } from '../controllers/user.controller.js';
import { verifyToken } from '../middleware/verifyToken.js';

const router = express.Router();

// RETORNA UMA LISTA DE USUÁRIOS
// PROVAVEL FUNCAO APENAS DE ADMIN
router.get('/', verifyToken, getUsers);

// RETORNA UM USUÁRIO ESPECIFICADO POR UM ID
// USUÁRIO COMUM VAI FAZER ISSO?
router.get('/search/:id', verifyToken, getUser);

// EDITA UM USUÁRIO ESPECIFICADO POR UM ID
router.put('/:id', verifyToken, updateUser );

// DELETA UM USUÁRIO ESPECIFICADO POR UM ID
router.delete('/:id', verifyToken, deleteUser);

// EXIBE AS INCRIÇÕES DO USUÁRIO
router.get('/subscriptions', verifyToken, userSubscriptions);

//EXIBE OS CERTIFICADOS DO USUÁRIO
router.get('/certificates', verifyToken, userCertificates);

export default router;