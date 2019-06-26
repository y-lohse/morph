import SVG from "svg.js";

const width = 375;
const height = 500;
const draw = SVG("app").size(width, height);

const scene = draw.group();
scene.x(width / 2);
scene.y(height);
scene.rotate(180);

export default scene;
