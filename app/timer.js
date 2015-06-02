

Timer = function(){

	var startTime;

	this.start = function(){
		startTime = (new Date).getTime();
	}

	this.stop = function(){
		return (new Date).getTime() - startTime;
	}
}

module.exports.create = function(){
	return new Timer();
}