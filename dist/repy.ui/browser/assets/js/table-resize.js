function tablePlugin(selector, config){
    function addStylesheetRules () {
      var styleEl = document.querySelector("#mytable-stylesheet");
      if(!styleEl){
          styleEl = document.createElement('style');
          styleEl.setAttribute("type", "text/css");
          styleEl.id='table-plugin-stylesheet'; 
          document.head.appendChild(styleEl);
      }
      styleEl.innerHTML = `.th-highlight-left,
      .td-highlight-left{
          border-left:10px solid #fffa90;
      }
      .th-highlight-right,
      .td-highlight-right{
          border-right:10px solid #fffa90;
      }
      th.has-resizer{
          position:relative;
      }
      th.has-resizer div.column-resizer{
          position: absolute;
          right: 0;
          top: 0;
          width: 5px;height: 100%;
          cursor: ew-resize;
          background: repeating-linear-gradient(45deg, transparent, transparent 2px, rgba(0, 0, 0, 0.15) 2px, rgba(0, 0, 0, 0.15) 4px);
          border-left: 1px solid rgba(0, 0, 0, 0.05);
      }
      .customizable-table-drag-img{
          position:fixed !important;
          left:99999px !important;
      }
      .customizable-table thead th,
      .customizable-table tbody td{
          overflow: hidden;
          text-overflow: ellipsis;
          white-space:nowrap;
      }
      .customizable-table thead th > div:not(.column-resizer),
      .customizable-table tbody td > div:not(.column-resizer){
          pointer-events:none;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
      }
      .customizable-table{
        table-layout:fixed;
      }`;
    }
    /////////
    /**START Drag event handlers**/
    function dragstartHandler(event){
        dragstartTarget = event.target;
        if(dragstartTarget.classList.contains("has-resizer")){// event.target is a treated th element ?
            dragstartTh = dragstartTarget;
            var oldImgTable = document.querySelector(".customizable-table-drag-img");
            if(oldImgTable){
                oldImgTable.parentNode.removeChild(oldImgTable);
            }
        
            var currentTh = event.target;
            var targetIndex = currentTh.dataset.elementId;
            var imgTable = document.querySelector('.customizable-table').cloneNode(true);
            imgTable.classList.add("customizable-table-drag-img");
        
            var thElements = imgTable.querySelectorAll("thead th:not(:nth-child("+targetIndex+"))");
            for(var index = 0; index < thElements.length; index++){
                var thElement = thElements[index];
                thElement.parentNode.removeChild(thElement);
            }
        
            var tdElements = imgTable.querySelectorAll("tbody td:not(:nth-child("+targetIndex+"))");
            for(var index = 0; index < tdElements.length; index++){
                var tdElement = tdElements[index];
                tdElement.parentNode.removeChild(tdElement);
            }
        
            var resizableTh = imgTable.querySelector("thead th.has-resizer");
            if(!config || config.resize){
                var columnResizer = imgTable.querySelector("thead th.has-resizer > .column-resizer");
                resizableTh.removeChild(columnResizer);
            }
            imgTable.style.cssText += "width:" + currentTh.offsetWidth + 'px !important';
        
            document.body.appendChild(imgTable);
            event.dataTransfer.setData("text/plain", event.target.dataset.elementId);
            event.dataTransfer.setDragImage(imgTable,-5,-5);
        }
        else if(dragstartTarget.classList.contains("column-resizer")){
            event.stopPropagation();
            dragstartThInitWidth = dragstartTarget.parentNode.offsetWidth;
            dragstartScreenX = event.screenX;
            dragstartThToResizeX = dragstartTarget.parentNode.getBoundingClientRect().x;
            //pointerPrevX = event.screenX;
            /*Start Remove old drag image element*/
            var oldImgResizer = document.querySelector(".customizable-table-resize-img");
            if(oldImgResizer){
                oldImgResizer.parentNode.removeChild(oldImgResizer);
            }
            /*END Remove old drag image element*/
            dragstartThToResize = dragstartTarget.parentNode;
            resizeMode = true;
        }
    }
    /////////
    function dragenterHandler(event){
        if(!resizeMode){
            if(!config || config.drag){

            
            var currentTh = event.target; 
            if(currentTh.classList.contains("has-resizer")){// event.target is a treated th element ?
       
                var currentId = currentTh.dataset.elementId;
                var dragstartId = dragstartTh.dataset.elementId;
                if(parseInt(dragstartId) < parseInt(currentId)){//insert after
                    //currentTh.style.borderRight = "10px solid #fffa90";
                    currentTh.classList.remove('th-highlight-left');
                    currentTh.classList.add('th-highlight-right');
                    var tdElements = table.querySelectorAll("tbody > tr > td:nth-child("+currentId+")");
                    for(var index = 0; index < tdElements.length; index++){
                        var tdElement = tdElements[index];
                        //tdElement.style.borderRight = "10px solid #fffa90";
                        tdElement.classList.remove('th-highlight-left');
                        tdElement.classList.add('th-highlight-right');
                        //console.log("tdElement: ", tdElement);
                    }
                }
                else if(parseInt(dragstartId) > parseInt(currentId)){//insert before
                    //currentTh.style.borderLeft = "10px solid #fffa90";
                    currentTh.classList.remove('th-highlight-right');
                    currentTh.classList.add('th-highlight-left');
                    var tdElements = table.querySelectorAll("tbody > tr > td:nth-child("+currentId+")");
                    for(var index = 0; index < tdElements.length; index++){
                        var tdElement = tdElements[index];
                        //tdElement.style.borderLeft = "10px solid #fffa90";
                        tdElement.classList.remove('th-highlight-right');
                        tdElement.classList.add('th-highlight-left');
                        //console.log("tdElement: ", tdElement);
                    }
                }
            }
            }
        }
        else{

        }
        
    }
    ////////
    function dragleaveHandler(event){
        if(!resizeMode){
            if(!config || config.drag){
            var currentTh = event.target; 
            if(currentTh.classList.contains("has-resizer")){// event.target is a treated th element ?
                //console.log("dragleaveHandler currentTh: ", currentTh);
                //console.log("dragstartTh: ", dragstartTh);
                //console.log(dragstartTh === currentTh);
                //console.log("_________________");
                var currentId = currentTh.dataset.elementId;
                var dragstartId = dragstartTh.dataset.elementId;
                if(parseInt(dragstartId) < parseInt(currentId)){
                    //currentTh.style.borderRight = "";
                    currentTh.classList.remove('th-highlight-right');
                    var tdElements = table.querySelectorAll("tbody > tr > td:nth-child("+currentId+")");
                    for(var index = 0; index < tdElements.length; index++){
                        var tdElement = tdElements[index];
                        tdElement.classList.remove('th-highlight-right');
                        //console.log("tdElement: ", tdElement);
                    }
                }
                else if(parseInt(dragstartId) > parseInt(currentId)){
                    //currentTh.style.borderLeft = "";
                    currentTh.classList.remove('th-highlight-left');
                    var tdElements = table.querySelectorAll("tbody > tr > td:nth-child("+currentId+")");
                    for(var index = 0; index < tdElements.length; index++){
                        var tdElement = tdElements[index];
                        tdElement.classList.remove('th-highlight-left');
                        //console.log("tdElement: ", tdElement);
                    }
                }
            }
            }
        }
        else{

        }
    }
    ////////
    function dragoverHandler(event){
        event.preventDefault();
        //console.log('dragover screenX = ',event.screenX);
        if(resizeMode){
            var currentScreenX = event.screenX;
            var xDiff = dragstartScreenX - currentScreenX;
            var newWidth = dragstartThInitWidth - xDiff;
            if((newWidth) >= 40){
                //console.log("currentScreenX = ", currentScreenX);
                    //console.log("dragstartScreenX = ", dragstartScreenX);
                    //console.log("newWidth = ", newWidth);
                    //console.log("_________________");
                    dragstartThToResize.style.cssText +=  'width:'+(newWidth)+"px !important";
                    dragstartThToResize.firstElementChild.style.cssText +=  'width:'+(newWidth)+"px !important";
                    var cellIndex = dragstartThToResize.dataset.elementId;
                    var tdElements = table.querySelectorAll("tbody > tr > td:nth-child("+cellIndex+")");
                    for(var index = 0; index < tdElements.length; index++){
                        var tdElement = tdElements[index];
                        tdElement.style.cssText +=  'width:'+(newWidth)+"px !important";
                        tdElement.firstElementChild.style.cssText +=  'width:'+(newWidth)+"px !important";
                    }}

        }
        else{ //nothing? :p

        }
    }
    ////////
    function dropHandler(event){
        if(!resizeMode){
            if(!config || config.drag){

            
        //console.log('drop target = ', event.target);
        event.preventDefault();
        var currentTh = event.target;
        var currentId = currentTh.dataset.elementId;
        var dragstartId = dragstartTh.dataset.elementId;
        if(currentTh.classList.contains("has-resizer")){// event.target is a treated th element ?
            if(dragstartId != currentId){
                
                var tableTheadRow = table.querySelector("thead > tr");
                var tableTbodyRows = table.querySelectorAll("tbody > tr");
                if( parseInt(dragstartId) < parseInt(currentId) ){ //insert after
                    //console.log("drop (After) here!");
                    currentTh.parentNode.insertBefore(dragstartTh, currentTh.nextElementSibling);
                    for(var index = 0; index < tableTbodyRows.length; index++){
                        var tableTbodyRow = tableTbodyRows[index];
                        var currentTd = tableTbodyRow.querySelector("td:nth-child("+currentId+")");
                        var dragstartTd = tableTbodyRow.querySelector("td:nth-child("+dragstartId+")");
                        currentTd.parentNode.insertBefore(dragstartTd, currentTd.nextElementSibling);
                    }
                }
                else if(parseInt(dragstartId) > parseInt(currentId)){//insert before
                    //console.log("drop (Before) here!");
                    currentTh.parentNode.insertBefore(dragstartTh, currentTh);
                    for(var index = 0; index < tableTbodyRows.length; index++){
                        var tableTbodyRow = tableTbodyRows[index];
                        var currentTd = tableTbodyRow.querySelector("td:nth-child("+currentId+")");
                        var dragstartTd = tableTbodyRow.querySelector("td:nth-child("+dragstartId+")");
                        currentTd.parentNode.insertBefore(dragstartTd, currentTd);
                    }
                }

                var thElements = table.querySelectorAll('thead th');
                for(var index = 0; index < thElements.length; index++){
                    var thElement = thElements[index];
                    thElement.dataset.elementId = (index+1);
                }
            }
            else{
                console.log("NO drop here!");
            }
            var markedCells = document.querySelectorAll('.th-highlight-right,.td-highlight-right,.th-highlight-left,.td-highlight-left');
            for(var index = 0; index < markedCells.length; index++){
                var markedCell = markedCells[index];
                markedCell.classList.remove("th-highlight-right");
                markedCell.classList.remove("td-highlight-right");
                markedCell.classList.remove("th-highlight-left");
                markedCell.classList.remove("td-highlight-left");
            }
        }   
        }
        }
        else{ //nothing? :p
        }
        resizeMode = false;
    }
    /**END Drag event handlers**/

    addStylesheetRules();
    var table;
    var dragstartTh;
    var dragstartThToResize;
    var dragstartScreenX;
    var dragstartThInitWidth;
    var resizeMode = false;
    table = document.querySelector(selector);
    if (table){
        table.classList.add('customizable-table');
        var thElements = table.querySelectorAll('thead th');
        for(var index = 0; index < thElements.length; index++){
            var thElement = thElements[index];
            var columnResizer = thElement.querySelector("div.column-resizer");
            thElement.dataset.elementId = (index+1);
            if(!config || config.drag){
                thElement.setAttribute("draggable", "true");
            }
            
            if(!columnResizer){//resizer not set? set it!
                columnResizer = document.createElement("div");
                columnResizer.className = 'column-resizer';
                columnResizer.setAttribute("draggable", "true");
                if(!config || config.resize){
                thElement.appendChild(columnResizer);
                }
                thElement.classList.add('has-resizer');
            }
            /*START Reset DragEvent listeners*/
            thElement.removeEventListener("dragstart", dragstartHandler);
            thElement.removeEventListener("dragenter", dragenterHandler);
            thElement.removeEventListener("dragleave", dragleaveHandler);
            thElement.removeEventListener("dragover", dragoverHandler);
            thElement.removeEventListener("drop", dropHandler);
            document.removeEventListener("dragover", dragoverHandler);
            /*END Reset DragEvent listeners*/

            thElement.addEventListener("dragstart", dragstartHandler);
            thElement.addEventListener("dragenter", dragenterHandler);
            thElement.addEventListener("dragleave", dragleaveHandler);
            thElement.addEventListener("dragover", dragoverHandler);
            thElement.addEventListener("drop", dropHandler);
            document.addEventListener("dragover", dragoverHandler);
        }   
    }
}

document.addEventListener("DOMContentLoaded", function(){
    tablePlugin("#mytable", {drag:false,resize:true});
});