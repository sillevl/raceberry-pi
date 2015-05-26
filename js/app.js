$(document).foundation();

var randomScalingFactor = function(){ return Math.round(Math.random()*100)};
var lineChartData = {
	labels : ["January","February","March","April","May","June","July"],
	//labels : [],
	datasets : [
		{
			label: "My First dataset",
			fillColor : "rgba(220,220,220,0)",
			strokeColor : "rgba(220,220,220,1)",
			pointColor : "rgba(220,220,220,1)",
			pointStrokeColor : "#fff",
			pointHighlightFill : "#fff",
			pointHighlightStroke : "rgba(220,220,220,1)",
			//data : []
			data : [randomScalingFactor(),randomScalingFactor(),randomScalingFactor(),randomScalingFactor(),randomScalingFactor(),randomScalingFactor(),randomScalingFactor()]
		},
		{
			label: "My Second dataset",
			fillColor : "rgba(151,187,205,0)",
			strokeColor : "rgba(151,187,205,1)",
			pointColor : "rgba(151,187,205,1)",
			pointStrokeColor : "#fff",
			pointHighlightFill : "#fff",
			pointHighlightStroke : "rgba(151,187,205,1)",
			//data : []
			data : [randomScalingFactor(),randomScalingFactor(),randomScalingFactor(),randomScalingFactor(),randomScalingFactor(),randomScalingFactor(),randomScalingFactor()]
		}
	]
}


$(document).ready(function(){
	var ctx = document.getElementById("chart").getContext("2d");
	window.myLine = new Chart(ctx).Line(lineChartData, {
		responsive: true,
		animation : false,
		scaleOverride: true,
		scaleStartValue: 0,
		scaleSteps: 10,
		scaleStepWidth: 10
	});
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