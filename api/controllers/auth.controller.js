import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import prisma from '../lib/prisma.js';

export const register = async (req, res) => {
    
    //const {name, email, password} = req.body;
    const {name, surname, cpf, email, password} = req.body; 
    //console.log(req.body);
    try {
        // HASH PASSWORD
        const hashedPassword = await bcrypt.hash(password, 10); // salt = 10
        
        // CREATE A NEW USER AND SAVE TO DB
        const newUser = await prisma.user.create({ 
            data: {
                name,
                surname,
                cpf,
                email,
                password: hashedPassword,
            }
        });

        res.status(201).json({message: 'Usuário criado com sucesso!'});

    } catch (error) {

        console.log(error);
        res.status(500).json({message : 'Erro ao criar usuário!'});

    }
    
}

export const login = async(req, res) => {

    const {cpf, password} = req.body;

    // VERIFICA SE O USUARIO EXISTE
    try {
        const user = await prisma.user.findUnique({
            where: {
                cpf: cpf,
            }
        });

        if (!user){
            return res.status(404).json({message: 'Erro ao realizar login: Credenciais inválidas!'});
        } 

        // COMPARA AS SENHAS ENCRIPTADAS
        const isPasswordValid = await bcrypt.compare(password, user.password);

        // VERIFICA SE A SENHA ESTÁ CORRETA
        if (!isPasswordValid) {
            return res.status(404).json({message: 'Erro ao realizar login: Credenciais inválidas!'});
        }

        // GERA UM COOKIE TOKEN E ENVIA PRO USUÁRIO
        const age = 1000 * 60 * 60 * 24 * 7; // UMA SEMANA

        // POR PADRAO isAdmin é falso 
        let isAdmin = false;

        // se a Role for ADMIN, isAdmin recebe TRUE
        if (user.Role === 'ADMIN') {
            isAdmin = true;
        }
        
        // PAYLOAD isAdmin RECEBE O BOOLEAN DE isAdmin
        const token = jwt.sign(
            { 
              id:user.userId,
              name:user.name,
              isAdmin: isAdmin,
            }, 
            process.env.JWT_SECRET_KEY, 
            { expiresIn: age }
        );

        res.cookie("token", token, {
            httpOnly: true,
            //secure: true,
            maxAge: age,
        }).status(200).json({message: 'Login efetuado com sucesso!'});

    } catch (error) {
        
        console.log(error);
        res.status(500).json({message: 'Erro ao realizar login!'});

    }
    
}

export const logout = (req, res) => {
    res.clearCookie('token').status(200).json({message: 'Logout realizado com sucesso!'});
}
