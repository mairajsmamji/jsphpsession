function bar(){
		this.diver ='';
}

bar.prototype.start = function(){

		this.diver = document.createElement('div');
	
		this.diver.setAttribute('style','width:100px;height:2px;box-shadow: 0px 0px 25px 3px red;position:fixed;top:0px;left:0px;z-index:12000;transform-style: preserve-3d;transition: all 0.5s linear');
		document.body.appendChild(this.diver);
			var nn = this;
				setTimeout(function(){
				nn.diver.style.width = document.body.offsetWidth / 4
			},300);			
		
			nn.diver.addEventListener( 'webkitTransitionEnd',runbar,false);
 
		    var trans = Array(2,10,100)
			var w = Array(2,1.4,1.1)
			var num = 0
			function runbar( event ) { 
				if(num == 3){
						nn.diver.removeEventListener( 'webkitTransitionEnd',runbar,false);
				}
				nn.diver.style.transition = 'all '+trans[num]+'s linear'
				nn.diver.style.width = document.body.offsetWidth / w[num]
				
				
				
				num++;
			 }
		
}

bar.prototype.stop = function(){
					var nn = this
					nn.diver.removeEventListener( 'webkitTransitionEnd',runbar,false);
					nn.diver.style.transition = 'all 0.2s linear'
					nn.diver.style.width = document.body.offsetWidth
					nn.diver.addEventListener( 'webkitTransitionEnd',runbar,false);
					function runbar(event){
						nn.diver.removeEventListener( 'webkitTransitionEnd',runbar,false);
						document.body.removeChild(nn.diver)						
					}					
}


var ajaxbar=new bar;


//   Ajax Like class which work with crossbrowser

 function pjax(){ 
		
		this.diver = '';
		this.callback = '';
		return this;
}		
pjax.prototype.create = function(){
		this.diver = document.createElement('div');
		this.diver.style.width = '0px'
		this.diver.style.height = '0px'
		
		this.diver.innerHTML = '<object type="application/json" data="n.php" ></object>';
		document.body.appendChild(this.diver);
		this.diver.childNodes[0].onload = (function(val){ return function(){  
				var res = val.diver.childNodes[0].contentDocument.body.innerHTML;
				val.diver.style.display = 'none';
				document.body.removeChild(val.diver);		
				if(val.callback !== null){ 
					val.callback.call(this,res); 
				} 
			}
		})(this)

		this.diver.style.display = 'none';
		
		return this;
	}

pjax.prototype.load = function(url,type,callback){
		if(type === null){
			type="application/json";			
		}
		if(url === null){
			if(callback !== null){
				callback.call(this,"ERROR: URL not defined");
			}
			return;
		}
		if(callback === null){
				alert('ERROR: PJEX callback not defined');
				return;
		} 
		this.callback = callback;
		this.diver.type = type;
		this.diver.childNodes[0].data = url;
		this.diver.style.display = 'block';
		return this;
}


//jssession class get or set php session class realtime 

function jssession(){
	this.php = "jssession.php";
	this.db = "sessiondb";
	this.table = "session"
	this.jsid = "";
	return this;
}

jssession.prototype.init = function(){
	this.source = new EventSource(this.php);
	this.lib = new localStorageDB(this.db, localStorage);
	if(this.lib.isNew()) {
	    this.lib.createTable(this.table, ["key", "value"]);
	}
	this.lib.commit();
	var self = this;
	this.source.onmessage = function(event) {   self.updatesession(JSON.parse(event.data));	}

	return this;
}
	
jssession.prototype.updatesession = function(data){ 
		this.jsid = data.jsid;
		this.lib.truncate(this.table)
		var keys = Object.keys(data);
		for(var b=0;b<keys.length;b++){
    		this.lib.insert(this.table, {key: keys[b], value: data[keys[b]]});			
		}
		this.lib.commit();
}

jssession.prototype.set = function(key,val){
		if(key !== null && val !== ''){
			new pjax().create().load('jssessionset.php?jsid='+this.jsid+'&key='+key+'&val='+val+'&cmd=set','application/json',function mph(res){});
		}			
}
jssession.prototype.get = function(key){
		if(key !== null){
			if(this.lib.query(this.table, {key: key}).length != 0){ 
				return (this.lib.query(this.table, {key: key}))[0].value
			}
				
		}			
}
jssession.prototype.unset = function(key){
		if(key !== null){
			new pjax().create().load('jssessionset.php?jsid='+this.jsid+'&key='+key+'&cmd=unset','application/json',function mph(res){});
		}			
}

jssession.prototype.destroy = function(){
			this.source.close();
			this.lib.drop();
			new pjax().create().load('jssessionset.php?jsid='+this.jsid+'&cmd=destroy','application/json',function mph(res){});		
			
}
