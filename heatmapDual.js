/*
cssp2-dual neural network 
-heatmap-
*/
$(document).ready(function() {

    // heatmap-tooltip get helix,beta value
    function getPointName(point) {
        var y = point.y;
        if(y < 10) {
            return "helix";
        }
        else {
            return "beta";
        }
    }

    // heatmap-tooltip color 
    function getPointColor(colorString) {
        if (colorString == '#FFFFCC' || colorString == '#FFFFBB' || colorString == '#FAE7E7' || colorString == '#E4FFCC') {
            return '#000000'
        } 
        else if(colorString == 'none') {
            return 'rgba(0,0,0,0)'
        }
        else {
            return '#FFFFFF'
        }
    }

    //heatmap-select
    function selectPointsByDrag(e) {
        var points = this.getSelectedPoints();
        if (points.length > 0) {
            Highcharts.each(points, function (point) {
                point.select(false);
            });
        }

        // Select points
        Highcharts.each(this.series, function (series) {
            Highcharts.each(series.points, function (point) {
                if (point.x >= e.xAxis[0].min && point.x <= e.xAxis[0].max &&
                        point.y >= e.yAxis[0].min && point.y <= e.yAxis[0].max) {
                    point.select(true, true);
                }
            });
        });

        // Fire a custom event
        Highcharts.fireEvent(this, 'selectedpoints', { points: this.getSelectedPoints() });
    
        return false; // Don't zoom
    }

    function selectedPoints(e) {
        var selectCount = e.points.length/3;
        var helixSelectTotal = 0;
        var betaSelectTotal = 0;
        var unCount = 0;

        for(var i = 0; i < selectCount; i++) {
            if(e.points[i].y < 10) {
                helixSelectTotal += e.points[i].value;
            }
            else if(e.points[i].y >= 10 && e.points[i].y < 13) {
                unCount += 1;
            }
            else {
                betaSelectTotal += e.points[i].value;
            }
        }

        var helixSelect = (helixSelectTotal / (selectCount - unCount)).toFixed(2);
        var betaSelect = (betaSelectTotal / (selectCount- unCount)).toFixed(2);

        $('#paSel').html('P(helix) = ' + helixSelect);
        $('#pbSel').html('P(beta) = ' + betaSelect);
    }

    function unselectByClick() {
        var points = this.getSelectedPoints();
        if (points.length > 0) {
            Highcharts.each(points, function (point) {
                point.select(false);
            });
        }
    }

    var options = {
        chart: {
            type: 'heatmap',
            marginTop: 60,
            marginBottom: 20,
            marginLeft: 50,
            plotBorderWidth: 0,
            borderWidth: 1, 
            borderColor: '#DDDDDD',
            events: {
                selection: selectPointsByDrag,
                selectedpoints: selectedPoints,
                click: unselectByClick
            },
            zoomType: 'xy',
            selectionMarkerFill: "rgba(51, 92, 255, 0.35)"
        },

        title: {
            text: ''
        },

        credits: {
			enabled: false
		},

        xAxis: [{
            categories: [],
            opposite: true,
            margin:0,
            lineWidth: 0,
            gridLineWidth: 0,
            labels: {
                y: -3,
                useHTML: true,
                formatter: function() {
                    return '<img src="' + this.value + '"/>';
                },
                step: 1
            }
        }, {
            categories: [],          
            opposite: true,
            margin:0,
            lineWidth: 0,
            gridLineWidth: 0,
            labels: {
                y: 10,
                padding:0,
                step: 1,
                style: {
                    fontSize: 10
                }
            }
        }, {
            categories: [],
            opposite: true,
            margin:0,
            lineWidth: 0,
            gridLineWidth: 0,
            labels: {
                y: 10,
                padding: 0,
                step: 1,
                style: {
                    fontSize: 10
                }
            }
        }],

        yAxis: [{
            categories: ['HIGH','', '','','','','','','','LOW', '','','','HIGH', '','','','','','','','','LOW'],
            title: null,
            reversed: true,
            endOnTick: false,
            gridLineWidth: 0,
            labels: {
                step:1,
                style: {
                    fontSize: 10
                }
            }
        }],

        series: [{
            name: 'data',
            borderWidth: 1,
            borderColor: 'white',
            data: [],
            xAxis: 1,
            allowPointSelect: true,
        }, {
            name: 'null',
            borderWidth: 1,
            borderColor: 'white',
            data: [],
            xAxis: 0,
            allowPointSelect: true
        }, {
            name: 'null',
            borderWidth: 1,
            borderColor: 'white',
            data: [],
            xAxis: 2,
            allowPointSelect: true
        }
        ],

        legend: {
            enabled: false
        },

        tooltip: {
            useHTML: true,
            backgroundColor: 'rgba(255, 255, 255, 0)',
            borderWidth:0,
            shadow: false, 
            formatter: function () {
               return '<div class="tooltip" style="background-color:' + this.point.color + '; color:' + getPointColor(this.point.color) + ';">'
               + 'P(' + getPointName(this.point) + ') = ' + this.point.value.toFixed(5)
               + '</div>';
            
            },
            style: {
                fontSize: 11
            },
            shared: true,
            outside: true
        },

        navigation: {
			buttonOptions: {
				enabled: false
			}
        }, 
        
        plotOptions: {
            series: {
                turboThreshold: 2000
            }
        },
        
        responsive: {
            rules: [{
                condition: {
                }
            }],
            chartOptions: {
            }
        }

    };

    function getPng(struct, type) {
        switch(type) {
            case 'start':
                if(struct == 'H' || struct == 'G' || struct =='I') {
                    return 'assets/startH.png'
                } else if (struct == 'E' || struct == 'B') {
                    return 'assets/start.png'
                } else {
                    return 'assets/blank.png'
                }
            case 'middle':
                if(struct == 'H' || struct == 'G' || struct =='I') {
                    return 'assets/middleH.png'
                } else if (struct == 'E' || struct == 'B') {
                    return 'assets/middle.png'
                } else {
                    return 'assets/blank.png'
                }
            case 'end':
                if(struct == 'H' || struct == 'G' || struct =='I') {
                    return 'assets/endH.png'
                } else if (struct == 'E' || struct == 'B') {
                    return 'assets/end.png'
                } else {
                    return 'assets/blank.png'
                } 
            case 'single':
                if(struct == 'H' || struct == 'G' || struct =='I') {
                    return 'assets/singleH.png'
                } else if (struct == 'E' || struct == 'B') {
                    return 'assets/single.png'
                } else {
                    return 'assets/blank.png'
                }      
        }   
    }

    // heatmap- color setting 
    var colorTable = 
        [{value: 0.95, colorH:'#990000', colorB:'#000099'}, 
        {value: 0.90, colorH:'#CC0000', colorB:'#0000CC'}, 
        {value: 0.85, colorH:'#FF0000', colorB: '#0000FF'},
        {value: 0.80, colorH: '#FF6666', colorB: '#3333FF'},
        {value: 0.75, colorH: '#FF9999', colorB: '#6666FF'},
        {value: 0.70, colorH: '#FFCCCC', colorB: '#9999FF'},
        {value: 0.50, colorH: '#FAE7E7', colorB: '#CCCCFF'},
        {value: 0.30, colorH: '#FFFFCC', colorB: '#FFFFCC'},
        {value: 0.25, colorH: '#FFFFBB', colorB: '#FFFFBB'},
        {value: 0.20, colorH: '#E4FFCC', colorB: '#E4FFCC'},
        {value: 0.15, colorH: '#99FF99', colorB: '#99FF99'},
        {value: 0.10, colorH: '#00FF00', colorB: '#00FF00'},
        {value: 0.05, colorH: '#00CC00', colorB: '#00CC00'},
        {value: 0, colorH: '#009900', colorB: '#009900'}];

    function getColorH(value) {
        var value2 = parseFloat(value);
        for(var i in colorTable) {
            if(value2 >= colorTable[i].value) {
                return colorTable[i].colorH;
            }
        }
    }

    function getColorB(value) {
        var value2 = parseFloat(value);
        for(var i in colorTable) {
            if(value2 >= colorTable[i].value) {
                return colorTable[i].colorB;
            }
        }
    }

    var query_name = $("#query_name").attr("value") + '.xml';

    // get XML file 
    $.get(query_name, function(xml) {
        var $xml = $(xml);

        /*
        cssp2 single neutal network 
        helix, beta coil에 대한 
        각 Total, Average 계산 
        */
        var paTotal, pbTotal;

        paTotal = parseFloat($xml.find('paTot').text()).toFixed(1);
        pbTotal = parseFloat($xml.find('pbTot').text()).toFixed(1);

        colTotal = $xml.find('colTot').text();
        paAverage = parseFloat(paTotal/(colTotal*20)).toFixed(3);
        pbAverage = parseFloat(pbTotal/(colTotal*20)).toFixed(3);

        var strPaTotal = document.getElementById("paTotal");
        strPaTotal.innerHTML="P(helix) = " + paTotal;
        var strPbTotal = document.getElementById("pbTotal");
        strPbTotal.innerHTML="P(beta) = " + pbTotal;

        var strPaAverage = document.getElementById("paAverage");
        strPaAverage.innerHTML="P(helix) = " + paAverage;
        var strPbAverage = document.getElementById("pbAverage");
        strPbAverage.innerHTML="P(beta) = " + pbAverage;

        var dataColumn = parseInt($xml.find('colTot').text());  // 147
        var dataRow = ($xml.find('data table column row').length) / dataColumn + 13;
        var splitxAxis1 = new Array;
        var splitxAxis2 = new Array;
        var splitxAxis3 = new Array;
        var pointH = new Array;
        var pointB = new Array;
        
        // heatmap-xAxis setting
        $xml.find('data table column').each(function(i, category1) {
            var struct = $(category1).find('struct').text();
            var type = $(category1).find('strType').text();
            splitxAxis1[i] = getPng(struct, type);
        });

        $xml.find('data table column center').each(function(i, category2) {
            splitxAxis2.push($(category2).text());
        });

        $xml.find('data table column number').each(function(i, category3) {
            splitxAxis3.push($(category3).text());
        });

        // heatmap-value, color setting 
        $xml.find('column row pa').each(function(i, setColor) {
            pointH.push({value: parseFloat($(setColor).text()), color:getColorH($(setColor).text())});
        });

        $xml.find('column row pb').each(function(i, setColor) {
            pointB.push({value: parseFloat($(setColor).text()), color:getColorB($(setColor).text())});
        });

        var dataSet = new Array;
        var numA = 0;
        var numB = 0;

        for(var i = 0; i < dataColumn; i += 50) {       // i = 100; dataColumn = 147
            var count = i/50;       // count = 2    
            dataSet[count] = new Object();
            dataSet[count].dataxAxis1 = [];
            dataSet[count].dataxAxis2 = [];
            dataSet[count].dataxAxis3 = [];
            dataSet[count].data = [];
            //dataSet[count].dataBeta = [];

            if(dataColumn - i < 50) {                                   // i = 100, 47
                for(var j = i; j < dataColumn; j++) {   //100 - 147
                    dataSet[count].dataxAxis1.push(splitxAxis1[j]); 
                    dataSet[count].dataxAxis2.push(splitxAxis2[j]);
                    dataSet[count].dataxAxis3.push(splitxAxis3[j]); 
                    for(var k = 0; k < dataRow; k++) {
                        if(k < 10) {
                            dataSet[count].data.push({x: (j-i), y: k, value: pointH[numA].value, color: pointH[numA].color});
                            numA++;
                        } 
                        else if(k >= 10 && k < 13) {
                            dataSet[count].data.push({x: (j-i), y: k, value: 0, color: "none"});
                        }
                        else if(k >= 13 && k < dataRow) {
                            dataSet[count].data.push({x: (j-i), y: k, value: pointB[numB].value, color: pointB[numB].color});
                            numB++;
                        }
                        
                        
                    }
                }
                
            } else { //i = 50
                for(var j = i; j < i + 50; j++) {       // 50 - 100
                    dataSet[count].dataxAxis1.push(splitxAxis1[j]);
                    dataSet[count].dataxAxis2.push(splitxAxis2[j]);
                    dataSet[count].dataxAxis3.push(splitxAxis3[j]);     
                    for(var k = 0; k < dataRow; k++) {
                        for(var k = 0; k < dataRow; k++) {
                            if(k < 10) {
                                dataSet[count].data.push({x: (j-i), y: k, value: pointH[numA].value, color: pointH[numA].color});
                                numA++;
                            } 
                            else if(k >= 10 && k < 13) {
                                dataSet[count].data.push({x: (j-i), y: k, value: 0, color: "none"});
                            }
                            else if(k >= 13 && k < dataRow) {
                                dataSet[count].data.push({x: (j-i), y: k, value: pointB[numB].value, color: pointB[numB].color});
                                numB++;
                            }
                        }
                        
                    }
                }
            }
            
        }

        for(count = 0; count < dataSet.length; count++) {
            
            var border_div = document.createElement("div");
            border_div.setAttribute("id", "border" + count);
            border_div.style.width = dataSet[count].dataxAxis1.length * 11 + 150;
            
            var description_div = document.createElement("div");
            description_div.setAttribute("id", "description");
            var p1 = document.createElement("p");
            p1.style.fontStyle = 'italic';
            p1.style.fontSize = 10 + 'px';
            p1.style.display = 'inline';
            var txt = document.createTextNode("(i,i±4)  ");
            p1.appendChild(txt);
            var span1 = document.createElement("span");
            span1.style.fontSize = 10 + 'px';
            var txt2 = document.createTextNode("energy");
            span1.appendChild(txt2);
            var br1 = document.createElement("br");
            var br2 = document.createElement("br");
            description_div.appendChild(br1);
            description_div.appendChild(br2);
            description_div.appendChild(p1);
            description_div.appendChild(span1);

            var p2 = document.createElement("p");
            p2.style.fontStyle = 'italic';
            p2.style.fontSize = 10 + 'px';
            p2.style.display = 'inline';
            var txt = document.createTextNode(">(i,i±4) ");
            p2.appendChild(txt);
            var span2 = document.createElement("span");
            span2.style.fontSize = 10 + 'px';
            var txt2 = document.createTextNode("energy");
            span2.appendChild(txt2);
            var br2 = document.createElement("br");
            var br3 = document.createElement("br");
            var br4 = document.createElement("br");
            var br5 = document.createElement("br");
            description_div.appendChild(br2);
            description_div.appendChild(br3);
            description_div.appendChild(br4);
            description_div.appendChild(br5);
            description_div.appendChild(p2);
            description_div.appendChild(span2);

            border_div.appendChild(description_div);

            var heat_div = document.createElement("div");
            heat_div.setAttribute("id", "heatmap_container" + count);
            border_div.appendChild(heat_div);

            var line_div = document.createElement("div");
            line_div.setAttribute("id", "line_container" + count);
            line_div.style.marginLeft = '65px';
            border_div.appendChild(line_div);

            document.getElementById('wrapper').appendChild(border_div);

            options.xAxis[0].categories = dataSet[count].dataxAxis1;
            options.xAxis[1].categories = dataSet[count].dataxAxis2;
            options.xAxis[2].categories = dataSet[count].dataxAxis3;
            options.series[0].data = dataSet[count].data;
            options.series[1].data = dataSet[count].data;
            options.series[2].data = dataSet[count].data;
          
            options.chart.width = dataSet[count].dataxAxis1.length * 11 + 60;
            options.chart.height = dataRow * 5 + 80;

            var container = "heatmap_container" + count;
            var heat_options = [];
            heat_options[count] = options;
            var func_name = "heatmap_container" + count;

            func_name = function() {
                var chart = new Highcharts.chart(container, options);
            }
            func_name()
        }
    });


});

    
