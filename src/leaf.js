import SVG from "svg.js";
import "svg.pathmorphing.js";
import random from "lodash/random";
import Color from "color";
import BezierEasing from "bezier-easing";
import scene from "./init";
import bezier from "./bezier";
import project from "./project";
import superformula from "./superformula";

const maxToothXMultiplier = 3;
const maxToothYMultiplier = 0.5;

const getLeafParams = useRandom => {
  if (useRandom) {
    const length = random(150, 400);
    const width = random(50, 200);

    const segments = random(2, 6);
    // const segments = 500;

    const a = random(1, 20);
    const b = random(1, 20);
    const m = 2;
    const n1 = random(2, 30);
    const n2 = random(4, 40);
    const n3 = 4;

    // how far sidewyas the teeth can spread
    // if the random is inside the loop, we can end up with very different sizes of leaves, an they look like planes
    const toothXMultiplier = random(1, maxToothXMultiplier, true);

    // how far worward the tooth can point
    // all tooth points in the same direction is probably safer
    const toothYMultiplier = random(-maxToothYMultiplier, maxToothYMultiplier);

    // tooth roundness, probably best to keep it uniform accross teeth
    const toothRoundnessMultiplier = -random(0, 0.5);

    // inclination of the blade, negative make them point forward, positive backward. Values to high make the leaf grow too large
    // the randomness can be changed at each step, it looks cool
    const bladeAngleMultiplier = random(-0.5, 0.5);

    const rotX = random(-5, 5) / 1000; // turn left/right
    const rotY = random(-10, 10) / 10000; //turn top bottom
    const rotZ = random(-65, 65);

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
      segments,
      rotX,
      rotY,
      rotZ
    };
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

    const rotX = 0;
    const rotY = 0;
    const rotZ = 0;

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
      segments,
      rotX,
      rotY,
      rotZ
    };
  }
};

const drawLeaf = ({ x, y, t, hasTeeth, params }) => {
  const {
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
    segments,
    rotX,
    rotY
  } = params;

  const currentLength = Math.ceil(
    length * BezierEasing(0.23, 0.16, 0.89, 0.12)(t)
  );
  const currentWidth = Math.ceil(
    width * BezierEasing(0.53, 0.02, 0.91, 0.5)(t)
  );

  const leftHand = [];
  const rightHand = [];

  const minSegments = 2;
  const extraSegments = segments - minSegments;
  const currentSegments = 2 + Math.round(extraSegments * t);
  const phi = Math.PI / currentSegments;
  const controlPoints = [];

  for (let i = 0; i <= currentSegments; i++) {
    const { x, y } = superformula(phi * i, a, b, m, m, n1, n2, n3);
    controlPoints.push(y); // pushing y, that we will use as x later, because superformula assumes a normal cartesian coordinate system, and we draw bottom to top
  }

  const largestPoint = Math.max(...controlPoints);
  const scaleFactor = currentWidth / 2 / largestPoint;

  const yStepLength = currentLength / (controlPoints.length - 1);

  controlPoints.forEach((controlPoint, index) => {
    const currentY = Math.round(index * yStepLength + y);
    const previousY = Math.round(currentY - yStepLength); //no +y on purpose, creates non straight bezier

    const previousX = Math.round(
      (controlPoints[index - 1] || 0) * scaleFactor + x
    );
    const currentX = Math.round(controlPoints[index] * scaleFactor + x);

    const xStepLength = currentX - previousX;

    // const controlPoint1X = random(-previousX * 0.3, previousX * 0.3);
    // const controlPoint2X = random(-currentX * 0.3, currentX * 0.3);
    // const controlPoint1Y = random(-yStepLength * 0.3, yStepLength * 0.3);
    // const controlPoint2Y = random(-yStepLength * 0.3, yStepLength * 0.3);

    const controlPoint1X = 0;
    const controlPoint2X = 0;
    const controlPoint1Y = 0;
    const controlPoint2Y = 0;

    if (hasTeeth) {
      const percentage = (index + 1) / controlPoints.length;
      const middleX = currentX - xStepLength / 2;
      const middleY = currentY - yStepLength / 2;

      const toothX = middleX * toothXMultiplier;

      //we only allow bit Y tooth displacement for big X tooth
      // 1 if the tooth is big, 0 if it's non existant
      const toothReduction =
        (toothX - middleX) / (middleX * maxToothXMultiplier - middleX) || 0;
      // the further foraward we go, the smaller the tooth. We don't want them to go in front of the leaf tip
      const advancementReduction = Math.max(
        1 - BezierEasing(1, 0, 1, 0.6)(percentage),
        0.3
      );

      const toothY =
        middleY *
        (1 + toothYMultiplier * toothReduction * advancementReduction); //TODO: decomposer ce calcul pour faie le random a l'exterieur de la boucle

      const toothXBump = toothX * bladeAngleMultiplier;
      const toothRoundness = yStepLength * toothRoundnessMultiplier;

      // console.log({ toothReduction, toothX, middleX, maxToothXMultiplier });

      leftHand.push(
        bezier(
          previousX,
          previousY,
          toothX,
          toothY,
          controlPoint1X,
          controlPoint1Y,
          toothXBump,
          toothRoundness
        )
      );
      leftHand.push(
        bezier(
          toothX,
          toothY,
          currentX,
          currentY,
          -toothXBump,
          -toothRoundness,
          controlPoint2X,
          controlPoint2Y
        )
      );

      rightHand.push(
        bezier(
          -previousX,
          previousY,
          -toothX,
          toothY,
          -controlPoint1X,
          controlPoint1Y,
          -toothXBump,
          toothRoundness
        )
      );
      rightHand.push(
        bezier(
          -toothX,
          toothY,
          -currentX,
          currentY,
          toothXBump,
          -toothRoundness,
          -controlPoint2X,
          controlPoint2Y
        )
      );
    } else {
      leftHand.push(
        bezier(
          previousX,
          previousY,
          currentX,
          currentY,
          controlPoint1X,
          controlPoint1Y,
          controlPoint2X,
          controlPoint2Y
        )
      );
      rightHand.push(
        bezier(
          -previousX,
          previousY,
          -currentX,
          currentY,
          -controlPoint1X,
          controlPoint1Y,
          -controlPoint2X,
          controlPoint2Y
        )
      );
    }
  });

  const toSVGBezier = ({ cx1, cy1, cx2, cy2, x, y }) =>
    `C ${cx1} ${cy1} ${cx2} ${cy2} ${x} ${y}`;
  // project = (x, y, xy, cy, phiX, phiY, phiY)

  const rotZ = 0; // z rotation is applied at th end to keep the gradient drawing simple
  const centerX = x;
  const centerY = y + currentLength / 2;

  const doProjection = ({ cx1, cy1, cx2, cy2, x, y }) => {
    const cp1 = project(cx1, cy1, centerX, centerY, rotX, rotY, rotZ);
    const cp2 = project(cx2, cy2, centerX, centerY, rotX, rotY, rotZ);
    const p = project(x, y, centerX, centerY, rotX, rotY, rotZ);

    return {
      cx1: cp1.x,
      cy1: cp1.y,
      cx2: cp2.x,
      cy2: cp2.y,
      x: p.x,
      y: p.y
    };
  };

  const projectedLeftHand = leftHand.map(doProjection);
  const projectedRightHand = rightHand.map(doProjection);

  const palette = [
    "#289B61",
    "#1C5438",
    "#71BC98",
    "#56A37E",
    "#EAC041",
    "#F9BB00",
    "#82453E",
    "#5A464C"
  ];
  // const baseColor = Color(palette[random(0, palette.length - 1)]);
  const baseColor = Color(palette[0]);
  const light = baseColor.lighten(0.2);
  const dark = baseColor.darken(0.2);

  const leftMostPoint = [...projectedLeftHand, ...projectedRightHand].sort(
    (p1, p2) => p2.x - p1.x
  )[0];
  const rightMostPoint = [...projectedLeftHand, ...projectedRightHand].sort(
    (p1, p2) => p1.x - p2.x
  )[0];

  const xend = Math.abs(leftMostPoint.x) + Math.abs(rightMostPoint.x);
  const xcenter = Math.abs(leftMostPoint.x);
  const relativeXCenter = 1 - xcenter / xend;

  const originPoint = projectedLeftHand.shift();
  projectedRightHand.shift();

  const gradient = scene.gradient("linear", function(stop) {
    stop.at(0, light.hex());
    stop.at(relativeXCenter, light.desaturate(0.3).hex());
    stop.at(relativeXCenter + 0.001, dark.hex());
    stop.at(1, dark.saturate(0.3).hex());
  });

  gradient.from(0, 0.5).to(1, 0.5);

  return {
    path: `
    M ${originPoint.x} ${originPoint.y}
    ${projectedLeftHand.map(toSVGBezier).join(" ")}
    M ${originPoint.x} ${originPoint.y}
    ${projectedRightHand.map(toSVGBezier).join(" ")}
  `,
    gradient
  };
};

const params = getLeafParams(true);

const next = t => {
  const { path, gradient } = drawLeaf({
    x: 0,
    y: 20,
    hasTeeth: true,
    params,
    t
  });

  shape
    .animate(150)
    .plot(path)
    .rotate(params.rotZ)
    .fill(gradient)
    .after(stch => {
      if (t < 1) next(t + 0.05);
    });
};

const shape = scene.path();
next(0);
