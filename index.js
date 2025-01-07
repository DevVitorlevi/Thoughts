// Importa as bibliotecas necessárias
const express = require('express');
const exphbs = require('express-handlebars');
const conn = require('./db/conn');
const session = require('express-session');
const flash = require('express-flash');
const FileStore = require('session-file-store')(session);
const User = require('./models/User');
const Thought = require('./models/Thought');
const ThoughtRouters = require("./routers/ThoughtRouters");
const AuthRoutes = require("./routers/AuthRoutes");

// Inicializa a aplicação Express
const app = express();

// Configuração do Handlebars como motor de templates
app.engine('handlebars', exphbs.engine());
app.set('view engine', 'handlebars');

// Middleware para processar dados enviados pelo cliente
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Configuração de sessões
app.use(session({
    name: 'session',
    secret: 'nosso_secret',
    resave: false,
    saveUninitialized: false,
    store: new FileStore({
        logFn: function () {},
        path: require('path').join(require('os').tmpdir(), 'sessions'),
    }),
    cookie: {
        secure: false,
        maxAge: 360000,
        expires: new Date(Date.now() + 360000),
        httpOnly: true
    }
}));

// Configuração do middleware de mensagens flash
app.use(flash());

// Middleware para servir arquivos estáticos
app.use(express.static('public'));

// Middleware para adicionar dados à variável `res.locals`
app.use((req, res, next) => {
    res.locals.messages = req.flash(); // Adiciona mensagens flash ao contexto global
    if (req.session.userid) {
        res.locals.session = req.session;
    }
    next();
});


// Rotas
app.use('/thoughts', ThoughtRouters);
app.use('/', AuthRoutes);

// Conecta ao banco de dados e inicia o servidor
conn.sync()
    .then(() => app.listen(3000))
    .catch(e => console.log(e));
