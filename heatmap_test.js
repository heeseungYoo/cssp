$(document).ready(function() {

var query_name = $("#query_name").attr("value") + '.xml';

$.get(query_name, function(xml) {
    var $xml = $(xml);

    // data-setting
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

    // heatmap-xAxis setting
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

    // heatmap value
    var pointH = $xml.find('column row pa');
    var pointB = $xml.find('column row pb');
    var pointC = $xml.find('column row pc');

    var dataSet = new Array;
    var num = 0;

    // set heatmap
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
                    dataSet[count] += "<td data-toggle='tooltip' data-type='"+ plotColor[num] + "' title='P(helix) : "+ parseFloat($(pointH[num]).text()) + "<br/>P(beta) : " + parseFloat($(pointB[num]).text()) + "<br/>P(coil) : " + parseFloat($(pointC[num]).text()) + "\n'"  + " style='background-color:" + plotColor[num] + "; height: 4px;'></td>";
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
                    dataSet[count] += "<td data-toggle='tooltip' data-type='"+ plotColor[num] + "' title='P(helix) : "+ parseFloat($(pointH[num]).text()) + "<br/>P(beta) : " + parseFloat($(pointB[num]).text()) + "<br/>P(coil) : " + parseFloat($(pointC[num]).text()) + "\n'" + " style='background-color:" + plotColor[num] + "; height: 4px;'></td>";
                }
                dataSet[count] += "</tr>";
            }
        }
        dataSet[count] += "</table>";
    }

    // draw wrapper
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
        
        border_div.appendChild(heat_div);

        var line_div = document.createElement("div");
        line_div.setAttribute("id", "line_container" + count);
        line_div.style.marginLeft = '20px';
        border_div.appendChild(line_div);

        document.getElementById('wrapper').appendChild(border_div); 
        $('#yAxis_container' + count).append('<table><tr><td>HIGH</td></tr><tr></tr><tr></tr><tr></tr><tr></tr><tr></tr><tr></tr><tr></tr><tr></tr><tr></tr><tr></tr><tr></tr><tr></tr><tr></tr><tr></tr><tr></tr><tr></tr><tr></tr><tr></tr><tr><td>LOW</td></tr></table>');
        $("#heatmap_container" + count).append(dataSet[count]);       
    }

    // tooltip
    $('[data-toggle="tooltip"]').each(function(){
        var options = {
            html: true,
            template: "<div class='tooltip' role='tooltip' style='background-color:"+ $(this).attr('data-type') +";'><div class='tooltip-arrow'></div><div class='tooltip-inner' data-type='"+$(this).attr('data-type')+"'></div></div>",
            sanitize: false
        };
        $(this).tooltip(options);
        
    });

    // calculating Selected area
    var pa = 0;
    var pb = 0;
    var pc = 0;

    const NO_RECTANGLE = 0;
    const RECT_DRAWING = 1;
    const RECT_SET = 2;

    var state = NO_RECTANGLE;
    var parentPosition;
    var xPosition = 0, yPosition = 0, xEndPosition = 0, yEndPosition = 0;

    var columnCount = 0;

    var selection = document.createElement("div");
    selection.setAttribute("id", "selection");

    document.querySelectorAll('div[id^="heatmap_container"]').forEach(item => {
        item.addEventListener('mousedown', mouseDownEvent);
        item.addEventListener('mousemove', mouseMoveEvent);
        item.addEventListener('mouseup', mouseUpEvent);
    });    

    function mouseDownEvent(event) {
        pa = 0;
        pb = 0;
        pc = 0;

        state = RECT_DRAWING;

        $(selection).prependTo(this);

        parentPosition = getPosition(event.currentTarget);
        xPosition = xEndPosition = event.clientX - parentPosition.x;
        yPosition = yEndPosition = event.clientY - parentPosition.y;

        // get the number of heatmap column
        var table = event.currentTarget.children[2];
        columnCount = table.rows[0].cells.length;
        drawRect();
    }

    function mouseMoveEvent(event) {
        if(state == RECT_DRAWING) {
            xEndPosition = event.clientX - parentPosition.x;
            yEndPosition = event.clientY - parentPosition.y;
            drawRect();
        }

    }

    function mouseUpEvent(event) {
        if(state == RECT_DRAWING) {
            mouseMoveEvent(event);
            state = RECT_SET;
        }

        if(xPosition == xEndPosition && yPosition == yEndPosition) {
            state = NO_RECTANGLE;
            pa = 0;
            pb = 0;
            pc = 0;
            $(selection).detach();
            $('.heatmap td').removeClass('selected');
            $('#paSel').text("P(helix) = " + pa.toFixed(2));
            $('#pbSel').text("P(beta) = " + pb.toFixed(2));
            $('#pcSel').text("P(coil) = " + pc.toFixed(2));
        }
    }

    function drawRect() {
        var x1 = Math.min(xPosition, xEndPosition);
        var x2 = Math.max(xPosition, xEndPosition);
        var y1 = Math.min(yPosition, yEndPosition);
        var y2 = Math.max(yPosition, yEndPosition);
        selection.style.left = x1 + 'px';
        selection.style.top = y1 + 'px';
        selection.style.width = x2 - x1 + 'px';
        selection.style.height = y2 - y1 + 'px';
        
        if(x1 != x2 && y1 != y2) {
            calSelected(x1, x2, y1, y2);
        }
        
    }

    function calSelected(x1, x2, y1, y2) {
        pa = 0;
        pb = 0;
        pc = 0;

        var dragStartX = (Math.ceil((x1-7) / 11)) > 0 ? Math.ceil((x1-7) / 11) : 1;
        var dragStartY = (Math.ceil((y1-36) / 5)) > 0 ? Math.ceil((y1-36) / 5) : 1;
        var dragEndX = (Math.ceil((x2-7) / 11)) > 0 ? Math.ceil((x2-7) / 11) : 1;
        var dragEndY = (Math.ceil((y2-36) / 5)) > 0 ? Math.ceil((y2-36) / 5) : 1;

        console.log("drag Start: (" + dragStartX + ", " + dragStartY + ") drag End: (" + dragEndX + ", " + dragEndY + ")");

        $('.heatmap td').removeClass('selected');
        for(var i = dragStartY; i <= dragEndY; i++) {
            var start = ((i-1) * columnCount + dragStartX -1);
            var end = (i-1) * columnCount + dragEndX;
            console.log("start: " + start + " end: " + end);
            $(event.currentTarget).find(".heatmap td").slice(start, end).addClass('selected');
        }

        var count = $(event.currentTarget).find(".selected").length;
        console.log("count: " + count);
        var cellString;
        
        $(event.currentTarget).find('td.selected').each(function(){
            cellString = $(this).attr('data-original-title');
            var cell = cellString.match(/[0-9]\.[0-9]{1,}/g);
        
            pa += parseFloat(cell[0]);
            pb += parseFloat(cell[1]);
            pc += parseFloat(cell[2]);
        });

        pa /= count;
        pb /= count;
        pc /= count;

        $('#paSel').text("P(helix) = " + pa.toFixed(2));
        $('#pbSel').text("P(beta) = " + pb.toFixed(2));
        $('#pcSel').text("P(coil) = " + pc.toFixed(2));
    }

    function getPosition(el) {
        var xPos = 0;
        var yPos = 0;
    
        while (el) {
          if (el.tagName == "BODY") {
            // deal with browser quirks with body/window/document and page scroll
            var xScroll = el.scrollLeft || document.documentElement.scrollLeft;
            var yScroll = el.scrollTop || document.documentElement.scrollTop;

            xPos += (el.offsetLeft - xScroll + el.clientLeft);
            yPos += (el.offsetTop - yScroll + el.clientTop);
                  } else {
            // for all other non-BODY elements
            xPos += (el.offsetLeft - el.scrollLeft + el.clientLeft);
            yPos += (el.offsetTop - el.scrollTop + el.clientTop);
                  }
      
            el = el.offsetParent;
        }
        return {
          x: xPos,
          y: yPos
        };
    }        
    
});

});