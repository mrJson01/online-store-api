$(document).ready(()=>{
	$('.nav-item label').click(function(){
		const url = $(this).children('.nav-link').data('href');


		fetch('http://localhost:8080/'+url,{
			method:'GET',
			headers:{
				'Content-Type':'text/html'
			}
		}).then(data=>{return data.text()})
		.then(html=>{
			$('main').html(html);
		});
	});
})