/**
 * Faces are composable: every face is the same round head with a few features (lashes, brows, smirk,
 * freckles, glasses, aviators, moustache) — or Papi Zorg's alien head.
 *
 * HUMAN_FACES are the faces a player can pick; CHARACTER_FACES are the CPU characters' faces, keyed by
 * character id. Names, levels and descriptions of the characters live in each game, not here.
 */

/** A composable avatar face: the same round head with a few features (or Papi Zorg's alien head). */
export interface FaceSpec {
  iris: string;
  lashes?: boolean;
  /** brow shape: plain (default), thick, raised (one brow up), aviator (straight-ish, set for sunglasses) */
  brows?: 'plain' | 'thick' | 'raised' | 'aviator';
  /** brow colour (default brown) */
  browColor?: string;
  smirk?: boolean;
  freckles?: boolean;
  /** round glasses */
  glasses?: boolean;
  /** gold aviator sunglasses (the eyes are hidden) */
  aviators?: boolean;
  /** handlebar moustache (no mouth) */
  stache?: 'brown' | 'grey';
  /** the green alien head */
  alien?: boolean;
  /** a small flower clip on the head */
  flower?: boolean;
  /** a beauty mark by the mouth */
  mole?: boolean;
  /** cool, half-lidded resting look */
  cool?: boolean;
}

/** the faces a player can pick (the index is what games store in their settings) */
export const HUMAN_FACES: FaceSpec[] = [
  { iris: '#3F7FD9' }, // 0 plain
  { iris: '#2F9B63', lashes: true }, // 1 lashes
  { iris: '#7A4A22', brows: 'thick' }, // 2 thick brows
  { iris: '#5B3FA8', stache: 'brown' }, // 3 handlebar moustache (no mouth)
  { iris: '#B8741F', freckles: true }, // 4 freckles
  { iris: '#3F7FD9', glasses: true }, // 5 round glasses
  { iris: '#2F9B63', brows: 'raised', smirk: true }, // 6 raised brow + smirk
  { iris: '#7A4A22', aviators: true, brows: 'aviator' }, // 7 aviator sunglasses
  { iris: '#1E9C9C', lashes: true, glasses: true }, // 8 lashes + round glasses
];
export const FACE_COUNT = HUMAN_FACES.length;

/** the CPU characters' faces, by character id */
export const CHARACTER_FACES = {
  lola: { iris: '#2F9B63', freckles: true, flower: true },
  pepe: { iris: '#5B3FA8', brows: 'raised', smirk: true },
  nico: { iris: '#3F7FD9', aviators: true, freckles: true, smirk: true, brows: 'aviator' },
  elena: { iris: '#B8741F', lashes: true },
  andres: { iris: '#7A4A22', brows: 'thick' },
  rosa: { iris: '#1E9C9C', lashes: true, glasses: true },
  carlos: { iris: '#3F7FD9', stache: 'brown' },
  marta: { iris: '#6F8FB0', lashes: true, brows: 'raised', smirk: true, mole: true, cool: true },
  julio: { iris: '#8B5A2B', glasses: true, stache: 'grey', browColor: '#9A9A92' },
  zorg: { iris: '#101418', alien: true },
} satisfies Record<string, FaceSpec>;
export type CharacterId = keyof typeof CHARACTER_FACES;
