$(document).ready(()=>{
	$('.nav-item label').click(function(e){
        if(!$(this).hasClass('active'))
        {
            const url = $(this).children('.nav-link').data('href');
            $('.nav-item label').removeClass('active');
            $(this).addClass('active');

            fetch('http://localhost:8080/'+url,{
                method:'GET',
                headers:{
                    'Content-Type':'text/html'
                }
            }).then(data=>{return data.text()})
            .then(html=>{
                $('main').html(html);
            });
        }
        else{
            e.preventDefault();
        }
	});
})