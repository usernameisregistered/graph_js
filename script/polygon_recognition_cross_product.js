const canvas = document.getElementById("graph-canvas")
const context = canvas.getContext("2d")
let pointList = [];
document.getElementById("start-btn").addEventListener("click", ()=>{
    clearCanvas();
    canvas.removeEventListener("dblclick", stopDraw);
    canvas.addEventListener("click", drawPoint);
    canvas.addEventListener("dblclick", stopDraw);
})
function clearCanvas(){
    const width = canvas.width;
    const height = canvas.height;
    context.clearRect(0,0, width, height);
    pointList = [];
}
function drawPoint(event){
    pointList.push([event.offsetX, event.offsetY])
    if(pointList.length === 1){
        context.beginPath();
        context.moveTo(event.offsetX, event.offsetY);
    } else {
        context.lineTo(event.offsetX, event.offsetY);
        context.stroke();
    }
}

function stopDraw(){
    pointList.push(pointList[0])
    canvas.removeEventListener("click", drawPoint);
    context.lineTo(pointList[0][0], pointList[0][1]);
    context.stroke();
    context.closePath();
}