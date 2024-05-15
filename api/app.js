import express from 'express';
import cookieParser from 'cookie-parser';

import userRoute from './routes/user.route.js';
import authRoute from './routes/auth.route.js';
import testRoute from './routes/test.route.js';
import minicourseRoute from './routes/minicourse.route.js';
import lectureRoute from './routes/lecture.route.js';
import subscriptionRoute from './routes/subscription.route.js';
import productRoute from './routes/product.route.js';
import certificateRoute from './routes/certificate.route.js';

const app = express();

app.set('view engine', 'ejs');

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

// ROTAS SECUNDÁRIAS
app.get('/', (req, res) => {
    res.send('rota home funcionando!');
});

app.listen(8800, () => {
    console.log('Servidor rodando!');
});