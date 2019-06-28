import SVG from "svg.js";
import random from "lodash/random";
import Color from "color";
import scene from "./init";
import bezier from "./bezier";
import superformula from "./superformula";

const drawLeaf = ({ x, y, length, width }) => {
  const leftHand = [];
  const rightHand = [];

  const a = random(1, 8);
  const b = random(1, 8);
  const m = 2;
  const n1 = 2;
  const n2 = 4;
  const n3 = 4;

  const segments = 6;
  const phi = Math.PI / segments;
  const controlPoints = [];

  for(let i = 0; i <= segments; i++) {
    const { x, y } = superformula(phi*i, a, b, m, m, n1, n2, n3);
    controlPoints.push(y); // pushing y, that we will use as x later, because superformula assumes a normal cartesian coordinate system, and we draw bottom to top
  }

  const largestPoint = Math.max(...controlPoints);
  const scaleFactor = width / largestPoint;

  const yStepLength = length / (controlPoints.length - 1);
  controlPoints.forEach((controlPoint, index) => {
    if (index === 0) return;

    const endY = Math.round(index * yStepLength + y);
    const startY = Math.round(endY - yStepLength + y);

    const startX = Math.round(controlPoints[index - 1] * scaleFactor + x);
    const endX = Math.round(controlPoints[index] * scaleFactor + x);

    const xStepLength = Math.abs(endX - startX);

    // const xBump = random(-xStepLength * .5, xStepLength * .5);
    // const yBump = random(-yStepLength * .5, yStepLength * .5);
    const xBump = 0;
    const yBump = 0;

    leftHand.push(bezier(startX, startY, endX, endY, xBump, yBump));
    rightHand.push(bezier(-startX, startY, -endX, endY, -xBump, yBump));
  });

  const palette = ['#289B61', '#1C5438', '#71BC98', '#56A37E', '#EAC041', '#F9BB00', '#82453E', '#7C3B78', '#46B1C9', '#5A464C'];
  // const baseColor = Color(palette[random(0, palette.length - 1)]);
  const baseColor = Color(palette[0]);
  const light = baseColor.lighten(.2);
  const dark = baseColor.darken(.2);

  const gradient = scene.gradient('linear', function(stop) {
    stop.at(0, light.hex())
    stop.at(.5, light.desaturate(.3).hex())
    stop.at(.51, dark.hex())
    stop.at(1, dark.saturate(.3).hex())
  });

  scene
  .path(`
    M ${x} ${y}
    ${leftHand.join(' ')}
    M ${x} ${y}
    ${rightHand.join(' ')}
  `)
  .fill(gradient);
};

drawLeaf({
  x: 0,
  y: 20,
  length: 400,
  width: 100
})
