/**
 * Eye shapes. Every shape is built from the same animated parts as the original round eye (white,
 * iris + pupil that follow the gaze, sliding upper lid, lash line, drowsy lid, closed and happy
 * curves), so blinks, glances and moods work the same on all of them.
 * Shapes are drawn for the right eye (outer corner at +x); the left eye is mirrored.
 */
import type { FacePalette } from './colors';
import type { FaceSpec } from './faces';

export type EyeShape = 'round' | 'big' | 'almond' | 'cat' | 'button';
export const EYE_SHAPES: readonly EyeShape[] = ['round', 'big', 'almond', 'cat', 'button'];

interface ShapeDef {
  /** the eye white (path), or null for bead eyes without a white */
  white: string | null;
  /** the area the iris may move in and the lid is clipped to (defaults to the white) */
  clip?: string;
  /** half the eye's width: sizes the closed / happy curves */
  w: number;
  /** iris size relative to the round eye */
  iris: number;
  pupil: 'round' | 'slit' | 'bead';
  /** the lash line along the top */
  lash: string;
  /** how far the upper lid always rests down (0..1) */
  hood: number;
  /** a soft lower-lid line */
  under?: string;
  /** lash line width (eyeliner) */
  liner?: number;
  /** lid travel relative to the round eye (shorter shapes close with less travel) */
  lk?: number;
}

const ellipse = (rx: number, ry: number): string =>
  `M0 ${-ry} C${(rx * 0.56).toFixed(1)} ${-ry} ${rx} ${(-ry * 0.56).toFixed(1)} ${rx} 0 C${rx} ${(ry * 0.56).toFixed(1)} ${(rx * 0.56).toFixed(1)} ${ry} 0 ${ry} C${(-rx * 0.56).toFixed(1)} ${ry} ${-rx} ${(ry * 0.56).toFixed(1)} ${-rx} 0 C${-rx} ${(-ry * 0.56).toFixed(1)} ${(-rx * 0.56).toFixed(1)} ${-ry} 0 ${-ry} Z`;
const ALMOND = 'M-12.6 3 C-10 -3.6 -4.4 -7.8 2.6 -7.8 C8.6 -7.8 12.8 -4.6 14.2 -1.6 C11.6 4.2 6 6.8 0 6.8 C-5.6 6.8 -10.2 5.4 -12.6 3 Z';
const CAT = 'M-12.4 4.4 C-10.6 -4.4 -4.4 -10.6 3 -10.6 C9.4 -10.6 13.8 -6.8 15.6 -4.4 C13.6 3.6 7.4 9.4 0 9.4 C-5.8 9.4 -10.4 7.4 -12.4 4.4 Z';

const DEFS: Record<Exclude<EyeShape, 'round'>, ShapeDef> = {
  big: { white: ellipse(13.4, 15.6), w: 13.4, iris: 1.42, pupil: 'round', lash: 'M-14.4 -5.6 Q0 -20.2 14.4 -5.6', hood: 0, liner: 2.6, lk: 1.2 },
  almond: { white: ALMOND, w: 12.8, iris: 0.86, pupil: 'round', lash: 'M-12.8 2.6 C-10 -4.4 -4.4 -8.8 2.6 -8.8 C8.8 -8.8 13.2 -5.4 14.6 -2 L17.6 -5.4', hood: 0, liner: 2.6, lk: 0.62 },
  cat: { white: CAT, w: 13.4, iris: 1.3, pupil: 'slit', lash: 'M-12.8 4 C-11 -5.2 -4.6 -11.6 3 -11.6 C9.8 -11.6 14.4 -7.6 16.2 -5 L19.6 -9.4', hood: 0, liner: 3, lk: 0.8 },
  button: { white: null, clip: ellipse(9, 11.4), w: 7, iris: 1, pupil: 'bead', lash: '', hood: 0 },
};

const shapeOf = (f: FaceSpec): ShapeDef | null => (f.eyes && f.eyes !== 'round' ? (DEFS[f.eyes] ?? null) : null);

/** mirror an absolute path (x, y pairs only) for the left eye */
const mirror = (d: string): string => d.replace(/(-?\d*\.?\d+) (-?\d*\.?\d+)/g, (_, x: string, y: string) => `${-Number(x)} ${y}`);

/** extra lid resting position for hooded shapes (0 = none) */
export const eyeHood = (f: FaceSpec): number => shapeOf(f)?.hood ?? 0;

/** clip paths for a shaped eye (right: e/l, left: f/n); '' for the round eye, which has its own */
export function eyeDefs(f: FaceSpec, uid: string): string {
  const S = shapeOf(f);
  if (!S) return '';
  const area = S.clip ?? S.white!;
  return `<clipPath id="${uid}x"><path d="${area}"/></clipPath><clipPath id="${uid}y"><path d="${area}" transform="scale(1.14)"/></clipPath><clipPath id="${uid}z"><path d="${mirror(area)}"/></clipPath><clipPath id="${uid}w"><path d="${mirror(area)}" transform="scale(1.14)"/></clipPath>`;
}

/** a shaped eye's markup, or null for the round eye (drawn by the face itself) */
export function eyeMarkup(f: FaceSpec, uid: string, C: FacePalette, cx: number, side: -1 | 1): string | null {
  const S = shapeOf(f);
  if (!S) return null;
  const m = (d: string) => (side < 0 ? mirror(d) : d);
  const clipE = side < 0 ? `${uid}z` : `${uid}x`;
  const clipL = side < 0 ? `${uid}w` : `${uid}y`;
  const lashes = !!f.lashes;
  const w = S.w;
  const k = S.iris;
  let iris: string;
  if (S.pupil === 'bead') {
    iris = `<ellipse class="pupil" cy="1" rx="5.8" ry="7.4" fill="#1A1210"/>
        <ellipse cy="4.8" rx="3.6" ry="2" fill="${f.iris}" opacity=".75"/>
        <circle cx="-2" cy="-2.6" r="2.3" fill="#fff"/>
        <circle cx="2.4" cy="2.2" r="1" fill="#fff" opacity=".8"/>`;
  } else {
    const pupil = S.pupil === 'slit' ? `<ellipse class="pupil" cy="1.5" rx="1.7" ry="5.6" fill="#1A1210"/>` : `<circle class="pupil" cy="1.5" r="4.2" fill="#1A1210"/>`;
    iris = `<g transform="scale(${k})">
        <circle cy="1.5" r="7.5" fill="${f.iris}"/>
        <circle cy="1.5" r="6.9" fill="none" stroke="#000" stroke-opacity=".22" stroke-width="1.3"/>
        <circle cy="3.6" r="4.6" fill="#fff" opacity=".12"/>
        ${pupil}
        <circle cx="-2.8" cy="-2.4" r="2.6" fill="#fff"/>
        <circle cx="3" cy="4" r="1.2" fill="#fff" opacity=".8"/>
        ${f.eyes === 'big' ? '<circle cx="2.6" cy="-3.4" r="1.3" fill="#fff" opacity=".9"/>' : ''}
      </g>`;
  }
  const white = S.white ? `<path d="${m(S.white)}" fill="#fff"/>\n      <ellipse cy="-7" rx="${w}" ry="6" fill="#E8E2EE" opacity=".55"/>` : '';
  const flicks = lashes
    ? `<path d="M${side * (w + 1.5)} -9 L${side * (w + 5.5)} -14 M${side * (w - 3.5)} -12.5 L${side * (w - 1.5)} -18.5" stroke="${C.line}" stroke-width="2.2" stroke-linecap="round" fill="none"/>`
    : '';
  const under = S.under ? `<path d="${S.under}" stroke="${C.line}" stroke-width="1.4" stroke-linecap="round" fill="none" opacity=".35"/>` : '';
  return `<g class="eye" data-cx="${cx}"${S.lk ? ` data-lk="${S.lk}"` : ''}>
  <g class="open">
    <g clip-path="url(#${clipE})">
      ${white}
      <g class="iris">
        ${iris}
      </g>
    </g>
    ${under}
    <g clip-path="url(#${clipL})"><path class="lid" d="M-16 -36 H16 V-4.5 Q0 -16 -16 -4.5 Z" fill="${C.face}"/></g>
    <g class="lash">
      ${S.lash ? `<path d="${m(S.lash)}" stroke="${C.line}" stroke-width="${lashes ? 3.2 : (S.liner ?? 2)}" stroke-linecap="round" stroke-linejoin="round" fill="none"/>` : ''}
      ${flicks}
    </g>
    <g clip-path="url(#${clipL})"><g class="dlid"><rect x="-16" y="-34" width="32" height="34" fill="${C.drowsy}"/><path d="M${-w - 1} 0 H${w + 1}" stroke="${C.line}" stroke-width="2.2" stroke-linecap="round"/></g></g>
  </g>
  <path class="closed" d="M${-w} 2.5 Q0 9.5 ${w} 2.5" stroke="${C.line}" stroke-width="3" stroke-linecap="round" fill="none" opacity="0"/>
  <path class="happy" d="M${-w} 3 Q0 -10 ${w} 3" stroke="${C.line}" stroke-width="3.4" stroke-linecap="round" fill="none" opacity="0"/>
</g>`;
}
