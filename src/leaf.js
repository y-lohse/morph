import SVG from "svg.js";
import random from "lodash/random";
import Color from "color";
import BezierEasing from "bezier-easing";
import scene from "./init";
import bezier from "./bezier";
import superformula from "./superformula";

const drawLeaf = ({ x, y, length, width, hasTeeth = false }) => {
  const leftHand = [];
  const rightHand = [];

  // const a = random(1, 20);
  // const b = random(1, 20);
  // const m = 2;
  // const n1 = random(2, 30);
  // const n2 = random(4, 40);
  // const n3 = 4;
  const a = 1;
  const b = 1;
  const m = 2;
  const n1 = 2;
  const n2 = 4;
  const n3 = 4;

  // const segments = random(2, 6);
  const segments = 4;
  const phi = Math.PI / segments;
  const controlPoints = [];

  for(let i = 0; i <= segments; i++) {
    const { x, y } = superformula(phi*i, a, b, m, m, n1, n2, n3);
    controlPoints.push(y); // pushing y, that we will use as x later, because superformula assumes a normal cartesian coordinate system, and we draw bottom to top
  }

  const largestPoint = Math.max(...controlPoints);
  const scaleFactor = (width / 2) / largestPoint;

  const yStepLength = length / (controlPoints.length - 1);

  // how far sidewyas the toth can spread
  // if the random is inside the loop, we can end up with very different sizes of leaves, an they look like planes
  const maxToothXMultiplier = 3;
  // const toothXMultiplier = random(1, maxToothXMultiplier, true);
  const toothXMultiplier = 2;

  // how far worward the tooth can point
  // all tooth points in the same direction is probably safer
  const maxToothYMultiplier = .5;
  // const toothYMultiplier = random(-maxToothYMultiplier, maxToothYMultiplier);
  const toothYMultiplier = 0;

  // tooth roundness, probably best to keep it uniform accross teeth
  const maxToothRoudness = yStepLength / 2;
  // const toothRoundness = random(-maxToothRoudness, 0);
  const toothRoundness = 0;

  // inclination of the blade, negative make them point forward, positive backward. Values to high make the leaf grow too large
  // the randomness can be changed at each step, it looks cool
  // const bladeAngleMultiplier = random(-.5, .5);
  const bladeAngleMultiplier = 0;

  controlPoints.forEach((controlPoint, index) => {
    if (index === 0) return;

    const currentY = Math.round(index * yStepLength + y);
    const previousY = Math.round(currentY - yStepLength + y);

    const previousX = Math.round(controlPoints[index - 1] * scaleFactor + x);
    const currentX = Math.round(controlPoints[index] * scaleFactor + x);

    const xStepLength = currentX - previousX;

    // const xBump1 = random(-previousX * .3, previousX * .3);
    // const xBump2 = random(-currentX * .3, currentX * .3);
    // const yBump1 = random(-yStepLength * .3, yStepLength * .3);
    // const yBump2 = random(-yStepLength * .3, yStepLength * .3);

    const xBump1 = 0;
    const xBump2 = 0;
    const yBump1 = 0;
    const yBump2 = 0;

    if (hasTeeth) {
      const percentage = (index + 1) / controlPoints.length;
      const middleX = currentX - xStepLength / 2;
      const middleY = currentY - yStepLength / 2;

      const toothX = middleX * toothXMultiplier;

      //we only allow bit Y tootth dispalcement for big X tooth
      // 1 if the tooth is big, 0 if it's non existant
      const toothreduction = (toothX - middleX) / ((middleX * maxToothXMultiplier) - middleX);
      // the further foraward we go, the smaller the tooth. We don't want them to go in front of the leaf tip
      const advancementreduction = Math.max(1 - BezierEasing(1, 0, 1, .6)(percentage), .3);

      const toothY = middleY * (1 + toothYMultiplier * toothreduction * advancementreduction);//TODO: decomposer ce calcul pour faie le random a l'exterieur de la boucle

      const toothXBump = toothX * bladeAngleMultiplier;

      leftHand.push(bezier(previousX, previousY, toothX, toothY, xBump1, yBump1, toothXBump, toothRoundness));
      leftHand.push(bezier(toothX, toothY, currentX, currentY, -toothXBump, -toothRoundness, xBump2, yBump2));

      rightHand.push(bezier(-previousX, previousY, -toothX, toothY, -xBump1, yBump1, -toothXBump, toothRoundness));
      rightHand.push(bezier(-toothX, toothY, -currentX, currentY, toothXBump, -toothRoundness, -xBump2, yBump2));
    }
    else {
      leftHand.push(bezier(previousX, previousY, currentX, currentY, xBump1, yBump1, xBump2, yBump2));
      rightHand.push(bezier(-previousX, previousY, -currentX, currentY, -xBump1, yBump1, -xBump2, yBump2));
    }
  });

  const palette = ['#289B61', '#1C5438', '#71BC98', '#56A37E', '#EAC041', '#F9BB00', '#82453E', '#5A464C'];
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
  .fill(gradient).skew(0, 15).rotate(-10);
};

drawLeaf({
  x: 0,
  y: 20,
  // length: random(150, 400),
  length: 200,
  // width: random(50, 200),
  width: 200,
  hasTeeth: false
})
