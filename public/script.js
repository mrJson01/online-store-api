function open(event)
{
	$('#fil').css('transition','0.4s linear');

	if($('#fil').hasClass('ope'))
		{
			$('#fil').css('transform','translateX(-100%)');
			event.target.innerText="Show Filters";
		}
	else {
		$('#fil').css('transform','translateX(0)');
		event.target.innerText="Hide Filters";
	}
	$('#fil').toggleClass('ope');

}

const filtrs = (e)=>{
	console.log($(e.target));
};

$('#button-div .btn').on('click',function(){open(event);})



// $('#toggle-navbar').click(function(e){

// 	let defaul = $('#toggle-navbar').attr('aria-expanded');
// 	console.log(defaul);

// 	if(defaul=='true')
// 	{
// 		$('#fil').animate({
// 			top:"56px"
// 		},500,()=>{
// 			console.log('DONE!!!');
// 			defaul=false;
// 		});
// 	}	
// 	else if(defaul=='false')
// 	{
// 		$('#fil').animate({
// 			top:"160px"
// 		},500,()=>{
// 			console.log('DONE!!!');
// 			defaul=true;
// 		});
// 	}
// })


$('#navbarToggle').on('show.bs.collapse',()=>{
	let heightOfNav = ($(window).width()<576) ? 216 : 160;
	$('#fil').animate({
			top:`${heightOfNav}px`
		},0,()=>{
			console.log('DONE!!!');
		});
});
$('#navbarToggle').on('hide.bs.collapse',()=>{
	$('#fil').animate({
			top:"56px"
		},0,()=>{
			console.log('DONE!!!');
		});
})


// Script gotowy tylko fetch()

// $('form').on('submit',function(e){
// 	e.preventDefault();

// 	let check = $(this).find('input:checked');//check
// 	let set = new Set();
// 	let obj = Object.create({});

// 	check.each((ind,val)=>{
// 		set.add(val.name);
// 	});

// 	for(let item of set)
// 	{
// 		let x = check.filter(`[name=${item}]`);
// 		let array = new Array();
// 		x.each((ind,val)=>{
// 			array.push(val.value);
// 		});
// 		obj[`${item}`]=array;
// 	}

// 	console.log(obj);
// })

$(window).resize(function(){
	if($(window).width()>=768)
		{
			$('#fil').attr("style",'');
			$('#fil').removeClass('ope');
		}

	// FOR PROMOTED ITEMS ON A TOP
	// let left = $('#img-background').offset().left;

	// $('#promo-container').css({'left':`${left}px`});
});
