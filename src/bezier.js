const cubicBezier = (
  startX,
  startY,
  destinationX,
  destinationY,
  cx1 = 0,
  cy1 = 0,
  cx2 = 0,
  cy2 = 0
) => {
  return {
    cx1: startX + cx1,
    cy1: startY + cy1,
    cx2: destinationX + cx2,
    cy2: destinationY + cy2,
    x: destinationX,
    y: destinationY
  };
};

export default cubicBezier;
