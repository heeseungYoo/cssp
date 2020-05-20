/*
cssp2-single neural network
-line chart-
*/

$(document).ready(function() {
	var line_options = {
		chart: {
			height: 250
		},
		title: {
			text: ''
		},
		credits: {
			enabled: false
		},
		xAxis:{
			type: 'category',
			categories: [],
			tickPosition: 'outside',
			tickWidth: 0.5,
			tickInterval: 1,
			labels: {
				step: 1,
                style: {
                    fontSize: 10
                }
            }
		},
		yAxis: {
			title: {
				text: 'cssp'
			},
			endOnTick: false,
			tickInterval: 4,
			minorTickInterval: 2,
			minorGridLineWidth: 0,
			minorTickWidth: 1,
			minorTickLength: 5,
			minorTickPosition: 'inside',
			minorTickColor: '#cccccc'
		},

		tooltip: {
			useHTML: true,
			headerFormat: '<div><b>{series.name}</b><br/>',
			pointFormat: '{point.category}<br/>{point.y}</div>',
			borderRadius: 0,
			padding: 3,
			outside: true
		},

		navigation: {
			buttonOptions: {
				enabled: false
			}
		}, 

		plotOptions: {
			
		},

		series: [{
			name: 'helix',
			color: '#990000',
			data: [],
			lineWidth: 1,
			marker: {
                enabled: false,
                symbol: 'circle',
                states: {
                    hover: {
                        enabled: true
                    }
                }
			},
			states: {
				hover: {
					lineWidth: 1
				}
			},
			label: {
                enabled: false
            }
		}, {
			name: 'beta',
			color: '#000099',
			data: [],
			lineWidth: 1,
			marker: {
                enabled: false,
                symbol: 'circle',
                states: {
                    hover: {
                        enabled: true
                    }
                }
			},
			states: {
				hover: {
					lineWidth: 1
				}
			},
			label: {
                enabled: false
            }
		}, {
			name: 'coil',
			color: '#009900',
			data: [],
			lineWidth: 1,
			marker: {
                enabled: false,
                symbol: 'circle',
                states: {
                    hover: {
                        enabled: true
                    }
                }
			},
			states: {
				hover: {
					lineWidth: 1
				}
			},
			label: {
                enabled: false
            }
		}
		],
		responsive: {
			rules: [{
				condition: {
				},
				chartOptions: {
					legend: {
						layout: 'horizontal',
						align: 'center',
						verticalAlign: 'bottom'
					}
				}
			}]
		}
	};

	var query_name = $("#query_name").attr("value") + '.xml';

	$.get(query_name, function(xml) {

		var $xml = $(xml);
		var dataColumn = parseInt($xml.find('colTot').text());	// 147
			
		var splitxAxis = new Array;
		var splitpaSum = new Array;
		var splitpbSum = new Array;
		var splitpcSum = new Array;

		$xml.find('data table column center').each(function(i, category) {
			splitxAxis.push($(category).text());
		});
			
		$xml.find('data table column paSum').each(function(i, point) {
			splitpaSum.push(parseFloat($(point).text()));
		});
		
		$xml.find('data table column pbSum').each(function(i, point) {
			splitpbSum.push(parseFloat($(point).text()));
		});
	
		$xml.find('data table column pcSum').each(function(i, point) {
			splitpcSum.push(parseFloat($(point).text()));
		});

		var dataSet = new Array;
			
		for(var i = 0; i < dataColumn; i += 50) {
			var count = i/50;
			dataSet[count] = new Object();
			dataSet[count].dataxAxis = [];
			dataSet[count].datapaSum = [];
			dataSet[count].datapbSum = [];
			dataSet[count].datapcSum = [];
			if(dataColumn - i < 50) {
				for(var j = i; j < dataColumn; j++) {
					dataSet[count].dataxAxis.push(splitxAxis[j]);
					dataSet[count].datapaSum.push(splitpaSum[j]);
					dataSet[count].datapbSum.push(splitpbSum[j]);
					dataSet[count].datapcSum.push(splitpcSum[j]);
				}
			} else {
				for(var j = i; j < i + 50; j++) {
					dataSet[count].dataxAxis.push(splitxAxis[j]);
					dataSet[count].datapaSum.push(splitpaSum[j]);
					dataSet[count].datapbSum.push(splitpbSum[j]);
					dataSet[count].datapcSum.push(splitpcSum[j]);
				}
			}
		}

		for(count = 0; count < dataSet.length; count++) {
			line_options.xAxis.categories = dataSet[count].dataxAxis;
			line_options.series[0].data = dataSet[count].datapaSum;
			line_options.series[1].data = dataSet[count].datapbSum;
			line_options.series[2].data = dataSet[count].datapcSum;
			line_options.chart.width = dataSet[count].dataxAxis.length * 11.3 + 70;
			var container = "line_container" + count;
			var func_name = "line_container" + count;

			func_name = function () {	
				var chart = new Highcharts.chart(container, line_options);
			}
			func_name()
		}	
	});

});



	