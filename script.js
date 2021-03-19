"use strict";
// Game
dragAndDropGame();

function dragAndDropGame() {
	let levels;
	
	let drag = document.querySelector('.drag'),
		drop = document.querySelector('.drop'),
		levelCounter = document.getElementById("levelCount"),
		nextLevelBtn = document.getElementById("nextLevel"),
		completeLevelScreen = document.querySelector(".complete-level");

		getLevels("levels.json");
	createLevel();
	dragAndDrop(); // Drag'n'Drop mechanic
	nextLevelBtn.addEventListener("click", ()=>nextLevel());

	function getLevels(url) {
		let req = new XMLHttpRequest();
		req.open("GET", url, false);
		req.send();	
		if (req.readyState === 4) {
			if (req.status >= 200 && req.status <= 299) {
				levels = JSON.parse(req.response);
			} else {
				console.error(`${req.status}: ${req.statusText}`);
			}
		}
	}
	function dragAndDrop() {
		let isMouseDown = false;

		drag.addEventListener("mousedown", (e)=>{
			isMouseDown = true;

			let shiftY = e.clientY - e.target.offsetTop,
				shiftX = e.clientX - e.target.offsetLeft;

			document.onmousemove = function(e) {
				if (isMouseDown) {
					drag.style.top  = e.clientY - shiftY + "px";
					drag.style.left = e.clientX - shiftX + "px";
				}
			}
		})
		drag.addEventListener("mouseup", ()=>{
			isMouseDown = false
			inDropZone(drag, drop); // In Drop zone?
		})
	}
	function inDropZone(dragElem, dropBox) {
		let dragPos = dragElem.getBoundingClientRect(),
			dropPos = dropBox.getBoundingClientRect();
		if ((dragPos.top > dropPos.top && dragPos.bottom < dropPos.bottom)
			&&
			(dragPos.left > dropPos.left && dragPos.right < dropPos.right)) 
		{
			if (levels.length <= +levelCounter.textContent)
				completeLevelScreen.innerHTML = "<h1>You win!</h1>"; 

			completeLevelScreen.style.display="flex"
		}
	}
	function nextLevel() {
		if (levels.length > +levelCounter.textContent) {	
			levelCounter.textContent++;
			completeLevelScreen.style.display = "none";
			createLevel();
		}
	}
	function createLevel() {
		try {
			let dragPosName = Object.keys(levels[+levelCounter.textContent-1].dragPosition),
				dropPosName = Object.keys(levels[+levelCounter.textContent-1].dropPosition);

			drag.style[dragPosName[1]] = (levels[+levelCounter.textContent-1].dragPosition[dragPosName[1]]);
			drag.style[dragPosName[0]] = (levels[+levelCounter.textContent-1].dragPosition[dragPosName[0]]);	
		
			drop.style[dropPosName[1]] = (levels[+levelCounter.textContent-1].dropPosition[dropPosName[1]]);
			drop.style[dropPosName[0]] = (levels[+levelCounter.textContent-1].dropPosition[dropPosName[0]]);	
		} catch (err) {
			console.error(`${err.message} | createLevel Error`);
		}
	}
}
