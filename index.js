const {check , validationResult} = require('express-validator');
const express = require('express');
const controler = require('./controler');

const router = express.Router();

router.get('/:typ',[
	check('typ').escape()
	],controler.Content,controler.Filters);

router.post('/:typ',controler.Content,controler.Filters);

module.exports = router;