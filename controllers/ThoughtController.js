const User = require('../models/User')
const Thought = require('../models/Thought')

module.exports = class ThoughtController {
    static async allThought(req,res){
        const thoughtsData = await Thought.findAll({include:User})

        const AllThoughts = thoughtsData.map(thought => thought.get({plain:true}))

        res.render('thoughts/home', {AllThoughts})
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


            let emptyThougth = false

            if(thoughts.length === 0){
                emptyThougth = true
            }
    
            res.render('thoughts/dashboard', { thoughts ,emptyThougth});
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
    static async deleteThought(req,res){
        const id = req.body.id
        const userid = req.session.userid
        await Thought.destroy({where:{id,userid}})
        req.session.save(()=>{
            res.redirect('/thoughts/dashboard')
        })

    }

    static async editThought(req,res){
        const id = req.params.id
        const userid = req.session.userid

        const thought = await Thought.findOne({where:{id,userid},raw:true})
        res.render('thoughts/edit',{thought})
        
    }
    static async updateThought(req,res){
        const id = req.body.id
        const userid = req.session.userid
        const Data = {
            title:req.body.title,
        }    

        await Thought.update(Data,{where:{id,userid}})

        res.redirect('/thoughts/dashboard')
    }
    
}