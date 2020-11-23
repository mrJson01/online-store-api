const pug = require('pug');
const mysql = require('./config');
const fs =require('fs');

exports.Tables = (req,res,next)=>{


	mysql.getConnection((err,con)=>{
		if(err){
			// WILL NOT WORK
			let error = new Error(err.code);
			next(error);
		}
		else{
			con.query('SELECT table_name FROM information_schema.tables WHERE table_schema = "store"',(err_2,result)=>{
				if(err){
					// WILL NOT WORK
					let error = new Error(err_2.code);
					next(error);
				}
				else 
				{

					let array = new Array(); 
					for(value of result)
					{
						(value['table_name']!='stock') ? array.push(value['table_name']) : "";
					}

					next(array);
				}

				con.release();
			});
		}
	});
}

exports.Add = (result,req,res,next)=>{

	const java = fs.readFileSync('public/dashboard-adding.js');

	const html = pug.renderFile('./views/dashboard-add.pug',{typs:result,js:java});

	res.end(html);

}

exports.Columns = (req,res,next)=>{

mysql.getConnection((err,con)=>{

	if(err)
	{	
		// WILL NOT WORK
		let error = new Error(err.sqlMessage);
		console.log(error);
		next(error);
	}


	con.query(`SHOW COLUMNS FROM ${req.params.typ}`,(errs,result)=>{
			if(errs){
				// WILL NOT WORK
				let error = new Error(errs.sqlMessage);
				console.log(error);
				next(error);
			}
			else
			{
				let array = new Array();

				for(value of result)
				{
					if(value.Field!='id')
					{
						let start = value['Type'].indexOf('(');
						let end = value['Type'].indexOf(')');

						let max_size = value['Type'].substring(start+1,end); 
						let size = parseInt(max_size);

						let object = Object.create({
							name:value['Field'],
							type:(value['Type']=='varchar(50)') ? 'text' : 'number',
							size:size
						});

						array.push(object);
					}
				}

				con.release();

			 	next(array);
			}


		});
	});


}

exports.Add_type = (result,req,res,next)=>{

	const html = pug.renderFile('./views/dashboard-add-typ.pug',{columns:result});

	res.end(html);
}

