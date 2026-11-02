export function rubberband(overshoot: number, dimension: number, constant = 0.55) {
  return (overshoot * dimension * constant) / (dimension + constant * Math.abs(overshoot));
}

/** Apple's exponential-decay projection from Designing Fluid Interfaces. Velocity is px/s. */
export function project(initialVelocity: number, decelerationRate = 0.998) {
  return (initialVelocity / 1000) * (decelerationRate / (1 - decelerationRate));
}

export function nearestSnap(projected: number, points: number[]) {
  return points.reduce((best, point) =>
    Math.abs(point - projected) < Math.abs(best - projected) ? point : best,
  );
}
