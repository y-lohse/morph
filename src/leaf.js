import SVG from "svg.js";
import random from "lodash/random";
import Color from "color";
import scene from "./init";
import bezier from "./bezier";
import superformula from "./superformula";

const drawLeaf = ({ x, y, length, width }) => {
  const leftHand = [];
  const rightHand = [];

  const a = 3;
  const b = 1;
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
  const scaleFactor = (width / 2) / largestPoint;

  const yStepLength = length / (controlPoints.length - 1);
  controlPoints.forEach((controlPoint, index) => {
    if (index === 0) return;

    const currentY = Math.round(index * yStepLength + y);
    const previousY = Math.round(currentY - yStepLength + y);

    const previousX = Math.round(controlPoints[index - 1] * scaleFactor + x);
    const currentX = Math.round(controlPoints[index] * scaleFactor + x);

    const xStepLength = currentX - previousX;

    // const xBump = random(-xStepLength * .7, xStepLength * .7);
    // const yBump = random(-yStepLength * .7, yStepLength * .7);
    const xBump = 10;
    const yBump = 20;

    if (true) {
      //generating teeth
      const middleX = currentX - xStepLength / 2;
      const middleY = currentY - yStepLength / 2;

      const toothX = currentX * 5;
      const toothY = currentY * 1.2;

      leftHand.push(bezier(previousX, previousY, toothX, toothY, xBump, -yBump));
      leftHand.push(bezier(toothX, toothY, currentX, currentY, xBump, yBump));

      rightHand.push(bezier(-previousX, previousY, -toothX, toothY, -xBump, -yBump));
      rightHand.push(bezier(-toothX, toothY, -currentX, currentY, -xBump, yBump));
    }
    else {
      leftHand.push(bezier(previousX, previousY, currentX, currentY, xBump, yBump));
      rightHand.push(bezier(-previousX, previousY, -currentX, currentY, -xBump, yBump));
    }
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
  y: 10,
  length: 300,
  width: 50
})
