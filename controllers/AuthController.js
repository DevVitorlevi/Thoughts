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
    static async loginPost(req,res){
        const {email,password} = req.body

        const UserExist = await User.findOne({where:{email:email}})// faz uma query em busca do email do usuário

        // Verifica se o usuario não existir ele envia uma flash message informando que o usuário nn foi encontrado
        if(!UserExist){
            req.flash('message', 'Usuário Não Encontrado')
            res.render('auth/login')

            return
        }

        const PasswordMatch = bcrypt.compareSync(password, UserExist.password)//compara as senhas


        // Verifica se as duas senhas batem 
        if(!PasswordMatch){
            req.flash('message','Senha Incorreta')
            res.render('auth/login')
            return
        }

        req.session.userid = UserExist.id

        req.session.save(()=>{
            res.redirect('/thoughts')
        })
    }


    // Método para exibir a página de registro
    static register(req, res) {
        res.render('auth/register'); // Renderiza a página de registro
    }

    // Método para lidar com o registro de um novo usuário
    static async registerPost(req, res) {
        // Extraindo as informações enviadas pelo formulário
        const { name, email, password } = req.body;

        // Verificando se o e-mail já está cadastrado no banco de dados
        const CheckEmailExists = await User.findOne({ where: { email } });

        if (CheckEmailExists) {
            // Caso o e-mail já exista, exibe uma mensagem de erro e renderiza novamente a página de registro
            req.flash('message', 'E-mail Já Cadastrado');
            res.render('auth/register');
            return; // Interrompe a execução para evitar criar o usuário
        }

        // Gerando um salt e criando um hash para a senha do usuário
        const salt = bcrypt.genSaltSync(10); // Gera um salt com fator de complexidade 10
        const hashedPassword = bcrypt.hashSync(password, salt); // Cria o hash da senha

        // Criando o objeto do usuário a ser salvo no banco de dados
        const user = {
            name,
            email,
            password: hashedPassword // Armazena apenas a senha criptografada
        };

        try {
            // Criando o usuário no banco de dados
            const createdUser = await User.create(user);

            // Salvando o ID do usuário na sessão para manter o usuário logado
            req.session.userid = createdUser.id;

            // Mensagem para testes no console
            console.log('Flash message:', req.flash('message'));

            // Salva a sessão e redireciona o usuário para a página de pensamentos (thoughts)
            setTimeout(() => req.session.save(() => {
                res.redirect('/thoughts'); // Redireciona para a página principal do aplicativo
            }), 5000); // Atraso de 5 segundos (pode ser ajustado ou removido)

        } catch (err) {
            // Exibe um erro no console em caso de falha
            console.log(err);
        }
    
    
    }
    static async account(req,res){
        
    }
};
