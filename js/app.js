$(document).foundation();



$(document).ready(function(){

});

function milliToString(milli){
	var milliseconds = milli % 1000;
	var seconds = (milli - milliseconds) / 1000;
	var minutes = 0;
	return {
		'minutes' : minutes,
		'seconds' : seconds,
		'milliseconds' : milliseconds
	}
}

var milli = 0;

var startTime = new Date();

angular.module("raceberry-pi", [])
.controller("TimerController", function ($scope, $interval) {
	$interval(function(){
		var now = new Date();
		var time = milliToString(now - startTime);
		$scope.minutes = time.minutes;
    	$scope.seconds = time.seconds;
    	$scope.milliseconds = time.milliseconds;
	}, 21);

})
.controller("ActionController", function($scope){
	$scope.start = function(){
		alert('Start...');
	};
	$scope.stop = function(){
		alert('Stop...');
	};
})
.controller("ChartController", function ($scope, $interval) {
	$interval(function(){
		window.myLine.addData([randomScalingFactor(), randomScalingFactor()]);
		window.myLine.removeData();
	}, 500);
});

