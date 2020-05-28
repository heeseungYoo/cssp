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
    
    //---------------Cell select--------------
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
    //-----------------------------------------

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

// Helper function to get an element's exact position
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
        var parentPosition = getPosition(event.currentTarget);
        var xPosition = event.clientX - parentPosition.x - 7;
        var yPosition = event.clientY - parentPosition.y - 36;
        console.log("currentTarget: " + event.currentTarget + " /// " + event.currentTarget.id);
        console.log("Target: " + event.target + " // x: " + xPosition + " y: " + yPosition);
        if(event.target.nodeName == 'TD') {
            var allCells = $('.heatmap td');
            dragStart = allCells.index(event.target);
            console.log("dragStart: " + dragStart);
        }

        // count table column 
        table = event.target.parentNode.parentNode;
        if(table.rows) {
            columnCount = table.rows[0].cells.length;                    
        }
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
            event.stopPropagation();
        }
    });
});  