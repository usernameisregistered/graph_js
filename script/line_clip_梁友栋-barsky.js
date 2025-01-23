const canvas = document.getElementById("graph-canvas");
const context = canvas.getContext("2d");
const width = canvas.width;
const height = canvas.height;
const rectPoint = [width / 4, height / 4, width / 2, height / 2];
const xMin = rectPoint[0],
  xMax = rectPoint[2] + xMin,
  yMin = height - rectPoint[1] - rectPoint[3],
  yMax = height - rectPoint[1];
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
    pointList.push([event.offsetX, height - event.offsetY]);
    context.strokeStyle = "red";
    context.beginPath();
    context.moveTo(event.offsetX, event.offsetY);
  } else {
    pointList.push([event.offsetX, height - event.offsetY]);
    context.lineTo(event.offsetX, event.offsetY);
    context.stroke();
    context.strokeStyle = "#000";
    canvas.removeEventListener("click", drawPoint);
    clipLine();
  }
}

function clipLine() {
  const point1 = pointList[0];
  const point2 = pointList[1];
  const dx = point2[0] - point1[0];
  const dy = point2[1] - point1[1];
  let redraw = false;
  if (dx === 0) {
    if(point1[0] - xMin < 0 || xMax - point1[0] < 0){
      appendMessage("线段完全在裁剪窗口外");
    } else {
      appendMessage("平行于y轴需要特殊判断");
    }
  } else if (dy === 0 ) {
    if(yMax - point1[1] < 0 || point1[1] - yMin < 0){
      appendMessage("线段完全在裁剪窗口外,细节需要特殊处理");
    } else {
      appendMessage("平行于y轴需要特殊判断");
    }
  } else {
    const ul = ((point1[0] - xMin) / dx) * -1;
    const ur = (xMax - point1[0]) / dx;
    const ut = (yMax - point1[1]) / dy;
    const ub = ((point1[1] - yMin) / dy) * -1;
    let umin1, umin2;
    let umax1, umax2;
    if(dx > 0 &&  dy > 0){
      umax1 = ul,
      umax2 = ub;
      umin1 = ur;
      umin2 = ut;
    } else if(dx > 0 &&  dy < 0){
      umax1 = ul,
      umax2 = ut;
      umin1 = ur;
      umin2 = ub;
    } else if(dx < 0 &&  dy > 0){
      umax1 = ur,
      umax2 = ub;
      umin1 = ul;
      umin2 = ut;
    } else {
      umax1 = ur,
      umax2 = ut;
      umin1 = ul;
      umin2 = ub;
    }
    let umax = Math.max(umax1, umax2, 0);
    let umin = Math.min(umin1, umin2, 1);
    if (umax > umin) {
      appendMessage("线段完全在裁剪窗口外");
    } else {
      console.log("umax" + umax, "umin" + umin)
      redraw = true;
      pointList[0] = [point1[0] + umin * dx, point1[1] + umin * dy];
      pointList[1] = [point1[0] + umax * dx, point1[1] + umax * dy];
      appendMessage("部分在窗口边界内");
    }
  }

  if (redraw) {
    context.strokeStyle = "yellow";
    context.beginPath();
    context.moveTo(pointList[0][0], height - pointList[0][1]);
    context.lineTo(pointList[1][0], height - pointList[1][1]);
    context.stroke();
    context.strokeStyle = "#000";
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
