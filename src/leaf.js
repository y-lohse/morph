import SVG from "svg.js";
import random from "lodash/random";
import scene from "./init";
import bezier from "./bezier";

const drawLeaf = ({ x, y, length }) => {
  const top = y + length;
  // const xOffset = random(length * .2, length);
  // const yOffset = random(-length * .8, length * .8);
  const xOffset = 80;
  const yOffset = 20;

  const halfTop = y + length / 2;
  const halfX = xOffset * .4;

  const gradient = scene.gradient('linear', function(stop) {
    stop.at(0, '#66C071')
    stop.at(.5, '#259A6A')
    stop.at(.1, '#146B54')
    stop.at(1, '#1E8762')
  })

  scene
    .path(`
      M ${x} ${y}
      ${bezier(x, y, halfX, halfTop, xOffset, yOffset)}
      ${bezier(x, halfTop, x, top, xOffset, yOffset)}
      ${bezier(x, top, -halfX, halfTop, -xOffset, yOffset)}
      ${bezier(-halfX, halfTop, x, y, -xOffset, yOffset)}
    `)
    // .stroke({ color: "#0E5C22", width: 1, linecap: "round" })
    .fill(gradient);
};

drawLeaf({
  x: 0,
  y: 20,
  length: 300
});
