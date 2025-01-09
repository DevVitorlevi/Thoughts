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
    static async addThought(req,res){
        const thought ={
            title:req.body.title,
            UserId:req.session.userid
        }
        try{
            await Thought.create(thought)
            req.flash('message', 'Pensamento Criado Com Sucesso')
            req.session.save(()=>{
                res.redirect('/thoughts/dashboard')
            })
        }
        catch(err){
            console.log(err)
        }
    }
}