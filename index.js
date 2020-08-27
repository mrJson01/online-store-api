const {check , validationResult} = require('express-validator');
const express = require('express');
const controler = require('./controler');

const router = express.Router();

router.use((req,res,next)=>{
	if(req.originalUrl ==='/favicon.ico'){
		res.status(204).json({nope:true});
	}
	else next();
})


router.get('/:typ',[
	check('typ').escape()
	],controler.Content,controler.Filters);

// router.post('/:typ',[
// 	check('*.*').escape()
// 	],controler.Content,controler.Filters);

module.exports = router;