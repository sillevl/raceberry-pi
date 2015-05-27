$(document).foundation();

$(function () {
    $(document).ready(function () {
        Highcharts.setOptions({
            global: {
                useUTC: false
            }
        });

        $('#container').highcharts({
            chart: {
                type: 'spline',
                animation: Highcharts.svg, // don't animate in old IE
                marginRight: 10,
                events: {
                    load: function () {

                        // set up the updating of the chart each second
                        var series = this.series[0];
                        setInterval(function () {
                            var x = (new Date()).getTime(), // current time
                                y = Math.random();
                            series.addPoint([x, y], true, true);
                        }, 1000);
                    }
                }
            },
            title: {
                text: 'Live random data'
            },
            xAxis: {
                type: 'datetime',
                tickPixelInterval: 150
            },
            yAxis: {
                title: {
                    text: 'Value'
                },
                plotLines: [{
                    value: 0,
                    width: 1,
                    color: '#808080'
                }]
            },
            tooltip: {
                formatter: function () {
                    return '<b>' + this.series.name + '</b><br/>' +
                        Highcharts.dateFormat('%Y-%m-%d %H:%M:%S', this.x) + '<br/>' +
                        Highcharts.numberFormat(this.y, 2);
                }
            },
            legend: {
                enabled: false
            },
            exporting: {
                enabled: false
            },
            series: [{
                name: 'Random data',
                data: (function () {
                    // generate an array of random data
                    var data = [],
                        time = (new Date()).getTime(),
                        i;

                    for (i = -19; i <= 0; i += 1) {
                        data.push({
                            x: time + i * 1000,
                            y: Math.random()
                        });
                    }
                    return data;
                }())
            }]
        });
    });
});


function milliToString(milli){
	var milliseconds = (milli / 10) % 100;
    var totalSeconds = Math.floor(milli / 1000);
	var seconds = totalSeconds % 60;
	var minutes = Math.floor(totalSeconds / 60);
	return {
		'minutes' : Math.round(minutes).padded(),
		'seconds' : Math.round(seconds).padded(),
		'milliseconds' : Math.round(milliseconds.toFixed(2)).padded()
	}
}

Number.prototype.padded = function(){
    var str = this.toString();
    return str < 10 ? "0" + str : str;
};

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

	}, 500);
});

