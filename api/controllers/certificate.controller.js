import prisma from "../lib/prisma.js";
import path from 'path';
import { fileURLToPath } from 'url';
import ejs from 'ejs';
import puppeteer from 'puppeteer';

export const getCertificates = async (req, res) => {

    try {
        
        const certificates = await prisma.certificate.findMany();

        if (!certificates) {
            return res.status(400).json({message: 'Falha ao buscar certificados!'});
        }

        res.status(200).json(certificates);

    } catch (error) {

        console.log(error);
        res.status(400).json({message: 'Erro ao listar certificados!'});
    }

}


export const getCertificate = async (req, res) => {

    const id = req.params.id;
    const tokenUserId = req.userId;

    try {
        
        const certificate = await prisma.certificate.findUnique({
            where: {
                certificateId: id,
                userId: tokenUserId
            }
        });

        if (!certificate) {
            return res.status(400).json({message: 'Falha ao buscar certificado!'});
        }

        res.status(200).json(certificate);

    } catch (error) {

        console.log(error);
        res.status(400).json({message: 'Erro ao buscar certificado!'});
    }

}

export const addCertificate = async (req, res) => {

    const { eventType, eventId } = req.body;

    const tokenUserId = req.userId;

    let eventEnrollment = {}

    try {
        if (eventType === 'LECTURE') {

            eventEnrollment = await prisma.lectureEnrollment.findUnique({
                where: {
                    lectureId_userId: {
                        lectureId: eventId,
                        userId: tokenUserId,
                    },
                    status: 'PRESENT'
                }
            });

        // eventType === MINICOURSE
        } else {

            eventEnrollment = await prisma.minicourseEnrollment.findUnique({
                where: {
                    minicourseId_userId: {
                        minicourseId: eventId,
                        userId: tokenUserId,
                    },
                    status: 'PRESENT'
                }
            });

        } 

        if (!eventEnrollment) {
            return res.status(400).json({message: 'Usuário não possui inscrição no evento ou não esteve presente!'});
        }

        const newCertificate = await prisma.certificate.create({
            data: {
                eventType: eventType,
                eventId: eventId,
                userId: tokenUserId
            }
        });
        
        res.status(201).json(newCertificate);

    } catch (error) {
        
        console.log(error);
        res.status(400).json({message: 'Erro ao criar certificado!'});

    }
    
}

export const updateCertificate = async (req, res) => {

    const id = req.params.id
    const body = req.body;
    const tokenUserId = req.userId;

    try {
        
        const updatedCertificate = await prisma.certificate.update({
            where: {
                certificateId: id,
                userId: tokenUserId
            },
            data: {
                ...body
            }
        });

        res.status(200).json(updatedCertificate);

    } catch (error) {
        
        console.log(error);
        res.status(400).json({message: 'Erro ao atualizar certificado!'});

    }
}

export const deleteCertificate = async (req, res) => {

    const id = req.params.id;
    const tokenUserId = req.userId;

    try {
        await prisma.certificate.delete({
            where: {
                certificateId: id,
                userId: tokenUserId
            }
        });

        res.status(200).json({message: 'Certificado deletado com sucesso!'});

    } catch (error) {
        
        console.log(error);
        res.status(400).json({message: 'Erro ao deletar certificado!'});

    }
}

export const viewCertificate = async (req, res) => {

    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    const filePath = path.join(__dirname, '../templates/certificates/certificate.ejs');

    // ID DO CERTIFICADO
    const id = req.params.id;

    // ID DO USUÁRIO DA REQUISICAO
    const tokenUserId = req.userId;

    try {
        
        const certificate = await prisma.certificate.findUnique({
            where: {
                certificateId: id
            }
        });

        if (!certificate) {
            return res.status(400).json({message: 'Falha ao visualizar certificado!'});
        }

        if (tokenUserId !== certificate.userId) {
            return res.status(401).json({message: 'Usuário não autorizado!'});
        }

        const user = await prisma.user.findUnique({
            where: {
                userId: tokenUserId
            }
        });

        let event = {}

        if (certificate.eventType === 'LECTURE') {

            event = await prisma.lecture.findUnique({
                where: {
                    lectureId: certificate.eventId
                }
            });

        } else {

            event = await prisma.minicourse.findUnique({
                where: {
                    minicourseId: certificate.eventId
                }
            });

        }

        ejs.renderFile(filePath, {user, event},(err, data) => {

            if (err) {

                console.log(err);
                return res.send('Erro na leitura do arquivo!');

            }
        
            // enviar para o navegador
            return res.send(data);
        });

    } catch (error) {
        console.log(error);
        res.status(400).json({message: 'Erro ao exibir certificado!'});
    }

}

export const issueCertificate = async (req, res) => {

    // TOKEN DO COOKIE DO USUÁRIO QUE TÁ LOGADO
    const token = req.cookies.token;

    // ID DO CERTIFICADO PASSADO PELA URL
    const id = req.params.id;


    try {

        // GERA O CERTIFICADO EM PDF

        // INICIA O NAVEGADOR
        const browser = await puppeteer.launch();

        // NAVEGADOR ABRE UMA NOVA PÁGINA 
        const page = await browser.newPage();

        //const urlSite = 'http://localhost:8800/certificates/view/' + id;
        const urlSite = `http://localhost:8800/certificates/view/${id}`;


        const cookie = {
                name: 'token', // NOME DO TOKEN
                value: token, // VALOR DO TOKEN JWT
                domain: 'localhost', // DOMÍNIO DO COOKIE
                path: '/certificates/', // CAMINHO DO COOKIE
                httpOnly: true, // DEFINE SE O COOKIE É ACESSÍVEL APENAS VIA HTTP
                secure: false // DEFINE SE O COOKIE SÓ DEVE SER ENVIADO ATRA'VES DE CONEXÕES HTTPS
            }
            
        // ADICIONA OS COOKIES AO CONTEXTO DA PÁGINA DO PUPPETEER
        await page.setCookie(cookie);

        // VAI ATÉ A PÁGINA E AGUARDA ELA CARREGAR 
        await page.goto(urlSite, {
            waitUntil: 'networkidle0'
        });

        await page.emulateMediaType('print');

        const pdf = await page.pdf({
            printBackground: true,
            format: 'A4',
            landscape: true
            
        });

        await browser.close();

        res.contentType('application/pdf');

        res.send(pdf);

    } catch (error) {
        
        console.log(error);
        res.status(400).json({message: 'Erro ao emitir certificado!'});

    }

}