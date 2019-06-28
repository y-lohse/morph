const bezier = (previousX, previousY, destinationX, destinationY, offsetX = 0, offsetY = 0, first) => {
  const straightX = previousX + ((destinationX - previousX) / 2);
  const straightY = previousY + ((destinationY - previousY) / 2);

  if (first) return `Q ${straightX + offsetX} ${straightY + offsetY} ${destinationX} ${destinationY}`;
  else {
    console.log(destinationX);
    return `T ${destinationX} ${destinationY}`;
  }
}

export default bezier;
