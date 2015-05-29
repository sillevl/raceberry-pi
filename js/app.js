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

showTimer = function(){
    $('#timervalue').show();
    $('#timerready').hide();
};

showReady = function(){
    $('#timervalue').hide();
    $('#timerready').show();
};


var raceberryPi = angular.module("raceberry-pi", ['ngResource'])
.controller("TimerController", function ($scope, $interval, RaceTime) {
    $scope.minutes = '00';
    $scope.seconds = '00';
    $scope.milliseconds = '00';
    $scope.teamname = "--";

    var timer;
    var time;

    $scope.createRace = function(){
        $('#startNewRaceModal').foundation('reveal', 'open');
    };
    $scope.startRace = function(){
        $scope.teamname = $scope.newTeamName;
        $('#startNewRaceModal').foundation('reveal', 'close');
        // send start to server
        ws.send('{"command": "start-race"}');
        // display ready on timer
        showReady();
    };
    $scope.startTimer = function (){
        console.log('timer started');
        // start the timer
        showTimer();
        var startTime = new Date();
        timer = $interval(function(){
            var now = new Date();
            setTime(now - startTime);
        }, 20);
    };

    setTime = function(time){
        time = milliToString(time);
        $scope.minutes = time.minutes;
        $scope.seconds = time.seconds;
        $scope.milliseconds = time.milliseconds;
    }

    $scope.finish = function(time){
        console.log('finished: ' + time);
        // finish race
        // show time
        console.log('stop timer');
        $interval.cancel(timer);
        timer = undefined;
        // save time and teamname to server
        RaceTime.save({'teamname': $scope.newTeamName, 'racetime': time}, function(){
            // update racetimes
            angular.element($('#raceTimes')).scope().updateRaceTimes();
        });
        
    };
    $scope.stop = function(){
        // send stop to server
        console.log('stop race!');
        ws.send('{"command": "cancel-race"}');
        $interval.cancel(timer);
        timer = undefined;
        time = 0;
        setTime(time);
        showTimer();
    };
})
.filter('offset', function() {
  return function(input, start) {
    start = parseInt(start, 10);
    return input.slice(start);
  };
})
.controller("RaceTimesController", function($scope, RaceTime, filterFilter){

    $scope.clearSearch = function(){
        $scope.searchText = '';
    };

    $scope.clearDate = function(){
        $scope.searchDate = '';
    };

    $scope.itemsPerPage = 10;
    $scope.currentPage = 0;
    $scope.filtered = [];

    $scope.updateRaceTimes = function(){
        $scope.raceTimes = RaceTime.query();
    }

    $scope.updateRaceTimes();

    $scope.range = function() {
        var rangeSize = 10;
        var ret = [];
        var start;
        var end;

        start = $scope.currentPage;
        if ( start > $scope.pageCount()-rangeSize ) {            
          start = $scope.pageCount()-rangeSize+1;
        }
        
        start = Math.max(start,0);
        end = Math.min(start+rangeSize, $scope.pageCount()+1);

        for (var i=start; i<end; i++) {
          ret.push(i);
        }
        return ret;
    };


    $scope.$watch('searchText', function(term) {
        $scope.setPage(0);
     });

    $scope.$watch('searchDate', function(term) {
        $scope.setPage(0);
     });
    
    $scope.prevPage = function() {
        if ($scope.currentPage > 0) {
          $scope.currentPage--;
        }
    };

    $scope.prevPageDisabled = function() {
        return $scope.currentPage === 0 ? "unavailable" : "";
    };

    $scope.pageCount = function() {
        return Math.ceil($scope.filtered.length/$scope.itemsPerPage)-1;
    };

    $scope.nextPage = function() {
        if ($scope.currentPage < $scope.pageCount()) {
          $scope.currentPage++;
        }
    };

    $scope.nextPageDisabled = function() {
        return $scope.currentPage === ($scope.pageCount()) ? "unavailable" : "";
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
  return $resource('http://racingrobots.be/api/v1/racetimes/:id', { id: '@_id' }, {});
});

var ws;

$(document).ready(function () {

  function debug(string) {
    var debug = document.getElementById("debug");
    var p = document.createElement('p');
    var now = new Date();
    p.innerHTML =  now.toLocaleTimeString()+ ": " +string;
    debug.insertBefore(p, debug.firstChild);
    console.log("debug: " + string);
  }

  var Socket = "MozWebSocket" in window ? MozWebSocket : WebSocket;
  ws = new Socket("ws://" + location.hostname + ":45679/");
  ws.onmessage = function(evt) {
    var response = {};
    debug("Received: " + evt.data);
    try{
        var json = JSON.parse(evt.data);
        if(json.command == "start-timer"){
            angular.element($('#timer-row')).scope().startTimer();
            response.status = "ok";
        }
        if(json.command == "finish"){
            angular.element($('#timer-row')).scope().finish(json.time);
            response.status = "ok";
        }
    } catch (err){
        response.status = "error";
        response.message = "JSON not valid, parsing error.";
        debug(error.message);
    }
    if(!$.isEmptyObject(response)){
        ws.send(JSON.stringify(response));
    }
  };
  ws.onclose = function(event) {
    debug("Closed - code: " + event.code + ", reason: " + event.reason + ", wasClean: " + event.wasClean);
  };
  ws.onopen = function() {
    debug("connected...");
  };
});
