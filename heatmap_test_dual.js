$(document).ready(function() {
    var query_name = $("#query_name").attr("value") + '.xml';

    $.get(query_name, function(xml) {
        var $xml = $(xml);

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

        // heatmap-color setting 
        var dataColumn = parseInt($xml.find('colTot').text());  // 147
        var dataRow = ($xml.find('data table column row').length) / dataColumn; // 20

        var plotColor = [];

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


        // heatmap-value, color setting 
        $xml.find('column row pa').each(function(i, setColor) {
            pointH.push({value: parseFloat($(setColor).text()), color:getColorH($(setColor).text())});
        });

        $xml.find('column row pb').each(function(i, setColor) {
            pointB.push({value: parseFloat($(setColor).text()), color:getColorB($(setColor).text())});
        });

        var splitxAxis = [[], [], []];

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
    });
});