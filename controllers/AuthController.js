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
                    const createdUser = await User.create(user)
                    req.session.userid = createdUser.id
                    console.log('Flash message:', req.flash('message'));
                    setTimeout(()=>req.session.save(()=>{

                        res.redirect('/thoughts')
                    }),5000)
                }
                catch(err){
                    console.log(err)
                }
            }
}