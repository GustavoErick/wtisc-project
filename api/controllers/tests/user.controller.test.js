import prisma from '../../lib/prisma';
import bcrypt from 'bcrypt';
import { getUsers, getUser, updateUser, deleteUser,
userSubscriptions, userCertificates } from '../user.controller.js';

// Mockando o prisma e bcrypt
jest.mock('../../lib/prisma', () => ({
    user: {
        findMany: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
    },
    minicourseEnrollment: {
        findMany: jest.fn(),
    },
    lectureEnrollment: {
        findMany: jest.fn(),
    },
    certificate: {
        findMany: jest.fn(),
    }
}));

jest.mock('bcrypt', () => ({
    hash: jest.fn(),
}));

describe('User Controller', () => {
    let req, res;

    beforeEach(() => {
        req = { params: {}, body: {}, userId: null };
        res = { status: jest.fn().mockReturnThis(), json: jest.fn(), clearCookie: jest.fn() };
    });

    describe('getUsers', () => {
        it('deve retornar uma lista de usuários', async () => {
            const mockUsers = [{ userId: 1, name: 'Beatriz', surname: 'Nascimento' }];
            prisma.user.findMany.mockResolvedValue(mockUsers);

            await getUsers(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(mockUsers);
        });

        it('deve lidar com falha ao buscar usuários', async () => {
            prisma.user.findMany.mockRejectedValue(new Error('DB Error'));

            await getUsers(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ message: 'Falha ao buscar usuários!' });
        });
    });

    describe('getUser', () => {
        it('deve retornar um usuário com sucesso', async () => {
            req.params.id = 1;
            const mockUser = { userId: 1, name: 'Beatriz', surname: 'Nascimento' };
            prisma.user.findUnique.mockResolvedValue(mockUser);

            await getUser(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(mockUser);
        });

        it('deve lidar com falha ao buscar o usuário', async () => {
            req.params.id = 1;
            prisma.user.findUnique.mockRejectedValue(new Error('DB Error'));

            await getUser(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ message: 'Erro ao buscar usuário: Credenciais inválidas!' });
        });
    });

    describe('updateUser', () => {
        it('deve atualizar o usuário com sucesso', async () => {
            req.params.id = 1;
            req.userId = 1;
            req.body = { name: 'Beatriz Oliveira', password: 'newPassword' };

            const mockUser = { userId: 1, name: 'John Updated', surname: 'Doe' };
            bcrypt.hash.mockResolvedValue('hashedPassword');
            prisma.user.update.mockResolvedValue(mockUser);

            await updateUser(req, res);

            expect(bcrypt.hash).toHaveBeenCalledWith('newPassword', 10);
            expect(prisma.user.update).toHaveBeenCalledWith(expect.anything());
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(mockUser);
        });

        it('deve retornar erro se tentar mudar a role', async () => {
            req.params.id = 1;
            req.userId = 1;
            req.body = { Role: 'admin' };

            await updateUser(req, res);

            expect(res.status).toHaveBeenCalledWith(403);
            expect(res.json).toHaveBeenCalledWith({ message: 'Falha ao atualizar usuário!' });
        });

        it('deve lidar com falha ao atualizar o usuário', async () => {
            req.params.id = 1;
            req.userId = 1;
            req.body = { name: 'Beatriz Oliveira' };

            prisma.user.update.mockRejectedValue(new Error('DB Error'));

            await updateUser(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ message: 'Falha ao atualizar usuário!' });
        });
    });

    describe('deleteUser', () => {
        it('deve deletar um usuário com sucesso', async () => {
            req.params.id = 1;
            req.userId = 1;

            await deleteUser(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ message: 'Usuário deletado com sucesso!' });
        });

        it('deve retornar erro ao tentar deletar outro usuário', async () => {
            req.params.id = 1;
            req.userId = 2;

            await deleteUser(req, res);

            expect(res.status).toHaveBeenCalledWith(403);
            expect(res.json).toHaveBeenCalledWith({ message: 'Usuário não autorizado!' });
        });

        it('deve lidar com falha ao deletar o usuário', async () => {
            req.params.id = 1;
            req.userId = 1;

            prisma.user.delete.mockRejectedValue(new Error('DB Error'));

            await deleteUser(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ message: 'Falha ao deletar usuário!' });
        });
    });

    describe('userSubscriptions', () => {
        it('deve retornar as inscrições do usuário', async () => {
            req.userId = 1;
            const mockMinicourseEnrollment = [{ minicourseId: 1, status: 'CONFIRMED' }];
            const mockLectureEnrollment = [{ lectureId: 1, status: 'CONFIRMED' }];

            prisma.minicourseEnrollment.findMany.mockResolvedValue(mockMinicourseEnrollment);
            prisma.lectureEnrollment.findMany.mockResolvedValue(mockLectureEnrollment);

            await userSubscriptions(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                userLectureEnrollment: mockLectureEnrollment,
                userMinicourseEnrollment: mockMinicourseEnrollment
            });
        });

        it('deve lidar com falha ao buscar inscrições do usuário', async () => {
            req.userId = 1;
            prisma.minicourseEnrollment.findMany.mockRejectedValue(new Error('DB Error'));

            await userSubscriptions(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ message: 'Erro ao listar inscrições' });
        });
    });

    describe('userCertificates', () => {
        it('deve retornar certificados do usuário', async () => {
            req.userId = 1;
            const mockCertificates = [{ certificateId: 1, name: 'Certificado' }];
            prisma.certificate.findMany.mockResolvedValue(mockCertificates);

            await userCertificates(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(mockCertificates);
        });

        it('deve lidar com falha ao buscar certificados do usuário', async () => {
            req.userId = 1;
            prisma.certificate.findMany.mockRejectedValue(new Error('DB Error'));

            await userCertificates(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ message: 'Falha ao buscar certificados!' });
        });
    });
});
