const express = require('express');
const body = require('body-parser');
const path = require('path');

const err = require('./error');
const router = require('./index');

const app = express();

app.set('views',path.join(__dirname,'views'));
app.set('view engine','pug');
app.use(express.static('public'));

app.use(body.json());
app.use(body.urlencoded({extended:true}));

app.use((req,res,next)=>{
	if(req.originalUrl ==='/favicon.ico'){
		res.status(204).json({nope:true});
	}
	else next();
})

app.use('/',router);


app.use(err.errorHandle);

module.exports = app;
