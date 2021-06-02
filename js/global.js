	$(document).ready(function(){

$('.btn123').click(function(){
	$(this).addClass('cur');
	$('.zzbox').css({
		'display':'block'
	})
	$('.wapnav').animate({
		'left':'0'
	})
})
$('.zzbox').click(function(){
$(this).css({
		'display':'none'
	})
$('.btn123').removeClass('cur');
$('.wapnav').animate({
		'left':'-100%'
	})
})
$('.wapnav .showbox .bolist .sli .h2tit').click(function(){
$(this).next('.sub').stop();
	$(this).next('.sub').slideToggle()
})
})