const {check , validationResult , body ,custom} = require('express-validator');
const express = require('express');
const controler = require('./controler');
const controlerResources = require('./controler-resources');
const controlerAdd = require('./controler-add-product.js');
const pool = require('./config');

const router = express.Router();

router.use((req,res,next)=>{
	if(req.originalUrl ==='/favicon.ico'){
		res.status(204).json({nope:true});
	}
	else next();
})

function Find(nazwa){

	return new Promise((resolve,reject)=>{


		pool.getConnection((err,con)=>{

			con.query('SELECT nazwa FROM stock WHERE nazwa="'+nazwa+'"',(err_2,result)=>{
					
				if(err_2)reject(err_2);
				else resolve(result);			
			});

			con.release();
		})

	});


}


router.get('/admin',controler.Admin);
router.post('/admin',controler.Recaptcha);
router.get('/admin/dashboard',controler.Dashboard);
router.post('/admin/dashboard/add/:typ',controlerResources.Columns,controlerAdd.FetchingData,[
		// CASE 1
		body('fileds.*').isAlphanumeric().withMessage('Field should contains only letters and nubers'),
		// CASE 4
		body('fileds.nazwa').custom(value=>{
			return Find(value).then(data =>{
				if(data.length)return Promise.reject('Podana nazwa już jest zajęta');
			})
		})
	],(req,res,next)=>{
		// WORKS
		const validation = validationResult(req);
		const resultV = validation.array();

		next(resultV);
	},controlerAdd.Finish);

router.get('/:typ',[
	check('typ').escape()
	],controler.Content,controler.Filters);


router.post('/:typ',[
	check('*.*').escape()
	],controler.Content,controler.Filters);


router.get('/resources/dashboard/add',controlerResources.Tables,controlerResources.Add);

router.get('/resources/dashboard/add/:typ',[
		check('typ').escape()
	],controlerResources.Columns,controlerResources.Add_type);

module.exports = router;