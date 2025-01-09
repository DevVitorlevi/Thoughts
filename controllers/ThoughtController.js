const User = require('../models/User')
const Thought = require('../models/Thought')

module.exports = class ThoughtController {
    static async allThought(req,res){
        
        res.render('thoughts/home')
    }
    static async dashboard(req, res) {
        const userid = req.session.userid;
                // Busca o usuário e seus pensamentos relacionados
            const user = await User.findOne({
                where: { id: userid },
                include: Thought, // Inclui os pensamentos relacionados ao usuário
                plain: true, // Retorna apenas o objeto puro
            });
                if(!user){
                    req.redirect('/login')
                }
            // Verifica se o usuário possui pensamentos relacionados
            const thoughts = user.Thoughts.map (thought => thought.dataValues);
    
            res.render('thoughts/dashboard', { thoughts });
    }
    static  createThought(req,res){
        res.render('thoughts/create')
    } 
    static async addThought(req, res) {
        const thought = {
            title: req.body.title,
            UserId: req.session.userid
        };
    
        try {
            await Thought.create(thought); // Criação do pensamento
            req.session.save(() => {
                res.redirect('/thoughts/dashboard'); // Redireciona para o dashboard
            });
        } catch (err) {
            console.error(err); // Log de erros para depuração
            req.flash('message', 'Erro ao criar pensamento'); // Mensagem de erro
            req.session.save(() => {
                res.redirect('/thoughts/create'); // Redireciona mesmo em caso de erro
            });
        }
    }


    
}