$('#input_typ').change(change_typ);
$('#input_file').change(display_img);
$('main form').submit(submit_add);

function change_typ(){
	let type = $(this).val();

	fetch('http://localhost:8080/resources/dashboard/add/'+type,{
		method:'GET'
	}).then(data=>{return data.text()})
	.then(html=>{
		$('main form').append(html);
	});
}

function display_img(event){
	// console.log('start');
	var reader = new FileReader();

	reader.onload = function(){
		let dataUrl = reader.result;

		$('main form #img-card img').attr('src',dataUrl);
		// console.log('end');
	}

	reader.readAsDataURL(event.target.files[0]);
}

function submit_add(e){

	e.preventDefault();

	let inputs = $('form input');
	let imgIn = document.querySelector('main form input[type="file"]');
	let select = $('form select');
	const typ = select.val();
	let formData = new FormData();

	formData.append('img',imgIn.files[0]);

	inputs.each(function(ind,val){
		if(val.getAttribute('name')!=='img')
		{
			formData.append(val.getAttribute('name'),val.value);
		}
	});

	fetch('/admin/dashboard/add/'+typ,{
		method:'POST',
		body:formData
	}).then(res=>{return res.json()})
	.then(data=>{
		console.log(data);
	});

}


// console.log('active');