$(function() {


$("#lookbook").spriteMe({
	fps:30,
	loop:true,
	autoplay:false,
	reverse:true,
	maxframe: 52,
	gotoframe:32,
	complete: function(){  
		console.log('the end complete');
	}
});





$(".play").click(function(){
	$("#lookbook").spriteMe("play");
});
$(".stop").click(function(){
	$("#lookbook").spriteMe("stop");
});
$(".resume").click(function(){
	$("#lookbook").spriteMe("resume");
});
$(".restart").click(function(){
	$("#lookbook").spriteMe("restart");
});
$(".fps6").click(function(){
	$("#lookbook").spriteMe("fps",6);
});
$(".fps30").click(function(){
	$("#lookbook").spriteMe("fps",30);
});
$(".gt30").click(function(){
	$("#lookbook").spriteMe("gotoframe",30);
});
$(".gt0").click(function(){
	$("#lookbook").spriteMe("gotoframe",0);
});
$(".reverse").click(function(){
	$("#lookbook").spriteMe("reverse");
});
$(".maxframe42").click(function(){
	$("#lookbook").spriteMe("setmaxframe",42);
});
$(".nomaxframe").click(function(){
	$("#lookbook").spriteMe("setmaxframe",false);
});
$(".looptrue").click(function(){
	$("#lookbook").spriteMe("setloop",true);
});
$(".loopfalse").click(function(){
	$("#lookbook").spriteMe("setloop",false);
});




var params = {
	loop:true,
	fps:30
}

// $("#b").spriteMe(params);
// $("#c").spriteMe(params);
// $("#l").spriteMe(params);
// $("#m").spriteMe(params);
// $("#r").spriteMe(params);
// $("#v").spriteMe(params);




/***************************************/
/* Resize 
/***************************************/
	window.onresize = resizeme;
	// window.setTimeout(resizeme, 100);
	var ww =  $(window).width();
	var wh = $(window).height();
	function resizeme(){
        ww = $(window).width();
        wh = $(window).height();


        //console.log('resizeme')
	}
	// resizeme();


});
