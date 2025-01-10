const User = require('../models/User'); // Importa o modelo User
const Thought = require('../models/Thought'); // Importa o modelo Thought
const { Op } = require('sequelize'); // Importa o operador Op do Sequelize para consultas avançadas

module.exports = class ThoughtController {
    // Método para listar todos os pensamentos
    static async allThought(req, res) {
        let search = ''; // Inicializa a variável de busca como uma string vazia
        let order = 'DESC'; // Define a ordenação padrão como decrescente

        // Verifica o parâmetro de ordenação na query string
        if (req.query.order === 'old') {
            order = 'ASC'; // Ordenação ascendente (mais antigos)
        } else {
            order = 'DESC'; // Ordenação descendente (mais novos)
        }

        // Verifica se há um termo de busca na query string
        if (req.query.search) {
            search = req.query.search; // Define o termo de busca
        }

        // Busca todos os pensamentos com base no termo de busca e na ordenação
        const thoughtsData = await Thought.findAll({
            include: User, // Inclui os dados do usuário relacionado
            where: { title: { [Op.like]: `%${search}%` } }, // Filtra pelos títulos que contêm o termo de busca
            order: [['createdAt', order]] // Ordena pela data de criação
        });

        // Transforma os dados em objetos simples
        const AllThoughts = thoughtsData.map(thought => thought.get({ plain: true }));
        let thoughtsqnt = AllThoughts.length; // Obtém o número total de pensamentos

        // Caso não haja pensamentos, define como falso
        if (thoughtsqnt === 0) {
            thoughtsqnt = false;
        }

        // Renderiza a página com os pensamentos, busca e quantidade
        res.render('thoughts/home', { AllThoughts, search, thoughtsqnt });
    }

    // Método para exibir o painel do usuário
    static async dashboard(req, res) {
        const userid = req.session.userid; // Obtém o ID do usuário na sessão

        // Busca o usuário e seus pensamentos relacionados
        const user = await User.findOne({
            where: { id: userid }, // Filtra pelo ID do usuário
            include: Thought, // Inclui os pensamentos relacionados
            plain: true, // Retorna apenas o objeto puro
        });

        // Redireciona para o login se o usuário não for encontrado
        if (!user) {
            req.redirect('/login');
        }

        // Extrai os pensamentos do usuário
        const thoughts = user.Thoughts.map(thought => thought.dataValues);
        let emptyThougth = false; // Inicializa o indicador de pensamentos vazios

        // Verifica se o usuário não possui pensamentos
        if (thoughts.length === 0) {
            emptyThougth = true;
        }

        // Renderiza o painel com os pensamentos
        res.render('thoughts/dashboard', { thoughts, emptyThougth });
    }

    // Método para renderizar a página de criação de pensamentos
    static createThought(req, res) {
        res.render('thoughts/create'); // Renderiza a página de criação
    }

    // Método para adicionar um novo pensamento
    static async addThought(req, res) {
        const thought = {
            title: req.body.title, // Título do pensamento vindo do formulário
            UserId: req.session.userid // ID do usuário na sessão
        };

        try {
            await Thought.create(thought); // Criação do pensamento no banco de dados
            req.session.save(() => {
                res.redirect('/thoughts/dashboard'); // Redireciona para o painel
            });
        } catch (err) {
            console.error(err); // Loga o erro no console
            req.flash('message', 'Erro ao criar pensamento'); // Mensagem de erro para o usuário
            req.session.save(() => {
                res.redirect('/thoughts/create'); // Redireciona para a página de criação
            });
        }
    }

    // Método para deletar um pensamento
    static async deleteThought(req, res) {
        const id = req.body.id; // ID do pensamento vindo do formulário
        const userid = req.session.userid; // ID do usuário na sessão

        // Exclui o pensamento com base no ID e no usuário
        await Thought.destroy({ where: { id, userid } });
        req.session.save(() => {
            res.redirect('/thoughts/dashboard'); // Redireciona para o painel
        });
    }

    // Método para renderizar a página de edição de pensamentos
    static async editThought(req, res) {
        const id = req.params.id; // ID do pensamento vindo da URL
        const userid = req.session.userid; // ID do usuário na sessão

        // Busca o pensamento com base no ID e no usuário
        const thought = await Thought.findOne({ where: { id, userid }, raw: true });
        res.render('thoughts/edit', { thought }); // Renderiza a página de edição com o pensamento
    }

    // Método para atualizar um pensamento existente
    static async updateThought(req, res) {
        const id = req.body.id; // ID do pensamento vindo do formulário
        const Data = {
            title: req.body.title, // Novo título vindo do formulário
        };

        // Atualiza o pensamento no banco de dados
        await Thought.update(Data, { where: { id } });

        // Redireciona para o painel
        res.redirect('/thoughts/dashboard');
    }
};
