const express = require('express')
const router = express.Router()
const TougthController = require('../controllers/TougthController')

router.get('/',TougthController.allTougths)
module.exports = router