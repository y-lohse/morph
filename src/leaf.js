import SVG from "svg.js";
import random from "lodash/random";
import Color from "color";
import scene from "./init";
import bezier from "./bezier";
import superformula from "./superformula";

const drawLeaf = ({ x, y, length, width, hasTeeth = false }) => {
  const leftHand = [];
  const rightHand = [];

  const a = random(1, 20);
  const b = random(1, 20);
  const m = 2;
  const n1 = random(2, 30);
  const n2 = random(4, 40);
  const n3 = 4;

  const segments = random(2, 6);
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

    const middleX = currentX - xStepLength / 2;
    const middleY = currentY - yStepLength / 2;

    const xBump1 = random(-previousX * .3, previousX * .3);
    const xBump2 = random(-currentX * .3, currentX * .3);
    const yBump1 = random(-yStepLength * .3, yStepLength * .3);
    const yBump2 = random(-yStepLength * .3, yStepLength * .3);

    // const xBump1 = 0;
    // const xBump2 = 0;
    // const yBump1 = 0;
    // const yBump2 = 0;

    if (hasTeeth) {
      const remaining = (controlPoints.length - index) / controlPoints.length;
      const maxToothX = middleX * 3;
      const toothX = random(middleX, maxToothX);
      // const toothX = middleX;

      const maxToothYOffset = middleY * .5 * ((toothX - middleX) / maxToothX) * remaining;
      const toothY = middleY + random(-maxToothYOffset, maxToothYOffset);
      // const toothY = middleY;

      // roundness of the tip
      // the bigger maxToothYOffset is, the smaller this can be become. Should not be above 0
      const maxToothYBump = maxToothYOffset * 1.5;
      const toothYBump = random(-maxToothYBump, 0);
      // const toothYBump = 0;

      // inclination of the blade
      // bigger number make the blade rounder, small make it dig in
      const maxToothXBump = toothX * (1 - (toothX / maxToothX));
      const toothXBump = random(-maxToothXBump, maxToothXBump);
      // const toothXBump = 0;

      leftHand.push(bezier(previousX, previousY, toothX, toothY, xBump1, yBump1, toothXBump, toothYBump));
      leftHand.push(bezier(toothX, toothY, currentX, currentY, -toothXBump, -toothYBump, xBump2, yBump2));

      rightHand.push(bezier(-previousX, previousY, -toothX, toothY, -xBump1, yBump1, -toothXBump, toothYBump));
      rightHand.push(bezier(-toothX, toothY, -currentX, currentY, toothXBump, -toothYBump, -xBump2, yBump2));
    }
    else {
      leftHand.push(bezier(previousX, previousY, currentX, currentY, xBump1, yBump1, xBump2, yBump2));
      rightHand.push(bezier(-previousX, previousY, -currentX, currentY, -xBump1, yBump1, -xBump2, yBump2));
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
  y: 20,
  length: 350,
  width: 150,
  hasTeeth: true
})
