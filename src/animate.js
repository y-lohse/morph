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

const rotatePoint = (x, y, cx, cy, phiX, phiY, phiZ) => {
  const cosa = Math.cos(phiZ);
  const sina = Math.sin(phiZ);

  const cosb = Math.cos(phiX);
  const sinb = Math.sin(phiX);

  const cosc = Math.cos(phiY);
  const sinc = Math.sin(phiY);

  const Axx = cosa*cosb;
  const Axy = cosa*sinb*sinc - sina*cosc;
  const Axz = cosa*sinb*cosc + sina*sinc;

  const Ayx = sina*cosb;
  const Ayy = sina*sinb*sinc + cosa*cosc;
  const Ayz = sina*sinb*cosc - cosa*sinc;

  const Azx = -sinb;
  const Azy = cosb*sinc;
  const Azz = cosb*cosc;

  const px = x - cx;
  const py = y - cy;
  const pz = 1;

  const rotatedX = Axx*px + Axy*py + Axz*pz;
  const rotatedY = Ayx*px + Ayy*py + Ayz*pz;
  const rotatedZ = Azx*px + Azy*py + Azz*pz;

  const d = 1;
  const r = d / rotatedZ;

  const nx = r * rotatedX + cx;
  const ny = r * rotatedY + cy;

  return { x: nx, y: ny }
}

const cx = 0;
const cy = 100;

const pitch = .001;
const roll = .000;
const yaw = 0;

for (let i = 0; i < points.length; i++) {
    const newP = rotatePoint(points[i].x, points[i].y, cx, cy, pitch, roll, yaw)

    points[i].x = newP.x;
    points[i].y = newP.y;
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
