const User = require('../models/User')
const Tougth = require('../models/Thought')

module.exports = class ThoughtController {
    static async allThought(req,res){
        
        res.render('thougths/home')
    }
}