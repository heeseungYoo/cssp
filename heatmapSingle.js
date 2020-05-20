/*
cssp2-single neural network 
-heatmap-
*/
$(document).ready(function() {

    // heatmap-tooltip get helix,beta value
    function getPointValue(point, int) {
        var x = point.x;
        var y = point.y;
        if(point.series.chart.series[int].data[x * 20 + y]) {
            var serValue = point.series.chart.series[int].data[x * 20 + y].value;
        }
        return serValue;
    }

    // heatmap-tooltip color 
    function getPointColor(colorString) {
        if (colorString == '#FFFFCC' || colorString == '#FFFFBB' || colorString == '#FAE7E7' || colorString == '#E4FFCC') {
            return '#000000'
        } else {
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
        var coilSelectTotal = 0;

        for(var i = 0; i < selectCount; i++) {
            helixSelectTotal += e.points[i].value;
        }
        for(var i = selectCount; i < selectCount * 2; i++) {
            betaSelectTotal += e.points[i].value;
        }
        for(var i = selectCount * 2; i < e.points.length; i++) {
            coilSelectTotal += e.points[i].value;
        }

        var helixSelect = (helixSelectTotal / selectCount).toFixed(2);
        var betaSelect = (betaSelectTotal / selectCount).toFixed(2);
        var coilSelect = (coilSelectTotal / selectCount).toFixed(2);

        $('#paSel').html('P(helix)= ' + helixSelect);
        $('#pbSel').html('P(beta)= ' + betaSelect);
        $('#pcSel').html('P(coil)= ' + coilSelect);
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
            width: 462,
            height: 198,
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
                y:10,
                padding: 0,
                step: 1,
                style: {
                    fontSize: 10
                }
            }
        }],

        yAxis: [{
            categories:['HIGH', '', '','','','','','','','','','','','','','','','','','LOW'],
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
            name: 'helix',
            borderWidth: 1,
            borderColor: 'white',
            data: [],
            xAxis: 1,
            allowPointSelect: true,
        }, {
            name: 'beta',
            borderWidth: 1,
            borderColor: 'white',
            data: [],
            xAxis: 0,
            allowPointSelect: true
        }, {
            name: 'coil',
            borderWidth: 1,
            borderColor: 'white',
            data: [],
            xAxis:2,
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
               + 'P(' + options.series[0].name + ') =' + getPointValue(this.point, 0)
               + '<br/>P(' + options.series[1].name + ') = ' + getPointValue(this.point, 1)
               + '<br/>P(' + options.series[2].name + ') = ' + this.point.value
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
        [{value: 0.90, colorH:'#990000', colorB:'#000099', colorC: '#009900'}, 
        {value: 0.80, colorH:'#CC0000', colorB:'#0000CC', colorC: '#00CC00'}, 
        {value: 0.75, colorH:'#FF0000', colorB: '#0000FF', colorC: '#00FF00'},
        {value: 0.70, colorH: '#FF6666', colorB: '#3333FF', colorC: '#99FF99'},
        {value: 0.60, colorH: '#FF9999', colorB: '#6666FF', colorC: '#E4FFCC'},
        {value: 0.50, colorH: '#FFCCCC', colorB: '#9999FF', colorC: '#FFFFBB'},
        {value: 0, colorH: '#FAE7E7', colorB: '#CCCCFF', colorC: '#FFFFCC'}];

    function getColor(jury, helix, beta, coil) {
        var jury2= jury.text();
        var helix2 = parseFloat(helix.text());
        var beta2 = parseFloat(beta.text());
        var coil2 = parseFloat(coil.text());

        switch(jury2) {
            case "h":
                for(var i in colorTable) {
                    var value2 = colorTable[i].value;
                    if (helix2 >= value2) {
                        return colorTable[i].colorH;
                    }
                
                };
                break;
            case "e":
                for(var i in colorTable) {
                    if (beta2 >= colorTable[i].value) {
                        return colorTable[i].colorB;
                    }
                
                };
                break;
            
            case "c":
                for(var i in colorTable) {
                    if (coil2 >= colorTable[i].value) {
                        return colorTable[i].colorC;
                    }
                    
                };
                break;
        }

    }

    var query_name = $("#query_name").attr("value") + '.xml';

    $.get(query_name, function(xml) {
        var $xml = $(xml);

        print($xml);

        /*
        cssp2 single neutal network 
        helix, beta coil에 대한 
        각 Total, Average 계산 
        */
       
        var paTotal, pbTotal, pcTotal;

        paTotal = parseFloat($xml.find('paTot').text()).toFixed(1);
        pbTotal = parseFloat($xml.find('pbTot').text()).toFixed(1);
        pcTotal = parseFloat($xml.find('pcTot').text()).toFixed(1);

        colTotal = $xml.find('colTot').text();
        paAverage = parseFloat(paTotal/(colTotal*20)).toFixed(3);
        pbAverage = parseFloat(pbTotal/(colTotal*20)).toFixed(3);
        pcAverage = parseFloat(pcTotal/(colTotal*20)).toFixed(3);

        var strPaTotal = document.getElementById("paTotal");
        strPaTotal.innerHTML="P(helix) = " + paTotal;
        var strPbTotal = document.getElementById("pbTotal");
        strPbTotal.innerHTML="P(beta) = " + pbTotal;
        var strPcTotal = document.getElementById("pcTotal");
        strPcTotal.innerHTML="P(coil) = " + pcTotal;

        var strPaAverage = document.getElementById("paAverage");
        strPaAverage.innerHTML="P(helix) = " + paAverage;
        var strPbAverage = document.getElementById("pbAverage");
        strPbAverage.innerHTML="P(beta) = " + pbAverage;
        var strPcAverage = document.getElementById("pcAverage");
        strPcAverage.innerHTML="P(coil) = " + pcAverage;


        // heatmap-color setting 
        var dataColumn = parseInt($xml.find('colTot').text());  // 147
        var dataRow = ($xml.find('data table column row').length) / dataColumn; // 20

        var plotColor = [];
        var splitxAxis1 = new Array;
        var splitxAxis2 = new Array;
        var splitxAxis3 = new Array;

        // heatmap color 
        $xml.find('column row').each(function(i, setColor) {
            var colorJury = $(setColor).find('jury');
            var colorHelix = $(setColor).find('pa');
            var colorBeta = $(setColor).find('pb');
            var colorCoil = $(setColor).find('pc');
            plotColor[i] = getColor(colorJury, colorHelix, colorBeta, colorCoil);
        });

        $xml.find('data table column').each(function(i, category1) {
            var struct = $(category1).find('struct').text();
            var type = $(category1).find('strType').text();
            splitxAxis1[i] = getPng(struct, type);
        });

        // heatmap-xAxis setting
        $xml.find('data table column center').each(function(i, category2) {
            splitxAxis2.push($(category2).text());
        });

        $xml.find('data table column number').each(function(i, category3) {
            splitxAxis3.push($(category3).text());
        });

        // heatmap value
        var pointH = $xml.find('column row pa');
        var pointB = $xml.find('column row pb');
        var pointC = $xml.find('column row pc');
 
        var dataSet = new Array;
        var num = 0;

        for(var i = 0; i < dataColumn; i += 50) {       // i = 100; dataColumn = 147
            var count = i/50;       // count = 2    
            dataSet[count] = new Object();
            dataSet[count].dataxAxis1 = [];
            dataSet[count].dataxAxis2 = [];
            dataSet[count].dataxAxis3 = [];
            dataSet[count].dataHelix = [];
            dataSet[count].dataBeta = [];
            dataSet[count].dataCoil = [];
            if(dataColumn - i < 50) {                                   // i = 100, 47
                for(var j = i; j < dataColumn; j++) {   //100 - 147
                    dataSet[count].dataxAxis1.push(splitxAxis1[j]); 
                    dataSet[count].dataxAxis2.push(splitxAxis2[j]);
                    dataSet[count].dataxAxis3.push(splitxAxis3[j]);
                    for(var k = 0; k < dataRow; k++) {
                        dataSet[count].dataHelix.push({x: (j-i), y: k, value: parseFloat($(pointH[num]).text()), color: "none"});
                        dataSet[count].dataBeta.push({x: (j-i), y: k, value: parseFloat($(pointB[num]).text()), color: "none"});
                        dataSet[count].dataCoil.push({x: (j-i), y: k, value: parseFloat($(pointC[num]).text()), color: plotColor[num]});
                        num++;
                    }
                }
                
            } else { //i = 50
                for(var j = i; j < i + 50; j++) {       // 50 - 100
                    dataSet[count].dataxAxis1.push(splitxAxis1[j]);
                    dataSet[count].dataxAxis2.push(splitxAxis2[j]);
                    dataSet[count].dataxAxis3.push(splitxAxis3[j]);    
                    for(var k = 0; k < dataRow; k++) {
                        dataSet[count].dataHelix.push({x: (j-i), y: k, value: parseFloat($(pointH[num]).text()), color: "none"});
                        dataSet[count].dataBeta.push({x: (j-i), y: k, value: parseFloat($(pointB[num]).text()), color: "none"});
                        dataSet[count].dataCoil.push({x: (j-i), y: k, value: parseFloat($(pointC[num]).text()), color: plotColor[num]});
                        num++;
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
            var txt = document.createTextNode(">(i,i±4)  ");
            p1.appendChild(txt);
            var span1 = document.createElement("span");
            span1.style.fontSize = 10 + 'px';
            var txt2 = document.createTextNode("energy");
            span1.appendChild(txt2);
            description_div.appendChild(p1);
            description_div.appendChild(span1);

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
            options.series[0].data = dataSet[count].dataHelix;
            options.series[1].data = dataSet[count].dataBeta;
            options.series[2].data = dataSet[count].dataCoil;
            options.chart.width = dataSet[count].dataxAxis1.length * 11 + 60;
            options.chart.height= dataRow * 5 + 80;

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

    // get XML file 
 /*   $.get('48267.xml', function(xml) {
        
/*
        var hasDragged = false;

        $('#heatmap_container').on('mousedown', function () {
            if (hasDragged == true) {
                hasDragged = false;
            }
            else if (hasDragged == false) {
                hasDragged = true;
            }
            console.log(hasDragged);
        })

        $('#heatmap_container').on('mousemove', function () {
            hasDragged = true;
            console.log(hasDragged);
        })

        $('#heatmap_container').on('mouseup', function () {
            if (hasDragged == true) {
                hasDragged = true;
            }
            console.log(hasDragged);
        });

        console.log(hasDragged);
        /*    
        (function(H) {
            H.wrap(H.Pointer.prototype, 'setDOMEvents', function(proceed) {
                proceed.apply(this, Array.prototype.slice.call(arguments, 1));
                var pointer = this;
        
                document.addEventListener("MSPointerUp", function(e) {
                    if (e.pointerType === e.MSPOINTER_TYPE_TOUCH || e.pointerType === "touch") {
                        pointer.hasDragged = true;
                        console.log(pointer);
                      /*report1("");
                      delete touches[e.pointerId];
                      report2(touchDump());
            
                      // This event corresponds to touchend, so we want to call onDocumentTouchEnd
                      e.type = "touchend";
                      e.target = e.currentTarget;
                      //                    e.preventDefault = e.stopPropagation;
                      e.touches = getWebkitTouches();
                      pointer.onDocumentTouchEnd(e);
                    }
                  });
            });

        }(chart));*/



});

    
