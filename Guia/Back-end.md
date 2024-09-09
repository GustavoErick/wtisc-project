[JAVASCRIPT__BADGE]: https://img.shields.io/badge/Javascript-000?style=for-the-badge&logo=javascript
[EXPRESS__BADGE]: https://img.shields.io/badge/express-005CFE?style=for-the-badge&logo=express
[JWT]: https://img.shields.io/badge/JWT-black?style=for-the-badge&logo=JSON%20web%20tokens
[PRISMA]: https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white
[VISUAL_STUDIO_CODE]: https://img.shields.io/badge/Visual%20Studio%20Code-0078d7.svg?style=for-the-badge&logo=visual-studio-code&logoColor=white
[POSTMAN]: https://img.shields.io/badge/Postman-FF6C37?style=for-the-badge&logo=postman&logoColor=white

<h1
    align="center" style="font-weight: bold;">
    WTISC Project 💻 - Back-end
</h1>

![express][EXPRESS__BADGE]
![jwt][JWT]
![javascript][JAVASCRIPT__BADGE]
![prisma][PRISMA]
![postman][POSTMAN]
![visual_studio_code][VISUAL_STUDIO_CODE]

<p align="center">
  <a href="#started">Getting Started</a> •
  <a href="#routes">API Endpoints</a> •
  <a href="#colab">Collaborators</a> •
  <a href="prerequisites">Prerequisites</a> •
  <a href="#contribute">Contribute</a>
  
</p>

## Sobre o WTISC 

Workshop de Tecnologia da Informação do Sertão Central (WTISC) é um evento da Universidade Federal do Ceará Campus Quixadá, realizado anualmente no primeiro semestre do ano, pelo grupo PET – Sistemas de Informação.

O objetivo do evento é promover e difundir o conhecimento sobre as diversas áreas de Tecnologia da Informação, de forma a fortalecer e motivar a formação técnico-profissional, por meio da troca de experiências entre profissionais e acadêmicos.

O WTISC é evento público realizado desde 2008, e consiste na oferta de palestras e minicursos. Buscando apresentar aos alunos/participantes um pouco da realidade do mercado de trabalho.

Nas palestras, os profissionais contam sua experiência profissional e temas acadêmicos: área de atuação, dicas para se tornar um bom profissional, tecnologias utilizadas, além de diversos temas tecnológicos.

Nos minicursos, são apresentados aos alunos/participantes várias técnicas e ferramentas utilizadas em diversas áreas de atuação no mercado e na academia.

## Status do Projeto

🚧 Em desenvolvimento 🚧

## Principais Funcionalidades

- Gerenciamento de usuários
- Inscrição em minicursos e palestras
- Emissão de certificados
- Criação e gerenciamento de produtos

## Tecnologias Utilizadas

### 1. Backend
- **Node.js**: Plataforma de execução de código JavaScript no servidor.
- **Express**: Framework para criação de APIs e servidores HTTP.

### 2. Banco de Dados
- **Prisma**: ORM para manipulação do banco de dados.
- **@prisma/client**: Cliente gerado automaticamente pelo Prisma para interação com o banco de dados.

### 3. Segurança
- **bcrypt**: Biblioteca para criptografia de senhas.
- **jsonwebtoken**: Implementação de JWT para autenticação segura.

### 4. Templates e Renderização
- **EJS (Embedded JavaScript)**: Motor de templates para renderizar HTML a partir de JavaScript.

### 5. Utilitários
- **dotenv**: Carrega variáveis de ambiente a partir de um arquivo `.env`.
- **cookie-parser**: Middleware para parsing de cookies nas requisições HTTP.

### 6. Automação 
- **Puppeteer**: Biblioteca para controle de navegadores via código.
- **Nodemon**: Ferramenta para reiniciar o servidor automaticamente em desenvolvimento.


<h2 id="started"> Instalando e executando</h2>

Clone o repositório:
```bash
git clone https://github.com/GustavoErick/wtisc-project.git
```
Entre no diretório do projeto:
```bash
cd api
```
```bash
npm install
```
Ajueste as variáveis de ambiente. Use o .env.properties.example como referência para criar seu arquivo de configuração .env com suas credenciais de conexão com o banco de dados e chave secreta JWT
```yaml
DATABASE_URL={Sua URL de conexão ao banco de dados}
JWT_SECRET_KEY={Sua chave secreta JWT}
```
Após isso, podemos gerar o client do Prisma a partir do schema definido no arquivo schema.prisma:
```bash
npx prisma generate
```
Agora para execute o servidor:
```bash
npm run dev
```

<h2 id="routes">📍 API Endpoints</h2>

Here you can list the main routes of your API, and what are their expected request bodies.
​
| route | description
|----------------------|-----------------------------------------------------
| <kbd>GET /authenticate</kbd> | retrieves user info see [response details](#get-auth-detail)
| <kbd>POST /authenticate</kbd> | authenticate user into the api see [request details](#post-auth-detail)

<h3 id="get-auth-detail">GET /authenticate</h3>

**RESPONSE**

```json
{
  "name": "Fernanda Kipper",
  "age": 20,
  "email": "her-email@gmail.com"
}
```

<h3 id="post-auth-detail">POST /authenticate</h3>

**REQUEST**

```json
{
  "username": "fernandakipper",
  "password": "4444444"
}
```

**RESPONSE**

```json
{
  "token": "OwoMRHsaQwyAgVoc3OXmL1JhMVUYXGGBbCTK0GBgiYitwQwjf0gVoBmkbuyy0pSi"
}
```

<h2 id="colab">🤝 Collaborators</h2>

Special thank you for all people that contributed for this project.

<table>
  <tr>
    <td align="center">
      <a href="#">
        <img src="https://avatars.githubusercontent.com/u/61896274?v=4" width="100px;" alt="Fernanda Kipper Profile Picture"/><br>
        <sub>
          <b>Fernanda Kipper</b>
        </sub>
      </a>
    </td>
    <td align="center">
      <a href="#">
        <img src="https://t.ctcdn.com.br/n7eZ74KAcU3iYwnQ89-ul9txVxc=/400x400/smart/filters:format(webp)/i490769.jpeg" width="100px;" alt="Elon Musk Picture"/><br>
        <sub>
          <b>Elon Musk</b>
        </sub>
      </a>
    </td>
    <td align="center">
      <a href="#">
        <img src="https://miro.medium.com/max/360/0*1SkS3mSorArvY9kS.jpg" width="100px;" alt="Foto do Steve Jobs"/><br>
        <sub>
          <b>Steve Jobs</b>
        </sub>
      </a>
    </td>
  </tr>
</table>
