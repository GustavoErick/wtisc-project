import prisma from '../../lib/prisma.js';
import { getLecture, getLectures, addLecture, updateLecture, deleteLecture, presenceLecture } from '../lecture.controller.js';

jest.mock('../../lib/prisma.js', () => ({
  lecture: {
    findUnique: jest.fn(),
    findMany: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  lectureEnrollment: {
    findUnique: jest.fn(),
    update: jest.fn(),
  }
}));

describe('Lecture Controller', () => {

  let req, res;

  beforeEach(() => {
    req = { params: {}, body: {}, userId: '1' };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });
 
  describe('getLecture', () => {
    it('deve retornar uma palestra com sucesso', async () => {
      req.params.id = '1';
      const mockLecture = { id: 1, name: 'Palestra 1' };
      prisma.lecture.findUnique.mockResolvedValue(mockLecture); 

      await getLecture(req, res); 

      expect(prisma.lecture.findUnique).toHaveBeenCalledWith({
        where: { lectureId: '1' },
      });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockLecture);
    });

    it('deve retornar erro se a palestra não for encontrada', async () => {
      req.params.id = '1';
      prisma.lecture.findUnique.mockResolvedValue(null);

      await getLecture(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Erro ao buscar palestra: Credenciais inválidas!' });
    });

    it('deve retornar erro ao tentar buscar a palestra', async () => {
      req.params.id = '1';
      prisma.lecture.findUnique.mockRejectedValue(new Error('Erro'));

      await getLecture(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Falha ao buscar palestra!' });
    });
  });

  describe('getLectures', () => {
    it('deve retornar uma lista de palestras com sucesso', async () => {
      const mockLectures = [{ id: 1, name: 'Palestra 1' }];
      prisma.lecture.findMany.mockResolvedValue(mockLectures);

      await getLectures(req, res);

      expect(prisma.lecture.findMany).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockLectures);
    });

    it('deve retornar erro ao buscar palestras', async () => {
      prisma.lecture.findMany.mockRejectedValue(new Error('Erro'));

      await getLectures(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Falha ao buscar palestras!' });
    });
  });

  describe('addLecture', () => {
    it('deve adicionar uma palestra com sucesso', async () => {
      req.body = { name: 'Palestra 1' };
      const mockLecture = { id: 1, name: 'Palestra 1' };
      prisma.lecture.create.mockResolvedValue(mockLecture);

      await addLecture(req, res);

      expect(prisma.lecture.create).toHaveBeenCalledWith({ data: req.body });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(mockLecture);
    });

    it('deve retornar erro ao adicionar uma palestra', async () => {
      req.body = { name: 'Palestra 1' };
      prisma.lecture.create.mockRejectedValue(new Error('Erro'));

      await addLecture(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Falha ao adicionar palestra!' });
    });
  });

  describe('updateLecture', () => {
    it('deve atualizar uma palestra com sucesso', async () => {
      req.params.id = '1';
      req.body = { name: 'Palestra Atualizada' };
      const mockUpdatedLecture = { id: 1, name: 'Palestra Atualizada' };
      prisma.lecture.update.mockResolvedValue(mockUpdatedLecture);

      await updateLecture(req, res);

      expect(prisma.lecture.update).toHaveBeenCalledWith({
        where: { lectureId: '1' },
        data: req.body,
      });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'Palestra atualizada com sucesso!' });
    });

    it('deve retornar erro ao tentar atualizar a palestra', async () => {
      req.params.id = '1';
      req.body = { name: 'Palestra Atualizada' };
      prisma.lecture.update.mockRejectedValue(new Error('Erro'));

      await updateLecture(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Falha ao atualizar palestra!' });
    });
  });

  describe('deleteLecture', () => {
    it('deve deletar uma palestra com sucesso', async () => {
      req.params.id = '1';
      prisma.lecture.delete.mockResolvedValue({});

      await deleteLecture(req, res);

      expect(prisma.lecture.delete).toHaveBeenCalledWith({
        where: { lectureId: '1' },
      });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'Palestra deletada com sucesso!' });
    });

    it('deve retornar erro ao tentar deletar a palestra', async () => {
      req.params.id = '1';
      prisma.lecture.delete.mockRejectedValue(new Error('Erro'));

      await deleteLecture(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Falha ao deletar palestra!' });
    });
  });

  describe('presenceLecture', () => {
    it('deve confirmar a presença com sucesso', async () => {
      req.params.id = '1';
      const mockLecture = { id: 1, name: 'Palestra 1' };
      const mockEnrollment = { id: 1, status: 'PRESENT' };

      prisma.lecture.findUnique.mockResolvedValue(mockLecture);
      prisma.lectureEnrollment.findUnique.mockResolvedValue(mockEnrollment);
      prisma.lectureEnrollment.update.mockResolvedValue({ status: 'PRESENT' });

      await presenceLecture(req, res);

      expect(prisma.lecture.findUnique).toHaveBeenCalledWith({
        where: { lectureId: '1' },
      });
      expect(prisma.lectureEnrollment.findUnique).toHaveBeenCalledWith({
        where: {
          lectureId_userId: {
            lectureId: '1',
            userId: '1',
          },
        },
      });
      expect(prisma.lectureEnrollment.update).toHaveBeenCalledWith({
        where: {
          lectureId_userId: {
            lectureId: '1',
            userId: '1',
          },
        },
        data: { status: 'PRESENT' },
      });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'Presença confirmada com sucesso!' });
    });

    it('deve retornar erro se o usuário não estava inscrito na palestra', async () => {
      req.params.id = '1';
      const mockLecture = { id: 1, name: 'Palestra 1' };

      prisma.lecture.findUnique.mockResolvedValue(mockLecture);
      prisma.lectureEnrollment.findUnique.mockResolvedValue(null);

      await presenceLecture(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ message: 'Você não estava inscrito na palestra!' });
    });

    it('deve retornar erro ao tentar confirmar presença', async () => {
      req.params.id = '1';
      prisma.lecture.findUnique.mockRejectedValue(new Error('Erro'));

      await presenceLecture(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Falha ao confirmar presença!' });
    });
  });

});
