const superforula = (phi, a, b, y, z, n1, n2, n3) => {
  let t1, t2;

  t1 = Math.cos(y * phi / 4) / a;
  t1 = Math.abs(t1);
  t1 = Math.pow(t1, n2);

  t2 = Math.sin(z * phi / 4) / b;
  t2 = Math.abs(t2);
  t2 = Math.pow(t2, n3);

  const r = Math.pow(t1 + t2, 1 / n1);

  if (Math.abs(r) === 0) {
    return { x: 0, y: 0 }
  } else {
      const ir = 1 / r;
      return {
        x: ir * Math.cos(phi),
        y: ir * Math.sin(phi)
      }
  }
}

export default superforula
