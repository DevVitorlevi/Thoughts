const express = require('express')
const router = express.Router()
const ThoughtController = require('../controllers/ThoughtController')
const checkAuth = require('../helpers/checkauth').checkAuth

router.get('/',ThoughtController.allThought)
router.get('/dashboard',checkAuth,ThoughtController.dashboard)
router.get('/create', checkAuth, ThoughtController.createThought)
router.post('/add',checkAuth, ThoughtController.addThought)


module.exports = router