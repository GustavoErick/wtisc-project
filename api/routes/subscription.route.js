import express from 'express';
import { verifyAdmin, verifyToken } from '../middleware/verifyToken.js';
import { addLecureEnrollment, addMinicourseEnrollment, deleteLectureEnrollment, deleteMinicourseEnrollment, getLecureEnrollment, getLecuresEnrollment, getMinicourseEnrollment, getMinicoursesEnrollment, updateLectureEnrollment, updateMinicourseEnrollment } from '../controllers/subscription.controller.js';

const router = express.Router();

router.get('/lectures', verifyAdmin, getLecuresEnrollment);

router.get('/lectures/:id', verifyToken, getLecureEnrollment);

router.post('/lectures/', verifyToken, addLecureEnrollment);

// USUÁRIO ATUALIZAR INSCRIÇÃO NA PALESTRA?
router.put('/lectures/:id', verifyToken, updateLectureEnrollment);

router.delete('/lectures/:id', verifyToken, deleteLectureEnrollment);

router.get('/minicourses', verifyAdmin, getMinicoursesEnrollment);

router.get('/minicourses/:id', verifyToken, getMinicourseEnrollment);

router.post('/minicourses/', verifyToken, addMinicourseEnrollment);

// USUÁRIO ATUALIZAR INSCRIÇÃO NO MINICURSO?
router.put('/minicourses/:id', verifyToken, updateMinicourseEnrollment);

router.delete('/minicourses/:id', verifyToken, deleteMinicourseEnrollment);

export default router;