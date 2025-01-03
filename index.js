const express = require('express');
const exphbs = require('express-handlebars');
const conn = require('./db/conn');
const session = require('express-session');
const flash = require('express-flash');
const FileStore = require('session-file-store')(session)

const app = express();

// Configuração do Handlebars
app.engine('handlebars', exphbs.engine());
app.set('view engine', 'handlebars');

// Middleware para processar dados do corpo da requisição
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(session({
    name:'session',
    secret:'nosso_secret',
    resave:false,
    saveUninitialized:false,
    store:new FileStore({
        logFn:function (){},
        path:require('path').join(require('os').tmpdir(),'sessions'),
    }),
    cookie:{
        secure:false,
        maxAge:360000,
        expires:new Date(Date.now() + 360000),
        httpOnly:true
    }
}))

app.use(flash())
// Middleware para servir arquivos estáticos
app.use(express.static('public'));

app.use((req,res,next)=>{
    if(req.session.userid){
        res.locals.session =req.session
}
    next()
})

// Rotas
app.use('/task', TaskRoutes);
    conn.sync().then(()=>app.listen(3000)).catch((e=>console.log(e)))