const project = (x, y, cx, cy, phiX, phiY, phiZ) => {
  const cosa = Math.cos(phiZ);
  const sina = Math.sin(phiZ);

  const cosb = Math.cos(phiX);
  const sinb = Math.sin(phiX);

  const cosc = Math.cos(phiY);
  const sinc = Math.sin(phiY);

  const Axx = cosa * cosb;
  const Axy = cosa * sinb * sinc - sina * cosc;
  const Axz = cosa * sinb * cosc + sina * sinc;

  const Ayx = sina * cosb;
  const Ayy = sina * sinb * sinc + cosa * cosc;
  const Ayz = sina * sinb * cosc - cosa * sinc;

  const Azx = -sinb;
  const Azy = cosb * sinc;
  const Azz = cosb * cosc;

  const px = x - cx;
  const py = y - cy;
  const pz = 1;

  const rotatedX = Axx * px + Axy * py + Axz * pz;
  const rotatedY = Ayx * px + Ayy * py + Ayz * pz;
  const rotatedZ = Azx * px + Azy * py + Azz * pz;

  const d = 1;
  const r = d / rotatedZ;

  const nx = r * rotatedX + cx;
  const ny = r * rotatedY + cy;

  return { x: nx, y: ny };
};

export default project;
