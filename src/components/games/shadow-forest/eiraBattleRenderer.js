import { createEiraLayers, limb, articulatedArm, animatedHand, drawEiraSword, drawEiraScabbard } from './campRenderer.js';
import { eiraElbow } from './eiraSword.mjs';

const clamp = value => Math.max(0, Math.min(1, value));
const smooth = value => { const p = clamp(value); return p * p * (3 - 2 * p); };
const mix = (a, b, p) => a.map((v, i) => v + (b[i] - v) * p);
const polygon = (c, color, points) => { c.fillStyle = color; c.beginPath(); points.forEach(([x, y], i) => i ? c.lineTo(Math.round(x), Math.round(y)) : c.moveTo(Math.round(x), Math.round(y))); c.closePath(); c.fill(); };

/** One rigid sword stays attached to the same hand throughout preparation and contact. */
export function getEiraBattlePose(state, time = 0, reducedMotion = false) {
  const p = smooth((state.phaseTime || 0) / (state.phaseDuration || 1));
  let grip = [237, 146], angle = -.78, thrust = 0, windup = 0;
  if (state.turn === 'eira') {
    if (state.phase === 'windup') { grip = mix(grip, [212, 114], p); angle += (-2.25 - angle) * p; windup = p; }
    if (state.phase === 'strike') { grip = mix([212, 114], [249, 157], p); angle = -2.25 + 2.2 * p; thrust = p; windup = 1 - p; }
    if (state.phase === 'recover' && state.strikeResolved) { grip = mix([249, 157], grip, p); angle = -.05 + (angle + .05) * p; thrust = 1 - p; }
  }
  return { grip, angle, thrust, windup, breathe: reducedMotion ? 0 : Math.sin(time * 1.8) * .8 };
}

export function getEiraSwordContact(state, time, reducedMotion, projection) {
  if (!projection?.eira) return null;
  const pose = getEiraBattlePose(state, time, reducedMotion);
  const lean = pose.thrust * .065;
  const x = pose.grip[0] + Math.cos(pose.angle) * 70 + pose.thrust * 8 - 195;
  const y = pose.grip[1] + pose.breathe + Math.sin(pose.angle) * 70 - 290;
  return {
    x: projection.eira.x + (x * Math.cos(lean) - y * Math.sin(lean)) * projection.eira.scale,
    y: projection.eira.y + (x * Math.sin(lean) + y * Math.cos(lean)) * projection.eira.scale,
  };
}

function legs(c, stride, thrust, down) {
  const cloth = { shadow: '#343c36', base: '#5c5544', light: '#807054' };
  const boot = { shadow: '#3b3129', base: '#614833', light: '#a17b4c' };
  const hips = [[176, 174 + down * 38], [198, 174 + down * 38]];
  const knees = [[173 - stride * 7, 225 + down * 40], [216 + thrust * 8 + stride * 7, 225 + down * 48]];
  const ankles = [[162 - stride * 10, 279 - Math.max(0, stride) * 8], [234 + thrust * 10 + stride * 10, 279 - Math.max(0, -stride) * 8]];
  for (const i of [0, 1]) {
    limb(c, hips[i], knees[i], 10, 7, cloth); limb(c, knees[i], ankles[i], 7, 5, cloth);
    const top = mix(knees[i], ankles[i], .48); limb(c, top, ankles[i], 7, 6, boot);
    const [x, y] = ankles[i]; const side = i ? 1 : -1;
    polygon(c, '#101c24', [[x - 8, y - 4], [x + 6, y - 4], [x + 9 + side * 4, y + 5], [x + 9 + side * 4, y + 11], [x - 10 + side * 4, y + 11], [x - 9, y + 5]]);
    polygon(c, boot.base, [[x - 5, y - 2], [x + 4, y - 2], [x + 6 + side * 4, y + 5], [x + 6 + side * 4, y + 8], [x - 7 + side * 4, y + 8], [x - 6, y + 4]]);
    c.fillStyle = boot.light; c.fillRect(Math.round(x - 4), Math.round(y + 4), 9, 2);
  }
  polygon(c, '#514532', [[165, 169 + down * 38], [203, 169 + down * 38], [207, 187 + down * 38], [194, 191 + down * 38], [184, 183 + down * 38], [175, 191 + down * 38], [160, 184 + down * 38]]);
}

export function createEiraBattleRenderer(ownerDocument) {
  const layers = createEiraLayers(ownerDocument, ['cape', 'torso', 'collar', 'profile']);
  return {
    draw(context, state, time, reducedMotion, view, projection, down = 0) {
      if (!projection.eira || view.intro <= 0) return;
      const at = projection.eira;
      const pose = getEiraBattlePose(state, time, reducedMotion);
      const moving = view.eiraStage?.moving || view.movingActor === 'eira';
      const progress = view.eiraStage?.moving ? view.eiraStage.progress : view.moveProgress;
      const envelope = moving ? Math.sin(progress * Math.PI) : 0;
      const stride = (moving ? Math.sin(progress * Math.PI * 4) * envelope * (view.eiraStage?.direction || 1) * (reducedMotion ? .4 : 1) : 0)
        + (reducedMotion ? 0 : Math.sin(time * 1.2) * .13) * (1 - envelope);
      const block = view.eiraBlock || 0, dodge = view.eiraDodge || 0;
      const hurt = Math.min(1, (state.eiraHurtTimer || 0) / .3);
      const lean = pose.thrust * .065 - dodge * .09 + down * .14 - hurt * (reducedMotion ? .015 : .065);
      const bodyY = -61 + down * 38 + pose.breathe;
      let grip = pose.grip, angle = pose.angle;
      grip = mix(grip, [229, 149], block); angle += (-1.28 - angle) * block;
      grip = mix(grip, [230, 220], down); angle += (.95 - angle) * down;
      context.save();
      context.translate(at.x, at.y);
      context.scale(at.scale, at.scale);
      context.translate(-195, -290);
      polygon(context, '#092638', [[148, 288], [166, 282], [232, 282], [252, 289], [235, 296], [163, 296]]);
      context.translate(195, 290); context.rotate(lean); context.translate(-195, -290);
      context.translate(pose.thrust * 8, -dodge * (reducedMotion ? 0 : 5));
      context.save(); context.translate(0, 174 + bodyY); context.scale(.94, 1.42 - down * .18); context.translate(10, -174); context.drawImage(layers.cape, 0, 0); context.restore();
      legs(context, stride * (1 - down), pose.thrust, down);
      context.drawImage(layers.torso, 0, Math.round(bodyY));
      context.drawImage(layers.collar, 0, Math.round(bodyY));
      context.save(); context.translate(0, bodyY); drawEiraScabbard(context); context.restore();
      const shoulder = [214, 199 + bodyY];
      const wrist = [grip[0], grip[1] + pose.breathe];
      const leftWrist = mix([189, 163 + down * 65], [220, 156], block);
      articulatedArm(context, [155, 196 + bodyY], eiraElbow([155, 196 + bodyY], leftWrist, -1), leftWrist, block > .8);
      articulatedArm(context, shoulder, eiraElbow(shoulder, wrist), wrist, true);
      context.drawImage(layers.profile, 2, Math.round(bodyY - 1));
      drawEiraSword(context, { grip: wrist, angle });
      animatedHand(context, wrist, true);
      if (block > .8) animatedHand(context, leftWrist, true);
      context.restore();
    },
    destroy() { Object.values(layers).forEach(layer => { layer.width = 0; }); },
  };
}
