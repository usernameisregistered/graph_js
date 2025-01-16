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
  calcCrossProduct();
}

function calcCrossProduct() {
  const vectors = [];
  for (let i = 0; i < pointList.length - 1; i++) {
    vectors.push([
      pointList[i + 1][0] - pointList[i][0],
      pointList[i + 1][1] - pointList[i][1],
    ]);
  }
  const result = [];
  for (let i = 0; i < vectors.length; i++) {
    const firstVector = vectors[i];
    const secondVector = i === vectors.length - 1 ? vectors[0] : vectors[i + 1];
    result.push(
      firstVector[0] * secondVector[1] - firstVector[1] * secondVector[0]
    );
  }
  if (result.every((el) => el > 0) || result.every((el) => el < 0)) {
    appendMessage("绘制的多边形是凸多边形");
  } else {
    appendMessage("绘制的多边形是凹多边形");
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
