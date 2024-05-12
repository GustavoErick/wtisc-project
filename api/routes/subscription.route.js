import express from 'express';
import { verifyToken } from '../middleware/verifyToken.js';
import { addLecureEnrollment, addMinicourseEnrollment, deleteLectureEnrollment, deleteMinicourseEnrollment, getLecureEnrollment, getLecuresEnrollment, getMinicourseEnrollment, getMinicoursesEnrollment, setStatusLectureEnrollment, updateLectureEnrollment, updateMinicourseEnrollment } from '../controllers/subscription.controller.js';

const router = express.Router();

router.get('/lectures', verifyToken, getLecuresEnrollment);

router.get('/lectures/:id', verifyToken, getLecureEnrollment);

// RECEBE O ID DA PALESTRA 
router.post('/lectures/', verifyToken, addLecureEnrollment);

router.put('/lectures/:id', verifyToken, updateLectureEnrollment);

router.delete('/lectures/:id', verifyToken, deleteLectureEnrollment);

//router.post('/lectures/auth/:id', verifyToken, setStatusLectureEnrollment);

router.get('/minicourses', verifyToken, getMinicoursesEnrollment);

router.get('/minicourses/:id', verifyToken, getMinicourseEnrollment);

router.post('/minicourses/', verifyToken, addMinicourseEnrollment);

router.put('/minicourses/:id', verifyToken, updateMinicourseEnrollment);

router.delete('/minicourses/:id', verifyToken, deleteMinicourseEnrollment);

export default router;