const smooth = (time, from, to) => {
  const t = Math.max(0, Math.min(1, (time - from) / (to - from)));
  return t * t * (3 - 2 * t);
};
const mix = (a, b, t) => a.map((value, index) => value + (b[index] - value) * t);

// All distances are in Eira's local pixels. The sword is a rigid prop;
// its inserted section is hidden by the opaque scabbard, never shortened.
export const EIRA_SWORD = Object.freeze({
  mouth: Object.freeze([174, 228]),
  sheathAngle: Math.atan2(.6, -.8),
  guard: 8,
  bladeBase: 11,
  bladeTip: 70,
  sheathLength: 66,
  extraction: 68,
  drawStart: 6.5,
  drawEnd: 7.15,
  turnStart: 7.22,
  guardTime: 7.9,
});

export function eiraSwordPose(elapsed) {
  const time = Number.isFinite(elapsed) ? elapsed : 0;
  const axis = [Math.cos(EIRA_SWORD.sheathAngle), Math.sin(EIRA_SWORD.sheathAngle)];
  const restingGrip = EIRA_SWORD.mouth.map((value, index) => value - axis[index] * EIRA_SWORD.guard);
  const pull = smooth(time, EIRA_SWORD.drawStart, EIRA_SWORD.drawEnd);
  const settle = smooth(time, EIRA_SWORD.turnStart, EIRA_SWORD.guardTime);
  const drawnGrip = restingGrip.map((value, index) => value - axis[index] * EIRA_SWORD.extraction * pull);
  return {
    grip: mix(drawnGrip, [248, 198], settle),
    angle: EIRA_SWORD.sheathAngle + (-.76 - EIRA_SWORD.sheathAngle) * settle,
    reach: smooth(time, 6.05, 6.45),
    support: smooth(time, 5.75, 6.35),
    release: smooth(time, 7.22, 7.82),
    pull,
    settle,
  };
}

// Two fixed-length bones bend toward a pole in front of the actor. Projecting
// the depth component lets a cross-body arm turn without a 2D elbow flip.
export function eiraElbow(shoulder, wrist, side = 1) {
  const upper = 31;
  const lower = 30;
  const delta = [wrist[0] - shoulder[0], wrist[1] - shoulder[1], -8];
  const rawDistance = Math.hypot(...delta);
  const distance = Math.max(1.01, Math.min(upper + lower - .01, rawDistance));
  const direction = delta.map(value => value / rawDistance);
  const along = (upper * upper - lower * lower + distance * distance) / (2 * distance);
  const height = Math.sqrt(Math.max(0, upper * upper - along * along));
  const pole = [side, .7, -1.5];
  const dot = pole.reduce((sum, value, index) => sum + value * direction[index], 0);
  const normal = pole.map((value, index) => value - dot * direction[index]);
  const length = Math.hypot(...normal);
  return shoulder.map((value, index) => value + direction[index] * along + normal[index] / length * height);
}
