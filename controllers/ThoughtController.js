const User = require('../models/User')
const Tougth = require('../models/Thought')
const Thought = require('../models/Thought')

module.exports = class ThoughtController {
    static async allThought(req,res){
        
        res.render('thoughts/home')
    }
    static async dashboard(req,res){
        res.render('thoughts/dashboard')
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