// Importando o bcrypt para hashing de senhas
const bcrypt = require('bcryptjs');

// Importando o modelo User para interagir com o banco de dados
const User = require('../models/User');

// Exportando a classe AuthController que gerencia autenticação
module.exports = class AuthController {
    
    // Método para exibir a página de login
    static login(req, res) {
        res.render('auth/login'); // Renderiza a página de login
    }

    // Método para processar o login do usuário
    static async loginPost(req, res) {
        const { email, password } = req.body;

        try {
            // Verifica se o usuário existe no banco de dados pelo e-mail
            const userExist = await User.findOne({ where: { email } }); 

            if (!userExist) {
                // Caso o usuário não seja encontrado, exibe mensagem e retorna
                req.flash('message', 'Usuário Não Encontrado');
                return res.render('auth/login'); 
            }

            // Compara a senha fornecida com o hash armazenado
            const passwordMatch = bcrypt.compareSync(password, userExist.password); 

            if (!passwordMatch) {
                // Caso a senha seja incorreta, exibe mensagem e retorna
                req.flash('message', 'Senha Incorreta');
                return res.render('auth/login'); 
            }

            // Armazena o ID do usuário na sessão
            req.session.userid = userExist.id;

            // Salva a sessão e redireciona para a página de pensamentos
            req.session.save(() => 
                res.redirect('/thoughts')
            );
        } catch (err) {
            // Trata erros e exibe mensagem no console
            console.error('Erro no login:', err);
            res.status(500).send('Erro interno no servidor.');
        }
    }

    // Método para exibir a página de registro
    static register(req, res) {
        res.render('auth/register'); // Renderiza a página de registro
    }

    // Método para processar o registro de um novo usuário
    static async registerPost(req, res) {
        const { name, email, password } = req.body;

        try {
            // Verifica se o e-mail já está cadastrado
            const emailExists = await User.findOne({ where: { email } });

            if (emailExists) {
                // Caso o e-mail já exista, exibe mensagem e retorna
                req.flash('message', 'E-mail Já Cadastrado');
                return res.render('auth/register'); 
            }

            // Gera um salt para hashing da senha
            const salt = bcrypt.genSaltSync(10);
            // Cria o hash da senha fornecida
            const hashedPassword = bcrypt.hashSync(password, salt);

            // Cria um objeto para o novo usuário
            const user = {
                name,
                email,
                password: hashedPassword
            };

            // Salva o novo usuário no banco de dados
            const createdUser = await User.create(user);

            // Armazena o ID do novo usuário na sessão
            req.session.userid = createdUser.id;

            // Salva a sessão e redireciona para a página principal
            req.session.save(() => {
                res.redirect('/thoughts'); 
            });
        } catch (err) {
            // Trata erros e exibe mensagem no console
            console.error('Erro no registro:', err);
        }
    }

    // Método para logout do usuário
    static logout(req, res) {
        // Destroi a sessão e redireciona para a página de login
        req.session.destroy(() => {
            res.redirect('/login'); 
        });
    }
};
