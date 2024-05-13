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

    // const body = req.body;
    // const tokenUserId = req.userId;

    // //VERIFICA SE O USUÁRIO ESTEVE PRESENTE NO EVENTO

    // try {
        
    //     const newCertificate = await prisma.certificate.create({
    //         data: {
    //             ...body,
    //             userId: tokenUserId
    //         }
    //     });

    //     res.status(201).json(newCertificate);

    // } catch (error) {
        
    //     console.log(error);
    //     res.status(400).json({message: 'Falha ao adicionar certificado!'});

    // }
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

export const issueCertificate = async (req, res) => {

    // ID DO CERTIFICADO PASSADO PELA URL
    const id = req.params.id;

    // ID DO USUÁRIO DA REQUISIÇAO/USUÁRIO LOGADO 
    const tokenUserId = req.userId;

    try {
        
        // GERA O CERTIFICADO EM PDF

    } catch (error) {
        
        console.log(error);
        res.status(400).json({message: 'Erro ao emitir certificado!'});

    }

}