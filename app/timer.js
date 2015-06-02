var log = require('./lib/logger');

Timer = function(){

	var startTime;

	this.start = function(){
		log.info('Timer started');
		startTime = (new Date).getTime();
	}

	this.stop = function(){
		var endTime = (new Date).getTime() - startTime;
		log.info('Timer stopped at %dms', endTime);
		return endTime;
	}
}

module.exports.create = function(){
	log.verbose('created new Timer instance');
	return new Timer();
}