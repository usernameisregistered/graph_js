const canvas = document.getElementById("graph-canvas");
const context = canvas.getContext("2d");
let pointList = [];
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
