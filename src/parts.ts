/**
 * Face accessories drawn as SVG markup: hats and moustaches. Every hat and moustache takes a colour
 * and derives its shading from it, in the same flat-with-shine style as the heads.
 */
import { tones, type Tones } from './colors';
import type { FaceSpec } from './faces';

// ───────────────────────── hats ─────────────────────────

export type HatKind = 'cap' | 'top' | 'cowboy' | 'beanie' | 'straw' | 'crown' | 'party';
export const HATS: readonly HatKind[] = ['cap', 'top', 'cowboy', 'beanie', 'straw', 'crown', 'party'];

/** each hat's own colour when the face does not set hatColor */
export const HAT_COLORS: Record<HatKind, string> = {
  cap: '#D9443A',
  top: '#2E2A33',
  cowboy: '#A86B3C',
  beanie: '#3F74D6',
  straw: '#E6C46E',
  crown: '#F2B630',
  party: '#7B5CF0',
};

const star = (cx: number, cy: number, r: number): string => {
  let d = '';
  for (let i = 0; i < 10; i++) {
    const a = -Math.PI / 2 + (i * Math.PI) / 5;
    const rr = i % 2 ? r * 0.45 : r;
    d += `${i ? 'L' : 'M'}${(cx + Math.cos(a) * rr).toFixed(1)} ${(cy + Math.sin(a) * rr).toFixed(1)}`;
  }
  return `${d}Z`;
};

/** point on the quadratic curve from (x0,y0) via (cx,cy) to (x1,y1) at a given x (symmetric curves) */
const quadY = (x: number, x0: number, x1: number, y0: number, cy: number): number => {
  const t = (x - x0) / (x1 - x0);
  return (1 - t) * (1 - t) * y0 + 2 * (1 - t) * t * cy + t * t * y0;
};

function hatBody(kind: HatKind, color: string, uid: string): string {
  const T = tones(color);
  switch (kind) {
    case 'cap':
      return `<path d="M33 31 C32 11 50 0 70 0 C90 0 108 11 107 31 Q70 25 33 31 Z" fill="${T.base}"/>
<path d="M80 1 C95 5 107 15 107 31 Q96 29 86 28.5 C87 18 85 8 80 1 Z" fill="${T.deep}" opacity=".35"/>
<path d="M70 0 V27 M56 2 C50 11 48 19 49 27.6 M84 2 C90 11 92 19 91 27.6" stroke="${T.dark}" stroke-width="1.2" fill="none" opacity=".6"/>
<ellipse cx="52" cy="11" rx="8" ry="3.8" fill="${T.light}" opacity=".55" transform="rotate(-32 52 11)"/>
<ellipse cx="70" cy="1" rx="4.2" ry="2.3" fill="${T.dark}"/>
<circle cx="70" cy="15.5" r="7" fill="#FFF8EC"/><path d="${star(70, 15.8, 4.4)}" fill="${T.base}"/>
<path d="M31 30 Q70 22.5 109 30 C115 32.5 115.5 37 110 38.5 Q70 45 30 38.5 C24.5 37 25 32.5 31 30 Z" fill="${T.base}"/>
<path d="M30 38.5 Q70 45 110 38.5 C110.5 40.3 108.2 41.6 104.5 41.9 Q70 47 35.5 41.9 C31.8 41.6 29.5 40.3 30 38.5 Z" fill="${T.deep}"/>
<path d="M37 31.2 Q70 25 103 31.2" stroke="${T.light}" stroke-width="1.6" stroke-linecap="round" fill="none" opacity=".7"/>`;
    case 'top':
      return `<ellipse cx="70" cy="28.5" rx="44" ry="8" fill="${T.deep}"/>
<ellipse cx="70" cy="27" rx="44" ry="7.4" fill="${T.base}"/>
<path d="M44.5 27 L41.5 -17 Q70 -21 98.5 -17 L95.5 27 Q70 31 44.5 27 Z" fill="${T.base}"/>
<path d="M87 -18.4 L98.5 -17 L95.5 27 Q90 28.4 85.5 28.9 Z" fill="${T.deep}" opacity=".45"/>
<path d="M50 -15 L52.4 22 L57.2 22.6 L55.4 -16 Z" fill="${T.light}" opacity=".35"/>
<ellipse cx="70" cy="-17" rx="28.5" ry="4.6" fill="${T.light}"/>
<ellipse cx="66" cy="-17.8" rx="16" ry="2" fill="#fff" opacity=".12"/>
<path d="M44 19.5 Q70 23.5 96 19.5 L95.5 27 Q70 31 44.5 27 Z" fill="#C8343A"/>
<path d="M44 19.5 Q70 23.5 96 19.5" stroke="#E86A6E" stroke-width="1.2" fill="none"/>
<path d="M26 27 A44 7.4 0 0 0 114 27 L109 27 A39 5 0 0 1 31 27 Z" fill="${T.base}"/>
<path d="M30 30.4 Q70 37.6 110 30.4" stroke="${T.light}" stroke-width="1.2" fill="none" opacity=".5"/>`;
    case 'cowboy':
      return `<path d="M42 27 C40 14 42 0 50 -8 C56 -13 62 -10 70 -6 C78 -10 84 -13 90 -8 C98 0 100 14 98 27 Q70 31 42 27 Z" fill="${T.base}"/>
<path d="M90 -8 C98 0 100 14 98 27 Q92 28.2 87.5 28.6 C91 16 92 4 90 -8 Z" fill="${T.deep}" opacity=".4"/>
<path d="M70 -6 C67.5 2 67.5 10 70 17 C72.5 10 72.5 2 70 -6 Z" fill="${T.deep}" opacity=".55"/>
<path d="M50 -3 C46.5 5 45.5 12 46.5 18" stroke="${T.light}" stroke-width="2.2" stroke-linecap="round" fill="none" opacity=".55"/>
<path d="M42.4 20 Q70 24 97.6 20 L98 27 Q70 31 42 27 Z" fill="#4A2A16"/>
<rect x="64" y="21.2" width="12" height="7.2" rx="1.6" fill="none" stroke="#E3C26A" stroke-width="1.6"/>
<path d="M18 22 C30 31 48 34 70 34 C92 34 110 31 122 22 C112 33.5 94 37.5 70 38 C46 37.5 28 33.5 18 22 Z" fill="${T.deep}"/>
<path d="M14 18 C18 28 34 34 70 34 C106 34 122 28 126 18 C128 13.5 123.5 12.5 121.5 16.5 C115.5 25 100 28 70 28 C40 28 24.5 25 18.5 16.5 C16.5 12.5 12 13.5 14 18 Z" fill="${T.base}"/>
<path d="M19 18.5 C26 26 42 29.8 70 29.8 C98 29.8 114 26 121 18.5" stroke="${T.light}" stroke-width="1.4" stroke-linecap="round" fill="none" opacity=".6"/>`;
    case 'beanie': {
      let ribs = '';
      for (let x = 28.5; x <= 111.5; x += 4.6) {
        const top = quadY(x, 24, 116, 31, 23) + 0.8;
        const bot = quadY(x, 23, 117, 43, 36) - 0.8;
        ribs += `M${x.toFixed(1)} ${top.toFixed(1)}V${bot.toFixed(1)}`;
      }
      return `<path d="M27 38 C25 13 45 -3 70 -3 C95 -3 115 13 113 38 Z" fill="${T.base}"/>
<path d="M93 0 C106 8 114 22 113 38 L102 38 C103 22 101 9 93 0 Z" fill="${T.deep}" opacity=".35"/>
<path d="M48 1 C41 13 39 24 39 33 M59 -2 C55 11 54 23 54 32 M70 -3 V32 M81 -2 C85 11 86 23 86 32 M92 1 C99 13 101 24 101 33" stroke="${T.dark}" stroke-width="1.1" fill="none" opacity=".4"/>
<ellipse cx="51" cy="10" rx="8" ry="3.6" fill="${T.light}" opacity=".5" transform="rotate(-36 51 10)"/>
<path d="M24 31 Q70 23 116 31 L117 43 Q70 36 23 43 Z" fill="${T.dark}"/>
<path d="${ribs}" stroke="${T.deep}" stroke-width="1.3" stroke-linecap="round" fill="none" opacity=".55"/>
<path d="M27 32.2 Q70 24.6 113 32.2" stroke="${T.light}" stroke-width="1.4" fill="none" opacity=".5"/>
<g fill="#F6F0E4"><circle cx="70" cy="-7" r="8.6"/><circle cx="63" cy="-9" r="4"/><circle cx="77" cy="-9" r="4"/><circle cx="66" cy="-14" r="4"/><circle cx="74" cy="-14" r="4"/><circle cx="70" cy="-1" r="4"/></g>
<path d="M75 -2 C78 -4 79.5 -8 78.5 -11 C80.5 -8 80 -3 75 -2 Z" fill="#D9CFBE"/>
<circle cx="66" cy="-11" r="2.2" fill="#fff" opacity=".8"/>`;
    }
    case 'straw':
      return `<ellipse cx="70" cy="31" rx="50" ry="10.5" fill="${T.dark}"/>
<ellipse cx="70" cy="29.5" rx="50" ry="10" fill="${T.base}"/>
<g fill="none" stroke="${T.dark}" stroke-width=".9" opacity=".45" stroke-dasharray="3 2"><ellipse cx="70" cy="29.5" rx="45" ry="8.6"/><ellipse cx="70" cy="29.5" rx="39" ry="7"/></g>
<path d="M44 30 C43 16 46 4 52 1 Q70 -4 88 1 C94 4 97 16 96 30 Q70 34 44 30 Z" fill="${T.base}"/>
<path d="M86 0.6 C93 4 97 16 96 30 Q91 31.2 87 31.6 C89 20 89 8 86 0.6 Z" fill="${T.deep}" opacity=".3"/>
<path d="M52 2 Q70 8.5 88 2 Q70 -2.5 52 2 Z" fill="${T.dark}" opacity=".55"/>
<g fill="none" stroke="${T.dark}" stroke-width=".9" opacity=".45" stroke-dasharray="3 2"><path d="M47 10 Q70 14 93 10"/><path d="M45.5 16 Q70 20 94.5 16"/></g>
<path d="M54 4 C50 9 48.5 15 48.6 20" stroke="${T.light}" stroke-width="2" stroke-linecap="round" fill="none" opacity=".6"/>
<path d="M44.3 22.5 Q70 26.5 95.7 22.5 L96 30 Q70 34 44 30 Z" fill="#2B2420"/>
<path d="M20 29.5 A50 10 0 0 0 120 29.5 L112 29.5 A42 6.2 0 0 1 28 29.5 Z" fill="${T.base}"/>
<path d="M24 33 Q70 44 116 33" stroke="${T.light}" stroke-width="1.2" fill="none" opacity=".5"/>`;
    case 'crown':
      return `<g transform="rotate(-6 70 30)">
<path d="M39 31 L33 5 L50 17 L58 -3 L70 12 L82 -3 L90 17 L107 5 L101 31 Q70 25 39 31 Z" fill="${T.base}"/>
<path d="M70 12 L82 -3 L90 17 L107 5 L101 31 Q86 27.6 70 27 Z" fill="${T.deep}" opacity=".22"/>
<path d="M42 26 L37.5 9.5 M60 4 L66 14" stroke="${T.light}" stroke-width="1.6" stroke-linecap="round" opacity=".8"/>
<path d="M38 30 Q70 24 102 30 L101 39 Q70 33 39 39 Z" fill="${T.base}"/>
<path d="M38 30 Q70 24 102 30" stroke="${T.light}" stroke-width="1.6" fill="none"/>
<path d="M39 39 Q70 33 101 39" stroke="${T.deep}" stroke-width="1.4" fill="none" opacity=".6"/>
<g fill="${T.light}" stroke="${T.dark}" stroke-width=".8"><circle cx="33" cy="5" r="3.2"/><circle cx="58" cy="-3" r="3.2"/><circle cx="82" cy="-3" r="3.2"/><circle cx="107" cy="5" r="3.2"/><circle cx="70" cy="12" r="2.8"/></g>
<ellipse cx="70" cy="32" rx="4.2" ry="3.2" fill="#D93A4A"/><circle cx="54" cy="33" r="2.6" fill="#3A7AD9"/><circle cx="86" cy="33" r="2.6" fill="#2FA36B"/>
<circle cx="68.6" cy="31" r="1.1" fill="#fff" opacity=".8"/></g>`;
    case 'party':
      return `<defs><clipPath id="${uid}p"><path d="M51 30 L74 -24 L93 28 Q72 34 51 30 Z"/></clipPath></defs>
<g transform="rotate(10 72 28)">
<path d="M51 30 L74 -24 L93 28 Q72 34 51 30 Z" fill="${T.base}"/>
<g clip-path="url(#${uid}p)"><path d="M40 18 L100 6 L100 13 L40 25 Z M40 2 L100 -10 L100 -4 L40 8 Z M40 -14 L100 -26 L100 -20 L40 -8 Z" fill="${T.light}" opacity=".7"/>
<path d="M78 -24 L96 28 L86 32 Z" fill="${T.deep}" opacity=".3"/></g>
<path d="M51 30 Q72 35.5 93 28" stroke="#FFD84D" stroke-width="3.6" stroke-linecap="round" fill="none"/>
<g fill="#FFD84D"><circle cx="74" cy="-25" r="5"/><circle cx="70" cy="-27" r="2.6"/><circle cx="78" cy="-27" r="2.6"/><circle cx="74" cy="-30" r="2.6"/></g>
<circle cx="72.6" cy="-26.4" r="1.4" fill="#fff" opacity=".8"/></g>`;
  }
}

/** the hat over the head (the alien's head is wider and starts higher) */
export function hatMarkup(f: FaceSpec, uid: string): string {
  if (!f.hat) return '';
  const body = hatBody(f.hat, f.hatColor ?? HAT_COLORS[f.hat], uid);
  const wrap = f.alien ? ' transform="translate(70 -4) scale(1.16 1.12) translate(-70 0)"' : '';
  return `<g class="hat"${wrap}>${body}</g>`;
}

// ───────────────────────── hair geometry ─────────────────────────

type Pt = [number, number];
const n1 = (v: number): string => (Math.round(v * 10) / 10).toString();
const pt = (p: Pt): string => `${n1(p[0])} ${n1(p[1])}`;

/** a smooth curve through the points (Catmull-Rom as cubic Béziers), continuing from p[0] */
function spline(p: Pt[]): string {
  let d = '';
  for (let i = 0; i < p.length - 1; i++) {
    const p0 = p[i - 1] ?? p[i];
    const p1 = p[i];
    const p2 = p[i + 1];
    const p3 = p[i + 2] ?? p2;
    const c1: Pt = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2: Pt = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += `C${pt(c1)} ${pt(c2)} ${pt(p2)}`;
  }
  return d;
}

/** a hairy edge through the points: a small rounded tuft between each pair (out = which side bulges) */
function tufts(p: Pt[], depth: (i: number) => number, out: 1 | -1): string {
  let d = '';
  for (let i = 0; i < p.length - 1; i++) {
    const [x0, y0] = p[i];
    const [x1, y1] = p[i + 1];
    const dx = x1 - x0;
    const dy = y1 - y0;
    const len = Math.hypot(dx, dy) || 1;
    const k = (depth(i) * out) / len;
    d += `Q${pt([(x0 + x1) / 2 + dy * k, (y0 + y1) / 2 - dx * k])} ${pt(p[i + 1])}`;
  }
  return d;
}

/** a point around the head (centre 70,68) at angle a (radians, y down) and radius r */
const hp = (a: number, r: number): Pt => [70 + r * Math.cos(a), 68 + r * Math.sin(a)];
const arc = (a0: number, a1: number, n: number, r: (a: number) => number): Pt[] =>
  Array.from({ length: n + 1 }, (_, i) => {
    const a = a0 + ((a1 - a0) * i) / n;
    return hp(a, r(a));
  });
const mirrorPts = (p: Pt[]): Pt[] => p.map(([x, y]) => [140 - x, y] as Pt).reverse();

/** shape with volume: a darker copy just below it (like the head's rim), then the shape itself */
const volume = (d: string, T: Tones, drop = 1.6, rule = ''): string =>
  `<path${rule} d="${d}" fill="${T.deep}" transform="translate(0 ${drop})"/><path${rule} d="${d}" fill="${T.base}"/>`;
const strokes = (d: string, color: string, w: number, o: number): string =>
  d ? `<path d="${d}" stroke="${color}" stroke-width="${w}" stroke-linecap="round" fill="none" opacity="${o}"/>` : '';

// ───────────────────────── moustaches ─────────────────────────

export type StacheStyle = 'handlebar' | 'chevron' | 'pencil' | 'walrus' | 'horseshoe' | 'imperial' | 'fuManchu';
export const STACHES: readonly StacheStyle[] = ['handlebar', 'chevron', 'pencil', 'walrus', 'horseshoe', 'imperial', 'fuManchu'];

/** ready-made moustache and beard colours (a FaceSpec's `stache` / `beardColor` take a key or any hex colour) */
export const STACHE_COLORS = {
  brown: '#5A3212',
  grey: '#8C8C86',
  black: '#2A1A10',
  blond: '#C9973E',
  ginger: '#B4531F',
  white: '#E9E6DE',
} as const;

interface StacheShape {
  /** left half (the right half is mirrored about x = 70) */
  lobe: string;
  /** light strands following the hair */
  hair: string;
  /** a soft light edge along the top */
  shine: string;
  /** the mouth stays visible below it */
  mouth: boolean;
  /** pivot height of the lobes and how strongly they follow the mouth's expression */
  py: number;
  k: number;
}

const chevron = (): string => {
  const top: Pt[] = [[70, 81.6], [63, 80.2], [55, 80.8], [48.5, 83.4], [44, 87.4], [42.4, 92.4]];
  const bottom: Pt[] = [[42.4, 92.4], [44.6, 96.4], [48.4, 97.8], [52.8, 98.6], [57.4, 99], [62, 99], [66.2, 98.7], [70, 98.3]];
  return `M${pt(top[0])}${spline(top)}${tufts(bottom, () => 1.5, -1)}Z`;
};
const walrus = (): string => {
  const top: Pt[] = [[70, 80.6], [62, 78.6], [53, 79.4], [46, 83.2], [41.4, 89], [40.4, 95.6]];
  const bottom: Pt[] = [[40.4, 95.6], [41.6, 100.8], [44, 104.8], [47.4, 106], [51, 106.8], [54.6, 107], [58.2, 106.4], [61.8, 105], [65.8, 103.6], [70, 103.2]];
  return `M${pt(top[0])}${spline(top)}${tufts(bottom, () => 2, -1)}Z`;
};
const horseshoe = (): string => {
  const outer: Pt[] = [[70, 83.2], [62, 82.2], [54, 83.4], [48.6, 86.6], [45.4, 92.2], [44.6, 99.4], [44.9, 106.6], [45.6, 112.6], [46.4, 117]];
  const tip: Pt[] = [[46.4, 117], [48.6, 118.6], [50.8, 117]];
  const inner: Pt[] = [[50.8, 117], [51, 111], [50.8, 104], [51.4, 97.6], [54.4, 93.4], [60.4, 91.4], [70, 91]];
  return `M${pt(outer[0])}${spline(outer)}${tufts(tip, () => 1.2, -1)}${spline(inner)}Z`;
};

const SHAPES: Record<StacheStyle, StacheShape> = {
  handlebar: {
    lobe: 'M70 88.5 C66 82 58 80.5 51 83.5 C45.5 86 41 86.5 37.5 82 C35.5 79.5 36.5 76.5 39 76 C35 75.5 31.5 79 32 84 C32.8 92.5 41 98.5 51 99 C59 99.4 65.5 97 70 94 Z',
    hair: 'M66 89.5 Q57 86.5 49 89.5 M64 93.5 Q55 93.5 46 92.5 M60 96.5 Q52 97.5 43 95.5',
    shine: '',
    mouth: false,
    py: 91,
    k: 1,
  },
  chevron: {
    lobe: chevron(),
    hair: 'M66 85 Q58 84.4 51 87.8 M66 89.6 Q57 89.2 48.6 93 M65 94.2 Q57 94.4 50.2 96.6',
    shine: 'M67 83.2 Q58 82.2 50.4 85.4',
    mouth: false,
    py: 89,
    k: 0.75,
  },
  pencil: {
    lobe: 'M68.6 84.8 C63 83 56.5 83.1 51 84.6 C48 85.4 45.8 85.2 44 83.8 C43.8 87 46.4 89.6 50.8 89.5 C56.8 89.3 62.8 89.2 68.6 89.6 Z',
    hair: '',
    shine: 'M66 85.7 Q58 85 51.2 86.4',
    mouth: true,
    py: 87,
    k: 0.45,
  },
  walrus: {
    lobe: walrus(),
    hair: 'M67 84 Q57 83 49 88 M67 89 Q56 88.6 46.6 95 M66 94.6 Q57 95 50 101 M62 99.4 Q57 100.8 53.6 104.2',
    shine: 'M66 82.4 Q56 81 47.6 86',
    mouth: false,
    py: 91,
    k: 0.6,
  },
  horseshoe: {
    lobe: horseshoe(),
    hair: 'M66 85.6 Q58 85.2 51 88.4 M47.8 94.4 Q47.4 104 48.4 113.4',
    shine: 'M65 84.6 Q57 84 50.6 86.8',
    mouth: true,
    py: 88,
    k: 0.4,
  },
  imperial: {
    lobe: 'M70 86 C64.4 84.6 57.8 85 52 87.4 C47.6 89.2 43.6 88.2 41.2 84.6 C39.4 81.8 38.6 78.2 39 74.6 C37 77.6 36.4 82 37.6 85.8 C39.4 91.4 45.4 93.6 51.4 92.4 C58 91.2 64 90.2 70 90.6 Z',
    hair: '',
    shine: 'M66 86.8 Q58 86.2 51.8 89 M41.8 83.6 Q40.2 80.2 40.1 76.6',
    mouth: true,
    py: 88,
    k: 0.5,
  },
  fuManchu: {
    lobe: 'M70 85.4 C64 84.8 58.6 85.8 55 88.6 C52 91 50.8 95 50.4 100 L49.8 112 C49.6 117 48.6 121.4 46.6 123.6 C45.6 124.6 44.2 124 44.6 122.6 C45.8 119 46.2 115 46.4 110 L46.8 99 C47.2 91.4 50.8 86.6 57 84.6 C61.6 83.2 66 83.4 70 84 Z',
    hair: '',
    shine: 'M48.6 100 Q48.3 110 47.6 118',
    mouth: true,
    py: 88,
    k: 0.35,
  },
};

const ORIGINAL = { brown: ['#5A3212', '#8A5A2E', '.6', '#4A280E'], grey: ['#8C8C86', '#C4C4BC', '.8', '#74746E'] } as const;
const colorOf = (v: string): string => STACHE_COLORS[v as keyof typeof STACHE_COLORS] ?? v;

export interface StacheParts {
  markup: string;
  mouth: boolean;
  py: number;
  k: number;
}

/** moustache markup (lobes are animated by the face), or null without one */
export function stacheMarkup(f: FaceSpec): StacheParts | null {
  if (!f.stache || f.alien) return null;
  const style = f.stacheStyle ?? 'handlebar';
  const S = SHAPES[style] ?? SHAPES.handlebar;
  let lobe: string;
  let knot = '';
  if (style === 'handlebar') {
    // the original moustache, drawn exactly as before
    let fill: string;
    let hairC: string;
    let hairO: string;
    let knotC: string;
    const key = f.stache;
    if (key === 'brown' || key === 'grey') [fill, hairC, hairO, knotC] = ORIGINAL[key];
    else {
      const T = tones(colorOf(key));
      [fill, hairC, hairO, knotC] = [T.base, T.light, '.6', T.dark];
    }
    lobe = `<path d="${S.lobe}" fill="${fill}"/>\n<path d="${S.hair}" stroke="${hairC}" stroke-width="1.2" stroke-linecap="round" fill="none" opacity="${hairO}"/>`;
    knot = `<ellipse cx="70" cy="91" rx="4.6" ry="4" fill="${knotC}"/>`;
  } else {
    const T = tones(colorOf(f.stache));
    lobe = volume(S.lobe, T, S.mouth ? 1.1 : 1.6) + strokes(S.shine, T.light, 1.4, 0.55) + strokes(S.hair, T.light, 1.2, 0.5);
  }
  return {
    markup: `<g class="stache"><g class="mlobe">${lobe}</g><g class="mlobe"><g transform="matrix(-1 0 0 1 140 0)">${lobe}</g></g>${knot}</g>`,
    mouth: S.mouth,
    py: S.py,
    k: S.k,
  };
}

// ───────────────────────── beards ─────────────────────────

export type BeardStyle = 'full' | 'goatee' | 'vandyke' | 'chinstrap' | 'mutton' | 'stubble' | 'long';
export const BEARDS: readonly BeardStyle[] = ['full', 'goatee', 'vandyke', 'chinstrap', 'mutton', 'stubble', 'long'];

/** the opening around the lips, so the mouth sits on skin (even-odd hole) */
const MOUTH_HOLE = 'M55.5 98.6 C55.5 94.2 62.4 92.8 70 93.2 C77.6 92.8 84.5 94.2 84.5 98.6 C84.5 104.4 77.8 108.6 70 108.6 C62.2 108.6 55.5 104.4 55.5 98.6 Z';
/** where a full beard starts: down the sideburns, along the cheekbones, under the nose */
const CHEEK_LINE: Pt[] = [[117.8, 56.6], [113.6, 60], [111, 70], [106.4, 79.6], [99.6, 87.4], [90.4, 90.8], [80.4, 87.2], [70, 86.2], [59.6, 87.2], [49.6, 90.8], [40.4, 87.4], [33.6, 79.6], [29, 70], [26.4, 60], [22.2, 56.6]];
const A0 = Math.PI + 0.22;
const A1 = -0.22;
const down = (a: number) => Math.max(0, Math.sin(a));

/** a beard hanging from the cheek line: `hang` = how far it reaches below the chin, `point` sharpens the tip */
function fullShape(hang: number, point: number): string {
  const outer = arc(A0, A1, 28, (a) => 51.4 + hang * down(a) ** point);
  const depth = (i: number) => 0.7 + 2.4 * down(A0 + ((A1 - A0) * i) / 28) ** 2;
  return `M${pt(outer[0])}${tufts(outer, depth, -1)}L${pt(CHEEK_LINE[0])}${spline(CHEEK_LINE)}Z`;
}

const FULL_HAIR = 'M28 74 Q30 92 40 106 M36 84 Q41 100 51 112 M47 94.6 Q52 108 60 118 M62 111 Q65 119 66 126 M78 111 Q75 119 74 126 M93 94.6 Q88 108 80 118 M104 84 Q99 100 89 112 M112 74 Q110 92 100 106';
const FULL_DARK = 'M32 80 Q35 96 45 109 M42 92 Q47 106 55 116 M70 112 V127 M98 92 Q93 106 85 116 M108 80 Q105 96 95 109';

function beardBody(style: BeardStyle, color: string, uid: string): string {
  const T = tones(color);
  const evenodd = ' fill-rule="evenodd"';
  switch (style) {
    case 'full':
      return (
        volume(`${fullShape(12, 3)} ${MOUTH_HOLE}`, T, 2.4, evenodd) +
        strokes(FULL_DARK, T.deep, 1.4, 0.4) +
        strokes(FULL_HAIR, T.light, 1.3, 0.5) +
        `<ellipse cx="34" cy="86" rx="4.5" ry="12" fill="${T.light}" opacity=".18" transform="rotate(-22 34 86)"/>`
      );
    case 'long':
      return (
        volume(`${fullShape(40, 6)} ${MOUTH_HOLE}`, T, 2.6, evenodd) +
        strokes(`${FULL_DARK} M64 124 Q66 138 68 150 M76 124 Q74 138 72 150`, T.deep, 1.4, 0.4) +
        strokes(`${FULL_HAIR} M60 118 Q63 134 66 148 M80 118 Q77 134 74 148`, T.light, 1.3, 0.5) +
        `<ellipse cx="34" cy="88" rx="4.5" ry="13" fill="${T.light}" opacity=".18" transform="rotate(-24 34 88)"/>`
      );
    case 'goatee':
      return `<path d="M56 105 C55 114 60 124 70 125.5 C80 124 85 114 84 105 C80 109.5 75 111.2 70 111.2 C65 111.2 60 109.5 56 105 Z" fill="${T.base}"/>
<path d="M60 117 C63 122.5 66.5 124.6 70 125 C73.5 124.6 77 122.5 80 117 C78 123.5 74.5 126.4 70 126.6 C65.5 126.4 62 123.5 60 117 Z" fill="${T.deep}" opacity=".7"/>
<path d="M64 113.5 Q66 119 67.5 122.5 M76 113.5 Q74 119 72.5 122.5" stroke="${T.light}" stroke-width="1.2" stroke-linecap="round" fill="none" opacity=".6"/>`;
    case 'vandyke':
      return `<path d="M57 105.5 C56.5 113 61 120 70 134 C79 120 83.5 113 83 105.5 C79 109.6 75 111.2 70 111.2 C65 111.2 61 109.6 57 105.5 Z" fill="${T.base}"/>
<path d="M64 120 C66.5 125 68.2 129 70 132 C71.8 129 73.5 125 76 120 C74 127 72 131.5 70 134.5 C68 131.5 66 127 64 120 Z" fill="${T.deep}" opacity=".7"/>
<path d="M65 114 Q67 121 69 127 M75 114 Q73 121 71 127" stroke="${T.light}" stroke-width="1.2" stroke-linecap="round" fill="none" opacity=".6"/>`;
    case 'chinstrap': {
      const outer = arc(A0, A1, 28, (a) => 51.8 + 3 * down(a) ** 3);
      const inner = arc(A1, A0, 28, (a) => 45.6 + 1.5 * down(a) ** 3);
      const d = `M${pt(outer[0])}${tufts(outer, () => 0.9, -1)}L${pt(inner[0])}${spline(inner)}Z`;
      let ticks = '';
      for (let i = 2; i <= 26; i += 2) {
        const a = A0 + ((A1 - A0) * i) / 28;
        const r = 48.8 + 2.2 * down(a) ** 3;
        const [x0, y0] = hp(a, r - 2);
        const [x1, y1] = hp(a + 0.03 * (a > Math.PI / 2 ? 1 : -1), r + 2);
        ticks += `M${n1(x0)} ${n1(y0)}L${n1(x1)} ${n1(y1)}`;
      }
      return volume(d, T, 1.4) + strokes(ticks, T.light, 1, 0.5);
    }
    case 'mutton': {
      const outer = arc(A0 + 0.02, 2.22, 9, () => 51.4);
      const inner: Pt[] = [outer[outer.length - 1], [44.2, 103.6], [46, 96], [42.4, 86.6], [36.8, 76.6], [31.6, 66], [27.6, 58], outer[0]];
      const half = `M${pt(outer[0])}${tufts(outer, (i) => 0.8 + i * 0.12, -1)}${spline(inner)}Z`;
      const hair = 'M24 63 Q25.6 77 31 89 M29.6 65 Q32.6 79 39.4 92 M36 98 Q39.6 101.6 43 101.8';
      const one = volume(half, T, 1.8) + strokes(hair, T.light, 1.2, 0.5) + `<ellipse cx="27" cy="74" rx="2.6" ry="9" fill="${T.light}" opacity=".18" transform="rotate(-14 27 74)"/>`;
      return one + `<g transform="matrix(-1 0 0 1 140 0)">${one}</g>`;
    }
    case 'stubble': {
      const outer = arc(A0, A1, 28, (a) => 50.6 + 1 * down(a));
      const d = `M${pt(outer[0])}${spline(outer)}L${pt(CHEEK_LINE[0])}${spline(CHEEK_LINE)}Z`;
      return `<defs><pattern id="${uid}s" width="2.6" height="2.6" patternUnits="userSpaceOnUse" patternTransform="rotate(20)"><circle cx=".6" cy=".6" r=".42" fill="${T.deep}"/><circle cx="1.9" cy="1.9" r=".38" fill="${T.deep}"/></pattern>
<linearGradient id="${uid}g" x1="0" y1="58" x2="0" y2="96" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#fff"/></linearGradient>
<mask id="${uid}k"><path d="${d}" fill="url(#${uid}g)"/></mask></defs>
<g mask="url(#${uid}k)"><path d="${d}" fill="${T.base}" opacity=".2"/><path d="${d}" fill="url(#${uid}s)" opacity=".8"/></g>`;
    }
  }
}

/** the beard on the lower face (drawn under the mouth), or '' without one */
export function beardMarkup(f: FaceSpec, uid: string): string {
  if (!f.beard || f.alien) return '';
  return `<g class="beard">${beardBody(f.beard, colorOf(f.beardColor ?? f.stache ?? 'brown'), uid)}</g>`;
}

// ───────────────────────── hair ─────────────────────────

export type HairStyle =
  // men
  | 'short'
  | 'sidePart'
  | 'spiky'
  | 'curly'
  | 'pompadour'
  // women
  | 'long'
  | 'bob'
  | 'ponytail'
  | 'bun'
  | 'pigtails';
export const HAIR_MEN: readonly HairStyle[] = ['short', 'sidePart', 'spiky', 'curly', 'pompadour'];
export const HAIR_WOMEN: readonly HairStyle[] = ['long', 'bob', 'ponytail', 'bun', 'pigtails'];
export const HAIRS: readonly HairStyle[] = [...HAIR_MEN, ...HAIR_WOMEN];

/** ready-made hair colours (a FaceSpec's `hairColor` takes a key or any hex colour) */
export const HAIR_COLORS = {
  ...STACHE_COLORS,
  auburn: '#7A2E1A',
  pink: '#E88AB4',
  blue: '#4E7FD6',
  purple: '#7B4FC4',
} as const;

const hairColorOf = (f: FaceSpec): string => {
  const v = f.hairColor ?? 'brown';
  return HAIR_COLORS[v as keyof typeof HAIR_COLORS] ?? v;
};
/** brows match the hair when a face has hair and no brow colour of its own */
export const hairBrow = (f: FaceSpec): string | null => (f.hair && !f.alien ? tones(hairColorOf(f)).dark : null);

const TIE = '#E25B7A';
const TIE_DARK = '#B8405E';

/** a closed outline from runs of points: each run is a smooth curve, runs meet in corners */
const outline = (...runs: Pt[][]): string => `${runs.map((r, i) => `${i ? 'L' : 'M'}${pt(r[0])}${spline(r)}`).join('')}Z`;
/** a full run from its right half (right end → centre, x = 70 last): the left half is mirrored */
const sym = (half: Pt[]): Pt[] => [...half, ...mirrorPts(half.slice(0, -1))];
/**
 * The top of the hair, from the left end over the crown to the right end: it hugs the head's rim at
 * the ends (side) and rises by lift on the crown. end = how far above the head's middle it stops.
 */
const dome = (lift: number, side = 54, end = 0.16, n = 12): Pt[] =>
  arc(Math.PI + end, 2 * Math.PI - end, n, (a) => side + lift * Math.max(0, -Math.sin(a)) ** 1.5);
/** hair with volume: a darker copy just below (like the head's rim), then the hair, corners softened */
const lock = (d: string, T: Tones, drop = 1.5): string =>
  `<path d="${d}" fill="${T.deep}" stroke="${T.deep}" stroke-width="1" stroke-linejoin="round" transform="translate(0 ${drop})"/>` +
  `<path d="${d}" fill="${T.base}" stroke="${T.base}" stroke-width="1" stroke-linejoin="round"/>`;
const mix = (a: string, b: string, t: number): string =>
  `#${[1, 3, 5].map((i) => Math.round(parseInt(a.slice(i, i + 2), 16) * (1 - t) + parseInt(b.slice(i, i + 2), 16) * t).toString(16).padStart(2, '0')).join('')}`;
/** hair behind the head or behind other hair: a little darker */
const backTones = (T: Tones, t = 0.6): Tones => ({ ...T, base: mix(T.base, T.dark, t) });

/** men's hairline: short sideburns, square temples (right half, sideburn → centre) */
const sideburn = (brow: Pt[]): Pt[] => [[117.6, 60.6], [116, 54], [114, 47.4], ...brow];
const BURN_R: Pt[] = [[123.2, 59.4], [117.6, 60.6]];
const BURN_L: Pt[] = [[22.4, 60.6], [16.8, 59.4]];
/** women's hairline with the hair pulled back: a small wisp in front of the ear (right half) */
const WISP: Pt[] = [[123.2, 59.4], [118.8, 55.4], [115.6, 48.6], [110.4, 41.4]];

function hairParts(style: HairStyle, T: Tones, hat: boolean): { back: string; front: string } {
  const fine = (d: string) => strokes(d, T.light, 1.2, 0.5);
  const dark = (d: string) => strokes(d, T.deep, 1.3, 0.5);
  const gloss = (cx: number, cy: number, rx: number, ry: number, rot: number) =>
    `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="${T.light}" opacity=".42" transform="rotate(${rot} ${cx} ${cy})"/>`;
  const tie = (cx: number, cy: number, rx: number, ry: number, rot: number) =>
    `<g transform="rotate(${rot} ${cx} ${cy})"><ellipse cx="${cx}" cy="${cy + 1}" rx="${rx}" ry="${ry}" fill="${TIE_DARK}"/><ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry - 0.6}" fill="${TIE}"/></g>`;
  switch (style) {
    case 'short': {
      const line = sym(sideburn([[108.6, 40.6], [99, 35.4], [86, 32.4], [70, 31.4]]));
      return {
        back: '',
        front:
          lock(outline(dome(2.8), BURN_R, line, BURN_L), T) +
          fine('M70 17.6 Q70.8 23 70 27.4 M57 18.8 Q56.4 24 57.6 28 M83 18.8 Q83.6 24 82.4 28 M44.6 22.8 Q43 27.4 44 31 M95.4 22.8 Q97 27.4 96 31 M33.6 30 Q31.4 34 32 37.6 M106.4 30 Q108.6 34 108 37.6') +
          gloss(47, 19.4, 8.6, 2.8, -31),
      };
    }
    case 'sidePart': {
      const right: Pt[] = sideburn([[110, 41.4], [101, 38.2], [90, 36.6], [78, 34.2], [66, 30.8], [57, 27.6], [52, 25.6]]);
      const left: Pt[] = [[52, 25.6], [44, 29], [35.4, 35.6], [29.6, 43.6], [26.4, 50], [24, 54.6], [22.4, 60.6]];
      return {
        back: '',
        front:
          lock(outline(dome(4.2), BURN_R, right, left, [BURN_L[1]]), T) +
          dark('M52 25.6 Q49.4 21.6 48.6 17.4') +
          fine('M55.6 20.6 Q80 19 103 31.6 M57 15.4 Q82 13 108 28.4 M46 22.6 Q36 27.6 29.4 38 M42.6 17.6 Q31 24.6 24.4 37') +
          gloss(75, 12.4, 12, 2.8, 6),
      };
    }
    case 'spiky': {
      const a0 = Math.PI + 0.52;
      const a1 = 2 * Math.PI - 0.52;
      const n = 7;
      const base = 54.6;
      let top = '';
      let lines = '';
      for (let i = 0; i < n; i++) {
        const va = a0 + ((a1 - a0) * i) / n;
        const dv = (a1 - a0) / n;
        const h = hat ? 1.6 : 3.4 + 6.6 * Math.max(0, -Math.sin(va + dv / 2)) ** 3;
        const tipA = va + dv * 0.6;
        top += `Q${pt(hp(va + dv * 0.24, base + h * 0.72))} ${pt(hp(tipA, base + h))}Q${pt(hp(va + dv * 0.84, base + h * 0.3))} ${pt(hp(va + dv, base))}`;
        if (!hat && i > 0 && i < n - 1) lines += `M${pt(hp(tipA - 0.01, base + h * 0.35))}L${pt(hp(tipA - 0.05, base - 5.4))}`;
      }
      const sideL = arc(Math.PI + 0.16, a0, 3, () => 54);
      const sideR = arc(a1, 2 * Math.PI - 0.16, 3, () => 54);
      const fringe: Pt[] = [[105, 38.8], [98.6, 33.4], [93.4, 38], [87, 32], [81.4, 37], [75.4, 31.4], [70, 36.4], [64.6, 31.4], [58.6, 37], [53, 32], [46.6, 38], [41.4, 33.4], [35, 38.8]];
      const d =
        `M${pt(sideL[0])}${spline(sideL)}L${pt(hp(a0, base))}${top}L${pt(sideR[0])}${spline(sideR)}L${pt(BURN_R[1])}${spline(sideburn([[110.6, 42.6]]))}` +
        fringe.map((p) => `L${pt(p)}`).join('') +
        `L29.4 42.6${spline(mirrorPts(sideburn([[110.6, 42.6]])))}L${pt(BURN_L[1])}Z`;
      return { back: '', front: lock(d, T) + fine(lines) + gloss(43.4, 23, 7, 2.6, -36) };
    }
    case 'curly': {
      const outer = arc(Math.PI + 0.02, 2 * Math.PI - 0.02, 9, (a) => 56.6 + 5 * Math.max(0, -Math.sin(a)));
      const line: Pt[] = [[126.6, 67], [119.4, 66.4], [117.8, 57], [114.2, 48], [107.6, 40.8], [98, 36.4], [87, 34], [75.6, 33.2], [64.4, 33.2], [53, 34], [42, 36.4], [32.4, 40.8], [25.8, 48], [22.2, 57], [20.6, 66.4], [13.4, 67]];
      const d = `M${pt(outer[0])}${tufts(outer, () => 6.6, 1)}${tufts(line, () => 2.2, 1)}Z`;
      const curl = ([x, y]: Pt) => `M${n1(x - 3)} ${n1(y + 1.2)}a3.2 3.2 0 1 1 4.6 2.2`;
      const rowA = arc(Math.PI + 0.34, 2 * Math.PI - 0.34, 8, (a) => 51.6 + 3.4 * Math.max(0, -Math.sin(a))).map(curl).join('');
      const rowB = arc(Math.PI + 1.02, 2 * Math.PI - 1.02, 4, () => 45.4).map(curl).join('');
      return { back: '', front: lock(d, T, 1.6) + strokes(rowB, T.deep, 1.3, 0.45) + strokes(rowA, T.light, 1.3, 0.6) };
    }
    case 'pompadour': {
      const line = sym(sideburn([[108.6, 40.4], [99, 35.2], [86, 32.2], [70, 31.2]]));
      if (hat) return { back: '', front: lock(outline(dome(3), BURN_R, line, BURN_L), T) };
      // short sides, a shade darker, under a tall quiff that sweeps up from the forehead and curls back
      const quiff: Pt[] = [[30.6, 41], [27.6, 32], [29.6, 22.6], [36.6, 13.6], [48, 6], [62, 0.4], [77, -3.4], [92, -3], [104.4, 3.4], [112, 13.6], [114.4, 25], [113, 34], [109.4, 41]];
      const brow: Pt[] = [[109.4, 41], [99, 35.2], [86, 32.2], [70, 31.2], [54, 32.2], [41, 35.2], [30.6, 41]];
      return {
        back: '',
        front:
          lock(outline(dome(2.4), BURN_R, line, BURN_L), backTones(T, 0.45)) +
          lock(outline(quiff, brow), T, 1.7) +
          dark('M37 33.4 Q40.6 19 60 10.6 Q83 2 100 10.6 Q109.6 18 105.6 26.6 Q101.6 32.6 95.6 28') +
          fine('M47 31.6 Q50 20.6 67 14 Q83 8.6 95 14 M61 30.4 Q66 22.6 79 20 M33.6 28 Q35.6 17.6 48 10.6') +
          gloss(56, 5.4, 10, 2.6, -20),
      };
    }
    case 'long': {
      const outer = sym([[113, 122.6], [120.4, 115.6], [126.6, 104], [130.6, 86], [131, 66], [126.6, 46], [117, 29], [103, 17], [87, 10.6], [70, 8.6]]).reverse();
      const inR: Pt[] = [[113, 122.6], [111.2, 112], [113.6, 98], [115.6, 84], [115.8, 70], [113.6, 57], [108, 45], [98, 35.6], [85, 29.2], [74, 26.2], [70, 24.2]];
      const hem = 'M14 70 C11 98 16 113 27 121.4 Q70 127.4 113 121.4 C124 113 129 98 126 70 Z';
      return {
        back: lock(hem, backTones(T), 1.6),
        front:
          lock(outline(outer, inR, mirrorPts(inR)), T) +
          dark('M70 24.2 V12.6') +
          fine('M63.6 14 Q38 22 22.6 56 M76.4 14 Q102 22 117.4 56 M15.6 70 Q13.6 92 18.6 110 M124.4 70 Q126.4 92 121.4 110') +
          gloss(39, 22.6, 9.6, 3, -40),
      };
    }
    case 'bob': {
      const outer = sym([[111, 107], [121, 104], [129, 95], [132.4, 80], [131.6, 62], [126.6, 44], [116.6, 28], [102, 16.4], [86, 10.4], [70, 8.6]]).reverse();
      const sideR: Pt[] = [[111, 107], [112.8, 98], [115.2, 86], [116, 72], [115.2, 58], [113.4, 47], [111, 40]];
      const bangs: Pt[][] = [
        [[111, 40], [101, 37.6], [91, 36.3]],
        [[89.4, 32.6], [89.4, 32.6]],
        [[87.8, 36.1], [72, 35.4], [56.2, 36]],
        [[54.6, 32.4], [54.6, 32.4]],
        [[53, 36.1], [40, 37.6], [29, 40]],
      ];
      return {
        back: '',
        front:
          lock(outline(outer, sideR, ...bangs, mirrorPts(sideR)), T) +
          fine('M71 12 Q72 24 71 32.6 M42 18.6 Q38 28 40.6 35 M100 17.6 Q104.6 27 102.6 34.6 M14.6 62 Q13 82 18.6 98 M125.4 62 Q127 82 121.4 98') +
          gloss(40, 21.6, 9.6, 3, -38),
      };
    }
    case 'ponytail': {
      const line: Pt[] = [...WISP, [101, 35.2], [88, 31], [74, 29.4], [60, 30], [47, 33], [36, 38.6], [29.6, 41.8], ...mirrorPts(WISP.slice(0, 3))];
      const tail = outline(
        [[104, 34], [112.6, 25.6], [123, 23.4], [132.4, 30.6], [137.6, 46], [138, 64], [134.6, 82], [128, 96], [121.6, 105.4]],
        [[121.6, 105.4], [121, 95], [122, 84], [121.6, 66], [119, 50], [112, 40], [104, 34]],
      );
      return {
        back: lock(tail, backTones(T, 0.35), 1.6) + strokes('M127.6 31.6 Q135.6 54 129.6 90', T.light, 1.2, 0.5) + tie(117.6, 29.6, 4, 8.4, 42),
        front:
          lock(outline(dome(2.6), line), T) +
          fine('M38.6 31.6 Q62 18.6 101 22.6 M28.6 41 Q46 21 78 15.4 M84 26.6 Q98 26 108 31') +
          gloss(47, 19.4, 8.6, 2.8, -31),
      };
    }
    case 'bun': {
      const line = sym([...WISP, [100.6, 35], [86, 30.6], [70, 29.4]]);
      const knot = hat
        ? ''
        : lock('M70 -6 C77.4 -6 83 -0.2 83 7 C83 14.2 77.4 20 70 20 C62.6 20 57 14.2 57 7 C57 -0.2 62.6 -6 70 -6 Z', T, 1.4) +
          fine('M61.6 3.6 Q70 -4.6 78.4 3.6 M64 9.6 Q70 4.6 76 9.6') +
          gloss(64, -0.4, 4.6, 1.8, -34);
      const band = hat ? '' : `<path d="M57.6 11.4 Q70 16.6 82.4 11.4 L83 15 Q70 20.8 57 15 Z" fill="${TIE}" stroke="${TIE}" stroke-width=".8" stroke-linejoin="round"/>`;
      return {
        back: knot,
        front:
          lock(outline(dome(2.6), line), T) +
          band +
          fine('M48 27 Q53 20.6 60.6 17.6 M92 27 Q87 20.6 79.4 17.6 M33.6 36.6 Q41 25 53 19.6 M106.4 36.6 Q99 25 87 19.6') +
          gloss(40.6, 22.6, 6.6, 2.4, -42),
      };
    }
    case 'pigtails': {
      const half: Pt[] = [...WISP, [100, 35], [86, 29.8], [74, 27.2], [70, 25]];
      const tail = outline([[16, 59], [9, 64], [4, 76], [2.6, 90], [6, 103], [13, 114]], [[13, 114], [18.6, 104], [21.6, 92], [22, 80], [21, 70], [16, 59]]);
      const one = lock(tail, backTones(T, 0.35), 1.6) + strokes('M9.6 70 Q5.6 88 10.6 104', T.light, 1.2, 0.5) + tie(15, 61, 3.6, 6.8, 24);
      return {
        back: one + `<g transform="matrix(-1 0 0 1 140 0)">${one}</g>`,
        front:
          lock(outline(dome(2.6), half, mirrorPts(half)), T) +
          dark('M70 25 V14.6') +
          fine('M63 17.6 Q42 22 28.6 38.6 M77 17.6 Q98 22 111.4 38.6 M64.6 24 Q48 27 36 37 M75.4 24 Q92 27 104 37') +
          gloss(44, 19.6, 7.6, 2.6, -34),
      };
    }
  }
}

/** hair behind the head (long hair, ponytail, bun…) and on top of it */
export function hairMarkup(f: FaceSpec): { back: string; front: string } {
  if (!f.hair || f.alien) return { back: '', front: '' };
  const p = hairParts(f.hair, tones(hairColorOf(f)), !!f.hat);
  return { back: p.back ? `<g class="hair-back">${p.back}</g>` : '', front: `<g class="hair">${p.front}</g>` };
}
