const BLACK = "#024",
      WHITE = "#c20",
      STROKE = "#a40",
      TILE_CODES = ["ntbt", "nnwn", "ntwn", "tttt"];

function drawTile(code) {
	var e = document.createElement("canvas");
	e.setAttribute("width", 72);
	e.setAttribute("height", 72);
	var cx = e.getContext("2d");
	
	for (j = 0; j < 4; j++)
		drawSector(cx, j, code[j]);
	return e;
}

let tiles = TILE_CODES.map((code) => {
	return document.body.appendChild(drawTile(code));
});

function elt(e) {
	return document.createElement(e)
}

var table = elt("table"), cells = [];
var tr = table.appendChild(elt("tr"));
cells[0] = tr.appendChild(elt("td"));
cells[1] = tr.appendChild(elt("td"));
cells[2] = tr.appendChild(elt("td"));
var tr = table.appendChild(elt("tr"));
cells[3] = tr.appendChild(elt("td"));
cells[4] = tr.appendChild(elt("td"));
cells[5] = tr.appendChild(elt("td"));

document.body.appendChild(table);

function isTileOver(cell, tile) {
	let c = cell.getBoundingClientRect(),
	    r = tile.getBoundingClientRect(),
	    t = {x: (r.left + r.right) / 2,
		 y: (r.top + r.bottom) / 2};

	return t.x > c.left && t.x < c.right && 
	       t.y > c.top  && t.y < c.bottom;
}

function drag(elt) {
	return function (event) {
		if (event.which == 0) {
			removeEventListener("mousemove", elt.drag);
			elt.drag = undefined;
			elt.lastPos = {
				x: parseInt(elt.style.left.slice(0,-2)), 
				y: parseInt(elt.style.top.slice(0,-2))
			};
			return;
		}
		elt.style.left = (elt.lastPos.x + event.pageX - elt.startPointer.x) + "px";
		elt.style.top = (elt.lastPos.y + event.pageY - elt.startPointer.y) + "px";
		cells.forEach((c) => { 
			c.style.backgroundColor = isTileOver(c, elt) ? "yellow" : "grey";
		});
		
	}
}

function startDrag(elt) {
	return function(event) {
		elt.startPointer = {x: event.pageX, y: event.pageY};
		if (!elt.lastPos) elt.lastPos = {x: 0, y: 0};
		elt.drag = drag(elt);
		addEventListener("mousemove", elt.drag);
	}
}

tiles.forEach(t => t.addEventListener("mousedown", startDrag(t)));

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
	switch(color) {
		case "b":
			cx.fillStyle = BLACK;
			cx.fillRect(0,0,72,72);
			break;
		case "w":
			cx.fillStyle = WHITE;
			cx.fillRect(0,0,72,72);
			break;
		case "n":
			cx.beginPath();
			for (i = 6; i < 70; i += 10) {
				cx.moveTo(0,i);
				cx.lineTo(72,i);
			}
			cx.strokeStyle = STROKE;
			cx.lineWidth = 5;
			cx.stroke();
			break;
		case "t":
			cx.beginPath();
			for (i = 6; i < 70; i += 10) {
				cx.moveTo(i,0);
				cx.lineTo(i,72);
			}
			cx.strokeStyle = STROKE;
			cx.lineWidth = 5;
			cx.stroke();
			break;
	}
	cx.restore();
}

