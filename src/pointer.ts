/**
 * Shared pointer tracking for "follow the cursor" eyes. One passive listener for the whole page,
 * added the first time something follows the pointer. Rects are read only after the pointer moved.
 */

let px = 0;
let py = 0;
let inside = false;
let seq = 0;
let listening = false;
const watchers = new Set<() => void>();

function onMove(e: PointerEvent): void {
  px = e.clientX;
  py = e.clientY;
  inside = true;
  seq++;
  for (const w of watchers) w();
}
function onLeave(e: PointerEvent): void {
  if (e.relatedTarget) return;
  inside = false;
  seq++;
  for (const w of watchers) w();
}

/** start tracking; `wake` runs on every pointer move (to restart a sleeping frame loop) */
export function watchPointer(wake: () => void): () => void {
  if (!listening && typeof window !== 'undefined') {
    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerdown', onMove, { passive: true });
    document.addEventListener('pointerout', onLeave, { passive: true });
    listening = true;
  }
  watchers.add(wake);
  return () => watchers.delete(wake);
}

/** pointer state: whether it is over the page, and a counter that changes on every move */
export const pointerSeq = (): number => seq;
export const pointerInside = (): boolean => inside;

/**
 * Direction from an element's centre to the pointer, -1..1 on each axis (full strength once the
 * pointer is about two face-widths away), written into out. False when the pointer is off the page.
 */
export function lookDir(el: Element, out: { x: number; y: number }): boolean {
  if (!inside) return false;
  const r = el.getBoundingClientRect();
  if (!r.width) return false;
  const dx = px - (r.left + r.width / 2);
  const dy = py - (r.top + r.height / 2);
  const len = Math.hypot(dx, dy) || 1;
  const k = Math.min(1, len / (r.width * 2));
  out.x = (dx / len) * k;
  out.y = (dy / len) * k;
  return true;
}
