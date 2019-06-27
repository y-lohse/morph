import SVG from "svg.js";
import random from "lodash/random";
import Color from "color";
import scene from "./init";
import bezier from "./bezier";

const drawLeaf = ({ x, y, length, width }) => {
  // const segments = random(1, 5);
  // const xOffset = random(width * .2, width);
  // const yOffset = random(-yStep * .8, yStep * .8);
  // const xInnerOffset = random(width * .1, width);
  const segments = 1;
  const xOffset = 250;
  const yOffset = 0;
  const xInnerOffset = 80;

  const yStep = length / segments;
  const top = y + length;

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

  const palette = ['#289B61', '#1C5438', '#71BC98', '#56A37E', '#EAC041', '#F9BB00', '#82453E', '#7C3B78', '#46B1C9', '#5A464C'];
  const baseColor = Color(palette[random(0, palette.length - 1)]);
  const light = baseColor.lighten(.2)
  const dark = baseColor.darken(.2)

  const gradient = scene.gradient('linear', function(stop) {
    stop.at(0, light.hex())
    stop.at(.5, light.desaturate(.3).hex())
    stop.at(.51, dark.hex())
    stop.at(1, dark.saturate(.3).hex())
  });

  const gradient2 = scene.gradient('linear');
  gradient2.at(0, '#ffffff', 0);

  const stepSize = 1;
  const stepDistance = 10;

  for (let i = stepDistance; i < 100; i+=stepDistance){
    gradient2.at((i - stepSize) / 100, '#ffffff', 0);
    gradient2.at(i / 100, '#000', .15);
    gradient2.at((i + stepSize) / 100, '#ffffff', 0);
  }
  
  gradient2.at(1, '#ffffff', 0);

  gradient2.from(0, 0).to(0, 1);

  scene
    .path(`
      M ${x} ${y}
      ${path.join(' ')}
      M ${x} ${y}
      ${path2.join(' ')}
    `)
    .fill(gradient);

  scene
    .path(`
      M ${x} ${y}
      ${path.join(' ')}
      M ${x} ${y}
      ${path2.join(' ')}
    `)
    .fill(gradient2);
};

drawLeaf({
  x: 0,
  y: 0,
  length: 400,
  width: 200,
});
