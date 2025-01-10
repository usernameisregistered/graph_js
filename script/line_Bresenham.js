document.getElementById("start-btn").addEventListener("click", startDarw);
let start_x; // 起点x
let start_y; // 起点y
let end_x; // 终点x
let end_y; // 终点y
let dx; // x方向的差值
let dy; // y方向的差值
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
  if (
    document.getElementsByTagName("input").item(0).value &&
    document.getElementsByTagName("input").item(1).value
  ) {
    [start_x, start_y] = document
      .getElementsByTagName("input")
      .item(0)
      .value.split(",")
      .map((el) => el * 1);
    [end_x, end_y] = document
      .getElementsByTagName("input")
      .item(1)
      .value.split(",")
      .map((el) => el * 1);
    dx = end_x - start_x;
    dy = end_y - start_y;
    if (dx === 0 || dy === 0) {
      appendMessage("暂不考虑和坐标轴重合与平行的场景");
    } else {
      size = Math.max(Math.abs(dx), Math.abs(dy)) + offset * 2;
      drawBox(size);
      let steps;
      await setPix(start_x, start_y);
      current_x = start_x;
      current_y = start_y;
      if (dx >= dy) {
        steps = Math.abs(dx) - 1;
		p = 2 * dy - dx;
      } else {
        steps = Math.abs(dy) - 1;
		p = 2 * dx - dy
      }
      
      for (let i = 0; i < steps; i++) {
        let nextPoint;
        if (dx >= dy) {
          nextPoint = getNextXPoint();
        } else {
          nextPoint = getNextYPoint();
        }
        await setPix(...nextPoint);
      }
      await setPix(end_x, end_y);
    }
  } else {
    appendMessage("请输入起点和终点坐标");
  }
}
/**
 * 获取下个点 斜率小于1大于0
 */
function getNextXPoint() {
  current_x += 1;
  if (p > 0) {
    current_y += 1;
    p = p + 2 * dy - 2 * dx;
  } else {
    p = p + 2 * dy;
  }
  return [current_x, current_y];
}

/**
 * 获取下个点 斜率大于1
 */
function getNextYPoint() {
  current_y += 1;
  if (p > 0) {
    current_x += 1;
    p = p + 2 * dx - 2 * dy;
  } else {
    p = p + 2 * dx;
  }
  return [current_x, current_y];
}

async function setPix(drawX, drawY) {
  let position = transformPosition(drawX, drawY);
  document.getElementById(position).classList.add(`bg-[${color}]`);
  appendMessage(
    `填充点位${drawX},${drawY},所属行列${position.split("_")[0] * 1 + 1},${
      position.split("_")[1] * 1 + 1
    }的颜色`
  );
  await sleep(1);
}

function transformPosition(drawX, drawY) {
  let col;
  const diffX = Math.abs(drawX - start_x);
  if (end_x > start_x) {
    col = offset + diffX;
  } else {
    col = size - offset - diffX;
  }
  let row;
  const diffY = Math.abs(drawY - start_y);
  if (end_y > start_y) {
    row = size - offset - diffY;
  } else {
    row = offset + diffX;
  }
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
  const width = Math.floor(800 / size);
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
