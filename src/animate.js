import SVG from "svg.js";
import "svg.pathmorphing.js";
import scene from "./init";
import bezier from "./bezier";

const points = [
  { x: 50, y: 50 },
  { x: 50, y: 150 },
  { x: -50, y: 150 },
  { x: -50, y: 50 },
]

const cx = 0;
const cy = 100;

const pitch = .001;
const roll = .000;
const yaw = 0;

var cosa = Math.cos(yaw);
var sina = Math.sin(yaw);

var cosb = Math.cos(pitch);
var sinb = Math.sin(pitch);

var cosc = Math.cos(roll);
var sinc = Math.sin(roll);

var Axx = cosa*cosb;
var Axy = cosa*sinb*sinc - sina*cosc;
var Axz = cosa*sinb*cosc + sina*sinc;

var Ayx = sina*cosb;
var Ayy = sina*sinb*sinc + cosa*cosc;
var Ayz = sina*sinb*cosc - cosa*sinc;

var Azx = -sinb;
var Azy = cosb*sinc;
var Azz = cosb*cosc;

for (var i = 0; i < points.length; i++) {
    var px = points[i].x - cx;
    var py = points[i].y - cy;
    var pz = 1;

    const rotatedX = Axx*px + Axy*py + Axz*pz;
    const rotatedY = Ayx*px + Ayy*py + Ayz*pz;
    const rotatedZ = Azx*px + Azy*py + Azz*pz;

    var d = 1;
    var r = d / rotatedZ;

    const x = r * rotatedX + cx;
    const y = r * rotatedY + cy;

    points[i].x = x;
    points[i].y = y;
}



const path1 = `
  M ${points[0].x} ${points[0].y}
  ${points.map(p => `L ${p.x} ${p.y}`)}
`

const gradient = scene.gradient('linear', function(stop) {
  stop.at(0, '#cc0000')
  stop.at(1, '#00cc00')
});

const path = scene
.path(path1)
.fill(gradient)

scene.circle(20, 0, 0).fill('#cc0000')
