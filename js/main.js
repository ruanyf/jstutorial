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
