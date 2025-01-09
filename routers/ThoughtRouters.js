const express = require('express')
const router = express.Router()
const ThoughtController = require('../controllers/ThoughtController')
const checkAuth = require('../helpers/checkauth').checkAuth

router.get('/',ThoughtController.allThought)
router.get('/dashboard',checkAuth,ThoughtController.dashboard)
router.get('/create', checkAuth, ThoughtController.createThought)
router.post('/add',checkAuth, ThoughtController.addThought)
router.post('/delete',checkAuth,ThoughtController.deleteThought)
router.get('/edit/:id', checkAuth, ThoughtController.editThought)
router.post('/update',checkAuth, ThoughtController.updateThought)


module.exports = router