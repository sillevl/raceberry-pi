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

$('.fdatepicker').fdatepicker({
    language: 'nl'
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

var raceberryPi = angular.module("raceberry-pi", ['ngResource'])
.controller("TimerController", function ($scope, $interval) {
	$interval(function(){
		var now = new Date();
		var time = milliToString(now - startTime);
		$scope.minutes = time.minutes;
    	$scope.seconds = time.seconds;
    	$scope.milliseconds = time.milliseconds;
	}, 1000);
    $scope.teamname = "Team naam";

})
.controller("ActionController", function($scope){
	$scope.start = function(){
		alert('Start...');
	};
	$scope.stop = function(){
		alert('Stop...');
	};
})
.filter('offset', function() {
  return function(input, start) {
    start = parseInt(start, 10);
    return input.slice(start);
  };
})
.controller("RaceTimesController", function($scope, RaceTime){

    $scope.clearSearch = function(){
        $scope.searchText = '';
    };

    $scope.clearDate = function(){
        $scope.searchDate = '';
    };

    $scope.itemsPerPage = 10;
    $scope.currentPage = 0;

    $scope.raceTimes = RaceTime.query();

    $scope.range = function() {
        var rangeSize = 10;
        var ret = [];
        var start;
        var end;

        start = $scope.currentPage;
/*        if ( start > $scope.pageCount()-rangeSize ) {            
          start = $scope.pageCount()-rangeSize+1;
        }*/
        
        end = Math.min(start+rangeSize, $scope.pageCount()+1);

        for (var i=start; i<end; i++) {
          ret.push(i);
        }
        return ret;
    };
    
    $scope.prevPage = function() {
        if ($scope.currentPage > 0) {
          $scope.currentPage--;
        }
    };

    $scope.prevPageDisabled = function() {
        return $scope.currentPage === 0 ? "unavailable" : "";
    };

    $scope.pageCount = function() {
        return Math.ceil($scope.raceTimes.length/$scope.itemsPerPage)-1;
    };

    $scope.nextPage = function() {
        if ($scope.currentPage < $scope.pageCount()-1) {
          $scope.currentPage++;
        }
    };

    $scope.nextPageDisabled = function() {
        return $scope.currentPage === ($scope.pageCount()-1) ? "unavailable" : "";
    };

    $scope.setPage = function(n) {
        $scope.currentPage = n;
    };
    
})
.controller("ChartController", function ($scope, $interval) {
	$interval(function(){

	}, 500);
})
.factory('RaceTime', function($resource) {
  return $resource('http://racingrobots.be/api/v1/racetimes/:id', { id: '@_id' }, {
    update: {
      method: 'PUT'
    }
  });
});

