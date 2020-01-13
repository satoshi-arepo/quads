const BLACK = "#024",
      WHITE = "#c20",
      STROKE = "#a40",
      TILE_CODES = [ "twwn", "wnwn", "wntn", "ttww", "wwwn", "wwtn",
		     "twtt", "tntw", "twtw", "twnw", "nnnn", "nttw",
		     "twww", "wwnn", "nwtt", "tnnw", "nnnw", "nntw",
		     "tbbn", "bnbn", "bntn", "ttbb", "bbbn", "bbtn",
		     "tbtt", "tntb", "tbtb", "tbnb", "tttt", "nttb",
		     "tbbb", "bbnn", "nbtt", "tnnb", "nnnb", "nntb" ];

let firstMoves = 2;
function drawTile(code, tileNo) {
	let e = document.createElement("canvas");
	e.setAttribute("width", 72);
	e.setAttribute("height", 72);
	e.code = code;

	let cx = e.getContext("2d");
	
	for (j = 0; j < 4; j++)
		drawSector(cx, j, code[j]);

	let lastPos = {x: 0, y: 0}, 
	    dragged = false, 
	    startPointer, 
	    angle = 0, 
	    cellBelow,
	    hl = null,
	    tableCrd;

	function startDrag(event) {
		e.classList.remove('returning');
		startPointer = {x: event.pageX, y: event.pageY};
		addEventListener("mousemove", drag);
		addEventListener("mouseup", removeDrag);
		tableCrd = table.getBoundingClientRect();
	}

	function drag (event) {
		dragged = true;
		let x = event.pageX, y = event.pageY;
		e.style.left = (lastPos.x + x - startPointer.x) + "px";
		e.style.top = (lastPos.y + y - startPointer.y) + "px";
		e.classList.add('moved');
		let newhlX = ~~((x - tableCrd.left) / (tableCrd.width / 6)),
		    newhlY = ~~((y - tableCrd.top) / (tableCrd.height / 6));
		let oldhl = hl;
		if (x > tableCrd.left && x < tableCrd.right &&
		    y > tableCrd.top && y < tableCrd.bottom)
			hl = newhlX + newhlY * 6;
		else hl = null;
		if (hl !== oldhl) {
			if (oldhl !== null) cells[oldhl].classList.remove('hl');
			if (hl !== null) cells[hl].classList.add('hl');
		}
	}

	function isDropAllowed() {
		if (cells[hl].children.length > 0) return false;
		let allowed = true, noNeighbors = true;
		cells[hl].neighbors.forEach((index, side) => {
			let child = cells[index].children[0];
			if (child) noNeighbors = false;
			if (child && child.code[(side + 2) % 4] != e.code[side]) 
				allowed = false;
		})
		if (noNeighbors && !firstMoves) allowed = false;
		if (allowed && firstMoves)
			if (e.code == "tttt" || e.code == "nnnn") {
				allowed = true;
				firstMoves--;
			} else allowed = false;
		return allowed;
	}

	function removeDrag () {
		removeEventListener("mousemove", drag);
		removeEventListener("mouseup", removeDrag);
		if (!dragged) rotate();
		dragged = false;
		e.classList.remove("moved");
		lastPos = {
			x: Number(e.style.left.slice(0,-2)), 
			y: Number(e.style.top.slice(0,-2))
		};
		if (cells[hl] && isDropAllowed()) {
			e.style.top = "0px";
			e.style.left = "0px";
			e.removeEventListener("mousedown", startDrag);
			cells[hl].appendChild(e);
		} else {
			e.classList.add('returning');
			if (cells[hl]) cells[hl].classList.remove('hl');
			setTimeout(()=>e.classList.remove('returning'),1000);
			e.style.top = "0px";
			e.style.left = "0px";
			lastPos = {x: 0, y: 0};
		}
	}

	function rotate () {
		if (dragged) return;
		angle += 90;
		e.code = e.code.slice(-1) + e.code.slice(0,3);
		e.style.transform = "rotate(" + angle + "deg)";
	}

	function drawSector(cx, sector, color) {
		cx.save();
		cx.beginPath();
		cx.translate(36,36);
		cx.rotate(sector / 2 * Math.PI);
		cx.translate(-36,-36);
		cx.moveTo(0,0);
		cx.lineTo(36,36);
		cx.lineTo(72,0);
		cx.clip();
		if (color == "b" || color == "w") {
			cx.fillStyle = (color == "b") ? BLACK : WHITE;
			cx.fillRect(0,0,72,72);
		} else {
			cx.beginPath();
			if (color == "n") 
				for (i = 6; i < 70; i += 10) {
					cx.moveTo(0,i);
					cx.lineTo(72,i);
				}
			else for (i = 6; i < 70; i += 10) {
				cx.moveTo(i,0);
				cx.lineTo(i,72);
			}
			cx.strokeStyle = STROKE;
			cx.lineWidth = 5;
			cx.stroke();
		}

		cx.restore();
	}

	e.addEventListener("mousedown", startDrag); 
	
	return document.querySelectorAll(".tiles")[tileNo < 18 ? 0 : 1].appendChild(e);
}

let tiles = TILE_CODES.map(drawTile);

function elt(e) {
	return document.createElement(e)
}

let table = elt("table"), cells = [];

let tr, cell;
for (let y = 0; y < 6; y++) {
	tr = table.appendChild(elt("tr"));
	for (let x = 0; x < 6; x++) {
		cell = tr.appendChild(elt("td"));
		cell.neighbors = [];
		if (y > 0) cell.neighbors[0] = (x + 6 * (y - 1));
		if (x < 5) cell.neighbors[1] = (x + 1 + 6 * y);
		if (y < 5) cell.neighbors[2] = (x + 6 * (y + 1));
		if (x > 0) cell.neighbors[3] = (x - 1 + 6 * y);
		cells.push(cell);
	}
}
		
document.querySelector("#board").appendChild(table);

