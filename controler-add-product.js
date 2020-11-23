const pool = require('./config');
const multiparty = require('multiparty');
const fs = require('fs');
const path = require('path');
const pug = require('pug');

exports.FetchingData = (columns,req,res,next)=>{


	var [imgs,fileds] = [new Array(),Object.create({})];

	var form = new multiparty.Form({
		uploadDir:'./public'
	});

	form.on('error',(err)=>{
		// let error = new Error(err.stack);
		// next(error);
	});

	form.on('file',(name,file)=>{

		// CASE 2  ------------------------

		const [headers,size,path_to_file] =[file.headers,file.size,file.path];
		let flaga = true;
		let msg = '';

		if((headers['content-type']!='image/png')&&(headers['content-type']!='image/jpg')&&(headers['content-type']!='image/jpeg'))
		{
			msg='File should be an png';
			flaga = false;
		}
		else
		{
			if(size>=1000000)
			{
				msg='File should be 1MB max';
				flaga = false;
			}
		}

		if(!flaga)
		{
			fs.unlinkSync(path_to_file);
			req.body.case_2 = JSON.stringify({msg:msg});
		}
		else imgs.push(path.basename(path_to_file));

	})

	form.on('field',(name,value)=>{
		// PONIEWAŻ W TABELI ZNAK SPACJI JEST ZASTAPIONY ZNAKIEM _
		name = name.replace(/ /g,'_');

		fileds[name] = value;
	})

	form.on('close',()=>{
		
		// PO CASE 3 WIADOMO NAPEWNO ŻE KAŻDA COLUMNA Z DANEJ TABELI MA ODPOWIEDNIK W FORMIE WYSŁANEJ Z PRZEGLĄDARKI
		// CASE 3 ------------------------
		let flaga = true;

		for(let object of columns)
		{
			if(fileds[object.name]==undefined)flaga=false;
		}

		if(!flaga){
			req.body.case_3 = JSON.stringify({msg:'Wystąpił bład podczas zestawiania kolumn'});
		}

		req.body.fileds = fileds;	
		req.body.imgs = imgs;
		req.body.columns = columns;
		next();
	})


	form.parse(req);

}

// function Find(nazwa){

// 	console.log(1);
// 	return new Promise((resolve,reject)=>{


// 		pool.getConnection((err,con)=>{
// 			console.log(2);

// 			con.query('SELECT nazwa FROM stock WHERE nazwa="'+nazwa+'"',(err_2,result)=>{
					
// 				if(err_2)reject(err_2);
// 				else resolve(result);			
// 			});
// 		})

// 	});

// }


exports.Finish = (case_1,req,res,next)=>{

	if(case_1.length)var case1 =case_1;
	if(req.body.case_2)var case2 = req.body.case_2;
	if(req.body.case_3)var case3 = req.body.case_3;

	if((case1)||(case2)||(case3)){
		// ISTNIEJE JAKIKOLWIEK BŁĄD
        
        //USUNĄĆ OBRAZ (OBSŁUGUJE TYLKO JEDEN IMG)
        fs.unlinkSync("public/"+req.body.imgs[0]);
		// CZĘŚCIEJ BEDZIE SIE POJAWIAC 1 I 2 CASE
		res.json({case1:case1,case2:case2,case3:case3});
	}
	else{
		// NIE ISTNIEJE ŻADEN BŁĄD Z CASE-ÓW

		const fields = req.body.fileds;
		const imgs = req.body.imgs;

		let schema ='(id,nazwa,typ,img,cena)';

		// WORKS
		let values =`(NULL,"${fields.nazwa}","${req.params.typ}","${imgs[0]}",${fields.cena})`;

		pool.getConnection((err,con)=>{

			// ADDING TO STOCK TABLE
			con.query('INSERT INTO `stock`'+schema+" VALUES"+values,(err_2)=>{

				// SELECTING ID OF ADDED ITEM
				con.query('SELECT id FROM stock WHERE nazwa="'+fields.nazwa+'"',(err_3,result)=>{
					// ADDING TO :TYP TABLE

					const typ = req.params.typ;
					const id = result[0].id;
					const columns = req.body.columns;

					// GENERETING A SCHEMA OF VALUES
					schema = `(id`;
					for(let column of columns){
						schema+=`,`+column.name;
					}
					schema+=`)`;

					// GENERATING A VALUES
					values=`(${id}`;
					for(let column of columns){
						values +=`,'`+fields[column.name]+`'`;
					}
					values+=`)`;

					con.query('INSERT INTO '+typ+schema+" VALUES"+values,(err_4)=>{

						if(!err_4)res.json({'msg':"Produkt został dodany do oferty"});
							
					})

					con.release();
				});
				
			});


		});

	}
}
