document.getElementById("start-btn").addEventListener("click", startDarw);
let rx; // 椭圆的x半径
let ry; // 椭圆的y半径
let size; // 需要绘制方格的行数和列数
const offset = 2; // 方格的行和列的偏移数
let color = "#ff000080"; // 直线填充的颜色
let p1; // 区域1的距离差
let p2; // 区域2的距离差
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
  if (
    document.getElementsByTagName("input").item(0).value &&
    document.getElementsByTagName("input").item(1).value
  ) {
    rx = document.getElementsByTagName("input").item(0).value * 1;
    ry = document.getElementsByTagName("input").item(1).value * 1;
    if (rx === ry) {
      appendMessage("椭圆的长半径和短半径如果相等请移步到圆的生成算法");
    } else {
      size = Math.max(rx, ry) * 2 + offset * 2;
      drawBox(size);
      while (current_y !== 0) {
        getNextPoint();
        await drawPoint();
      }
    }
  } else {
    appendMessage("请输入椭圆的长半径和短半径");
  }
}
/**
 * 获取下个点
 */
function getNextPoint() {
  if (current_x === undefined && current_y === undefined) {
    current_x = 0;
    current_y = ry;
  } else {
    if (ry * ry * current_x < rx * rx * current_y) {
      current_x += 1;
      if (!p1) {
        p1 = ry * ry - rx * rx * current_y + (rx * rx) / 4;
      } else {
        if (p1 >= 0) {
          current_y -= 1;
          p1 = p1 + 2 * ry * ry * current_x + ry * ry - 2 * rx * rx * current_y;
        } else {
          p1 = p1 + 2 * ry * ry * current_x + ry * ry;
        }
      }
    } else {
      current_y -= 1;
      if (!p2) {
        p2 =
          ry * ry * (current_x + 0.5) * (current_x + 0.5) +
          rx * rx * (current_y - 1) * (current_y - 1) -
          rx * rx * ry * ry;
        if (p2 >= 0) {
          current_x += 1;
        }
      } else {
        if (p2 >= 0) {
          current_x += 1;
          p2 =
            p2 +
            2 * ry * ry * current_x +
            rx * rx -
            2 * rx * rx * current_y
        } else {
          p2 = p2 - 2 * rx * rx * current_y + rx * rx;
        }
      }
    }
  }
}

async function drawPoint() {
  let listsPoint = [
    [current_x, current_y],
    [-current_x, current_y],
    [-current_x, -current_y],
    [current_x, -current_y],
  ];
  appendMessage(`填充点位${current_x},${current_y}的颜色`);
  listsPoint.forEach((el) => {
    setPix(...el);
  });
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
