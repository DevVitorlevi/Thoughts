const User = require('../models/User')
const Tougth = require('../models/Thought')

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
        const title = req.body
        await User.create({title})
        res.redirect('/thoughts')
    }
}