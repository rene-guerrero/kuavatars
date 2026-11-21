/**
 * Faces are composable: every face is the same round head with a few features (lashes, brows, smirk,
 * freckles, glasses, aviators, moustache) — or Papi Zorg's alien head.
 *
 * The library offers the options; the games decide which faces to use. HUMAN_FACES are ready-made
 * starting faces; each game defines its own CPU characters (any FaceSpec) with their names, levels
 * and descriptions. CHARACTER_FACES is deprecated and only kept for older games.
 */

import type { EyeShape } from './eyes';
import type { Eyewear } from './eyewear';
import type { MouthStyle } from './mouths';
import type { BeardStyle, HairStyle, HatKind, StacheStyle } from './parts';

/** A composable avatar face: the same round head with a few features (or Papi Zorg's alien head). */
export interface FaceSpec {
  /** eye colour (Papi Zorg: the colour of his big almond eyes). See EYE_COLORS */
  iris: string;
  /** eye shape (default 'round'). See EYE_SHAPES */
  eyes?: EyeShape;
  /** mouth style (default 'smile'). See MOUTHS */
  mouth?: MouthStyle;
  /** lip colour for the 'lips' mouth (any hex colour) */
  lipColor?: string;
  /** skin colour, any hex colour (default: the classic yellow; Papi Zorg: green). See SKIN_TONES */
  skin?: string;
  lashes?: boolean;
  /** brow shape: plain (default), thick, raised (one brow up), aviator (straight-ish, set for sunglasses) */
  brows?: 'plain' | 'thick' | 'raised' | 'aviator';
  /** brow colour (default brown) */
  browColor?: string;
  smirk?: boolean;
  freckles?: boolean;
  /** eyewear (see EYEWEAR): round / square glasses, aviators, sunglasses, cat-eye, monocle, eye patch */
  eyewear?: Eyewear;
  /** round glasses (same as eyewear: 'round'; kept for older faces) */
  glasses?: boolean;
  /** gold aviator sunglasses (same as eyewear: 'aviators'; kept for older faces) */
  aviators?: boolean;
  /** a moustache in this colour: a STACHE_COLORS key ('brown', 'grey', 'black'…) or any hex colour */
  stache?: string;
  /** moustache shape (default 'handlebar'); some shapes leave the mouth visible. See STACHES */
  stacheStyle?: StacheStyle;
  /** a beard. See BEARDS */
  beard?: BeardStyle;
  /** beard colour: a STACHE_COLORS key or any hex colour (default: the moustache's, else brown) */
  beardColor?: string;
  /** hairstyle. See HAIR_MEN / HAIR_WOMEN */
  hair?: HairStyle;
  /** hair colour: a HAIR_COLORS key or any hex colour (default brown) */
  hairColor?: string;
  /** a hat. See HATS */
  hat?: HatKind;
  /** hat colour, any hex colour (default: each hat's own) */
  hatColor?: string;
  /** white cartoon gloves instead of bare hands (when the face gestures) */
  gloves?: boolean;
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

/**
 * @deprecated Games define their own CPU characters' faces (any FaceSpec). This set stays only so
 * older games keep working, and will be removed in a future version; it gets no new looks.
 */
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
/** @deprecated see CHARACTER_FACES */
export type CharacterId = keyof typeof CHARACTER_FACES;

// colour choices (pure data too, so pickers and servers can use them without the DOM code)
export { DEFAULT_ALIEN_SKIN, DEFAULT_SKIN, EYE_COLORS, SKIN_TONES, type EyeColorId, type SkinToneId } from './colors';
export { BEARDS, HAIRS, HAIR_COLORS, HAIR_MEN, HAIR_WOMEN, HATS, HAT_COLORS, STACHES, STACHE_COLORS, type BeardStyle, type HairStyle, type HatKind, type StacheStyle } from './parts';
export { EYE_SHAPES, type EyeShape } from './eyes';
export { DEFAULT_LIPS, MOUTHS, type MouthStyle } from './mouths';
export { EYEWEAR, type Eyewear } from './eyewear';
export { sameFace, sanitizeFace } from './sanitize';
