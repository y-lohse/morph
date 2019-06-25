import "./styles.css";
import SVG from "svg.js";
import random from "lodash/random";

const width = 375;
const height = 500;
const draw = SVG("app").size(width, height);

var scene = draw.group();
scene.x(width / 2);
scene.y(height);
scene.rotate(180);

const drawBranch = ({ x, y, length, thickness, angle }) => {
  const lengthReduction = 0.8;
  const angularDeviation = 1.3;
  const angularSpread = 15;

  const thicknessReudction = 0.8;
  const nextThickness = thickness * thicknessReudction;

  const halfThickness = thickness / 2;
  const nextHalfThickness = nextThickness / 2;

  const bezier = `${x + random(-8, 8)} ${y + length * random(0.1, 0.9)}`;

  // faire des arrondis au bouts des branches
  const bottomLeft = x - halfThickness;
  const bottomRight = x + halfThickness;
  const topLeft = x - nextHalfThickness;
  const topRight = x + nextHalfThickness;
  const top = y + length;
  scene
    .path(
      ` M ${bottomLeft} ${y}
        Q ${bezier} ${topLeft} ${top}
        Q ${topRight} ${top} ${topRight} ${top}
        Q ${bezier} ${bottomRight} ${y}
      `
    )
    .stroke({ color: "#0E5C22", width: 1, linecap: "round" })
    .fill({ color: "#0E5C22", opacity: 0.1 })
    .rotate(angle, x, y);

  if (length < 35) return;

  const theta = (angle * Math.PI) / 180;
  const endX = x - length * Math.sin(theta);
  const endY = y + length * Math.cos(theta);
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
  thickness: 25,
  angle: 0
});
