[NODE__BADGE]: https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white
[EXPRESS__BADGE]: https://img.shields.io/badge/express-005CFE?style=for-the-badge&logo=express
[JWT]: https://img.shields.io/badge/JWT-black?style=for-the-badge&logo=JSON%20web%20tokens
[PRISMA]: https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white
[VISUAL_STUDIO_CODE]: https://img.shields.io/badge/Visual%20Studio%20Code-0078d7.svg?style=for-the-badge&logo=visual-studio-code&logoColor=white
[POSTMAN]: https://img.shields.io/badge/Postman-FF6C37?style=for-the-badge&logo=postman&logoColor=white
[MONGO]: https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white
[JEST]: https://img.shields.io/badge/Jest-323330?style=for-the-badge&logo=Jest&logoColor=white

<h1
    align="center" style="font-weight: bold;">
    WTISC Project 💻
</h1>

![nodejs][NODE__BADGE]
![express][EXPRESS__BADGE]
![prisma][PRISMA]
![mongodb][MONGO]
![jwt][JWT]
![postman][POSTMAN]
![jest][JEST]
![visual_studio_code][VISUAL_STUDIO_CODE]

<p align="center">
  <a href="#tecnologias">Tecnologias Utilizadas</a> •
  <a href="#ferramentas">Ferramentas Utilizadas</a> •
  <a href="#started">Instalando e Executando</a> • 
  <a href="#prerequisites">Pré-requisitos</a> •
  <a href="#testando">API Endpoints</a> •
  <a href="#colab">Colaboradores</a> 
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


<h2 id="tecnologias"> Tecnologias Utilizadas</h2>

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

### 6. Testes
- **Jest**: Framework de testes em JavaScript para validação das funcionalidades do projeto.

### 7. Automação 
- **Puppeteer**: Biblioteca para controle de navegadores via código.
- **Nodemon**: Ferramenta para reiniciar o servidor automaticamente em desenvolvimento.

<h2 id="ferramentas"> Ferramentas Utilizadas</h2>

- **Postman**: Utilizado para testar e documentar as APIs.

<h2 id="prerequisites"> Pré-requisitos</h2>

- **Node.js**
- **NPM**
- **MongoDB** (ou acesso ao MongoDB Atlas)

<h2 id="started"> Instalando e Executando</h2>

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
<h2 id="testando"> Testando a API com Postman</h2>

Após configurar e rodar o projeto, você pode testar as rotas da API utilizando o Postman. Siga os passos abaixo:

1. **Instale o Postman**: Caso ainda não tenha, baixe e instale o [Postman](https://www.postman.com/downloads/).
2. **Crie uma nova coleção**: No Postman, crie uma nova coleção para agrupar as requisições.
3. **Adicione as requisições que deseja testar usando a URL http://localhost:8800**:
​
###  API Endpoints

Aqui você encontra uma lista de algumas rotas da API e o que cada uma faz:

| Rota | Descrição |
|-------------------------------|-------------------------------------------------------------|
| <kbd>POST /auth/register</kbd> | Registra um usuário [detalhes de registro](#post-register-detail) |
| <kbd>POST /auth/login</kbd> | Realiza o login/autentica o usuário [detalhes de login](#post-login-detail) |
| <kbd>UPDATE /users/6643fcfdbf78a93ed89008cd</kbd> | Atualiza dados do usuário [detalhes de atualização](#update-user-detail) |
| <kbd>GET /minicourses</kbd> | Retorna todos os minicursos [detalhes do minicurso](#get-minicourses-detail) |
| <kbd>POST /subscriptions/minicourses/</kbd> | Inscreve-se em um minicurso [detalhes da inscrição](#post-subscriptions-detail) |
| <kbd>DELETE /subscriptions/minicourses/66a98e1dd4ec13c270ad4b74</kbd> | Deleta uma inscrição [detalhes da inscrição deletada](#delete-subscriptions-detail) |


<h3 id="post-register-detail">POST /auth/register</h3>

**REQUEST**

```json
{
    "name": "Antonio",
    "surname": "Mágico da Silva",
    "cpf": "121212",
    "email": "ontoin@email.com",
    "password": "cubomagico123"
}
```

**RESPONSE**

```json
{
  {"message": "Usuário criado com sucesso!"}
}
```

<h3 id="post-login-detail">POST /auth/login</h3>

**REQUEST**

```json
{
    "cpf": "121212",
    "password": "cubomagico123"
}
```

**RESPONSE**

```json
{
    "message": "Login efetuado com sucesso!"
}
```

<h3 id="update-user-detail">UPDATE /users/6643fcfdbf78a93ed89008cd</h3>

**REQUEST**

```json
{
    "name": "Anthony"
}
```

**RESPONSE**

```json
{
    "userId": "6643fcfdbf78a93ed89008cd",
    "name": "Anthony",
    "surname": "Mágico da Silva",
    "cpf": "121212",
    "Role": "USER"
}
```

<h3 id="get-minicourses-detail">GET /minicourses</h3>

**RESPONSE**

```json
{
        "minicourseId": "6642ae53d0d0d582ca8a6448",
        "title": "Node.js para iniciantes",
        "description": "Aqui você aprenderá o básico de Node.js!",
        "prequisites": "Javascript básico",
        "instructor": "Regis Pires",
        "date": "2024-08-31T15:00:00.000Z",
        "time": "15:00",
        "location": "Auditório",
        "capacity": 60,
        "workload": 2,
        "enrolled": 4
    }
```

<h3 id="post-subscriptions-detail">POST /subscriptions/minicourses/</h3>

**REQUEST**

```json
{
    "minicourseId": "6642ae53d0d0d582ca8a6448"
}
```

**RESPONSE**

```json
{
    "enrollmentId": "66a98e1dd4ec13c270ad4b74",
    "userId": "6643fcfdbf78a93ed89008cd",
    "minicourseId": "6642ae53d0d0d582ca8a6448",
    "status": "ABSENT"
}
```

<h3 id="delete-subscriptions-detail">DELETE /minicourses/subscriptions/minicourses/66a98e1dd4ec13c270ad4b74</h3>

**RESPONSE**

```json
{
    "message": "Inscrição no minicurso deletada com sucesso!"
}
```

<h2 id="colab">🤝 Colaboradores</h2>

Agradecimento especial a todos aqueles que contribuíram com este projeto!

<table>
  <tr>
    <td align="center">
      <a href="#">
        <img src="https://avatars.githubusercontent.com/u/105515712?v=4" width="100px;" alt="Gustavo Erick Profile Picture"/><br>
        <sub>
          <a href="https://github.com/GustavoErick">Gustavo Erick</a>
        </sub>
      </a>
    </td>
    <td align="center">
      <a href="#">
        <img src="https://avatars.githubusercontent.com/u/105880814?v=4" width="100px;" alt="Beatriz Nascimento Picture"/><br>
        <sub>
          <a href="https://github.com/beatriznnascimento">Beatriz Nascimento</a>
        </sub>
      </a>
    </td>
    <td align="center">
      <a href="#">
        <img src="https://avatars.githubusercontent.com/u/101434230?v=4" width="100px;" alt="Foto do Samuel Nascimento"/><br>
        <sub>
         <a href="https://github.com/samuelnasc-dev">Samuel Nascimento</a>
        </sub>
      </a>
    </td>
    <td align="center">
      <a href="#">
        <img src="https://avatars.githubusercontent.com/u/101982315?v=4" width="100px;" alt="Foto do Elysson Alves"/><br>
        <sub>
          <a href="https://github.com/ElyssonAlvs">Elysson Alves</a>
        </sub>
      </a>
    </td>
        <td align="center">
      <a href="#">
        <img src="https://avatars.githubusercontent.com/u/85910011?v=4" width="100px;" alt="Foto do Danilo Gomes"/><br>
        <sub>
          <a href="https://github.com/danilosgomes">Danilo Gomes</a>
        </sub>
      </a>
    </td>
  </tr>
</table>
