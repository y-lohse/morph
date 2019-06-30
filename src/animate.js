import SVG from "svg.js";
import "svg.pathmorphing.js";
import scene from "./init";
import bezier from "./bezier";

const startX = 0;
const startY = 0;
const width = 140;
const height = 240;

const path1 = `
  M ${startX} ${startY}
  L ${startX + width} ${startY + height / 2}
  L ${startX} ${startY + height}
  L ${startX - width} ${startY + height / 2}
  L ${startX} ${startY}
`

const path2 = `
  M ${startX} ${startY}
  L ${startX + width / 2} ${startY + height / 2}
  L ${startX} ${startY + height}
  L ${startX - width / 2} ${startY + height / 2}
  L ${startX} ${startY}
`

const path = scene
.path(path2)
.fill('#cc0000')

path.animate().plot(path1)
