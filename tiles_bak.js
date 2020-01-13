const BLACK = "#024",
      WHITE = "#c20",
      STROKE = "#a40";

function drawTile(code) {
	var e = document.createElement("canvas");
	e.setAttribute("width", 72);
	e.setAttribute("height", 72);
	var cx = e.getContext("2d");
	
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

	for (j = 0; j < 4; j++)
		drawSector(cx, j, code[j]);
	return e;
}

document.body.appendChild(drawTile("ntbw"));
document.body.appendChild(drawTile("nnwb"));
document.body.appendChild(drawTile("ntnt"));
document.body.appendChild(t = drawTile("ttbn"));

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

function doEltsOverlap(e1, e2) {
	let rect1 = e1.getBoundingClientRect(),
	    rect2 = e2.getBoundingClientRect();
	let l1 = rect1.left,
	    l2 = rect2.left,
	    r1 = rect1.right,
	    r2 = rect2.right,
	    t1 = rect1.top,
	    t2 = rect2.top,
	    b1 = rect1.bottom,
	    b2 = rect2.bottom;

	return l1 < r2 && l2 < r1 && t1 < b2 && t2 < b1;
}

t.addEventListener("mousedown", () => addEventListener("mousemove", drag));

let startDrag, lastpos = {x:0, y:0};
function drag(e) {
	if (e.which == 0) {
		removeEventListener("mousemove", drag);
		startDrag = undefined;
		lastpos = {x: parseInt(t.style.left.slice(0,-2)), 
			   y: parseInt(t.style.top.slice(0,-2))};
		return;
	}
	if (!startDrag) startDrag = {x: e.pageX, y: e.pageY};
	t.style.left = (lastpos.x + e.pageX - startDrag.x) + "px";
	t.style.top = (lastpos.y + e.pageY - startDrag.y) + "px";
	cells.forEach((c) => { c.style.backgroundColor = doEltsOverlap(c, t) ? "yellow" : "grey"});
}


