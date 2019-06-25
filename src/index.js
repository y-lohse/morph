import "./styles.css";
import SVG from "svg.js";
import random from "lodash/random";

const scene = SVG("app").size(300, 300);
var group = scene.group();
group.x(150);
group.y(300);
group.rotate(180);

const drawBranch = (startX, startY, len, branchWidth, angle) => {
  group
    .path(
      `M ${startX} ${startY} Q ${startX + random(-8, 8)} ${startY +
        len * random(0.1, 0.9)} ${startX} ${startY + len}`
    )
    .stroke({ color: "#0E5C22", width: branchWidth, linecap: "round" })
    .fill({ color: "#0E5C22", opacity: 0.2 })// makes some shaodws
    .rotate(angle, startX, startY);

  if (len < 15) return;

  const theta = (angle * Math.PI) / 180;
  const endX = startX - len * 0.95 * Math.sin(theta);
  const endY = startY + len * 0.95 * Math.cos(theta);

  drawBranch(
    endX,
    endY,
    len * 0.8,
    branchWidth * 0.7,
    angle * 1.3 + random(-8, -25)
  );
  drawBranch(
    endX,
    endY,
    len * 0.8,
    branchWidth * 0.7,
    angle * 1.3 + random(8, 25)
  );
};

drawBranch(0, 10, 70, 12, 0);
