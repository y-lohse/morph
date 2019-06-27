const bezier = (x1, y1, x2, y2, offsetX = 0, offsetY = 0) => {
  return `Q ${x1 + ((x2 - x1) / 2) + offsetX} ${y1 + ((y2 - y1) / 2) + offsetY} ${x2} ${y2}`;
}

export default bezier;
