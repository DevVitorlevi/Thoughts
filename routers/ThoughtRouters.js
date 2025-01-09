const express = require('express')
const router = express.Router()
const ThoughtController = require('../controllers/ThoughtController')
const checkAuth = require('../helpers/checkauth').checkAuth

router.get('/',ThoughtController.allThought)
router.get('/dashboard',checkAuth,ThoughtController.dashboard)


module.exports = router