import prisma from '../../lib/prisma';
import { getMinicourse, getMinicourses, addMinicourse, 
updateMinicourse, deleteMinicourse, presenceMinicourse } from '../minicourse.controller.js';


// Mock das funções do prisma 
jest.mock('../../lib/prisma', () => ({
    minicourse: {
        findUnique: jest.fn(),
        findMany: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn()
    }, 
    minicourseEnrollment: { 
        findUnique: jest.fn(),
        update: jest.fn()
    }
}));

describe('Minicourse Controller', () => {

    let req, res;

    beforeEach(() => {
        req = { params: {}, body: {}, userId: null };
        res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    });

    describe('getMinicourse', () => {
        it('deve retornar um minicurso com sucesso', async () => {
            req.params.id = 1;
            const mockMinicourse = { id: 1, title: 'Test Minicourse' };
            prisma.minicourse.findUnique.mockResolvedValue(mockMinicourse);

            await getMinicourse(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(mockMinicourse);
        });

        it('deve retornar erro se o minicurso não for encontrado', async () => {
            req.params.id = 1;
            prisma.minicourse.findUnique.mockResolvedValue(null);

            await getMinicourse(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ message: 'Erro ao buscar minicurso: Credenciais inválidas!' });
        });

        it('deve lidar com falha na busca do minicurso', async () => {
            req.params.id = 1;
            prisma.minicourse.findUnique.mockRejectedValue(new Error('DB Error'));

            await getMinicourse(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ message: 'Falha ao buscar minicurso!' });
        });
    });

    describe('getMinicourses', () => {
        it('deve retornar uma lista de minicursos', async () => {
            const mockMinicourses = [{ id: 1, title: 'Test Minicourse' }];
            prisma.minicourse.findMany.mockResolvedValue(mockMinicourses);

            await getMinicourses(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(mockMinicourses);
        });

        it('deve lidar com falha na busca dos minicursos', async () => {
            prisma.minicourse.findMany.mockRejectedValue(new Error('DB Error'));

            await getMinicourses(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ message: 'Falha ao buscar minicursos!' });
        });
    });

    describe('addMinicourse', () => {
        it('deve adicionar um minicurso com sucesso', async () => {
            req.body = { title: 'New Minicourse' };
            const mockMinicourse = { id: 1, ...req.body };
            prisma.minicourse.create.mockResolvedValue(mockMinicourse);

            await addMinicourse(req, res);

            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith(mockMinicourse);
        });

        it('deve lidar com falha ao adicionar um minicurso', async () => {
            req.body = { title: 'New Minicourse' };
            prisma.minicourse.create.mockRejectedValue(new Error('DB Error'));

            await addMinicourse(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ message: 'Falha ao adicionar minicurso!' });
        });
    });

    describe('updateMinicourse', () => {
        it('deve atualizar um minicurso com sucesso', async () => {
            req.params.id = 1;
            req.body = { title: 'Updated Minicourse' };
            const mockMinicourse = { id: 1, ...req.body };
            prisma.minicourse.update.mockResolvedValue(mockMinicourse);

            await updateMinicourse(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ message: 'Minicurso atualizado com sucesso!' });
        });

        it('deve lidar com falha ao atualizar o minicurso', async () => {
            req.params.id = 1;
            prisma.minicourse.update.mockRejectedValue(new Error('DB Error'));

            await updateMinicourse(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ message: 'Falha ao atualizar minicurso!' });
        });
    });

    describe('deleteMinicourse', () => {
        it('deve deletar um minicurso com sucesso', async () => {
            req.params.id = 1;
            prisma.minicourse.delete.mockResolvedValue({});

            await deleteMinicourse(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ message: 'Minicurso deletado com sucesso!' });
        });

        it('deve lidar com falha ao deletar o minicurso', async () => {
            req.params.id = 1;
            prisma.minicourse.delete.mockRejectedValue(new Error('DB Error'));

            await deleteMinicourse(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ message: 'Falha ao deletar minicurso!' });
        });
    });

    describe('presenceMinicourse', () => {
        it('deve confirmar presença com sucesso', async () => {
            req.params.id = 1;
            req.userId = 1;
            const mockMinicourse = { id: 1 };
            const mockEnrollment = { id: 1, status: 'PRESENT' };
            prisma.minicourse.findUnique.mockResolvedValue(mockMinicourse);
            prisma.minicourseEnrollment.findUnique.mockResolvedValue(mockEnrollment);
            prisma.minicourseEnrollment.update.mockResolvedValue(mockEnrollment);

            await presenceMinicourse(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ message: 'Presença confirmada com sucesso!' });
        });

        it('deve retornar erro se o usuário não estava inscrito no minicurso', async () => {
            req.params.id = 1;
            req.userId = 1;
            const mockMinicourse = { id: 1 };
            prisma.minicourse.findUnique.mockResolvedValue(mockMinicourse);
            prisma.minicourseEnrollment.findUnique.mockResolvedValue(null);

            await presenceMinicourse(req, res);

            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith({ message: 'Você não estava inscrito no minicurso!' });
        });

        it('deve lidar com falha ao confirmar presença', async () => {
            req.params.id = 1;
            req.userId = 1;
            prisma.minicourse.findUnique.mockRejectedValue(new Error('DB Error'));

            await presenceMinicourse(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ message: 'Falha ao confirmar presença!' });
        });
    });
});
