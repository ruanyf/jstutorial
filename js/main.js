jQuery(document).on('click',"header a",function(){
	$('header')
	.animate({width:0,height:0,opacity:0},700)
	.animate({width:"100%",height:"100%",opacity:1}, 700);
});

jQuery(document).on('click',"#toc a",function(){
	$('header')
	.animate({width:0,height:0,opacity:0},700)
	.animate({width:"100%",height:"100%",opacity:1}, 700);
});

jQuery(document).ready(function(){

			$('#toc').toc({
				'selectors': 'h2,h3,h4', //elements to use as headings
				'container': 'article'
			});

			$('#toc ul li.toc-h2').clone().appendTo("nav section li.nav-3 ul");
			
			$('#toc').before('<h2>目录</h2>');	

/*
        $('#toc li.toc-h2 a').each(function (i){
			
			$(this).html((i+1)+'. '+$(this).html());
			
			}); 
			
*/
		$('#toc~h2').wrap('<div class="chapter" />');

	});

jQuery(window).load(function(){

		if (window.location.hash !== '') {

			var positionTop = ($(window.location.hash).position().top || -100);

			// console.info(positionTop);			

			$(window).scrollTop(positionTop+100);

		}

	});
