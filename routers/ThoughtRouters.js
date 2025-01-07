const express = require('express')
const router = express.Router()
const ThoughtController = require('../controllers/ThoughtController')

router.get('/', ThoughtController.allThought)


module.exports = router