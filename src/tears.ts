/**
 * Tears for the crying face (😭): two flat, even-width blue bands that run straight down from under the
 * closed eyes to the bottom edge of the face (cut off by the head outline). Built only the first time a
 * face cries, and inserted under the eyes and the mouth so the eyelid arcs sit on top of the bands' tops
 * and the mouth is never covered. `pour` (0..1) grows the bands from the eyes downwards.
 */

/** the y the bands pour from (just under the top of the closed-eye arc) */
export const TEAR_TOP = 69;

const ALIEN_HEAD = 'M70 14 Q125 14 123 58 Q121 96 93 115 Q70 128 47 115 Q19 96 17 58 Q15 14 70 14 Z';

export function tearsMarkup(uid: string, alien = false): string {
  // the left band (x0..x1, under the left eye); the right one is mirrored. Kept clear of the mouth.
  const [x0, x1] = alien ? [36, 51] : [45.5, 57];
  const r = 3.5;
  const top = TEAR_TOP;
  const band = `M${x0} 140 V${top + r} Q${x0} ${top} ${x0 + r} ${top} H${x1 - r} Q${x1} ${top} ${x1} ${top + r} V140`;
  const one = `<path d="${band} Z" fill="#5AA9F2"/><path d="${band}" fill="none" stroke="#3F8FE3" stroke-width="1"/>`;
  const head = alien ? `<path d="${ALIEN_HEAD}"/>` : `<circle cx="70" cy="72" r="54"/>`;
  return `<g class="tears" display="none">
  <defs><clipPath id="${uid}th">${head}</clipPath></defs>
  <g clip-path="url(#${uid}th)">
    <g class="tpour">${one}<g transform="matrix(-1 0 0 1 140 0)">${one}</g></g>
  </g>
</g>`;
}
