import prisma from '../../lib/prisma';
import ejs from 'ejs';
import puppeteer from 'puppeteer';
import { getCertificates, getCertificate, addCertificate, updateCertificate,
deleteCertificate, issueCertificate } from '../certificate.controller.js';


// Mockando o prisma, ejs, puppeteer 
jest.mock('../../lib/prisma', () => ({
    certificate: {
        findMany: jest.fn(),
        findUnique: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
    },
    lectureEnrollment: {
        findUnique: jest.fn(),
    },
    minicourseEnrollment: {
        findUnique: jest.fn(),
    },
    user: {
        findUnique: jest.fn(),
    },
    lecture: {
        findUnique: jest.fn(),
    },
    minicourse: {
        findUnique: jest.fn(),
    },
}));

jest.mock('ejs', () => ({
    renderFile: jest.fn(),
}));

jest.mock('puppeteer', () => ({
    launch: jest.fn(),
}));

describe('Certificate Controller', () => {
    let req, res;

    beforeEach(() => {
        req = { params: {}, body: {}, userId: null, cookies: {} };
        res = { status: jest.fn().mockReturnThis(), json: jest.fn(), contentType: jest.fn(), send: jest.fn() };
    });

    describe('getCertificates', () => {
        it('deve retornar uma lista de certificados', async () => {
            const mockCertificates = [{ certificateId: 1, eventType: 'LECTURE' }];
            prisma.certificate.findMany.mockResolvedValue(mockCertificates);

            await getCertificates(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(mockCertificates);
        });

        it('deve lidar com falha ao buscar certificados', async () => {
            prisma.certificate.findMany.mockRejectedValue(new Error('DB Error'));

            await getCertificates(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ message: 'Erro ao listar certificados!' });
        });
    });

    describe('getCertificate', () => {
        it('deve retornar um certificado com sucesso', async () => {
            req.params.id = 1;
            req.userId = 1;
            const mockCertificate = { certificateId: 1, eventType: 'LECTURE', userId: 1 };
            prisma.certificate.findUnique.mockResolvedValue(mockCertificate);

            await getCertificate(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(mockCertificate);
        });

        it('deve lidar com falha ao buscar certificado', async () => {
            req.params.id = 1;
            prisma.certificate.findUnique.mockRejectedValue(new Error('DB Error'));

            await getCertificate(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ message: 'Erro ao buscar certificado!' });
        });
    });

    describe('addCertificate', () => {
        it('deve adicionar um novo certificado com sucesso', async () => {
            req.body = { eventType: 'LECTURE', eventId: 1 };
            req.userId = 1;
            const mockEnrollment = { status: 'PRESENT' };
            const mockCertificate = { certificateId: 1, eventType: 'LECTURE' };

            prisma.lectureEnrollment.findUnique.mockResolvedValue(mockEnrollment);
            prisma.certificate.create.mockResolvedValue(mockCertificate);

            await addCertificate(req, res);

            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith(mockCertificate);
        });

        it('deve lidar com erro ao adicionar certificado', async () => {
            req.body = { eventType: 'LECTURE', eventId: 1 };
            req.userId = 1;
            prisma.lectureEnrollment.findUnique.mockRejectedValue(new Error('DB Error'));

            await addCertificate(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ message: 'Erro ao criar certificado!' });
        });
    });

    describe('updateCertificate', () => {
        it('deve atualizar um certificado com sucesso', async () => {
            req.params.id = 1;
            req.userId = 1;
            const mockUpdatedCertificate = { certificateId: 1, eventType: 'LECTURE' };

            prisma.certificate.update.mockResolvedValue(mockUpdatedCertificate);

            await updateCertificate(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(mockUpdatedCertificate);
        });

        it('deve lidar com erro ao atualizar certificado', async () => {
            req.params.id = 1;
            req.userId = 1;
            prisma.certificate.update.mockRejectedValue(new Error('DB Error'));

            await updateCertificate(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ message: 'Erro ao atualizar certificado!' });
        });
    });

    describe('deleteCertificate', () => {
        it('deve deletar um certificado com sucesso', async () => {
            req.params.id = 1;
            req.userId = 1;

            await deleteCertificate(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ message: 'Certificado deletado com sucesso!' });
        });

        it('deve lidar com erro ao deletar certificado', async () => {
            req.params.id = 1;
            req.userId = 1;
            prisma.certificate.delete.mockRejectedValue(new Error('DB Error'));

            await deleteCertificate(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ message: 'Erro ao deletar certificado!' });
        });
    });

    describe('issueCertificate', () => {
        it('deve emitir um certificado em PDF', async () => {
            req.cookies.token = 'mockToken';
            req.params.id = 1;

            const mockPdf = Buffer.from('mock pdf');
            const mockBrowser = {
                newPage: jest.fn().mockResolvedValue({
                    setCookie: jest.fn(),
                    goto: jest.fn(),
                    emulateMediaType: jest.fn(),
                    pdf: jest.fn().mockResolvedValue(mockPdf),
                }),
                close: jest.fn(),
            };
            puppeteer.launch.mockResolvedValue(mockBrowser);

            await issueCertificate(req, res);

            expect(res.contentType).toHaveBeenCalledWith('application/pdf');
            expect(res.send).toHaveBeenCalledWith(mockPdf);
        });

        it('deve lidar com erro ao emitir certificado', async () => {
            req.cookies.token = 'mockToken';
            req.params.id = 1;

            puppeteer.launch.mockRejectedValue(new Error('Browser Error'));

            await issueCertificate(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ message: 'Erro ao emitir certificado!' });
        });
    });
});