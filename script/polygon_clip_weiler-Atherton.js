const canvas = document.getElementById("graph-canvas");
const context = canvas.getContext("2d");
const width = canvas.width;
const height = canvas.height;
const rectPoint = [width / 10, height / 10, width / 10 * 8, height / 10 * 8];
const xMin = rectPoint[0],
  xMax = rectPoint[2] + xMin,
  yMin = height - rectPoint[1] - rectPoint[3],
  yMax = height - rectPoint[1];
clearCanvas();
document.getElementById("start-btn").addEventListener("click", () => {
  clearCanvas();
  canvas.addEventListener("click", drawPoint);
  canvas.addEventListener("dblclick", endDraw);
});
function clearCanvas() {
  const width = canvas.width;
  const height = canvas.height;
  context.strokeStyle = "#000";
  context.clearRect(0, 0, width, height);
  pointList = [];
  let messageRootNode = document.getElementById("message-container");
  while (messageRootNode.firstChild) {
    messageRootNode.removeChild(messageRootNode.firstChild);
  }
  context.strokeStyle = "blue";
  context.strokeRect(...rectPoint);
}

function drawPoint(event) {
  if (pointList.length === 0) {
    pointList.push([event.offsetX, height - event.offsetY]);
    context.strokeStyle = "red";
    context.beginPath();
    context.moveTo(event.offsetX, event.offsetY);
  } else {
    pointList.push([event.offsetX, height - event.offsetY]);
    context.lineTo(event.offsetX, event.offsetY);
    context.stroke();
  }
}

function endDraw(event){
  debugger
  if(pointList.length > 2){
    pointList.push([pointList[0][0], pointList[0][1]]);
    context.lineTo(pointList[0][0], height- pointList[0][1]);
    context.stroke();
    context.strokeStyle = "#000";
  } else {
    appendMessage("没有形成一个有效的多边形，请重新开始操作");
  }
  canvas.removeEventListener("click", drawPoint);
  canvas.removeEventListener("dblclick", endDraw);
  beginClip();
}


function beginClip(){
  
}

/**
 * 追加提示信息
 * @param {String} message
 */
function appendMessage(message) {
  const element = document.createElement("div");
  element.setAttribute(
    "class",
    "leading-[25px] text-blue-300 mb-[8px] border border-0 border-b border-gray-400"
  );
  element.textContent = message;
  document.getElementById("message-container").appendChild(element);
}
