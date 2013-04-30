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

	        if ($('article h2').length === 0) {
				$('#toc').remove();
				return 0;
			}

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

			var positionTop = ($(window.location.hash).position().top ||100);

			// console.info(positionTop);			

			$(window).scrollTop(positionTop-100);

		}

	});

/*
 * jQuery hashchange event - v1.3 - 7/21/2010
 * http://benalman.com/projects/jquery-hashchange-plugin/
 * 
 * Copyright (c) 2010 "Cowboy" Ben Alman
 * Dual licensed under the MIT and GPL licenses.
 * http://benalman.com/about/license/
 */
(function($,e,b){var c="hashchange",h=document,f,g=$.event.special,i=h.documentMode,d="on"+c in e&&(i===b||i>7);function a(j){j=j||location.href;return"#"+j.replace(/^[^#]*#?(.*)$/,"$1")}$.fn[c]=function(j){return j?this.bind(c,j):this.trigger(c)};$.fn[c].delay=50;g[c]=$.extend(g[c],{setup:function(){if(d){return false}$(f.start)},teardown:function(){if(d){return false}$(f.stop)}});f=(function(){var j={},p,m=a(),k=function(q){return q},l=k,o=k;j.start=function(){p||n()};j.stop=function(){p&&clearTimeout(p);p=b};function n(){var r=a(),q=o(m);if(r!==m){l(m=r,q);$(e).trigger(c)}else{if(q!==m){location.href=location.href.replace(/#.*/,"")+q}}p=setTimeout(n,$.fn[c].delay)}$.browser.msie&&!d&&(function(){var q,r;j.start=function(){if(!q){r=$.fn[c].src;r=r&&r+a();q=$('<iframe tabindex="-1" title="empty"/>').hide().one("load",function(){r||l(a());n()}).attr("src",r||"javascript:0").insertAfter("body")[0].contentWindow;h.onpropertychange=function(){try{if(event.propertyName==="title"){q.document.title=h.title}}catch(s){}}}};j.stop=k;o=function(){return a(q.location.href)};l=function(v,s){var u=q.document,t=$.fn[c].domain;if(v!==s){u.title=h.title;u.open();t&&u.write('<script>document.domain="'+t+'"<\/script>');u.close();q.location.hash=v}}})();return j})()})(jQuery,this);

jQuery(window).hashchange(function(){

	if (window.location.hash !== '') {
		var positionTop = ($(window.location.hash).position().top || 0);
	} else {
		var positionTop = 0;
	}
	
	$(window).scrollTop(positionTop>0?positionTop-30:0);

});
