document.getElementById("start-btn").addEventListener("click", startDarw);
let r; // 圆的半径
let size; // 需要绘制方格的行数和列数
const offset = 2; // 方格的行和列的偏移数
let color = "#ff000080"; // 直线填充的颜色
let p; // 第一个点位的距离差
let current_x; // 临时变量存储当前的点位x
let current_y; // 临时变量存储当前的点位x
async function startDarw() {
  const rootNode = document.getElementById("graph-container");
  while (rootNode.firstChild) {
    rootNode.removeChild(rootNode.firstChild);
  }
  let messageRootNode = document.getElementById("message-container");
  while (messageRootNode.firstChild) {
    messageRootNode.removeChild(messageRootNode.firstChild);
  }
  current_x = undefined;
  current_y = undefined;
  p = undefined;
  if (document.getElementsByTagName("input").item(0).value) {
    r = document.getElementsByTagName("input").item(0).value * 1;
    size = r * 2 + offset * 2;
    drawBox(size);
    while(!current_x  || current_x !==current_y){
      nextPoint = getNextPoint();
      await drawPoint();
    }
  } else {
    appendMessage("请输入圆的半径");
  }
}
/**
 * 获取下个点
 */
function getNextPoint() {
  if (current_x === undefined) {
    current_x = 0;
    current_y = r;
    p = 5 / 4  - r;
  } else {
    current_x += 1;
    if (p > 0) {
      current_y -= 1;
      p = p + 1 + 2 * (current_x - current_y);
    } else {
      p = p + 3 + 2 * current_x;
    }
  }
}

async function drawPoint() {
  let listsPoint = [
    [current_x, current_y],
    [current_y, current_x],
    [-current_y, current_x],
    [-current_x, current_y],
    [-current_x, -current_y],
    [-current_y, -current_x],
    [current_y, -current_x],
    [current_x, -current_y],
  ];
  appendMessage(
    `填充点位${current_x},${current_y}的颜色`
  );
  listsPoint.forEach((el)=>{
    setPix(...el)
  })
  await sleep(1);
}

async function setPix(drawX, drawY) {
  let position = transformPosition(drawX, drawY);
  document.getElementById(position).classList.add(`bg-[${color}]`);
}

function transformPosition(drawX, drawY) {
  let center = size / 2;
  let col = center - drawX;
  let row = center + drawY;
  return row + "_" + col;
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
/**
 * 绘制方格
 * @param {Number} size
 */
function drawBox(size) {
  // 获取每个方格的宽度
  const rootNode = document.getElementById("graph-container");
  const width = Math.floor((800 - 2) / size);
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      const element = document.createElement("div");
      element.setAttribute("id", `${i}_${j}`);
      element.setAttribute(
        "class",
        `w-[${width}px] h-[${width}px] border border-0 border-b border-r border-neutral-300`
      );
      rootNode.appendChild(element);
    }
  }
}

function sleep(time) {
  return new Promise((resolve) => {
    setTimeout(resolve, time * 1000);
  });
}
