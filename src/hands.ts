/**
 * Floating hands (no arms): two hands that pop in next to the head for a gesture and pop out again.
 * Four hand shapes (open palm, thumb-up fist, flat hand seen from the side, plain fist) are drawn once
 * per face and posed by a transform per frame; nothing exists in the DOM until a face first gestures.
 *
 * Hand shapes are drawn as the viewer's right hand, wrist at (0, 0), fingers up (negative y).
 */
import type { Expr } from './avatars';

export type Gesture = 'thumbsUp' | 'thumbsDown' | 'rub' | 'clap' | 'wave' | 'shrug' | 'facepalm' | 'chin' | 'mewing';
export const GESTURES: readonly Gesture[] = ['thumbsUp', 'thumbsDown', 'rub', 'clap', 'wave', 'shrug', 'facepalm', 'chin', 'mewing'];

/** hand shapes, by index */
export const enum H {
  PALM,
  THUMB,
  MITT,
  FIST,
  /** thumb-down fist seen from the front */
  DOWN,
  /** open hand seen from the back */
  BACK,
  /** thinking hand: index along the chin, thumb up */
  THINK,
  /** shush hand: a fist with the index finger straight up */
  SHH,
}
/** a finger: a tapered tube with a round tip, from its base (x, y) pointing up, turned a degrees */
const tube = (x: number, y: number, a: number, len: number, w0: number, w1: number) => {
  const r = w1 / 2;
  return `<path transform="translate(${x} ${y}) rotate(${a})" d="M${-w0 / 2} 2L${-r} ${r - len}A${r} ${r} 0 0 1 ${r} ${r - len}L${w0 / 2} 2Z"/>`;
};
/** a nail hint at the tip of a tube */
const nail = (x: number, y: number, a: number, len: number, w: number) =>
  `<rect transform="translate(${x} ${y}) rotate(${a})" x="${-w / 2}" y="${1.6 - len}" width="${w}" height="${w * 1.25}" rx="${w / 2.4}" fill="#fff" opacity=".34"/>`;
// open hand (🖐): a rounded palm, four long fingers fanned out, a slimmer thumb out to the side
const OPEN =
  `<path d="M-7 2.4 C-12.6 1 -14.8 -6 -14.2 -15 L-13.6 -24 L13.4 -24 C15 -13 13.4 -3 7 2.4 C4 3.6 -4 3.6 -7 2.4 Z"/>` +
  tube(-10, -21.5, -19, 22.5, 7.4, 6.6) +
  tube(-3.4, -23, -6, 26, 7.4, 6.6) +
  tube(3.5, -23, 7, 24.5, 7.4, 6.6) +
  tube(10, -21, 22, 19.5, 7, 6) +
  tube(-10.5, -7, -48, 17.5, 11, 7);
const SHAPES = [
  OPEN,
  // thumb up (👍): the back of the hand on the left, four curled fingers stacked on the right, a slim thumb
  `<path d="M-13.5 -8 L-13.4 -20 L-5 -25.4 L6 -25.4 L6 1.6 L-4 1.6 C-10 1.6 -13.2 -2.4 -13.5 -8 Z"/>
<path d="M-13.4 -14 C-13.8 -23 -13 -30.6 -11.6 -37.4 C-10.4 -43.4 -3.8 -43.6 -3.6 -37.6 C-3.4 -33 -4 -28.6 -1 -24.6 L-1 -14 Z"/>
<rect x="-2" y="-25.6" width="17" height="7.2" rx="3.5"/>
<rect x="-2" y="-18.8" width="17.5" height="6.8" rx="3.4"/>
<rect x="-2" y="-12.4" width="16.6" height="6.6" rx="3.3"/>
<rect x="-2" y="-6.1" width="15" height="6.4" rx="3.2"/>`,
  // flat hand from the side (🙏 one hand): a slim blade, palm towards +x, the thumb lying in front
  `<path d="M-13.4 -6 C-14 -13 -13.8 -20 -12.6 -26 C-11.8 -31 -11.2 -36 -10.6 -40.6 C-9.6 -47 -1.6 -47 -1.4 -40.4 C-1.2 -34 -0.8 -28 -0.4 -22 C0.8 -14 0.6 -6 -1 -1 C-2 1.8 -4 2.4 -7 2.4 C-11 2.4 -13 0 -13.4 -6 Z"/>` +
    tube(-2.4, -5, 20, 17, 9, 6.4),
  // fist (✊): four folded fingers on top, the thumb across the front below them
  `<path d="M-13.6 -22 L13.6 -22 C14.4 -12 13 -3 8.5 1 C6 3 -6 3 -8.5 1 C-13 -3 -14.4 -12 -13.6 -22 Z"/>
<rect x="-13.8" y="-31" width="7" height="18" rx="3.5"/>
<rect x="-6.9" y="-33" width="7" height="20" rx="3.5"/>
<rect x="0" y="-32.4" width="7" height="20" rx="3.5"/>
<rect x="6.9" y="-30" width="6.9" height="18" rx="3.4"/>
<rect x="-16" y="-13.6" width="22" height="8.6" rx="4.3" transform="rotate(-9 -5 -9)"/>`,
  // thumb down (👎): a fist seen from the front, the four folded fingers stacked, the thumb pointing down
  `<path d="M-13.8 -24 C-13.8 -30 -10 -33 -5 -33 L5 -33 L5 -0.6 L-6 -0.6 C-11 -0.6 -13.8 -4 -13.8 -10 Z"/>
<rect x="-12" y="-33.6" width="22.5" height="8.2" rx="4.1" transform="rotate(-8 -12 -29.5)"/>
<rect x="-12" y="-25.6" width="26.2" height="8.2" rx="4.1" transform="rotate(-3 -12 -21.5)"/>
<rect x="-12" y="-17.4" width="27.2" height="8.2" rx="4.1" transform="rotate(2 -12 -13.3)"/>
<rect x="-12" y="-9.1" width="25" height="8.2" rx="4.1" transform="rotate(7 -12 -5)"/>` + tube(-5.6, -3, 177, 22, 12, 8),
  // the open hand again, seen from the back
  OPEN,
  // thinking hand (🤔): index finger pointing along the chin, thumb up, the other fingers curled below
  `<path d="M-13.4 -8 C-14 -15 -13.6 -20 -12 -24 L7 -24 L8 2 L-5 2 C-10.4 2 -13 -2 -13.4 -8 Z"/>
<rect x="-1" y="-16.4" width="14.8" height="6.8" rx="3.4"/>
<rect x="-1" y="-10" width="13.6" height="6.4" rx="3.2"/>
<rect x="-1" y="-4" width="12" height="6.2" rx="3.1"/>` +
    tube(-7.6, -20, -7, 21, 10.4, 7.4) +
    tube(-3, -19.6, 79, 31, 8.4, 6.8),
  // shush hand (🤫): a fist with the index finger straight up, the thumb folded across the curled fingers
  `<path d="M-12.6 -8 C-13.2 -15 -12.6 -20 -11 -23 L10 -22 C13.4 -16 13 -6 9 0 C6 2.6 -5 2.6 -8.5 1 C-11.4 -1 -12.4 -4 -12.6 -8 Z"/>
<rect x="-2.4" y="-27" width="6.2" height="13" rx="3.1"/>
<rect x="3.4" y="-25.6" width="6" height="13" rx="3"/>
<rect x="9" y="-23.2" width="5.4" height="12" rx="2.7"/>` + tube(-6.6, -20, 0, 27, 8.8, 7.2),
];
/** creases and shine on top of each shape (L = crease colour) */
const DETAILS = [
  `<path d="M-4 -21 C-1.4 -16 -1.2 -9 -4.6 -3.4" stroke="L" stroke-width="1.2" stroke-linecap="round" fill="none" opacity=".3"/>
<ellipse cx="5" cy="-12" rx="5" ry="6.5" fill="#fff" opacity=".16"/>`,
  `<path d="M4 -18.7 H13.6 M4 -12.3 H13.6 M4 -6 H12.4" stroke="L" stroke-width="1.2" stroke-linecap="round" opacity=".5"/>
<path d="M-1 -21 C0.6 -15 0.4 -7 -1.4 -1.6" stroke="L" stroke-width="1.2" stroke-linecap="round" fill="none" opacity=".3"/>
<path d="M-10.4 -25 C-10.2 -29.6 -9.6 -34 -8.6 -37.4" stroke="#fff" stroke-width="1.8" stroke-linecap="round" fill="none" opacity=".3"/>`,
  `<path d="M-6.4 -7 L-0.7 -19.1" stroke="L" stroke-width="1.2" stroke-linecap="round" opacity=".42"/>
<path d="M-8.6 -39 C-10 -31 -11.2 -22 -11 -12" fill="none" stroke="#fff" stroke-width="1.8" stroke-linecap="round" opacity=".28"/>`,
  `<path d="M-6.9 -29 V-16 M0 -29.6 V-16.4 M6.9 -28.6 V-16.8" stroke="L" stroke-width="1.2" stroke-linecap="round" opacity=".42"/>
<path d="M-12.6 -13.6 H1.7 A4.3 4.3 0 0 1 1.7 -5 H-11" stroke="L" stroke-width="1.3" stroke-linecap="round" fill="none" opacity=".45" transform="rotate(-9 -5 -9)"/>
<ellipse cx="-4" cy="-10.6" rx="6" ry="1.3" fill="#fff" opacity=".22" transform="rotate(-9 -5 -9)"/>`,
  `<g stroke="R" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"><path d="M8 -25.4 H-7.9 A4.1 4.1 0 0 1 -7.9 -33.6" transform="rotate(-8 -12 -29.5)"/><path d="M8 -17.4 H-7.9 A4.1 4.1 0 0 1 -7.9 -25.6" transform="rotate(-3 -12 -21.5)"/><path d="M8 -9.2 H-7.9 A4.1 4.1 0 0 1 -7.9 -17.4" transform="rotate(2 -12 -13.3)"/><path d="M7 -0.9 H-7.9 A4.1 4.1 0 0 1 -7.9 -9.1" transform="rotate(7 -12 -5)"/></g>`,
  nail(-10, -21.5, -19, 22.5, 3.8) +
    nail(-3.4, -23, -6, 26, 3.8) +
    nail(3.5, -23, 7, 24.5, 3.8) +
    nail(10, -21, 22, 19.5, 3.4) +
    `<path d="M-10.6 -24.6 L-9.4 -21.4 M-3.8 -26 L-3.4 -22.6 M3.2 -26 L2.8 -22.6 M9.4 -24 L8.2 -21" stroke="L" stroke-width="1.2" stroke-linecap="round" opacity=".32"/>
<ellipse cx="-3" cy="-11" rx="6.5" ry="5" fill="#fff" opacity=".13"/>`,
  `<path d="M3.6 -9.8 H12 M3.6 -3.8 H10.8" stroke="L" stroke-width="1.2" stroke-linecap="round" opacity=".45"/>
<path d="M2 -15.6 C6 -15 10 -15.4 14 -16.4" stroke="L" stroke-width="1.2" stroke-linecap="round" fill="none" opacity=".4"/>
<path d="M1.4 -14 C2.6 -9 2.4 -4 1 0" stroke="L" stroke-width="1.2" stroke-linecap="round" fill="none" opacity=".3"/>
<path d="M-10.4 -24 L-11.6 -35" stroke="#fff" stroke-width="1.8" stroke-linecap="round" opacity=".3"/>`,
  `<g stroke="R" stroke-width="2" stroke-linecap="round" fill="none"><path d="M-2.3 -25 V-15.4 M3.6 -23.6 V-15.6 M9.2 -21.6 V-15"/><path d="M-11.6 -12.9 H2.4 A3.7 3.7 0 0 1 2.4 -5.5 H-10.6" transform="rotate(-20 -4 -9)"/></g>`,
];

export interface HandColors {
  fill: string;
  /** the shadow side */
  shade: string;
  rim: string;
  line: string;
}
export const GLOVES: HandColors = { fill: '#FFFFFF', shade: '#DDE0E8', rim: '#9EA3B2', line: '#8E94A3' };

/** the hands' markup (two slots, every shape in each, all hidden) */
export function handsMarkup(uid: string, c: HandColors): string {
  const defs = SHAPES.map((s, i) => `<g id="${uid}h${i}">${s}</g>`).join('');
  const slot = SHAPES.map(
    (_, i) =>
      `<g class="hp" display="none"><use href="#${uid}h${i}" fill="${c.rim}" stroke="${c.rim}" stroke-width="5" stroke-linejoin="round"/><use href="#${uid}h${i}" fill="${c.shade}"/><use href="#${uid}h${i}" fill="${c.fill}" transform="translate(-1.1 -1.3)"/>${DETAILS[i].replace(/"L"/g, `"${c.line}"`).replace(/"R"/g, `"${c.rim}"`)}</g>`,
  ).join('');
  return `<g class="hands" display="none"><defs>${defs}</defs><g class="hand">${slot}</g><g class="hand">${slot}</g></g>`;
}

/** one hand's pose: shape (-1 = hidden), wrist position (face units), rotation (deg), scale, mirrored */
export interface HandPose {
  shape: number;
  x: number;
  y: number;
  rot: number;
  s: number;
  flip: boolean;
}
export const handPose = (): HandPose => ({ shape: -1, x: 0, y: 0, rot: 0, s: 1, flip: false });

interface GestureDef {
  /** seconds */
  dur: number;
  /** the face's mood while it plays (null = keep the current one) */
  mood: Expr | null;
  /** the moment that best shows the gesture (static faces, reduced motion) */
  hold: number;
  /** pose both hands at time t (seconds); osc = motion amount (0 = hold still) */
  pose(t: number, osc: number, L: HandPose, R: HandPose): void;
}

const set = (p: HandPose, shape: number, x: number, y: number, rot: number, flip = false, s = 1) => {
  p.shape = shape;
  p.x = x;
  p.y = y;
  p.rot = rot;
  p.flip = flip;
  p.s = s;
};
const sin = Math.sin;
const RAD = Math.PI / 180;
const smooth = (u: number) => {
  const v = u < 0 ? 0 : u > 1 ? 1 : u;
  return v * v * (3 - 2 * v);
};

export const GESTURE_DEFS: Record<Gesture, GestureDef> = {
  thumbsUp: {
    dur: 1.7,
    mood: 'happy',
    hold: 0.6,
    pose(t, o, L, R) {
      L.shape = -1;
      set(R, H.THUMB, 14, 132, 8 + o * 7 * sin(t * 9) * (t < 0.7 ? 1 : 0.25), false, 1.2);
    },
  },
  thumbsDown: {
    dur: 1.7,
    mood: 'meh',
    hold: 0.6,
    pose(t, o, L, R) {
      L.shape = -1;
      set(R, H.DOWN, 13, 113, o * 6 * sin(t * 8) * (t < 0.7 ? 1 : 0.25), false, 1.12);
    },
  },
  rub: {
    dur: 1.9,
    mood: 'smug',
    hold: 0.5,
    pose(t, o, L, R) {
      const v = o * 2.6 * sin(t * 15);
      set(L, H.MITT, 70.6, 158 + v, 5 + v * 0.8, false, 1.05);
      set(R, H.MITT, 69.4, 158 - v, -5 + v * 0.8, true, 1.05);
    },
  },
  clap: {
    dur: 1.8,
    mood: 'happy',
    hold: 0.4,
    pose(t, o, L, R) {
      const gap = o * 6 * (0.5 + 0.5 * Math.cos(t * Math.PI * 2 * 2.4)) + (1 - o) * 2;
      set(L, H.MITT, 68 - gap * 1.6, 158, 10 + gap * 0.6, false, 1.05);
      set(R, H.MITT, 72 + gap * 1.6, 158, -10 - gap * 0.6, true, 1.05);
    },
  },
  wave: {
    dur: 1.7,
    mood: 'happy',
    hold: 0.5,
    pose(t, o, L, R) {
      L.shape = -1;
      set(R, H.PALM, 10, 116, -14 - o * 17 * sin(t * 10), true, 1.2);
    },
  },
  shrug: {
    dur: 1.7,
    mood: 'meh',
    hold: 0.7,
    pose(t, o, L, R) {
      const up = 5 * sin(Math.min(1, t / 0.45) * Math.PI * 0.5) + o * 0.8 * sin(t * 5);
      set(L, H.PALM, 12, 124 - up, -64, true, 1.15);
      set(R, H.PALM, 128, 124 - up, 64, false, 1.15);
    },
  },
  facepalm: {
    dur: 1.9,
    mood: 'hurt',
    hold: 0.8,
    pose(t, o, L, R) {
      const v = o * 1.2 * sin(t * 6);
      set(L, H.BACK, 44, 108 + v, 5, false, 1.04);
      set(R, H.BACK, 96, 108 + v, -5, true, 1.04);
    },
  },
  chin: {
    dur: 2.4,
    mood: 'thinking',
    hold: 0.8,
    pose(t, o, L, R) {
      L.shape = -1;
      set(R, H.THINK, 38, 138 + o * 1.3 * sin(t * 8), -3, false, 1.15);
    },
  },
  mewing: {
    dur: 2.9,
    mood: 'mew',
    hold: 1.9,
    pose(t, o, L, R) {
      L.shape = -1;
      const s = 1.1;
      // shh: the index finger upright over the lips, pressing a little
      const press = o * sin(t * 9) * (t < 0.9 ? 1 : 0);
      const ax = 60;
      const ay = 139 - press * 0.8;
      const ar = 3 - press * 1.5;
      // jawline: after the shh the fingertip runs from the ear (viewer's left) down the jaw to the chin, lying along it
      const th = 70 - 58 * smooth((t - 1.15) / 1.2);
      const a = th * RAD;
      const br = th - 90;
      const co = Math.cos(br * RAD);
      const si = Math.sin(br * RAD);
      const lx = 6.6 * s; // the hand is mirrored: its fist hangs outside the jaw
      const ly = -40 * s;
      const bx = 70 - 50 * sin(a) - (co * lx - si * ly);
      const by = 68 + 50 * Math.cos(a) - (si * lx + co * ly);
      const k = smooth((t - 0.9) / 0.45);
      set(R, H.SHH, ax + (bx - ax) * k, ay + (by - ay) * k, ar + (br - ar) * k, true, s);
    },
  },
};

const backOut = (u: number) => {
  const c = 1.9;
  const v = u - 1;
  return 1 + (c + 1) * v * v * v + c * v * v;
};

/** pop in / pop out around a gesture: scale factor and how far below its pose the hand still is */
export function handEnvelope(t: number, dur: number): { s: number; drop: number } {
  if (t < 0.22) {
    const u = Math.max(0, t / 0.22);
    return { s: Math.max(0, backOut(u)), drop: (1 - u) * 10 };
  }
  const out = dur - 0.2;
  if (t > out) {
    const u = Math.min(1, (t - out) / 0.2);
    return { s: 1 - u * u, drop: u * 10 };
  }
  return { s: 1, drop: 0 };
}
