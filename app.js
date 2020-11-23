const express = require('express');
const body = require('body-parser');
const cookie = require('cookie-parser');
const session = require('express-session');
const path = require('path');
const flash = require('flash');
const uuid = require('uuid');

const err = require('./error');
const router = require('./index');

const store = new session.MemoryStore();

const app = express();


app.set('views',path.join(__dirname,'views'));
app.set('view engine','pug');
app.use(express.static('public'));

app.use(body.json());
app.use(body.urlencoded({extended:true}));
app.use(cookie());

app.use(session({
	genid:function(req){
		return uuid.v4();
	},
	secret:'store',
	key:`express.sid`,
	resave:false,
	saveUninitialized:true,
	store:store,
	cookie:{}
}));

app.use(flash());

app.use('/',router);


app.use(err.errorHandle);

module.exports = app;