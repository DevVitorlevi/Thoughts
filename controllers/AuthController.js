const bcrypt = require('bcryptjs')
const User = require('../models/User')
module.exports = class AuthController {
    static login(req,res){
        res.render('auth/login')
    }
    static register(req,res){
        res.render('auth/register')
    }

        static async registerPost(req,res){
            const {name,email,password} = req.body

            const CheckEmailExists = await User.findOne({where:{email}})

            if(CheckEmailExists){
                req.flash('message','E-mail Já Cadastrado')
                res.render('auth/register')
                
                return
            }
            const salt = bcrypt.genSaltSync(10)
            const hashedPassword = bcrypt.hashSync(password,salt)

            const user = {
                name,
                email,
                password: hashedPassword
            }
            try{
                await User.create(user)
                res.flash('message','Autenticação realizada com sucesso')
                res.redirect('/thoughts/home')
            }
            catch(err){
                console.log(err)
            }
        }
}