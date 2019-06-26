import "./styles.css";
import SVG from "svg.js";
import random from "lodash/random";

const width = 375;
const height = 500;
const draw = SVG("app").size(width, height);

const scene = draw.group();
scene.x(width / 2);
scene.y(height);
scene.rotate(180);

const bezier = (x1, y1, x2, y2, offsetX = 0, offsetY = 0) => `Q ${x1 + ((x2 - x1) / 2) + offsetX} ${y1 + ((y2 - y1) / 2) + offsetY} ${x2} ${y2}`

const drawBranch = ({ x, y, length, thickness, angle }) => {
  const lengthReduction = random(.7, .9);
  const angularDeviation = random(1.2, 1.4);
  const angularSpread = random(4, 25);

  const thicknessReudction = random(.6, .9);
  const nextThickness = thickness * thicknessReudction;

  const halfThickness = thickness / 2;
  const nextHalfThickness = nextThickness / 2;

  // faire des arrondis au bouts des branches
  const bottomLeft = x - halfThickness;
  const bottomRight = x + halfThickness;
  const topLeft = x - nextHalfThickness;
  const topRight = x + nextHalfThickness;
  const top = y + length;

  scene
    .path(`
      M ${bottomLeft} ${y}
      ${bezier(bottomLeft, y, topLeft, top, random(-halfThickness*.3, halfThickness*.3), random(-length*.3, length*.3))}
      ${bezier(topLeft, top, topRight, top, 0, nextHalfThickness)}
      ${bezier(topRight, top, bottomRight, y, random(-halfThickness*.3, halfThickness*.3), random(-length*.3, length*.3))}
      ${bezier(bottomRight, y, bottomLeft, y, 0, -halfThickness)}
    `)
    // .stroke({ color: "#0E5C22", width: 1, linecap: "round" })
    .fill({ color: "#0E5C22", opacity: 1 })
    .rotate(angle, x, y);

  if (length < 15) return;

  const theta = (angle * Math.PI) / 180;
  const endX = x - length * .95 * Math.sin(theta);
  const endY = y + length * .95 * Math.cos(theta);
  // faire varier la position de reprise pour la placer en milieu de branche

  drawBranch({
    x: endX,
    y: endY,
    length: length * lengthReduction,
    thickness: nextThickness,
    angle: angle * angularDeviation + -angularSpread
  });
  drawBranch({
    x: endX,
    y: endY,
    length: length * lengthReduction,
    thickness: nextThickness,
    angle: angle * angularDeviation + angularSpread
  });
};

drawBranch({
  x: 0,
  y: 0,
  length: 90,
  thickness: 20,
  angle: 0
});
