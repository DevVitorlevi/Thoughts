module.exports.checkAuth = function(req,res,next){
    const user = req.session.userid
    if(!user){
        res.redirect('/login')
    }

    
    next()
}