jQuery(document).on('click',"header a",function(){
			
			$('header').hide(600).show(600);
			});

jQuery(document).on('click',"#toc a",function(){
			
			$('header').hide(600).show(600);
			});

jQuery(document).ready(function(){

			$('#toc').toc({
				'selectors': 'h2,h3,h4', //elements to use as headings
    'container': 'article'	
	});
			
		$('#toc').before('<h2>目录</h2>');	

		$('#toc li.toc-h2 a').each(function (i){
			
			$(this).html((i+1)+'. '+$(this).html());
			
			});

	});

jQuery(window).load(function(){

		if (window.location.hash !== '') {

			var positionTop = ($(window.location.hash).position().top || -50);

			console.info(positionTop);			

			$(window).scrollTop(positionTop+50);

		}
	});
