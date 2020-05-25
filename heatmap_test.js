$(document).ready(function() {

var query_name = $("#query_name").attr("value") + '.xml';

$.get(query_name, function(xml) {
    var $xml = $(xml);

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

    $xml.find('column row').each(function(i, setColor){
        var colorJury = $(setColor).find('jury');
        var colorHelix = $(setColor).find('pa');
        var colorBeta = $(setColor).find('pb');
        var colorCoil = $(setColor).find('pc');
        plotColor[i] = getColor(colorJury, colorHelix, colorBeta, colorCoil);
    });

    var splitxAxis = [[],[],[]];

    function getPng(struct, type) {
        switch(type) {
            case 'start':
                if(struct == 'H' || struct == 'G' || struct =='I') {
                    return "<img src='assets/startH.png'></img>"
                } else if (struct == 'E' || struct == 'B') {
                    return "<img src='assets/start.png'></img>"
                } else {
                    return "<img src='assets/blank.png'></img>"
                }
            case 'middle':
                if(struct == 'H' || struct == 'G' || struct =='I') {
                    return "<img src='assets/middleH.png'></img>"
                } else if (struct == 'E' || struct == 'B') {
                    return "<img src='assets/middle.png'></img>"
                } else {
                    return "<img src='assets/blank.png'></img>"
                }
            case 'end':
                if(struct == 'H' || struct == 'G' || struct =='I') {
                    return "<img src='assets/endH.png'></img>"
                } else if (struct == 'E' || struct == 'B') {
                    return "<img src='assets/end.png'></img>"
                } else {
                    return "<img src='assets/blank.png'></img>"
                } 
            case 'single':
                if(struct == 'H' || struct == 'G' || struct =='I') {
                    return "<img src='assets/singleH.png'></img>"
                } else if (struct == 'E' || struct == 'B') {
                    return "<img src='assets/single.png'></img>"
                } else {
                    return "<img src='assets/blank.png'></img>"
                }      
        }   
    }

    // heatmap-xAxis setting
    $xml.find('data table column number').each(function(i, category3) {
        splitxAxis[0].push($(category3).text());
    });

    $xml.find('data table column center').each(function(i, category2) {
        splitxAxis[1].push($(category2).text());
    });

    $xml.find('data table column').each(function(i, category1) {
        var struct = $(category1).find('struct').text();
        var type = $(category1).find('strType').text();
        splitxAxis[2][i] = getPng(struct, type);
    });


    // heatmap value
    var pointH = $xml.find('column row pa');
    var pointB = $xml.find('column row pb');
    var pointC = $xml.find('column row pc');

    var dataSet = new Array;
    var num = 0;

    for(var i = 0; i < dataColumn; i+= 50) {
        var count = i/50;
        dataSet[count] = "";
        dataSet[count] += "<table style='margin-left: 1px;'>";
        if(dataColumn - i < 50) {
            for(var l = 0; l < 3; l++) {
                dataSet[count] += "<tr>";
                for(var j = i; j < dataColumn; j++) {
                    dataSet[count] += "<td>" +splitxAxis[l][j] + "</td>";
                }
                dataSet[count] += "</tr>";
            }
            dataSet[count] += "</table>";
            dataSet[count] += "<table class='heatmap' style='border-collapse: separate; border-spacing: 1px;'>";
            for(var k = 0; k < dataRow; k++) {
                dataSet[count] += "<tr>";
                for(var j = i; j < dataColumn; j++) {   
                    num = k + j * 20; 
                    dataSet[count] += "<td data-toggle='tooltip' data-type='"+ plotColor[num] + "' title='"+ parseFloat($(pointH[num]).text()) + "<br/>" + parseFloat($(pointB[num]).text()) + "<br/>" + parseFloat($(pointC[num]).text()) + "\n'"  + " style='background-color:" + plotColor[num] + "; height: 4px;'></td>";
                }
                dataSet[count] += "</tr>";
            }
        } else {
            for(var l = 0; l < 3; l++) {
                dataSet[count] += "<tr>";
                for(var j = i; j < i+50; j++) {
                    dataSet[count] += "<td>" +splitxAxis[l][j] + "</td>";
                }
                dataSet[count] += "</tr>";
            }
            dataSet[count] += "</table>";
            dataSet[count] += "<table class='heatmap' style='border-collapse: separate; border-spacing: 1px;'>";
            for(var k = 0; k < dataRow; k++) {
                dataSet[count] += "<tr>";
                for(var j = i; j < i + 50; j++) {
                    num = k + j * 20;
                    dataSet[count] += "<td data-toggle='tooltip' data-type='"+ plotColor[num] + "' title='"+ parseFloat($(pointH[num]).text()) + "<br/>" + parseFloat($(pointB[num]).text()) + "<br/>" + parseFloat($(pointC[num]).text()) + "\n'" + " style='background-color:" + plotColor[num] + "; height: 4px;'></td>";
                }
                dataSet[count] += "</tr>";
            }
        }
        dataSet[count] += "</table>";
    }

    var dataLength = dataSet.length;

    for(count = 0; count < dataLength; count++) {
        var border_div = document.createElement("div");
        border_div.setAttribute("id", "border" + count);
        var border_num = (dataSet[count].match(/<td/g) || []).length / 23 * 11 + 110;
        border_div.style.width = border_num + "px";

        var description_div = document.createElement("div");
        description_div.setAttribute("id", "description");
        var p1 = document.createElement("p");
        p1.style.fontStyle = 'italic';
        p1.style.fontSize = 11 + 'px';
        p1.style.display = 'inline';
        var txt = document.createTextNode(">(i,i±4)  ");
        p1.appendChild(txt);
        var span1 = document.createElement("span");
        span1.style.fontSize = 11 + 'px';
        var txt2 = document.createTextNode("energy");
        span1.appendChild(txt2);
        description_div.appendChild(p1);
        description_div.appendChild(span1);

        border_div.appendChild(description_div);

        var yAxis_div = document.createElement("div");
        yAxis_div.setAttribute("id", "yAxis_container" + count);
        border_div.appendChild(yAxis_div);
        
        var heat_div = document.createElement("div");
        heat_div.setAttribute("id", "heatmap_container" + count);

        var drag_div = document.createElement("div");
        drag_div.setAttribute("id", "selection");
        drag_div.setAttribute("hidden", true);
        heat_div.appendChild(drag_div);
        
        border_div.appendChild(heat_div);

        var line_div = document.createElement("div");
        line_div.setAttribute("id", "line_container" + count);
        line_div.style.marginLeft = '20px';
        border_div.appendChild(line_div);

        document.getElementById('wrapper').appendChild(border_div); 
        $('#yAxis_container' + count).append('<table><tr><td>HIGH</td></tr><tr></tr><tr></tr><tr></tr><tr></tr><tr></tr><tr></tr><tr></tr><tr></tr><tr></tr><tr></tr><tr></tr><tr></tr><tr></tr><tr></tr><tr></tr><tr></tr><tr></tr><tr></tr><tr><td>LOW</td></tr></table>');
        $("#heatmap_container" + count).append(dataSet[count]);       
    }

    $('[data-toggle="tooltip"]').each(function(){
        var options = {
            html: true,
            template: "<div class='tooltip' role='tooltip' style='background-color:"+ $(this).attr('data-type') +";'><div class='tooltip-arrow'></div><div class='tooltip-inner' data-type='"+$(this).attr('data-type')+"'></div></div>",
            sanitize: false
        };
        $(this).tooltip(options);
        
    });

// color: "+ getTooltipColor($(this).attr('data-type')) + ";
/*
        var $container = $('div[id^="heatmap_container"]');
        //var $container = $('#heatmap_container0')
        var $selection = $('<div>').addClass('selection-box');

        $container.on('mousedown', function(e) {
            if(document.getElementsByClassName('selection-box')) {
                [...document.getElementsByClassName('selection-box')].map(n => n && n.remove());
            }
            var click_y = e.pageY,
            click_x = e.pageX;
    
            $selection.css({
                'top': click_y,
                'left': click_x,
                'width': 0,
                'height': 0,
                'visibility':'hidden'
            });
            $selection.appendTo($container);
    
            $container.on('mousemove', function(e) {
                $('[data-toggle="tooltip"]').tooltip('disable');
                var move_x = e.pageX, 
                    move_y = e.pageY,
                    width = Math.abs(move_x - click_x),
                    height = Math.abs(move_y - click_y),
                    new_x, new_y;
                
                new_x = (move_x < click_x) ? (click_x - width) : click_x;
                new_y = (move_y < click_y) ? (click_y - height) : click_y;    
    
                $selection.css({
                    'width': width,
                    'height': height,
                    'top': new_y,
                    'left': new_x,
                    'visibility':'visible'
                });
            }).on('mouseup', function(e) {
                $('[data-toggle="tooltip"]').tooltip('enable');
                $container.off('mousemove');
                
            });
        });*/

        var div = document.getElementById('selection'), x1 = 0, y1 = 0, x2 = 0, y2 = 0;
        //var $container = $('#heatmap_container0');
        //var $div = $('<div>').addClass('selection'), x1 = 0, y1 = 0, x2 = 0, y2 = 0;

        var pa = 0;
        var pb = 0;
        var pc = 0;

        var table;
        var columnCount = 0;

        var dragStart = 0;
        var dragEnd = 0;

        const NO_RECTANGLE = 0;
        const RECT_DRAWING = 1;
        const RECT_SET = 2;

        var state = NO_RECTANGLE;

        function drawRect() { //This will restyle the div
            var x3 = Math.min(x1,x2); //Smaller X
            var x4 = Math.max(x1,x2); //Larger X
            var y3 = Math.min(y1,y2); //Smaller Y
            var y4 = Math.max(y1,y2); //Larger Y
            div.style.left = x3 + 'px';
            div.style.top = y3 + 'px';
            div.style.width = x4 - x3 + 'px';
            div.style.height = y4 - y3 + 'px';
            
            calcSelected();
        }
        
        

        function calcSelected() {
            var count = 0;
            pa = 0;
            pb = 0;
            pc = 0;

            //console.log(event.currentTarget);
            //console.log(event.target);
            //console.log(event.preventDefault);
            var startValue = parseInt(dragStart/columnCount);
            var endValue = parseInt(dragEnd/columnCount);

            var startRemain = dragStart%columnCount;
            var endRemain = dragEnd%columnCount;
            if(endRemain != 0) {
                for(var i = startValue; i <= endValue; i++) {
                    var start = i * columnCount + startRemain;
                    var end = i * columnCount + endRemain;
                    $(".heatmap td").slice(start, end+1).addClass('selected');
                }
            }

            //const parentElement = $('#selection').parentElement;
            //const parentAbsoluteTop = getAbsoluteTop(parentElement);
            //const absoluteTop = getAbsoluteTop($('#selection'));

            //const relativeTop = absoluteTop - parentAbsoluteTop;

            //console.log("relativeTop: " + relativeTop);

            count = $('.selected').length;
            console.log("Cell count: " + count);         
            //if (dragEnd + 1 < dragStart) { // reverse select
            //    $(".heatmap td").slice(dragEnd, dragStart + 1).addClass('selected');
            //} else {
            //    $(".heatmap td").slice(dragStart, dragEnd + 1).addClass('selected');
            //}
            
            
            var cellString = $('td.selected').attr('data-original-title');
            console.log("title: " + cellString);
            //string slice 후 pa, pb, pc에 할당
            //pa /= cellCount;
            //pb /= cellCount;
            //pc /= cellCount;
        }

        //function getAbsoluteTop(element) {
        //    return window.pageYOffset + element.getBoundingClientRect().top;
        //}

        function mouseMove() {
            if(state == RECT_DRAWING) {
                x2 = event.pageX; //Update the current position X
                y2 = event.pageY; //Update the current position Y
                drawRect();
            }
        }

        document.querySelectorAll('div[id^="heatmap_container"]').forEach(item => {
            item.addEventListener('mousedown', event => {
                //$('.heatmap td').removeClass('selected');
                pa = 0;
                pb = 0;
                pc = 0;
    
                div.hidden = 0; //Unhide the div
                x1 = x2 = event.pageX; //Set the initial X
                y1 = y2 = event.pageY; //Set the initial Y
    
                state = RECT_DRAWING;
                if(event.target.nodeName == 'TD') {
                    var allCells = $('.heatmap td');
                    dragStart = allCells.index(event.target);
                    console.log("dragStart: " + dragStart);
                }
                table = event.target.parentNode.parentNode;
                if(table.rows) {
                    columnCount = table.rows[0].cells.length;                    
                }

                var offset = $(this).offset();
                event.stopPropagation();
                console.log(this.tagName + " coords ( " + offset.left + ", " + offset.top + " )");
                

                drawRect();
            });

            item.addEventListener('mousemove', event => {
                if(state == RECT_DRAWING) {
                    x2 = event.pageX; //Update the current position X
                    y2 = event.pageY; //Update the current position Y
                    
                    if(event.target.nodeName == 'TD') {
                        var allCells = $('.heatmap td');
                        dragEnd = allCells.index(event.target);
                        console.log("dragEnd: " + dragEnd);
                        
                    }  
                    drawRect();
                }
            });

            item.addEventListener('mouseup', event => {
                if(state == RECT_DRAWING) {
                    mouseMove(event);
                    state = RECT_SET;
                }
    
                if(x1 == x2 && y1 == y2) {
                    state = NO_RECTANGLE;
                    pa = 0;
                    pb = 0;
                    pc = 0;
                    div.hidden = 1;//Hide the div
                    $('.heatmap td').removeClass('selected');
                }
            });
        });  
    
});

});