const User = require('../models/User')
const Tougth = require('../models/Tougths')

module.exports = class TougthController {
    static async allTougths(req,res){
        
        res.render('tougths/home')
    }
}