// Importa as bibliotecas necessárias
const express = require('express'); // Framework para criar o servidor web
const exphbs = require('express-handlebars'); // Motor de templates Handlebars
const conn = require('./db/conn'); // Arquivo de conexão ao banco de dados
const session = require('express-session'); // Gerenciamento de sessões
const flash = require('express-flash'); // Para exibir mensagens temporárias (flash)
const FileStore = require('session-file-store')(session); // Armazena sessões em arquivos
const User = require('./models/User')
const Thought = require('./models/Thought')
const ThoughtRouters = require("./routers/ThoughtRouters")


// Inicializa a aplicação Express
const app = express();

// Configuração do Handlebars como motor de templates
app.engine('handlebars', exphbs.engine()); // Define o motor de templates
app.set('view engine', 'handlebars'); // Define o tipo de view como Handlebars

// Middleware para processar dados enviados pelo cliente
app.use(express.urlencoded({ extended: true })); // Processa dados de formulários HTML
app.use(express.json()); // Processa dados enviados em JSON

// Configuração de sessões
app.use(session({
    name: 'session', // Nome do cookie da sessão
    secret: 'nosso_secret', // Chave secreta para criptografia
    resave: false, // Não salva a sessão se ela não foi modificada
    saveUninitialized: false, // Não cria uma sessão sem dados
    store: new FileStore({ // Armazena sessões em arquivos
        logFn: function () {}, // Desabilita logs do FileStore
        path: require('path').join(require('os').tmpdir(), 'sessions'), // Caminho para armazenar sessões
    }),
    cookie: { // Configurações do cookie da sessão
        secure: false, // Não requer HTTPS
        maxAge: 360000, // Tempo de vida do cookie 
        expires: new Date(Date.now() + 360000), // Define a data de expiração
        httpOnly: true // Impede acesso ao cookie via JavaScript no navegador
    }
}));

// Configuração do middleware de mensagens flash
app.use(flash()); // Permite exibir mensagens temporárias, como alertas

// Middleware para servir arquivos estáticos
app.use(express.static('public')); // Define a pasta `public` para arquivos estáticos (CSS, JS, imagens)

// Middleware para adicionar a sessão às variáveis locais
app.use((req, res, next) => {
    if (req.session.userid) { // Verifica se há um usuário autenticado
        res.locals.session = req.session; // Disponibiliza a sessão nas views
    }
    next(); // Continua para o próximo middleware
});

// Rotas
app.use('/tougth', ThoughtRouters)

// Conecta ao banco de dados e inicia o servidor
conn.sync()
    .then(() => app.listen(3000)) // Inicia o servidor na porta 3000
    .catch(e => console.log(e)); // Exibe erro no console caso falhe
