const quadraticBezier = (startX, startY, destinationX, destinationY, offsetX = 0, offsetY = 0) => {
  const straightX = startX + ((destinationX - startX) / 2);
  const straightY = startY + ((destinationY - startY) / 2);

  return `Q ${straightX + offsetX} ${straightY + offsetY} ${destinationX} ${destinationY}`;
}

const cubicBezier = (startX, startY, destinationX, destinationY, cx1 = 0, cy1 = 0, cx2 = 0, cy2 = 0) => {
  return `C ${startX + cx1} ${startY + cy1} ${destinationX + cx2} ${destinationY + cy2} ${destinationX} ${destinationY}`;
}

export default cubicBezier;
