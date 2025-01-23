const canvas = document.getElementById("graph-canvas");
const context = canvas.getContext("2d");
let pointList = [];
const width = canvas.width;
const height = canvas.height;
const rectPoint = [width / 4, height / 4, width / 2, height / 2];
const xMin = rectPoint[0],
  xMax = rectPoint[2] + xMin,
  yMin = height - rectPoint[1] - rectPoint[3],
  yMax = height - rectPoint[1];
const LEFT = 0b0001;
const RIGHT = 0b0010;
const BOTTOM = 0b0100;
const TOP = 0b1000;
clearCanvas();
document.getElementById("start-btn").addEventListener("click", () => {
  clearCanvas();
  canvas.addEventListener("click", drawPoint);
});
function clearCanvas() {
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
    clipLine(pointList);
  }
}

function clipLine(points) {
  const point1 = points[0];
  const point2 = points[1];
  let code1 = getPointAreaCode(point1);
  let code2 = getPointAreaCode(point2);
  let redraw = false;
  let isoutput = true;
  let k, b;
  while (true) {
    if ((code1 | code2) === 0) {
      isoutput && appendMessage("完全在窗口边界内");
      redraw = true;
      break;
    } else if (code1 & code2) {
      isoutput && appendMessage("完全在窗口边界外");
      break;
    } else {
      isoutput && appendMessage("部分在窗口边界内");
      isoutput = false;
      if (!k) {
        k = (point1[1] - point2[1]) / (point1[0] - point2[0]);
        b =
          (point1[0] * point2[1] - point2[0] * point1[1]) /
          (point1[0] - point2[0]);
      }
      let code = code1 !== 0 ? code1 : code2;
      let tempPoint;
      if (code & LEFT) {
        tempPoint = [xMin, k * xMin + b];
      } else if (code & RIGHT) {
        tempPoint = [xMax, k * xMax + b];
      } else if (code & BOTTOM) {
        tempPoint = [(yMin - b) / k, yMin];
      } else {
        tempPoint = [(yMax - b) / k, yMax];
      }
      if (code === code1) {
        code1 = getPointAreaCode(tempPoint);
        pointList[0] = tempPoint;
      } else {
        code2 = getPointAreaCode(tempPoint);
        pointList[1] = tempPoint;
      }
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

function getPointAreaCode(point) {
  let code = 0;
  if (point[0] < xMin) {
    code |= LEFT;
  }
  if (point[0] > xMax) {
    code |= RIGHT;
  }
  if (point[1] < yMin) {
    code |= BOTTOM;
  }
  if (point[1] > yMax) {
    code |= TOP;
  }
  return code;
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
