NL.onDomReady(function () {
	NL('#api_side dl dd').addClass('hide');

	var id_h2 = NL('#api_side h2').on('click', function () {
		NL(this).toggleClass('open').getSiblings({ tagName: 'div' }).toggleClass('hide');
	});
	var id_h3 = NL('#api_side h3').on('click', function () {
		NL(this).toggleClass('open').getSiblings({ tagName: ['dl','ul'] }).toggleClass('hide');
	});
	var id_dt = NL('#api_side dt').on('click', function () {
		NL(this).toggleClass('open').getSiblings().toggleClass('hide');
	});
	var id_link = NL('#api_side a').on('click', function (e) {
		e.preventDefault();
		NL('#api_side a').removeClass('reading');
		NL(this).addClass('reading');
		NL('#iframe').setAttr('src', this.href);
	});
	var id_windowReset = NL(window).on('resize',function(e){
		//NL.console.log(e.target.innerHeight);
		//NL.exec();
	});
	var _id = "NLexecID";
	NL.exec(function(time){
		if(time == 2)
			NL.exec.clear(_id);
		NL.console.log(time);
	},3,1000,_id);
	NL.exec(function(time){
		NL.console.log(time+'--');
	},3,1000, _id);
	//alert(id_);
	var arr = {};
	for(var i=0; i<5; i++){
		arr[function(){}] = 0;
	}
	NL.console.log(arr);
});