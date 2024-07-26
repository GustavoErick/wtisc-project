import prisma from "../lib/prisma.js";
import bcrypt from "bcrypt";

export const getUsers = async (req, res) => {
    try {
        const users = await prisma.user.findMany({
            select: {
                userId: true,
                name: true,
                surname: true,
                cpf: true,
                Role: true,
                password: false,
            }
        });

        if(!users) {
            return res.status(400).json({message: 'Erro ao buscar usuários: Nenhum usuário cadastrado!'});
        }

        res.status(200).json(users);

    } catch (error) {

        console.log(error);
        res.status(500).json(({message: 'Falha ao buscar usuários!'}));

    }
}

export const getUser = async (req, res) => {
    const id = req.params.id;

    try {
        const user = await prisma.user.findUnique({
            where: {
                userId: id,
            },
            select: {
                userId: true,
                name: true,
                surname: true,
                cpf: true,
                Role: true,
                password: false,
            }
        });

        if(!user) {
            return res.status(400).json({message: 'Erro ao buscar usuário: Credenciais inválidas!'});
        }

        res.status(200).json(user);

    } catch (error) {

        console.log(error);
        res.status(500).json(({message: 'Erro ao buscar usuário: Credenciais inválidas!'}));

    }
}

export const updateUser = async (req, res) => {
    // id da url
    const id = req.params.id;

    // id da requisição
    const tokenUserId = req.userId;

    if(id !== tokenUserId) {
        return res.status(403).json({message: 'Usuário não autorizado!'});
    }

    // separando a senha e a role dos demais parâmetros
    const {password, Role, ...inputs} = req.body;

    // se o usuário deseja alterar sua Role, ele tem acesso negado
    if (Role) {
        return res.status(403).json(({message: 'Falha ao atualizar usuário!'}));
    }

    try {

        let updatedPassword = null;

        // se a senha for um dos parâmetros a serem alterados
        if (password) {
            // a nova senha será encriptada
            updatedPassword = await bcrypt.hash(password, 10);
        }

        const updatedUser = await prisma.user.update({
            where: {
                userId: id,
            },
            data: {
                ...inputs,
                // se a nova senha não for nula, se espalhará para o objeto senha
                ...(updatedPassword && {password: updatedPassword}),
            },
            select: {
                userId: true,
                name: true,
                surname: true,
                cpf: true,
                Role: true,
                password: false,
            }
        });

        res.status(200).json(updatedUser);

    } catch (error) {

        console.log(error);
        res.status(500).json(({message: 'Falha ao atualizar usuário!'}));

    }
}

export const deleteUser = async (req, res) => {
    
    const id = req.params.id;
    const tokenUserId = req.userId;


    if (id !== tokenUserId) {
        res.status(403).json({message: 'Usuário não autorizado!'});
    }

    try {
        res.clearCookie('token');
        await prisma.user.delete({
            where: {
                userId: id,
            },
        });

        res.status(200).json({message: 'Usuário deletado com sucesso!'});
        

    } catch (error) {

        console.log(error);
        res.status(500).json(({message: 'Falha ao deletar usuário!'}));

    }
}

export const userSubscriptions = async (req, res) => {

    const tokenUserId = req.userId;

    try {

        const userMinicourseEnrollment = await prisma.minicourseEnrollment.findMany({
            where: {
                userId: tokenUserId
            }, 
            include: {
                //user: true,
                minicourse: true
            }
        });

        const userLectureEnrollment = await prisma.lectureEnrollment.findMany({
            where: {
                userId: tokenUserId
            },
            include: {
                //user: true,
                lecture: true
            }
        });

        res.status(200).json({userLectureEnrollment, userMinicourseEnrollment});
        
    } catch (error) {
        
        console.log(error);
        res.status(500).json({message : 'Erro ao listar inscrições'});

    }

}

export const userCertificates = async (req, res) => {

    const tokenUserId = req.userId;

    try {
        
        const certificates = await prisma.certificate.findMany({
            where: {
                userId: tokenUserId
            }
        });

        if(!certificates) {
            return res.status(400).json({message: 'Credenciais inválidas!'});
        }

        res.status(200).json(certificates);

    } catch (error) {

        console.log(error);
        res.status(400).json({message: 'Falha ao buscar certificados!'});

    }

}