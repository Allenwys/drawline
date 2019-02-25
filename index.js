//点坐标数组
var indexArray = [{x:10,y:10},{x:30,y:100},{x:100,y:150},{x:200,y:50}];
var index = 0;
$("#addBtn").click(function(){
    if ($("#xindex").val() && $("#yindex").val()) {
        indexArray.push({ x: $("#xindex").val(), y: $("#yindex").val() });
        if ($("#coordinate").val()) {
            $("#coordinate").val($("#coordinate").val()+"\n("+$("#xindex").val()+","+$("#yindex").val()+")");
        } else {
            $("#coordinate").val("("+$("#xindex").val()+","+$("#yindex").val()+")");
        }
    } else {
        alert("请输入数字！");
    }
});

$("#playBtn").click(function(){
    if (indexArray.length > 0) {
        $(this).hide();
        $("#stopBtn").show();
        ligature();
    } else {
        alert("请输入数字！");
    }
});

$("#stopBtn").click(function(){
    $(this).hide();
    $("#playBtn").show();
});

$("#replayBtn").click(function(){
    if (indexArray.length > 0) {
        var c = document.getElementById("myCanvas");
        var ctx = c.getContext("2d");
        ctx.clearRect(0,0,c.clientWidth,c.clientHeight);
        ligature();
    } else {
        alert("请输入数字！");
    }
});

function ligature() {
    if (index < indexArray.length-1) {
        var startPoint = indexArray[index];
        var endPoint = indexArray[index+1];
        drawDynamicLine(startPoint.x, startPoint.y, endPoint.x, endPoint.y);
        index++;
        ligature();
    }
}


/*
    画动态直线
    @(x1,y1)    起点
    @(x2,y2)    终点
*/
function drawDynamicLine(x1, y1, x2, y2) {
    
    var c = document.getElementById("myCanvas");
    var ctx = c.getContext("2d");
    ctx.beginPath();
    // ctx.fillStyle="blue";
    // ctx.arc(x1,y1,2,0,2*Math.PI);

    if(x1 == x2) {
        drawVerticalLine(x1, y1, x2, y2);   /*斜率不存在的情况*/
    } else {
        drawCommonLine(x1, y1, x2, y2);    /*斜率为正或者负或者0*/
    }

    /*k存在的情况*/
    function drawCommonLine(x1, y1, x2, y2) {
        var k = (y2-y1)/(x2-x1)   //斜率k
        var b = y1-k*x1           //常数b
        var i = 0;
        var flag = compare(x1, x2);

        function draw(){
            var xi = x1+i;
            var yi = k*xi+b;
            var xj = x1+i+1;
            var yj = k*xj+b;
            drawLine(xi,yi,xj,yj);
            
            i += 1*flag;               
            if(Math.abs(i+1*flag) <= Math.abs(x1-x2)) {
                setTimeout(function(){
                    draw();
                },50);
            } else {
                drawLine(xj,yj,x2,y2);
                // ctx.arc(x2,y2,2,0,2*Math.PI);
                // ctx.fill();
                // ctx.strokeStyle="blue";
                // ctx.stroke();
            }
        }
        draw();
    }

    /*k不存在，也就是垂直的情况*/
    function drawVerticalLine(x1, y1, x2, y2){
        var i = 0;
        var flag = compare(y1, y2);
        function draw(){
            var yi = y1+i;
            var yj = y1+i+1*flag;
            drawLine(x1,yi,x2,yj);
            
            i += 1*flag;
            if (Math.abs(i+1*flag) <= Math.abs(y1-y2)) {
                setTimeout(function(){
                    draw();
                },50);
            } else {
                drawLine(x2,yj,x2,y2);
            }
        }
        draw();
    }
    
    /*比较函数*/
    function compare(a, b){
        if(a < b){
            return 1;
        } else {
            return -1;
        }
    }

    /*线条片段*/
    function drawLine(x1, y1, x2, y2) {
        ctx.moveTo(x1,y1);
        ctx.lineTo(x2,y2);
        ctx.stroke();
        ctx.closePath();
    }
}