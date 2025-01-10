module.exports.checkAuth = function(req,res,next){
    const user = req.session.userid// pega o id do usuário na sessão
    if(!user){
        res.redirect('/login')
    }
    next()
}