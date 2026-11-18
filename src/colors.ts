/**
 * Face colours. A face's skin is one base colour; the shading (rim, inner glow, shine), the drowsy lid,
 * blush, freckles and the line colours (lashes, mouth, brows) are derived from it, so any colour
 * works. Faces without a `skin` use the original hand-picked colours exactly.
 */
import type { FaceSpec } from './faces';

/** the classic yellow and Papi Zorg's green */
export const DEFAULT_SKIN = '#FFCB3D';
export const DEFAULT_ALIEN_SKIN = '#6FD24F';

/** ready-made skin colours (any CSS hex colour works too) */
export const SKIN_TONES = {
  yellow: '#FFCB3D',
  light: '#F7DECE',
  mediumLight: '#F3D2A2',
  medium: '#D5AB88',
  mediumDark: '#AF7E57',
  dark: '#7C533E',
  green: '#7ED957',
  blue: '#6EC6FF',
  pink: '#FF9BC8',
  purple: '#B48CFF',
  orange: '#FF9F45',
} as const;
export type SkinToneId = keyof typeof SKIN_TONES;

/** ready-made eye (iris) colours */
export const EYE_COLORS = {
  blue: '#3F7FD9',
  green: '#2F9B63',
  brown: '#7A4A22',
  hazel: '#B8741F',
  amber: '#C98A1A',
  grey: '#6F8FB0',
  teal: '#1E9C9C',
  violet: '#5B3FA8',
  dark: '#2A1E18',
} as const;
export type EyeColorId = keyof typeof EYE_COLORS;

export interface FacePalette {
  /** main skin */
  face: string;
  /** the darker rim around the head */
  rim: string;
  /** inner edge glow */
  glow: string;
  /** big shine */
  shine: string;
  /** small shine */
  shine2: string;
  /** flat drowsy lid */
  drowsy: string;
  blush: string;
  freckles: string;
  /** lashes, closed-eye curves, the drowsy lid's edge */
  line: string;
  mouth: string;
  /** default brow colour (a FaceSpec's browColor wins) */
  brow: string;
}

export interface AlienPalette {
  face: string;
  rim: string;
  shine: string;
  blush: string;
  /** mouth and closed-eye curves */
  line: string;
}

const YELLOW: FacePalette = {
  face: DEFAULT_SKIN,
  rim: '#EE9D1C',
  glow: '#F2A21F',
  shine: '#FFE28A',
  shine2: '#FFF6D2',
  drowsy: '#F0B02A',
  blush: '#F5924E',
  freckles: '#D98A1E',
  line: '#3A2410',
  mouth: '#6B2E1A',
  brow: '#7A4A16',
};
const GREEN: AlienPalette = { face: DEFAULT_ALIEN_SKIN, rim: '#3E9E3A', shine: '#B6F28C', blush: '#2F9B63', line: '#1F5A22' };

// ───────── tiny colour maths (hex ⇄ HSL) ─────────

type HSL = [number, number, number];

function hexToHsl(hex: string): HSL | null {
  const m = /^#?([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(hex.trim());
  if (!m) return null;
  let h = m[1];
  if (h.length === 3) h = h.replace(/./g, (c) => c + c);
  const n = parseInt(h, 16);
  const r = ((n >> 16) & 255) / 255;
  const g = ((n >> 8) & 255) / 255;
  const b = (n & 255) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  let hue = 0;
  let s = 0;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    if (max === r) hue = (g - b) / d + (g < b ? 6 : 0);
    else if (max === g) hue = (b - r) / d + 2;
    else hue = (r - g) / d + 4;
    hue *= 60;
  }
  return [hue, s * 100, l * 100];
}

function hslToHex([h, s, l]: HSL): string {
  h = ((h % 360) + 360) % 360;
  s = Math.min(100, Math.max(0, s)) / 100;
  l = Math.min(100, Math.max(0, l)) / 100;
  const k = (n: number) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => l - a * Math.max(-1, Math.min(k(n) - 3, 9 - k(n), 1));
  const x = (v: number) =>
    Math.round(v * 255)
      .toString(16)
      .padStart(2, '0');
  return `#${x(f(0))}${x(f(8))}${x(f(4))}`.toUpperCase();
}

/** shift a base colour: hue + dh degrees, saturation × ks, lightness + dl points */
const shift = (base: HSL, dh: number, ks: number, dl: number, maxL = 100): string =>
  hslToHex([base[0] + dh, base[1] * ks, Math.min(maxL, base[2] + dl)]);

const same = (a: string, b: string) => a.trim().toUpperCase() === b.toUpperCase();

const cache = new Map<string, FacePalette>();
const alienCache = new Map<string, AlienPalette>();

/** the colours a (round-head) face is drawn with */
export function facePalette(f: Pick<FaceSpec, 'skin'>): FacePalette {
  const skin = f.skin;
  if (!skin || same(skin, DEFAULT_SKIN)) return YELLOW;
  const hit = cache.get(skin);
  if (hit) return hit;
  const b = hexToHsl(skin);
  if (!b) return YELLOW;
  // the offsets reproduce the original yellow's shading from its base colour
  const dark = b[2] < 40;
  const deep = b[2] < 55;
  const p: FacePalette = {
    face: hslToHex(b),
    rim: shift(b, -6, 0.86, -10),
    glow: shift(b, -6, 0.89, -9),
    shine: shift(b, 2, 1, 15, 96),
    shine2: shift(b, 5, 1, 29, 98),
    drowsy: shift(b, -2, 0.87, -7),
    blush: shift(b, -19, 0.89, dark ? 4 : 1),
    freckles: shift(b, -8, 0.76, -14),
    line: dark ? '#140A04' : YELLOW.line,
    mouth: dark ? '#2E1009' : YELLOW.mouth,
    brow: deep ? '#2E1A0C' : YELLOW.brow,
  };
  cache.set(skin, p);
  return p;
}

/** the colours Papi Zorg's alien head is drawn with */
export function alienPalette(f: Pick<FaceSpec, 'skin'>): AlienPalette {
  const skin = f.skin;
  if (!skin || same(skin, DEFAULT_ALIEN_SKIN)) return GREEN;
  const hit = alienCache.get(skin);
  if (hit) return hit;
  const b = hexToHsl(skin);
  if (!b) return GREEN;
  // the offsets reproduce the original green's shading from its base colour
  const p: AlienPalette = {
    face: hslToHex(b),
    rim: shift(b, 12, 0.78, -15),
    shine: shift(b, -10, 1.36, 18, 96),
    blush: shift(b, 44, 0.9, -17),
    line: shift(b, 19, 0.83, -33),
  };
  alienCache.set(skin, p);
  return p;
}

export interface Tones {
  base: string;
  light: string;
  dark: string;
  deep: string;
}
const toneCache = new Map<string, Tones>();
/** a colour with a lighter shine and two darker shades (for hats, moustaches, hands) */
export function tones(color: string): Tones {
  const hit = toneCache.get(color);
  if (hit) return hit;
  const b = hexToHsl(color) ?? hexToHsl('#808080')!;
  const t: Tones = {
    base: hslToHex(b),
    light: shift(b, 3, 1, b[2] > 70 ? 10 : 16, 94),
    dark: shift(b, -3, 1, -12),
    deep: shift(b, -5, 1, -22),
  };
  toneCache.set(color, t);
  return t;
}
