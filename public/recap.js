function Email(e){

	const value = e.target.value;
	const email_feed = document.querySelector('#f-g-1 div');

	 if (/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(value))
	 {
	 	email_feed.innerText = 'Poprawny Email';

	 	with(email_feed.classList)
	 	{
	 		contains('invalid-feedback') ? remove('invalid-feedback') : "";
	 		add("valid-feedback");
	 	}
	 	with(e.target.classList)
	 	{
	 		contains('is-invalid') ? remove('is-invalid') : "";
	 		add('is-valid');
	 	}
	 }
	 else
	 {
	 	email_feed.innerText = "Niepoprawny Email";

	 	with(email_feed.classList)
	 	{
		 	contains('valid-feedback') ? remove('valid-feedback') : "";
		 	add('invalid-feedback');
	 	}
	 	with(e.target.classList)
	 	{
	 		contains('is-valid') ? remove('is-valid') : "";
	 		add('is-invalid');
	 	}

	 }
}

function Password(e){

	const password_feed = document.querySelector('#f-g-2 div');
	const value = e.target.value;

	
	if((matching(value))&&(value.length>=8)&&(value.length<=20))
	{
		password_feed.innerText = "Poprawnie wpisane hasło";

		with(password_feed.classList)
		{
			contains('invalid-feedback') ? remove('invalid-feedback') : "";
			add('valid-feedback');
		}
		with(e.target.classList)
		{
			contains('is-invalid') ? remove('is-invalid') : "";
			add('is-valid');
		}
	}
	else
	{
		password_feed.innerText = "Niepoprawnie wpisane hasło";

		with(password_feed.classList)
		{
			contains('valid-feedback') ? remove('valid-feedback') : "";
			add('invalid-feedback');
		}
		with(e.target.classList)
		{
			contains('is-valid') ? remove('is-valid') : "";
			add('is-invalid');
		}
	}
}

function matching(value){

	if((value.match(/[A-Z]/g))&&(value.match(/[a-z]/g))&&(value.match(/[0-9]/g)))
	{
		return true;
	}
	else return false;
};


function onSubmit(e){
	
	e.preventDefault();

	// Animacja Loadingu
	var div = document.createElement('div');
	div.classList.add('text-center');
	div.innerHTML = "<div class='spinner-border text-primary'role='status'><span class='sr-only'>Loading...</span></div>";
	e.target.append(div);

	const inputs = e.target.querySelectorAll('input:valid');


	grecaptcha.execute('6LcFoscZAAAAACddNhwTsLBHb08XF7h0Amgut5pU',{action:"homepage"}).then(token=>{

		fetch("http://localhost:8080/admin",{
			method:"POST",
			mode:'cors',//albo no-cors
			headers:{
				'Content-Type':"application/json",
				'Accept':"application/json, text/plain, */*"
			},
			body:JSON.stringify({
				response:token,
				email:inputs[0].value,
				pass:inputs[1].value
			})
		}).then(res=>{return res.json()})
		.then(data=>{
			
			if(data.msg=="Znaleziono")window.location.href="/admin/dashboard";
			else alert(data.msg);

		}).finally(()=>{
			inputs[1].value = "";
			div.remove();
		});

	});
	
	// document.getElementById('admin-form-login').submit();
}


document.getElementById('admin-form-login').addEventListener('submit',onSubmit);
document.getElementById('inputEmail').addEventListener('focusout',Email);
document.getElementById('inputPassword').addEventListener('focusout',Password);


