import prisma from '../../lib/prisma.js';  
import { register, login } from '../auth.controller.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'; 

// Mock do prisma e outros módulos
jest.mock('../../lib/prisma.js', () => ({
  user: {
    create: jest.fn(),  // Moca a função create 
    findUnique: jest.fn(),
  },
}));


describe('register', () => {
    let req, res;

    beforeEach(() => {
        req = {
            body: {
                name: 'Beatriz',
                surname: 'Nascimento',
                cpf: '12345678900',
                email: 'bia@teste.com',
                password: 'password123',
            },
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        // Mock para bcrypt.hash
        bcrypt.hash.mockResolvedValue('hashedPassword123');
    });

    it('deve criar um novo usuário com sucesso', async () => {
        // Mock de sucesso para prisma.user.create
        prisma.user.create.mockResolvedValue({
            id: 1,
            name: 'Beatriz',
            surname: 'Nascimento',
            cpf: '12345678900',
            email: 'bia@teste.com',
            password: 'hashedPassword123',  // A senha agora é o hash
        });

        await register(req, res);

        expect(prisma.user.create).toHaveBeenCalledWith({
            data: {
                name: 'Beatriz',
                surname: 'Nascimento',
                cpf: '12345678900',
                email: 'bia@teste.com',
                password: 'hashedPassword123',  // A senha criptografada deve ser verificada
            },
        });
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({ message: 'Usuário criado com sucesso!' });
    });

    it('deve retornar erro ao tentar criar um novo usuário', async () => {
        // Mock de erro para prisma.user.create
        prisma.user.create.mockRejectedValue(new Error('Erro ao criar usuário'));

        await register(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ message: 'Erro ao criar usuário!' });
    });
});


jest.mock('bcrypt', () => ({
    hash: jest.fn(),
    compare: jest.fn(),
}));

jest.mock('jsonwebtoken', () => ({
    sign: jest.fn(),
}));

describe('login', () => {
    let req, res;

    beforeEach(() => {
        req = {
            body: {
                cpf: '12345678900',
                password: 'password123',
            },
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            cookie: jest.fn().mockReturnThis(),
            clearCookie: jest.fn(),
        };
    });

    it('deve retornar erro se o usuário não for encontrado', async () => {
        prisma.user.findUnique.mockResolvedValue(null); 

        await login(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ message: 'Erro ao realizar login: Credenciais inválidas!' });
    });

    it('deve retornar erro se a senha estiver incorreta', async () => {
        const mockUser = { 
            cpf: '12345678900',
            password: 'hashedpassword',
        };
        prisma.user.findUnique.mockResolvedValue(mockUser);
        bcrypt.compare.mockResolvedValue(false);

        await login(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ message: 'Erro ao realizar login: Credenciais inválidas!' });
    });

    it('deve realizar o login com sucesso e gerar um token', async () => {
        const mockUser = {
            userId: 1,
            cpf: '12345678900',
            password: 'hashedpassword',
            Role: 'USER',
        };
        prisma.user.findUnique.mockResolvedValue(mockUser);
        bcrypt.compare.mockResolvedValue(true);
        jwt.sign.mockReturnValue('mockedToken');

        await login(req, res);

        expect(prisma.user.findUnique).toHaveBeenCalledWith({
            where: { cpf: '12345678900' },
        });
        expect(bcrypt.compare).toHaveBeenCalledWith('password123', 'hashedpassword');
        expect(jwt.sign).toHaveBeenCalledWith(
            { id: mockUser.userId, isAdmin: false }, 
            process.env.JWT_SECRET_KEY, 
            { expiresIn: 1000 * 60 * 60 * 24 * 7 } 
        );
        expect(res.cookie).toHaveBeenCalledWith('token', 'mockedToken', { 
            httpOnly: true, 
            maxAge: 1000 * 60 * 60 * 24 * 7, 
        });
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ message: 'Login efetuado com sucesso!' });
    });

    it('deve retornar erro ao tentar realizar o login', async () => {
        prisma.user.findUnique.mockRejectedValue(new Error('Erro no login'));

        await login(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ message: 'Erro ao realizar login!' });
    });
});
