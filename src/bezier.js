const quadraticBezier = (previousX, previousY, destinationX, destinationY, offsetX = 0, offsetY = 0) => {
  const straightX = previousX + ((destinationX - previousX) / 2);
  const straightY = previousY + ((destinationY - previousY) / 2);

  return `Q ${straightX + offsetX} ${straightY + offsetY} ${destinationX} ${destinationY}`;
}

const cubicBezier = (previousX, previousY, destinationX, destinationY, offsetX = 0, offsetY = 0) => {
  const straightX = previousX + ((destinationX - previousX) / 2);
  const straightY = previousY + ((destinationY - previousY) / 2);

  return `C ${straightX + offsetX} ${straightY + offsetY} ${straightX + offsetX} ${straightY + offsetY} ${destinationX} ${destinationY}`;
}

export default cubicBezier;
