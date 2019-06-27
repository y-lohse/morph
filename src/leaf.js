import SVG from "svg.js";
import random from "lodash/random";
import Color from "color";
import scene from "./init";
import bezier from "./bezier";

const drawLeaf = ({ x, y, length, width }) => {
  const segments = random(1, 5);
  const yStep = length / segments;
  const top = y + length;
  const xOffset = random(width * .2, width);
  const yOffset = random(-yStep * .8, yStep * .8);
  const xInnerOffset = random(width * .1, width);
  // const xOffset = 150;
  // const yOffset = 0;
  // const xInnerOffset = 80;

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

  const palette = [
    ['#289B61', '#1C5438'],
    ['#71BC98', '#56A37E'],
    ['#66C071', '#146B54'],
    ['#EAC041', '#F9BB00'],
    ['#82453E', '#82453E'],
  ];
  const colors = palette[random(0, palette.length - 1)];
  const light = Color(colors[0]);
  const dark = Color(colors[1]);

  const gradient = scene.gradient('linear', function(stop) {
    stop.at(0, light.hex())
    stop.at(.5, light.desaturate(random(.2, .4)).rotate(random(4, 17)).hex())
    stop.at(.51, dark.hex())
    stop.at(1, dark.lighten(random(.2, .5)).hex())
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
  y: 0,
  length: 400,
  width: 200,
});
