import SVG from "svg.js";
import random from "lodash/random";
import scene from "./init";
import bezier from "./bezier";

const drawLeaf = ({ x, y, length, width }) => {
  const segments = random(1, 5);
  const yStep = length / segments;
  const top = y + length;
  const xOffset = random(length * .2, length);
  const yOffset = random(-yStep * .8, yStep * .8);
  const xInnerOffset = random(width * .1, width - xOffset);
  // const xOffset = 80;
  // const yOffset = 0;


  const path = [];
  const path2 = [];

  for (let i = 0; i < segments; i++) {
    const s = (i + 1) / segments;
    const xOffsetMultiplier = Math.sin(3.14 * s);
    const xOff = Math.round(xInnerOffset * xOffsetMultiplier);

    const yStep = length / segments;
    const xStep = 30;
    const startY = y + yStep * i;
    const endY = startY + yStep;

    path.push(bezier(x, startY, x + xOff, endY, xOffset, yOffset))
    path2.push(bezier(x, startY, x - xOff, endY, -xOffset, yOffset))
  }

  const gradient = scene.gradient('linear', function(stop) {
    stop.at(0, '#66C071')
    stop.at(.5, '#259A6A')
    stop.at(.1, '#146B54')
    stop.at(1, '#1E8762')
  });

  scene
    .path(`
      M ${x} ${y}
      ${path.join(' ')}
      M ${x} ${y}
      ${path2.join(' ')}
    `)
    .fill(gradient);
};

drawLeaf({
  x: 0,
  y: 20,
  length: 300,
  width: 200,
});
