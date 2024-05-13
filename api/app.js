import express from 'express';
import cookieParser from 'cookie-parser';
// import ejs from 'ejs';
// import path from 'path';
// import { fileURLToPath } from 'url';

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

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// app.get('/certificado', (req, res) => {
//     const filePath = path.join(__dirname, './certificado.ejs');
//     ejs.renderFile(filePath, (err, html) => {
//         if (err) {
//             console.log(err);
//             return res.send('Erro na leitura do arquivo');
//         }
    
//         // enviar para o navegador
//         return res.send(html);
//     });
// });

// app.get('/pdf', async (req, res) => {
//     // inicia navegador
//     const browser = await puppeteer.launch();
//     // navegador abre uma nova página
//     const page = await browser.newPage();

//     const urlSite = 'http://localhost:3333/certificado';

//     await page.goto(urlSite, {
//         waitUntil: 'networkidle0'
//     });

//     await page.emulateMediaType('print');

//     const pdf = await page.pdf({
//         printBackground: true,
//         format: 'A4',
//         landscape: true
        
//     });

//     await browser.close();

//     res.contentType('application/pdf');

//     res.send(pdf);

// });

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