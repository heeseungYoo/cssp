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
    })
});