import SVG from "svg.js";
import random from "lodash/random";
import Color from "color";
import scene from "./init";
import bezier from "./bezier";

function getSuperformulaPoint(phi, a, b, y, z, n1, n2, n3) {
    var point = {};

    var r;
    var t1, t2;
    var radius;

    t1 = Math.cos(y* phi / 4) / a;
    t1 = Math.abs(t1);
    t1 = Math.pow(t1, n2);

    t2 = Math.sin(z * phi / 4) / b;
    t2 = Math.abs(t2);
    t2 = Math.pow(t2, n3);

    r = Math.pow(t1 + t2, 1 / n1);

    if(Math.abs(r) == 0) {
        point.x = 0;
        point.y = 0;
    } else {
        r = 1 / r;
        point.x = r * Math.cos(phi);
        point.y = r * Math.sin(phi);
    }

    return point;
}

const draw = ({ cx, cy, radius }) => {
  var resolution = 800;
  var phi = (Math.PI*2) / resolution;
  const path = [];

  const a = 1;
  const b = 1;
  const y = 5;
  const z = 5; // keep y and z equal for more normal results
  const n1 = 3;
  const n2 = 1;
  const n3 = 1;

  console.log({ a, b });

  for(var i=0; i<=resolution; i++) {
    path.push(getSuperformulaPoint(phi*i, a, b, y, z, n1, n2, n3));
  }

  const maxOffset = path.reduce((largest, point) => {
    var radius = Math.sqrt(point.x * point.x + point.y * point.y);
    return radius > largest ? radius : largest;
  }, 0);

  console.log(maxOffset);

  const beziers = path.map(({ x, y }) => `L ${cx + (y / maxOffset * radius)} ${cy + (-x / maxOffset * radius)}`);

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
    M ${cx} ${cy}
    ${beziers.join(' ')}
  `)
  .fill(gradient);
}


const drawLeaf = ({ x, y, length, width }) => {
  // const segments = random(1, 5);
  // const xOffset = random(width * .2, width);
  // const yOffset = random(-yStep * .8, yStep * .8);
  const segments = 2;
  const xOffset = 250;
  const yOffset = 0;

  const yStep = length / segments;

  const leftHand = [];
  const rightHand = [];

  const sinusoidal = x => Math.sin(3.14 * x);

  for (let i = 0; i < segments; i++) {
    const percent = (i + 1) / segments;
    const widthMultiplier = sinusoidal(percent);
    const stepWidth = Math.round(width * widthMultiplier);

    const previousPercent = i / segments;
    const previousMultiplier = sinusoidal(previousPercent);
    const previousStepWidth = Math.round(width * previousMultiplier);

    const startY = y + yStep * i;
    const endY = startY + yStep;

    leftHand.push(bezier(previousStepWidth, startY, stepWidth, endY, xOffset, yOffset, i === 0))
    rightHand.push(bezier(-previousStepWidth, startY, -stepWidth, endY, -xOffset, yOffset, i === 0))
  }

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

draw({
  cx: 0,
  cy: 250,
  radius: 100
});
