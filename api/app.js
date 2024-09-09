import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';

import authRoute from './routes/auth.route.js';
import certificateRoute from './routes/certificate.route.js';
import lectureRoute from './routes/lecture.route.js';
import minicourseRoute from './routes/minicourse.route.js';
import productRoute from './routes/product.route.js';
import subscriptionRoute from './routes/subscription.route.js';
import testRoute from './routes/test.route.js';
import userRoute from './routes/user.route.js';

const app = express();

app.set('view engine', 'ejs');

// Configuração de CORS (deve vir antes das rotas)
app.use(cors({
    origin: 'http://localhost:5173', // Permite o front-end (Vite)
    methods: 'GET, POST, PUT, DELETE', // Métodos HTTP permitidos
    credentials: true, // Permite envio de cookies
}));

// Middlewares
app.use(express.json());
app.use(cookieParser());

// ROTAS
app.use('/users', userRoute);
app.use('/auth', authRoute);
app.use('/minicourses', minicourseRoute);
app.use('/lectures', lectureRoute);
app.use('/test', testRoute);
app.use('/subscriptions', subscriptionRoute);
app.use('/products', productRoute);
app.use('/certificates', certificateRoute);

// Rota principal
app.get('/', (req, res) => {
    res.send('rota home funcionando!');
});

// Inicia o servidor
app.listen(8800, () => {
    console.log('Servidor rodando na porta 8800');
});
