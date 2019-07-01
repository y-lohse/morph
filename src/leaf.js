import SVG from "svg.js";
import "svg.pathmorphing.js";
import random from "lodash/random";
import Color from "color";
import BezierEasing from "bezier-easing";
import scene from "./init";
import bezier from "./bezier";
import superformula from "./superformula";

const maxToothXMultiplier = 3;
const maxToothYMultiplier = .5;

const getLeafParams = (useRandom) => {
  if (useRandom) {
    const length = random(150, 400);
    const width = random(50, 200);

    const segments = random(2, 6);

    const a = random(1, 20);
    const b = random(1, 20);
    const m = 2;
    const n1 = random(2, 30);
    const n2 = random(4, 40);
    const n3 = 4;

    // how far sidewyas the toth can spread
    // if the random is inside the loop, we can end up with very different sizes of leaves, an they look like planes
    const toothXMultiplier = random(1, maxToothXMultiplier, true);

    // how far worward the tooth can point
    // all tooth points in the same direction is probably safer
    const toothYMultiplier = random(-maxToothYMultiplier, maxToothYMultiplier);

    // tooth roundness, probably best to keep it uniform accross teeth
    const toothRoundnessMultiplier = -random(0, .5);

    // inclination of the blade, negative make them point forward, positive backward. Values to high make the leaf grow too large
    // the randomness can be changed at each step, it looks cool
    const bladeAngleMultiplier = random(-.5, .5);

    return {
      a,
      b,
      m,
      n1,
      n2,
      n3,
      toothXMultiplier,
      toothYMultiplier,
      toothRoundnessMultiplier,
      bladeAngleMultiplier,
      length,
      width,
      segments
    }
  } else {
    const a = 1;
    const b = 1;
    const m = 2;
    const n1 = 2;
    const n2 = 4;
    const n3 = 4;

    const toothXMultiplier = 2;
    const toothYMultiplier = 0;
    const toothRoundnessMultiplier = 0;
    const bladeAngleMultiplier = 0;

    const length = 300;
    const width = 150;
    const segments = 2;

    return {
      a,
      b,
      m,
      n1,
      n2,
      n3,
      toothXMultiplier,
      toothYMultiplier,
      toothRoundnessMultiplier,
      bladeAngleMultiplier,
      length,
      width,
      segments
    }
  }
}

const drawLeaf = ({ x, y, t, hasTeeth, params }) => {
   const { a, b, m, n1, n2, n3, toothXMultiplier, toothYMultiplier, toothRoundnessMultiplier, bladeAngleMultiplier, length, width, segments } = params;

   const currentLength = Math.ceil(length * BezierEasing(0.23, 0.16, 0.89, 0.12)(t));
   const currentWidth = Math.ceil(width * BezierEasing(0.53, 0.02, 0.91, 0.50)(t));

  const leftHand = [];
  const rightHand = [];

  const minSegments = 2;
  const extraSegments = segments - minSegments;
  const currentSegments = 2 + Math.round(extraSegments * t);
  console.log({segments, currentSegments});
  const phi = Math.PI / currentSegments;
  const controlPoints = [];

  for(let i = 0; i <= currentSegments; i++) {
    const { x, y } = superformula(phi*i, a, b, m, m, n1, n2, n3);
    controlPoints.push(y); // pushing y, that we will use as x later, because superformula assumes a normal cartesian coordinate system, and we draw bottom to top
  }

  const largestPoint = Math.max(...controlPoints);
  const scaleFactor = (currentWidth / 2) / largestPoint;

  const yStepLength = currentLength / (controlPoints.length - 1);

  controlPoints.forEach((controlPoint, index) => {
    if (index === 0) return;

    const currentY = Math.round(index * yStepLength + y);
    const previousY = Math.round(currentY - yStepLength);//no +y on purpose, creates non straight bezier

    const previousX = Math.round(controlPoints[index - 1] * scaleFactor + x);
    const currentX = Math.round(controlPoints[index] * scaleFactor + x);

    const xStepLength = currentX - previousX;

    const controlPoint1X = random(-previousX * .3, previousX * .3);
    const controlPoint2X = random(-currentX * .3, currentX * .3);
    const controlPoint1Y = random(-yStepLength * .3, yStepLength * .3);
    const controlPoint2Y = random(-yStepLength * .3, yStepLength * .3);

    // const controlPoint1X = 0;
    // const controlPoint2X = 0;
    // const controlPoint1Y = 0;
    // const controlPoint2Y = 0;

    if (hasTeeth) {
      const percentage = (index + 1) / controlPoints.length;
      const middleX = currentX - xStepLength / 2;
      const middleY = currentY - yStepLength / 2;

      const toothX = middleX * toothXMultiplier;

      //we only allow bit Y tooth displacement for big X tooth
      // 1 if the tooth is big, 0 if it's non existant
      const toothReduction = (toothX - middleX) / ((middleX * maxToothXMultiplier) - middleX);
      // the further foraward we go, the smaller the tooth. We don't want them to go in front of the leaf tip
      const advancementReduction = Math.max(1 - BezierEasing(1, 0, 1, .6)(percentage), .3);

      const toothY = middleY * (1 + toothYMultiplier * toothReduction * advancementReduction);//TODO: decomposer ce calcul pour faie le random a l'exterieur de la boucle

      const toothXBump = toothX * bladeAngleMultiplier;
      const toothRoundness = yStepLength * toothRoundnessMultiplier;

      leftHand.push(bezier(previousX, previousY, toothX, toothY, controlPoint1X, controlPoint1Y, toothXBump, toothRoundness));
      leftHand.push(bezier(toothX, toothY, currentX, currentY, -toothXBump, -toothRoundness, controlPoint2X, controlPoint2Y));

      rightHand.push(bezier(-previousX, previousY, -toothX, toothY, -controlPoint1X, controlPoint1Y, -toothXBump, toothRoundness));
      rightHand.push(bezier(-toothX, toothY, -currentX, currentY, toothXBump, -toothRoundness, -controlPoint2X, controlPoint2Y));
    }
    else {
      leftHand.push(bezier(previousX, previousY, currentX, currentY, controlPoint1X, controlPoint1Y, controlPoint2X, controlPoint2Y));
      rightHand.push(bezier(-previousX, previousY, -currentX, currentY, -controlPoint1X, controlPoint1Y, -controlPoint2X, controlPoint2Y));
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

  return {path: `
    M ${x} ${y}
    ${leftHand.join(' ')}
    M ${x} ${y}
    ${rightHand.join(' ')}
  `, gradient}
};

const params = getLeafParams(true)

const next = (t) => {
  const { path, gradient } = drawLeaf({
    x: 0,
    y: 20,
    hasTeeth: false,
    params,
    t
  });

  shape
  .animate(200)
  .plot(path)
  .fill(gradient)
  .after((stch) => {
    if (t < 1) next(t + .05);
  })
};

const shape = scene.path();
next(.05);
