const canvas = document.getElementById("graph-canvas");
const context = canvas.getContext("2d");
let pointList = [];
document.getElementById("start-btn").addEventListener("click", () => {
  clearCanvas();
  canvas.removeEventListener("dblclick", stopDraw);
  canvas.addEventListener("click", drawPoint);
  canvas.addEventListener("dblclick", stopDraw);
});
function clearCanvas() {
  const width = canvas.width;
  const height = canvas.height;
  context.clearRect(0, 0, width, height);
  pointList = [];
  let messageRootNode = document.getElementById("message-container");
  while (messageRootNode.firstChild) {
    messageRootNode.removeChild(messageRootNode.firstChild);
  }
}
function drawPoint(event) {
  if (pointList.length === 0) {
    pointList.push([event.offsetX, event.offsetY]);
    context.beginPath();
    context.moveTo(event.offsetX, event.offsetY);
  } else {
    const prevPoint = pointList.slice(-1)[0];
    if (prevPoint[0] !== event.offsetX && event.offsetY !== prevPoint[1]) {
      pointList.push([event.offsetX, event.offsetY]);
      context.lineTo(event.offsetX, event.offsetY);
      context.stroke();
    }
  }
}

function stopDraw() {
  pointList.push(pointList[0]);
  canvas.removeEventListener("click", drawPoint);
  context.lineTo(pointList[0][0], pointList[0][1]);
  context.stroke();
  context.closePath();
  calcEextension();
}

function calcEextension() {
    let result = [];
    for (let i = 0; i < pointList.length - 1; i++) {
      const side = calcSide(pointList[i], pointList[i+1]);
      result.push(calcPointSide(side, pointList.filter((el, index)=> index !== i || index !== (i + 1))))
    }
  if (result.every(el => el)) {
    appendMessage("绘制的多边形是凸多边形");
  } else {
    appendMessage("绘制的多边形是凹多边形");
  }
}

/**
 * 计算两点构成的直线关系
 * @param {Array} point1 
 * @param {Array} point2 
 */
function calcSide(point1, point2){
    if(point1[0] - point2[0] === 0){
        return {
            type: "与y轴平行",
            k: point1[0],
            b: undefined
        }
    } else if(point1[1] - point2[1] === 0){
        return {
            type: "与x轴平行",
            k:undefined,
            b: point1[1]
        }
    } else {
        return {
            type: "直线方程",
            k: (point1[1] - point2[1]) / (point1[0] - point2[0]),
            b: (point1[0] * point1[2] - point2[0] * point1[1]) / (point1[0] - point2[0]),
        }
    }
}

function calcPointSide(side, points){
    let result;
    if(side.type === "与x轴平行"){
        result = points.every(point => point[1] > side.b)
    } else if(side.type === "与y轴平行"){
        result = points.every(point => point[0] > side.k)
    } else {
        result = points.every(point => side.k * point[0] + side.b - point[1] > 0)
    }
    return result
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
