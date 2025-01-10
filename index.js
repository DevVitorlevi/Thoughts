// Importa as bibliotecas necessárias
const express = require('express'); // Framework para criação de servidores web
const exphbs = require('express-handlebars'); // Biblioteca para gerenciar templates HTML
const conn = require('./db/conn'); // Conexão com o banco de dados
const session = require('express-session'); // Gerenciamento de sessões de usuário
const flash = require('express-flash'); // Para exibir mensagens temporárias (flash messages)
const FileStore = require('session-file-store')(session); // Armazena sessões em arquivos temporários no servidor
const User = require('./models/User'); // Modelo para interagir com a tabela de usuários no banco de dados
const Thought = require('./models/Thought'); // Modelo para interagir com a tabela de pensamentos
const ThoughtRouters = require("./routers/ThoughtRouters"); // Rotas relacionadas a pensamentos
const AuthRoutes = require("./routers/AuthRoutes"); // Rotas relacionadas à autenticação

// Inicializa a aplicação Express
const app = express();

// Configuração do Handlebars como motor de templates
app.engine('handlebars', exphbs.engine());
app.set('view engine', 'handlebars');

// Middleware para processar dados enviados pelo cliente
app.use(express.urlencoded({ extended: true })); // Permite processar dados de formulários enviados via POST
app.use(express.json()); // Permite processar dados enviados no formato JSON


app.use(session({
    name: 'session', // Nome do cookie de sessão
    secret: 'nosso_secret', // Chave secreta para assinar o cookie
    resave: false, // Não salva a sessão novamente se ela não foi alterada
    saveUninitialized: false, // Não salva sessões que ainda não possuem dados
    store: new FileStore({ // Define o armazenamento das sessões em arquivos temporários
        logFn: function () {}, // Desativa logs de operações de sessão
        path: require('path').join(__dirname, 'sessions'), // Caminho para armazenar os arquivos de sessão
    }),
    cookie: {
        secure: process.env.NODE_ENV === 'production', // Apenas se HTTPS estiver ativado
        maxAge: 3600000, // Tempo de vida do cookie (1 hora)
        httpOnly: true // Impede que o cookie seja acessado pelo JavaScript no navegador
    }
}));


// Configuração do middleware de mensagens flash
app.use(flash()); // Permite exibir mensagens temporárias (ex.: sucesso, erro)

// Middleware para servir arquivos estáticos
app.use(express.static('public')); // Define a pasta "public" para arquivos estáticos (CSS, imagens, etc.)

// Middleware para adicionar dados à variável `res.locals`
app.use((req, res, next) => {
    res.locals.messages = req.flash(); // Adiciona mensagens flash ao escopo global das views
    if (req.session.userid) {
        res.locals.session = req.session; // Adiciona a sessão ao contexto global, se houver um usuário logado
    }
    next(); // Prossegue para o próximo middleware ou rota
});

// Rotas
app.use('/thoughts', ThoughtRouters); // Rotas relacionadas a pensamentos (ex.: criação, exibição)
app.use('/', AuthRoutes); // Rotas relacionadas à autenticação (ex.: login, registro)

const PORT = process.env.PORT || 3000; // Mude para 3001 ou outra porta
// Conecta ao banco de dados e inicia o servidor
conn.sync() // Sincroniza os modelos com o banco de dados
    .then(() => app.listen(PORT)) // Inicia o servidor na porta 3000 após conectar ao banco
    .catch(e => console.log(e)); // Exibe um erro no console caso a conexão falhe

    