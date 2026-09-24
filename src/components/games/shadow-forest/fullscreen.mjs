export const MOBILE_GAME_MEDIA = '(max-width: 700px), (max-width: 1024px) and (pointer: coarse)';

export function getFullscreenElement(doc) {
  return doc?.fullscreenElement || doc?.webkitFullscreenElement || null;
}

/** Invoke the native method before yielding so the click's user activation is
 * preserved. A denied request leaves the caller free to use its layout fallback. */
export async function enterFullscreen(element) {
  try {
    if (typeof element?.requestFullscreen === 'function') await element.requestFullscreen({ navigationUI: 'hide' });
    else if (typeof element?.webkitRequestFullscreen === 'function') await element.webkitRequestFullscreen();
    else return false;
    return true;
  } catch {
    return false;
  }
}

export async function leaveFullscreen(doc) {
  try {
    if (typeof doc?.exitFullscreen === 'function') await doc.exitFullscreen();
    else if (typeof doc?.webkitExitFullscreen === 'function') await doc.webkitExitFullscreen();
    else return false;
    return true;
  } catch {
    return false;
  }
}
