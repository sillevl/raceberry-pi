var log = require('./lib/logger');

Timer = function(){

	var startTime;
	var status = 'waiting';
	var time = 0;

	this.start = function(){
		log.info('Timer started');
		startTime = (new Date).getTime();
		status = 'running';
	}

	getTime = function(){
		if(status == 'running'){
			return (new Date).getTime() - startTime;
		} else {
			return time;
		}
	}

	this.stop = function(){
		var endTime = (new Date).getTime() - startTime;
		log.info('Timer stopped at %dms', endTime);
		status = 'stopped';
		time = endTime;
		return endTime;
	}

	this.reset = function(){
		log.info('Timer reset');
		time = 0;
		status = 'waiting';
	}

	this.getStatus= function(){
		return { status: status, time: getTime()};
	}
}

module.exports.create = function(){
	log.verbose('created new Timer instance');
	return new Timer();
}