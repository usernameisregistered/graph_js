const canvas = document.getElementById("graph-canvas");
const context = canvas.getContext("2d");
const width = canvas.width;
const height = canvas.height;
const rectPoint = [width / 4, height / 4, width / 2, height / 2];
const xMin = rectPoint[0],
  xMax = rectPoint[2] + xMin,
  yMin = rectPoint[1],
  yMax = rectPoint[3] + yMin;
clearCanvas();
document.getElementById("start-btn").addEventListener("click", () => {
  clearCanvas();
  canvas.addEventListener("click", drawPoint);
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
  context.strokeRect(width / 4, height / 4, width / 2, height / 2);
}
function drawPoint(event) {
  if (pointList.length === 0) {
    pointList.push([event.offsetX, event.offsetY]);
    context.strokeStyle = "red";
    context.beginPath();
    context.moveTo(event.offsetX, event.offsetY);
  } else {
    pointList.push([event.offsetX, event.offsetY]);
    context.lineTo(event.offsetX, event.offsetY);
    context.stroke();
    context.strokeStyle = "#000";
    canvas.removeEventListener("click", drawPoint);
    clipLine();
  }
}

function clipLine(){
  const point1 = pointList[0]
  const point2 = pointList[1]
  const dx = point2[0] - point1[0];
  const dy = point2[1] - point1[1];
  if(dx === 0 && (point1[0] - xMin < 0 || xMax - point1[0] < 0)){
    appendMessage("完全在窗口边界内");
  } else if(dy === 0 && (yMax - point1[1] < 0 || point1[1] - yMin < 0)){
    appendMessage("完全在窗口边界内");
  } else {
    const ul = (point1[0] - xMin )/ dx * -1;
    const ur = (xMax - point1[0] )/ dx;
    const ut = (yMax - point1[1]) / dy;
    const ub = (point1[1] - yMin) / dy * -1;
    const umax = Math.max(ul, ub, 0)
    const umin = Math.min(ur, ut, 1)
    if(umax > umin){
      appendMessage("完全在窗口边界内");
    }
  }

  
  
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
