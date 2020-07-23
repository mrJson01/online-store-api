const app = require('./app.js');

app.set('port',process.env.PORT | 8080);

const server = app.listen(app.get('port'),()=>{
	console.log(`Server Online :${server.address().port}`);
});