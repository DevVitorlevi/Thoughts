// Importando o bcrypt para hashing de senhas
const bcrypt = require('bcryptjs');

// Importando o modelo User para interagir com o banco de dados
const User = require('../models/User');

// Exportando a classe AuthController
module.exports = class AuthController {
    
    // Método para exibir a página de login
    static login(req, res) {
        res.render('auth/login'); // Renderiza a página de login
    }

    static async loginPost(req, res) {
        const { email, password } = req.body;

        try {
            const userExist = await User.findOne({ where: { email } }); // Consulta o usuário pelo email

            if (!userExist) {
                req.flash('message', 'Usuário Não Encontrado');
                return res.render('auth/login'); // Retorna imediatamente após renderizar
            }

            const passwordMatch = bcrypt.compareSync(password, userExist.password); // Compara as senhas

            if (!passwordMatch) {
                req.flash('message', 'Senha Incorreta');
                return res.render('auth/login'); // Retorna imediatamente após renderizar
            }

            req.session.userid = userExist.id;

            req.session.save(() => {
                res.redirect('/thoughts'); // Redireciona o usuário para a página de pensamentos
            });
        } catch (err) {
            console.error('Erro no login:', err);
            res.status(500).send('Erro interno no servidor.');
        }
    }

    // Método para exibir a página de registro
    static register(req, res) {
        res.render('auth/register'); // Renderiza a página de registro
    }

    // Método para lidar com o registro de um novo usuário
    static async registerPost(req, res) {
        const { name, email, password } = req.body;

        try {
            const emailExists = await User.findOne({ where: { email } });

            if (emailExists) {
                req.flash('message', 'E-mail Já Cadastrado');
                return res.render('auth/register'); // Retorna imediatamente após renderizar
            }

            const salt = bcrypt.genSaltSync(10);
            const hashedPassword = bcrypt.hashSync(password, salt);

            const user = {
                name,
                email,
                password: hashedPassword
            };

            const createdUser = await User.create(user);

            req.session.userid = createdUser.id;

            req.session.save(() => {
                res.redirect('/thoughts'); // Redireciona o usuário para a página principal
            });
        } catch (err) {
            console.error('Erro no registro:', err)
        }
    }

    // Método para logout
    static logout(req, res) {
        req.session.destroy(() => {
            res.redirect('/login'); // Redireciona para a página de login
        });
    }
};
