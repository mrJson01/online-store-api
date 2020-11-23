const pool = require('./config');
const mongoDB = require('./mongo-config');
const pug = require('pug');
const request = require('request');
const fs = require('fs');

// ADMIN
exports.Admin = (req,res,next)=>{
	res.render('admin-login');
}

// DASHBOARD
exports.Dashboard = (req,res,next)=>{

	// fs.readFile(__dirname+"/public/add-button.svg",'utf8',(err,data)=>{
	// 	var h = pug.render(data)
	// });
	res.render('dashboard');

	// if(req.session.logedIn)res.render('dashboard',{login:req.session.login});
	// else res.redirect('/admin');
	
}

// LOG-IN
exports.Recaptcha = (req,res,next)=>{
	const secret = '6LcFoscZAAAAAMsI2P0MvpBfhwkWAio3CEa7aA1x';

	if(!req.body.response)
	{
		res.json({'msg':'Wystąpił błąd podczas wyszukiwania'});
	}
	else
	{
	//Email 
	const ifEmail = isEmail(req.body.email);

	// Password
	const ifPass = isPassword(req.body.pass,req.body.pass.length);


	const verifyUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${secret}&response=${req.body.response}`;

	//IF BOT
	request(verifyUrl,(err,response,body)=>{

		//Verifying Account

		body = JSON.parse(body);

		if((body.score>0.4)&&(ifPass)&&(ifEmail)){

			mongoDB.connect(err =>{


				if(err)
				{
					let error = new Error("Nie połączono z bazą danych");
					//console.log('not-finded')
					//BŁĄD
				}
				else
				{
					const collection = mongoDB.db().collection('admin_of_store');

					collection.find({email:req.body.email,password:req.body.pass}).toArray((err,items)=>{
						
						if(err)
						{
							let error = new Error('Wystąpił błąd');
							//BŁĄD
						}
						else if(items.length==1)
						{
							//SESSION VARIABLES
							req.session.logedIn = true; 
							req.session.login = items[0].login;

							req.session.save();


							res.json({'msg':"Znaleziono"});
							// mongoDB.close();
						}
						else res.json({'msg':'Podany E-mail lub Hasło są błędne'});

						
					});
				}

			});

		}
		else res.json({'msg':'Wystąpił błąd'});

	})

	}
}

function isEmail(email){

	 if (/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(email))
	 {
	 	return true;	
	 }
	 else return false;
}

function isPassword(pass,len){
	if((pass.match(/[A-Z]/g))&&(pass.match(/[a-z]/g))&&(pass.match(/[0-9]/g)))
	{
		if((len>=8)&&(len<=20))return true;
	}
	return false;
}


//Content
function isEmpty(obj)
{
		for(var ind in obj)
		{
			return false;
		}
		return true;
}

exports.Content = (req,res,next)=>{
	const typ = req.params.typ;

	// //console.log(req.body);

	var filtr='(1=1';
	if(!isEmpty(req.body))
	{
		for(var ind in req.body)
		{	
			filtr+=")&&(";

			if(typeof(req.body[ind])=='object')
			{
				const ar = req.body[ind].slice();
				let last = ar.pop();
				for(var val of req.body[ind])
				{
					filtr+=`${typ}.${ind}=\"${val}\"`;
					if(val!=last)filtr+=" ||";
				}

			}
			else if(typeof(req.body[ind])=='string')
			{
				filtr+=`${typ}.${ind}=\"${req.body[ind]}\" `;
			}
		}
	}
	filtr+=")";

	pool.getConnection((err,con)=>{
		if(err)
		{
			var error = new Error(err.code);
			next(error); 
		}
		else
		{
			con.query(`SELECT stock.nazwa,stock.img,stock.cena,${typ}.* FROM stock INNER JOIN ${typ} ON stock.id = ${typ}.id WHERE ${filtr}`,(ers,rows)=>{
				
				let img= new Array(); 
				if(ers)
				{
					var error = new Error(ers.sqlMessage);
					next(error); 
				}else
				{
					let opis = Object.create({});
					for(let index in rows)
					{	
						// let array = new Array();
						let array = Object.create({});


						img.push(rows[index]['img']);
						for(let opt in rows[index])
						{
							
							// if((opt!='id')&&(opt!='img'))array.push(rows[index][opt]);
							if((opt!='id')&&(opt!='img'))array[`${opt}`] = rows[index][opt];
						}
						opis[`${index}`]=array;
					}

					////console.log(opis);

					// let ran = random( (Object.keys(opis).length<=3) ? Object.keys(opis).length : 3);

					// let Promoted = pug.renderFile('./views/promoted.pug',{which:ran,obj:opis,picture:img});
					// req.body.promo = Promoted;

					let HTML = pug.renderFile('./views/content.pug',{obj:opis,pic:img});
					req.body.html = HTML;
					next();
				}

				con.release();
			})
		}
	});

}

// function random(len)
// {
// 	let array = new Set();

// 	for(let i =0;i<len;i++)
// 	{
// 		let size = array.size;
// 		array.add(Math.floor(Math.random()*len));
// 		if(array.size==size)i--;
// 	}
// 	return array;
// }



// 2
function query(name,typ,connection)
{
	return new Promise((resolve,reject)=>{

		connection.query(`SELECT DISTINCT ${name} FROM ${typ}`,(err,rows)=>{
			if(err)
			{
				reject(err);
			}
			else
			{
				let arr = new Array();
				for(let opt of rows)
				{
					arr.push(opt[`${name}`]);
				}
				resolve(arr);
			}

		})

	})
}

// 1

function onion(row,typ,connection)
{
	let len = row.length;
	let object = Object.create({});
	let i=1;
	return new Promise((resolve,reject)=>{
		for(let key in row)
		{
			let name = row[key].Field;
			if(name!='id')
			{
				query(name,typ,connection).then(value=>{
					object[`${name}`]=value;

					if(i==len)resolve(object);
					else i++;

				}).catch(error=>{

					reject(error);		
				});
			}else i++;
		}

		
	})
}

// FILTERS
exports.Filters =(req,res,next)=>{
	
	var typ = req.params.typ;
	var obj = Object.create({});

	var flag = false;
	var alr = {};
	for(let key in req.body)
	{
		if(req.body.hasOwnProperty(key))
		{
			flag=true;
		}
	}

	if(flag)alr = req.body;
	
	pool.getConnection((err,con)=>{

		
		con.query(`SHOW COLUMNS FROM ${typ}`,(err,row)=>{
			
			if(row)
			{
				onion(row,typ,con).then(value=>{
					obj = value;

					let html = pug.renderFile('./views/filters.pug',{options:obj,typs:typ,already:alr});

					res.render('home',{filter_tab:html,content:req.body.html});
					
				}).catch(error=>{
					//console.log(error);
					next(error);
				})



				// let len = row.length;
				
				// for(let key in row)
				// {
				// 	let name = row[key].Field;

				// 	if(name!='id')
				// 	{
				// 		// con.query(`SELECT DISTINCT ${name} FROM ${typ}`,(err,rows)=>{

				// 		// let arr = new Array();
				// 		// 	for(let opt of rows)
				// 		// 	{
				// 		// 		arr.push(opt[`${name}`]);
				// 		// 	}
				// 		// 	obj[`${name}`]=arr;

				// 		// 	if(i==len)
				// 		// 	{
				// 		// 		let html = pug.renderFile('./views/filters.pug',{options:obj,typs:typ,already:alr});

				// 		// 		res.render('home',{filter_tab:html,content:req.body.html});
				// 		// 	}
				// 		// 	else i++;
				// 		// })

						
				// 	}
				// 	// else i++;	

				// }

			}
			else
			{
				let error = new Error(err.sqlMessage);
				error.status = err.errno;
				next(error);
			}
			con.release();
		})
		// //console.log('end');
	})


}
