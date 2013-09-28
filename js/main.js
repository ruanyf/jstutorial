jQuery(document).on('click',"header a",function(e){
	$('header')
	.animate({marginBottom:130},200)
	.animate({marginBottom:30},200);
});

jQuery(document).on('click',"#toc a",function(e){
	$('header')
	.animate({marginBottom:130},200)
	.animate({marginBottom:30},200);
// 	.animate({width:0,height:0,opacity:0},700)
//	.animate({width:"100%",height:"100%",opacity:1}, 700);
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

			if($.trim($('article h2:nth-last-of-type(1)').text())==='参考链接'){
				$('article h2:nth-last-of-type(1)').addClass('reference').next('ul').addClass('reference-list');
			}

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

/*! pace 0.4.10 */
(function(){var a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,x,y,z,A,B,C,D,E,F,G,H,I,J,K,L=[].slice,M={}.hasOwnProperty,N=function(a,b){function c(){this.constructor=a}for(var d in b)M.call(b,d)&&(a[d]=b[d]);return c.prototype=b.prototype,a.prototype=new c,a.__super__=b.prototype,a},O=[].indexOf||function(a){for(var b=0,c=this.length;c>b;b++)if(b in this&&this[b]===a)return b;return-1};q={catchupTime:500,initialRate:.03,minTime:500,ghostTime:250,maxProgressPerFrame:10,easeFactor:1.25,startOnPageLoad:!0,restartOnPushState:!0,restartOnBackboneRoute:!0,target:"body",elements:{checkInterval:100,selectors:["body"]},eventLag:{minSamples:10},ajax:{trackMethods:["GET"],trackWebSockets:!0}},y=function(){var a;return null!=(a="undefined"!=typeof performance&&null!==performance?"function"==typeof performance.now?performance.now():void 0:void 0)?a:+new Date},A=window.requestAnimationFrame||window.mozRequestAnimationFrame||window.webkitRequestAnimationFrame||window.msRequestAnimationFrame,p=window.cancelAnimationFrame||window.mozCancelAnimationFrame,null==A&&(A=function(a){return setTimeout(a,50)},p=function(a){return clearTimeout(a)}),C=function(a){var b,c;return b=y(),c=function(){var d;return d=y()-b,b=y(),a(d,function(){return A(c)})},c()},B=function(){var a,b,c;return c=arguments[0],b=arguments[1],a=3<=arguments.length?L.call(arguments,2):[],"function"==typeof c[b]?c[b].apply(c,a):c[b]},r=function(){var a,b,c,d,e,f,g;for(b=arguments[0],d=2<=arguments.length?L.call(arguments,1):[],f=0,g=d.length;g>f;f++)if(c=d[f])for(a in c)M.call(c,a)&&(e=c[a],null!=b[a]&&"object"==typeof b[a]&&null!=e&&"object"==typeof e?r(b[a],e):b[a]=e);return b},u=function(a,b){var c,d,e;if(null==a&&(a="options"),null==b&&(b=!0),e=document.querySelector("[data-pace-"+a+"]")){if(c=e.getAttribute("data-pace-"+a),!b)return c;try{return JSON.parse(c)}catch(f){return d=f,"undefined"!=typeof console&&null!==console?console.error("Error parsing inline pace options",d):void 0}}},null==window.Pace&&(window.Pace={}),z=Pace.options=r(q,window.paceOptions,u()),b=function(){function a(){this.progress=0}return a.prototype.getElement=function(){var a;return null==this.el&&(this.el=document.createElement("div"),this.el.className="pace pace-active",this.el.innerHTML='<div class="pace-progress">\n  <div class="pace-progress-inner"></div>\n</div>\n<div class="pace-activity"></div>',a=document.querySelector(z.target),null!=a.firstChild?a.insertBefore(this.el,a.firstChild):a.appendChild(this.el)),this.el},a.prototype.finish=function(){var a;return a=this.getElement(),a.className=a.className.replace("pace-active",""),a.className+=" pace-inactive"},a.prototype.update=function(a){return this.progress=a,this.render()},a.prototype.destroy=function(){return this.getElement().parentNode.removeChild(this.getElement()),this.el=void 0},a.prototype.render=function(){var a,b;return null==document.querySelector(z.target)?!1:(a=this.getElement(),a.children[0].style.width=""+this.progress+"%",(!this.lastRenderedProgress||0|(this.lastRenderedProgress|0!==this.progress))&&(a.setAttribute("data-progress-text",""+(0|this.progress)+"%"),this.progress>=100?b="99":(b=this.progress<10?"0":"",b+=0|this.progress),a.setAttribute("data-progress",""+b)),this.lastRenderedProgress=this.progress)},a.prototype.done=function(){return this.progress>=100},a}(),g=function(){function a(){this.bindings={}}return a.prototype.trigger=function(a,b){var c,d,e,f,g;if(null!=this.bindings[a]){for(f=this.bindings[a],g=[],d=0,e=f.length;e>d;d++)c=f[d],g.push(c.call(this,b));return g}},a.prototype.on=function(a,b){var c;return null==(c=this.bindings)[a]&&(c[a]=[]),this.bindings[a].push(b)},a}(),I=window.XMLHttpRequest,H=window.XDomainRequest,G=window.WebSocket,s=function(a,b){var c,d,e,f;f=[];for(d in b.prototype)try{e=b.prototype[d],null==a[d]&&"function"!=typeof e?f.push(a[d]=e):f.push(void 0)}catch(g){c=g}return f},h=function(a){function b(){var a,c=this;b.__super__.constructor.apply(this,arguments),a=function(a){var b;return b=a.open,a.open=function(d,e){var f;return f=(null!=d?d:"GET").toUpperCase(),O.call(z.ajax.trackMethods,f)>=0&&c.trigger("request",{type:d,url:e,request:a}),b.apply(a,arguments)}},window.XMLHttpRequest=function(b){var c;return c=new I(b),a(c),c},s(window.XMLHttpRequest,I),null!=H&&(window.XDomainRequest=function(){var b;return b=new H,a(b),b},s(window.XDomainRequest,H)),null!=G&&z.ajax.trackWebSockets&&(window.WebSocket=function(a,b){var d;return d=new G(a,b),c.trigger("request",{type:"socket",url:a,protocols:b,request:d}),d},s(window.WebSocket,G))}return N(b,a),b}(g),x=new h,a=function(){function a(){var a=this;this.elements=[],x.on("request",function(){return a.watch.apply(a,arguments)})}return a.prototype.watch=function(a){var b,c,d;return d=a.type,b=a.request,c="socket"===d?new k(b):new l(b),this.elements.push(c)},a}(),l=function(){function a(a){var b,c,d,e,f,g,h=this;if(this.progress=0,null!=window.ProgressEvent)for(c=null,a.addEventListener("progress",function(a){return h.progress=a.lengthComputable?100*a.loaded/a.total:h.progress+(100-h.progress)/2}),g=["load","abort","timeout","error"],d=0,e=g.length;e>d;d++)b=g[d],a.addEventListener(b,function(){return h.progress=100});else f=a.onreadystatechange,a.onreadystatechange=function(){var b;return 0===(b=a.readyState)||4===b?h.progress=100:3===a.readyState&&(h.progress=50),"function"==typeof f?f.apply(null,arguments):void 0}}return a}(),k=function(){function a(a){var b,c,d,e,f=this;for(this.progress=0,e=["error","open"],c=0,d=e.length;d>c;c++)b=e[c],a.addEventListener(b,function(){return f.progress=100})}return a}(),d=function(){function a(a){var b,c,d,f;for(null==a&&(a={}),this.elements=[],null==a.selectors&&(a.selectors=[]),f=a.selectors,c=0,d=f.length;d>c;c++)b=f[c],this.elements.push(new e(b))}return a}(),e=function(){function a(a){this.selector=a,this.progress=0,this.check()}return a.prototype.check=function(){var a=this;return document.querySelector(this.selector)?this.done():setTimeout(function(){return a.check()},z.elements.checkInterval)},a.prototype.done=function(){return this.progress=100},a}(),c=function(){function a(){var a,b,c=this;this.progress=null!=(b=this.states[document.readyState])?b:100,a=document.onreadystatechange,document.onreadystatechange=function(){return null!=c.states[document.readyState]&&(c.progress=c.states[document.readyState]),"function"==typeof a?a.apply(null,arguments):void 0}}return a.prototype.states={loading:0,interactive:50,complete:100},a}(),f=function(){function a(){var a,b,c,d=this;this.progress=0,a=0,c=0,b=y(),setInterval(function(){var e;return e=y()-b-50,b=y(),a+=(e-a)/15,c++>z.eventLag.minSamples&&Math.abs(a)<3&&(a=0),d.progress=100*(3/(a+3))},50)}return a}(),j=function(){function a(a){this.source=a,this.last=this.sinceLastUpdate=0,this.rate=z.initialRate,this.catchup=0,this.progress=this.lastProgress=0,null!=this.source&&(this.progress=B(this.source,"progress"))}return a.prototype.tick=function(a,b){var c;return null==b&&(b=B(this.source,"progress")),b>=100&&(this.done=!0),b===this.last?this.sinceLastUpdate+=a:(this.sinceLastUpdate&&(this.rate=(b-this.last)/this.sinceLastUpdate),this.catchup=(b-this.progress)/z.catchupTime,this.sinceLastUpdate=0,this.last=b),b>this.progress&&(this.progress+=this.catchup*a),c=1-Math.pow(this.progress/100,z.easeFactor),this.progress+=c*this.rate*a,this.progress=Math.min(this.lastProgress+z.maxProgressPerFrame,this.progress),this.progress=Math.max(0,this.progress),this.progress=Math.min(100,this.progress),this.lastProgress=this.progress,this.progress},a}(),E=null,D=null,n=null,F=null,m=null,o=null,v=function(){return z.restartOnPushState?Pace.restart():void 0},null!=window.history.pushState&&(J=window.history.pushState,window.history.pushState=function(){return v(),J.apply(window.history,arguments)}),null!=window.history.replaceState&&(K=window.history.replaceState,window.history.replaceState=function(){return v(),K.apply(window.history,arguments)}),t=!0,z.restartOnBackboneRoute&&setTimeout(function(){return null!=window.Backbone?Backbone.history.on("route",function(a,b){var c,d,e,f,g;if(d=z.restartOnBackboneRoute){if(t)return t=!1,void 0;if("object"==typeof d){for(g=[],e=0,f=d.length;f>e;e++)if(c=d[e],c===b){Pace.restart();break}return g}return Pace.restart()}}):void 0},0),i={ajax:a,elements:d,document:c,eventLag:f},(w=function(){var a,c,d,e,f,g,h,k,l;for(Pace.sources=E=[],h=["ajax","elements","document","eventLag"],d=0,f=h.length;f>d;d++)c=h[d],z[c]!==!1&&E.push(new i[c](z[c]));for(l=null!=(k=z.extraSources)?k:[],e=0,g=l.length;g>e;e++)a=l[e],E.push(new a(z));return Pace.bar=n=new b,D=[],F=new j})(),Pace.stop=function(){return n.destroy(),o=!0,null!=m&&("function"==typeof p&&p(m),m=null),w()},Pace.restart=function(){return Pace.stop(),Pace.go()},Pace.go=function(){return n.render(),o=!1,m=C(function(a,b){var c,d,e,f,g,h,i,k,l,m,p,q,r,s,t,u,v,w;for(k=100-n.progress,d=r=0,e=!0,h=s=0,u=E.length;u>s;h=++s)for(p=E[h],m=null!=D[h]?D[h]:D[h]=[],g=null!=(w=p.elements)?w:[p],i=t=0,v=g.length;v>t;i=++t)f=g[i],l=null!=m[i]?m[i]:m[i]=new j(f),e&=l.done,l.done||(d++,r+=l.tick(a));return c=r/d,n.update(F.tick(a,c)),q=y(),n.done()||e||o?(n.update(100),setTimeout(function(){return n.finish()},Math.max(z.ghostTime,Math.min(z.minTime,y()-q)))):b()})},Pace.start=function(a){return r(z,a),n.render(),document.querySelector(".pace")?Pace.go():setTimeout(Pace.start,50)},"function"==typeof define&&define.amd?define(function(){return Pace}):"object"==typeof exports?module.exports=Pace:z.startOnPageLoad&&Pace.start()}).call(this);
