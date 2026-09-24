import { createCampRenderer } from "./campRenderer.js";
import { createRenderer } from "./renderer.js";
import { CREATURE_ROAR_START, CREATURE_ROAR_DURATION } from "./cinematic.mjs";

const WIDTH = 360;
const HEIGHT = 600;
const DURATION = 18;
const unit = (value) => Math.max(0, Math.min(1, value));
const smooth = (value) => {
  const progress = unit(value);
  return progress * progress * (3 - 2 * progress);
};

function polygon(context, color, points) {
  context.fillStyle = color;
  context.beginPath();
  points.forEach(([x, y], index) => {
    if (index === 0) context.moveTo(Math.round(x), Math.round(y));
    else context.lineTo(Math.round(x), Math.round(y));
  });
  context.closePath();
  context.fill();
}

function passingTrees(context, cameraX, progress) {
  // These trunks belong to the space between the camp and the adjoining path.
  // Their different speeds create depth while masking the panorama's join.
  context.save();
  context.globalAlpha = smooth(Math.min(progress / 0.07, (1 - progress) / 0.07));
  const seam = WIDTH - cameraX;
  polygon(context, "#071321", [
    [seam - 24, -10], [seam + 25, -10], [seam + 19, 92], [seam + 31, 187],
    [seam + 24, 320], [seam + 34, 458], [seam + 49, 600],
    [seam - 48, 600], [seam - 31, 435], [seam - 29, 271], [seam - 33, 122],
  ]);
  polygon(context, "#102430", [
    [seam - 25, 0], [seam - 13, 0], [seam - 18, 133], [seam - 14, 286],
    [seam - 13, 431], [seam - 24, 594], [seam - 37, 600], [seam - 24, 422],
  ]);
  polygon(context, "#081623", [
    [seam - 23, 127], [seam - 66, 92], [seam - 83, 54], [seam - 75, 49],
    [seam - 54, 81], [seam - 17, 101],
  ]);
  polygon(context, "#081623", [
    [seam + 12, 227], [seam + 64, 181], [seam + 76, 142], [seam + 86, 137],
    [seam + 76, 190], [seam + 25, 250],
  ]);
  const near = 514 - cameraX * 1.6;
  polygon(context, "#040e19", [
    [near - 18, -10], [near + 11, -10], [near + 17, 145], [near + 8, 299],
    [near + 21, 451], [near + 36, 600], [near - 28, 600], [near - 22, 405],
    [near - 28, 209],
  ]);
  polygon(context, "#0b1b27", [
    [near - 19, 0], [near - 13, 0], [near - 18, 209], [near - 12, 381],
    [near - 17, 579], [near - 22, 573], [near - 18, 389], [near - 24, 208],
  ]);
  context.restore();
}

/**
 * A spatial 18-second transition driven entirely by state.cinematic.elapsed.
 * Use the same visualTime here and in renderer.syncClock at the combat handoff.
 */
export function createCinematicRenderer(canvas) {
  canvas.width = WIDTH;
  canvas.height = HEIGHT;
  const context = canvas.getContext("2d", { alpha: false });
  if (!context) throw new Error("Cinematic canvas is unavailable");
  const campCanvas = canvas.ownerDocument.createElement("canvas");
  const battleCanvas = canvas.ownerDocument.createElement("canvas");
  let campRenderer;
  let battleRenderer;
  try {
    campRenderer = createCampRenderer(campCanvas);
    battleRenderer = createRenderer(battleCanvas);
  } catch (error) {
    campRenderer?.destroy();
    battleRenderer?.destroy();
    campCanvas.width = 0;
    battleCanvas.width = 0;
    throw error;
  }
  let destroyed = false;

  return {
    render(state, visualTime = 0, reducedMotion = false) {
      if (destroyed) return;
      const elapsed = Number.isFinite(state.cinematic?.elapsed) ? Math.max(0, Math.min(DURATION, state.cinematic.elapsed)) : 0;
      const time = Number.isFinite(visualTime) ? visualTime : 0;
      const pan = smooth((elapsed - 8) / 4);
      context.setTransform(1, 0, 0, 1, 0, 0);
      context.globalAlpha = 1;
      context.imageSmoothingEnabled = false;

      if (elapsed < 12) campRenderer.render(state, time, reducedMotion);
      if (elapsed <= 8) {
        context.drawImage(campCanvas, 0, 0);
        return;
      }

      const approach = smooth((elapsed - 14) / 2.5);
      const reveal = smooth((elapsed - 14) / 0.8);
      const eyes = smooth((elapsed - 13) / 0.45) * (1 - smooth((elapsed - 14) / 0.65));
      const roarTime = elapsed - CREATURE_ROAR_START;
      const roarAmount = smooth(roarTime / .18) * (1 - smooth((roarTime - CREATURE_ROAR_DURATION + .45) / .45));
      // No combat animation can leak into this directed establishing shot.
      const pose = {
        ...state,
        status: "ready", turn: "player", phase: "idle", phaseTime: 0,
        block: false, attackTimer: 0, dodgeTimer: 0, hurtTimer: 0,
        enemyHurtTimer: 0, parryTimer: 0, restTimer: 0, roarAmount,
      };
      battleRenderer.renderCinematic(pose, time, reducedMotion, {
        monsterProgress: approach,
        monsterVisibility: reveal,
        eyesVisibility: eyes,
        weaponProgress: smooth((elapsed - 16) / 2),
      });

      if (elapsed >= 12) {
        // At 18s this is precisely the standard battle renderer's idle frame:
        // same background, monster, saved outfit, weapons, motes and clock.
        context.drawImage(battleCanvas, 0, 0);
      } else if (reducedMotion) {
        // A single gentle, stationary transition replaces the long camera pan.
        // Eira still completes her readable actions before the view changes.
        const blend = smooth((elapsed - 9.6) / 1.2);
        context.drawImage(campCanvas, 0, 0);
        if (blend > 0) {
          context.globalAlpha = blend;
          context.drawImage(battleCanvas, 0, 0);
          context.globalAlpha = 1;
        }
      } else {
        const cameraX = Math.round(pan * WIDTH);
        context.drawImage(campCanvas, -cameraX, 0);
        context.drawImage(battleCanvas, WIDTH - cameraX, 0);
        passingTrees(context, cameraX, pan);
      }
    },
    destroy() {
      if (destroyed) return;
      destroyed = true;
      campRenderer.destroy();
      battleRenderer.destroy();
      campCanvas.width = 0;
      battleCanvas.width = 0;
    },
  };
}
