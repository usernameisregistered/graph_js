document.getElementById("start-btn").addEventListener("click", startDarw)

function startDarw(){
    const [start_x, start_y] = document.getElementsByTagName("input").item(0).value.split(",")
    const [end_x, end_y] = document.getElementsByTagName("input").item(1).value.split(",")
    if( document.getElementsByTagName("input").item(0).value &&  document.getElementsByTagName("input").item(1).value){
        const dx = end_x - start_x;
        const dy = end_y - start_y;
       
        const k = dy / dx;
        if(dx === 0 || dy === 0){
            appendMessage("暂不考虑和坐标轴重合的场景");
        } else {
            const offset = 2; // 方格的扩展个数
            const size = Math.ceil(Math.max(dx, dy)) + offset;
            drawBox(size);
        }
    } else {
        appendMessage("请输入起点和终点坐标");
    }
}

/**
 * 追加提示信息
 * @param {String} message 
 */
function appendMessage(message){
    const element = document.createElement("div")
    element.setAttribute("class", "leading-[25px] text-blue-300 mb-[8px] border border-0 border-b border-gray-400")
    element.textContent =  message;
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
    for(let i = 0; i < size; i++){
        for(let j = 0; j < size; j++){
            const element = document.createElement("div")
            element.setAttribute("class", `w-[${width}px] h-[${width}px] border border-0 border-b border-r border-neutral-300`)
            rootNode.appendChild(element)
        }
    }
    
}