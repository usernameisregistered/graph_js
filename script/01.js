document.getElementById("start-btn").addEventListener("click", startDarw);
// size 为方格的行列数 行数=列数
const offset = 2; // 扩展的行数或者列数
let dx, dy, k, size;
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
		const [start_x, start_y] = document
			.getElementsByTagName("input")
			.item(0)
			.value.split(",")
			.map((el) => el * 1);
		const [end_x, end_y] = document
			.getElementsByTagName("input")
			.item(1)
			.value.split(",")
			.map((el) => el * 1);
		dx = end_x - start_x;
		dy = end_y - start_y;
		if (dx === 0 || dy === 0) {
			appendMessage("暂不考虑和坐标轴重合于平行的场景");
		} else {
			size = Math.max(Math.abs(dx), Math.abs(dy)) + offset * 2;
			drawBox(size);
			k = dy / dx;
			let steps;
			if (Math.abs(k) >= 1) {
				steps = Math.abs(dy);
				await drawBoxLine(start_x, start_y, end_x, end_y, steps, dx > 0 ?  1 / Math.abs(k) : -1 / Math.abs(k), dy > 0 ? 1: -1);
			} else {
				steps = Math.abs(dx);
				await drawBoxLine(start_x, start_y, end_x, end_y, steps, dx > 0 ? 1 : -1, dy > 0 ?  Math.abs(k) : - Math.abs(k));
			}
		}
	} else {
		appendMessage("请输入起点和终点坐标");
	}
}

/**
 *
 * @param {Number} start_x  起点x
 * @param {Number} start_y  起点y
 * @param {Number} end_x 终点x
 * @param {Number} end_y 终点y
 * @param {Number} step 执行步长
 * @param {Number} xIncrement x增量
 * @param {Number} yIncrement y增量
 */
async function drawBoxLine(
	start_x,
	start_y,
	end_x,
	end_y,
	step,
	xIncrement,
	yIncrement
) {
	let x = start_x;
	let y = start_y;
	let color = "#ff000080";
	await setPix(x, y, color, start_x, start_y, end_x, end_y);
	for (let i = 1; i < step; i++) {
		x += xIncrement;
		y += yIncrement;
		await setPix(x, y, color, start_x, start_y, end_x, end_y);
	}
	await setPix(end_x, end_y, color, start_x, start_y, end_x, end_y);
}

async function setPix(x, y, color, start_x, start_y, end_x, end_y) {
	let drawX = Math.round(x);
	let drawY = Math.round(y);
	let position = transformPosition(
		drawX,
		drawY,
		start_x,
		start_y,
		end_x,
		end_y
	);
	document.getElementById(position).classList.add(`bg-[${color}]`);
	appendMessage(`填充点位${drawX},${drawY},所属行列${position.split("_")[0] * 1 + 1},${position.split("_")[1]* 1 + 1}的颜色`);
	await sleep(1);
}

function transformPosition(drawX, drawY, start_x, start_y, end_x, end_y) {
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
	const width = Math.floor(900 / size) - 1;
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
