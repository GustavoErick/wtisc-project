import prisma from "../lib/prisma.js";

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

    const body = req.body;
    const tokenUserId = req.userId;

    try {
        
        const newCertificate = await prisma.certificate.create({
            data: {
                ...body,
                userId: tokenUserId
            }
        });

        res.status(201).json(newCertificate);

    } catch (error) {
        
        console.log(error);
        res.status(400).json({message: 'Falha ao adicionar certificado!'});

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