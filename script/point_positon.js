const canvas = document.getElementById("graph-canvas");
const context = canvas.getContext("2d");
let pointList = [];
let currentPoint = [];
let radius = 4
document.getElementById("start-btn").addEventListener("click", () => {
  clearCanvas();
  canvas.removeEventListener("dblclick", stopDraw);
  canvas.addEventListener("click", beginDraw);
  canvas.addEventListener("dblclick", stopDraw);
});

document.getElementById("start-point").addEventListener("click", () => {
  canvas.removeEventListener("dblclick", stopDraw);
  canvas.removeEventListener("click", beginDraw);
  canvas.removeEventListener("click", drawPoint);
  canvas.addEventListener("click", drawPoint);
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
  const width = canvas.width;
  const height = canvas.height;
  context.clearRect(0, 0, width, height);
  let messageRootNode = document.getElementById("message-container");
  while (messageRootNode.firstChild) {
    messageRootNode.removeChild(messageRootNode.firstChild);
  }
  context.beginPath();
  for (let i = 0; i < pointList.length; i++) {
    if (i === 0) {
      context.moveTo(pointList[i][0], pointList[i][1]);
    } else {
      context.lineTo(pointList[i][0], pointList[i][1]);
    }
  }
  context.stroke();
  context.beginPath();
  context.arc(event.offsetX - radius, event.offsetY - radius, radius, 0, Math.PI * 2, true);
  currentPoint = [event.offsetX - radius, event.offsetY - radius];
  context.stroke();
  verify();
}

function verify() {
  let intersectionSize = 0;
  // 为简单起见，取射线y = currentPoint[1] x的定义域为x >= event.offsetX - 2
  for (let i = 0; i < pointList.length - 1; i++) {
    const side = [pointList[i], pointList[i + 1]];
    const xRange = Math.min(side[0][0], side[1][0]);
    if (currentPoint[0] > xRange) {
      const yRange = [
        Math.min(side[0][1], side[1][1]),
        Math.max(side[0][1], side[1][1]),
      ];
      if (currentPoint[1] >= yRange[0] && currentPoint[1] <= yRange[1]) {
        intersectionSize++;
      }
    }
  }
  if (intersectionSize % 2 === 0) {
    appendMessage("外部点");
  } else {
    appendMessage("内部点");
  }
}

function beginDraw(event) {
  context.fillStyle = "white";
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
  canvas.removeEventListener("click", beginDraw);
  context.lineTo(pointList[0][0], pointList[0][1]);
  context.stroke();
  context.closePath();
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
