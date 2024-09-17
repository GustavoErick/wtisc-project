import prisma from '../../lib/prisma.js';
import { 
    getLecuresEnrollment, 
    getLecureEnrollment, 
    addLecureEnrollment, 
    updateLectureEnrollment, 
    deleteLectureEnrollment,
    getMinicoursesEnrollment,
    getMinicourseEnrollment,
    deleteMinicourseEnrollment
} from '../subscription.controller.js';

// Mock do prisma
jest.mock('../../lib/prisma.js', () => ({
    lectureEnrollment: {
        findMany: jest.fn(),
        findUnique: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
    },
    lecture: {
        findUnique: jest.fn(),
        update: jest.fn(),
    },
    minicourseEnrollment: {
        findMany: jest.fn(),
        findUnique: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
    },
    minicourse: {
        findUnique: jest.fn(),
        update: jest.fn(),
    }
}));

// bloco geral de testes do Subscription Controller
describe('Subscription Controller', () => {
    let req, res;

    beforeEach(() => {
        req = {
            params: { id: '1' },
            body: {},
            userId: 'user123',
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
    });

    describe('getLecuresEnrollment', () => {
        it('deve retornar todas as inscrições em palestras', async () => {
            prisma.lectureEnrollment.findMany.mockResolvedValue([{ enrollmentId: 1 }]);

            await getLecuresEnrollment(req, res);

            expect(prisma.lectureEnrollment.findMany).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith([{ enrollmentId: 1 }]);
        });

        it('deve retornar erro se não encontrar inscrições', async () => {
            prisma.lectureEnrollment.findMany.mockResolvedValue(null);

            await getLecuresEnrollment(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ message: 'Nenhuma inscrição em palestras encontrada!' });
        });
    });

    describe('getLecureEnrollment', () => {
        it('deve retornar uma inscrição específica', async () => {
            prisma.lectureEnrollment.findUnique.mockResolvedValue({ enrollmentId: 1 });

            await getLecureEnrollment(req, res);

            expect(prisma.lectureEnrollment.findUnique).toHaveBeenCalledWith({
                where: { enrollmentId: '1', userId: 'user123' }
            });
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ enrollmentId: 1 });
        });

        it('deve retornar erro se a inscrição não for encontrada', async () => {
            prisma.lectureEnrollment.findUnique.mockResolvedValue(null);

            await getLecureEnrollment(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ message: 'Erro ao buscar incrições: Credenciais inválidas!' });
        });
    });

    describe('addLecureEnrollment', () => {
        beforeEach(() => {
            req.body = { lectureId: 'lecture123' };
        });

        it('deve criar uma nova inscrição com sucesso', async () => {
            prisma.lecture.findUnique.mockResolvedValue({ lectureId: 'lecture123', enrolled: 10, capacity: 20 });
            prisma.lectureEnrollment.create.mockResolvedValue({ enrollmentId: 1 });

            await addLecureEnrollment(req, res);

            expect(prisma.lectureEnrollment.create).toHaveBeenCalledWith({
                data: { lectureId: 'lecture123', userId: 'user123' }
            });
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith({ enrollmentId: 1 });
        });

        it('deve retornar erro se a palestra não for encontrada', async () => {
            prisma.lecture.findUnique.mockResolvedValue(null);

            await addLecureEnrollment(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ message: 'Palestra inexistente!' });
        });

        it('deve retornar erro se a capacidade for atingida', async () => {
            prisma.lecture.findUnique.mockResolvedValue({ lectureId: 'lecture123', enrolled: 20, capacity: 20 });

            await addLecureEnrollment(req, res);

            expect(res.status).toHaveBeenCalledWith();
            expect(res.json).toHaveBeenCalledWith({ message: 'Limite de inscrições no minicurso atingido!' });
        });
    });

    describe('updateLectureEnrollment', () => {
        beforeEach(() => {
            req.body = { lectureId: 'lecture123' };
        });

        it('deve atualizar uma inscrição com sucesso', async () => {
            prisma.lectureEnrollment.update.mockResolvedValue({ enrollmentId: 1 });

            await updateLectureEnrollment(req, res);

            expect(prisma.lectureEnrollment.update).toHaveBeenCalledWith({
                where: { enrollmentId: '1', userId: 'user123' },
                data: { lectureId: 'lecture123' }
            });
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ enrollmentId: 1 });
        });

        it('deve retornar erro ao tentar atualizar uma inscrição inexistente', async () => {
            prisma.lectureEnrollment.update.mockResolvedValue(null);

            await updateLectureEnrollment(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ message: 'Erro ao atualizar incrição: Credenciais inválidas!' });
        });
    });

    describe('deleteLectureEnrollment', () => {
        it('deve deletar uma inscrição com sucesso', async () => {
            prisma.lectureEnrollment.findUnique.mockResolvedValue({ lectureId: 'lecture123' });

            await deleteLectureEnrollment(req, res);

            expect(prisma.lectureEnrollment.delete).toHaveBeenCalledWith({ where: { enrollmentId: '1' } });
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ message: 'Inscrição deletada com sucesso!' });
        });

        it('deve retornar erro ao tentar deletar uma inscrição inexistente', async () => {
            prisma.lectureEnrollment.findUnique.mockResolvedValue(null);

            await deleteLectureEnrollment(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ message: 'Credenciais inválidas!' });
        });
    });

        describe('getMinicoursesEnrollment', () => {
            it('deve retornar todas as inscrições em minicursos', async () => {
                prisma.minicourseEnrollment.findMany.mockResolvedValue([{ enrollmentId: 1 }]);
    
                await getMinicoursesEnrollment(req, res);
    
                expect(prisma.minicourseEnrollment.findMany).toHaveBeenCalled();
                expect(res.status).toHaveBeenCalledWith(200);
                expect(res.json).toHaveBeenCalledWith([{ enrollmentId: 1 }]);
            });
    
            it('deve retornar erro se não encontrar inscrições', async () => {
                prisma.minicourseEnrollment.findMany.mockResolvedValue(null);
    
                await getMinicoursesEnrollment(req, res);
    
                expect(res.status).toHaveBeenCalledWith(400);
                expect(res.json).toHaveBeenCalledWith({ message: 'Nenhuma inscrição em minicursos encontrada!' });
            });
        });
    
        describe('getMinicourseEnrollment', () => {
            it('deve retornar uma inscrição específica em minicurso', async () => {
                prisma.minicourseEnrollment.findUnique.mockResolvedValue({ enrollmentId: 1 });
    
                await getMinicourseEnrollment(req, res);
    
                expect(prisma.minicourseEnrollment.findUnique).toHaveBeenCalledWith({
                    where: { enrollmentId: '1', userId: 'user123' }
                });
                expect(res.status).toHaveBeenCalledWith(200);
                expect(res.json).toHaveBeenCalledWith({ enrollmentId: 1 });
            });
    
            it('deve retornar erro se a inscrição não for encontrada', async () => {
                prisma.minicourseEnrollment.findUnique.mockResolvedValue(null);
    
                await getMinicourseEnrollment(req, res);
    
                expect(res.status).toHaveBeenCalledWith(400);
                expect(res.json).toHaveBeenCalledWith({ message: 'Erro ao buscar incrições: Credenciais inválidas!' });
            });
        });
    
        describe('deleteMinicourseEnrollment', () => {
            it('deve deletar uma inscrição em minicurso com sucesso', async () => {
                prisma.minicourseEnrollment.findUnique.mockResolvedValue({ minicourseId: 'minicourse123', userId: 'user123' });
    
                await deleteMinicourseEnrollment(req, res);
    
                expect(prisma.minicourseEnrollment.delete).toHaveBeenCalledWith({ where: { enrollmentId: '1' } });
                expect(prisma.minicourse.update).toHaveBeenCalledWith({
                    where: { minicourseId: 'minicourse123' },
                    data: { enrolled: { increment: -1 } }
                });
                expect(res.status).toHaveBeenCalledWith(200);
                expect(res.json).toHaveBeenCalledWith({ message: 'Inscrição no minicurso deletada com sucesso!' });
            });
    
            it('deve retornar erro ao tentar deletar uma inscrição inexistente', async () => {
                prisma.minicourseEnrollment.findUnique.mockResolvedValue(null);
    
                await deleteMinicourseEnrollment(req, res);
    
                expect(res.status).toHaveBeenCalledWith(400);
                expect(res.json).toHaveBeenCalledWith({ message: 'Erro ao deletar inscrição no minicurso!' });
            });
    
            it('deve retornar erro se o usuário não for autorizado a deletar', async () => {
                prisma.minicourseEnrollment.findUnique.mockResolvedValue({ userId: 'otherUserId' });
    
                await deleteMinicourseEnrollment(req, res);
    
                expect(res.status).toHaveBeenCalledWith(403);
                expect(res.json).toHaveBeenCalledWith({ message: 'Usuário não autorizado!' });
            });
        });
    });
