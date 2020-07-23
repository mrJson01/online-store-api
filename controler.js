const pool = require('./config');
const pug = require('pug');


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
			var error = new Error(err.sqlMessage);
			error.status = err.errno;
			next(error); 
		}
		else
		{
			con.query(`SELECT stock.nazwa,stock.img,${typ}.* FROM stock INNER JOIN ${typ} ON stock.id = ${typ}.id WHERE ${filtr}`,(ers,rows)=>{
				
				let img= new Array(); 
				if(ers)
				{
					var error = new Error(ers.sqlMessage);
					error.status = ers.errno;
					next(error);
				}else
				{
					let opis = Object.create({});
					for(let index in rows)
					{	
						let array = new Array();

						img.push(rows[index]['img']);
						for(let opt in rows[index])
						{
							if((opt!='id')&&(opt!='img'))array.push(rows[index][opt]);
						}
						opis[`${index}`]=array;
					}


					let HTML = pug.renderFile('./views/content.pug',{obj:opis,pic:img});
					next(HTML);
				}

				con.release();
			})
		}
	});

}


exports.Filters =(data,req,res,next)=>{


	
	var typ = req.params.typ;
	var obj = Object.create({});
	var i = 1;

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
				let len = row.length;
				
				for(let key in row)
				{
					let name = row[key].Field;

					if(name!='id')
					{
						con.query(`SELECT DISTINCT ${name} FROM ${typ}`,(err,rows)=>{

						let arr = new Array();
							for(let opt of rows)
							{
								arr.push(opt[`${name}`]);
							}
							obj[`${name}`]=arr;

							if(i==len)
							{
								let html = pug.renderFile('./views/filters.pug',{options:obj,typs:typ,already:alr});

								res.render('home',{filter_tab:html,content:data});
							}
							else i++;
						})
					}
					else i++	

				}

			}
			else
			{
				let error = new Error(err.sqlMessage);
				error.status = err.errno;
				next(error);
			}
			con.release();
		})
		// console.log('end');
	})


}