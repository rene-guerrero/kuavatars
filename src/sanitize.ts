/**
 * Checking faces that come from storage or from other players. Pure data (no DOM), so servers can use
 * it too: `import { sanitizeFace } from 'kuavatars/faces'`.
 *
 * Unknown fields and invalid values are dropped, so a face saved by a newer version of the library
 * still loads in an older one (it just loses the options the older one doesn't know).
 */
import { EYE_SHAPES } from './eyes';
import { EYEWEAR } from './eyewear';
import { HUMAN_FACES, type FaceSpec } from './faces';
import { MOUTHS } from './mouths';
import { BEARDS, HAIRS, HAIR_COLORS, HATS, STACHES, STACHE_COLORS } from './parts';

const HEX = /^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/;
const BROWS = ['plain', 'thick', 'raised', 'aviator'] as const;
const FLAGS = ['lashes', 'smirk', 'freckles', 'glasses', 'aviators', 'alien', 'flower', 'mole', 'cool', 'gloves'] as const;

const hex = (v: unknown): string | undefined => (typeof v === 'string' && HEX.test(v) ? v.toUpperCase() : undefined);
const oneOf = <T extends string>(list: readonly T[], v: unknown): T | undefined => (typeof v === 'string' && (list as readonly string[]).includes(v) ? (v as T) : undefined);
/** a palette key or a hex colour */
const colorOrKey = (keys: Record<string, string>, v: unknown): string | undefined => (typeof v === 'string' && v in keys ? v : hex(v));

/**
 * A clean FaceSpec from anything (parsed JSON, a number = HUMAN_FACES index). Falls back to
 * `fallback` (default HUMAN_FACES[0]) when there is no usable eye colour.
 */
export function sanitizeFace(input: unknown, fallback: FaceSpec = HUMAN_FACES[0]): FaceSpec {
  if (typeof input === 'number' && Number.isInteger(input)) return { ...(HUMAN_FACES[input] ?? fallback) };
  if (!input || typeof input !== 'object') return { ...fallback };
  const o = input as Record<string, unknown>;
  const iris = hex(o.iris);
  if (!iris) return { ...fallback };
  const f: Record<string, unknown> = {
    iris,
    skin: hex(o.skin),
    eyes: oneOf(EYE_SHAPES, o.eyes),
    mouth: oneOf(MOUTHS, o.mouth),
    lipColor: hex(o.lipColor),
    hair: oneOf(HAIRS, o.hair),
    hairColor: colorOrKey(HAIR_COLORS, o.hairColor),
    brows: oneOf(BROWS, o.brows),
    browColor: hex(o.browColor),
    stache: colorOrKey(STACHE_COLORS, o.stache),
    stacheStyle: oneOf(STACHES, o.stacheStyle),
    beard: oneOf(BEARDS, o.beard),
    beardColor: colorOrKey(STACHE_COLORS, o.beardColor),
    eyewear: oneOf(EYEWEAR, o.eyewear),
    hat: oneOf(HATS, o.hat),
    hatColor: hex(o.hatColor),
  };
  for (const k of FLAGS) if (o[k] === true) f[k] = true;
  for (const k of Object.keys(f)) if (f[k] === undefined) delete f[k];
  return f as unknown as FaceSpec;
}

/** two faces look the same (same options, key order ignored) */
export function sameFace(a: FaceSpec, b: FaceSpec): boolean {
  const ka = Object.keys(a).sort();
  const kb = Object.keys(b).sort();
  return ka.length === kb.length && ka.every((k, i) => k === kb[i] && (a as unknown as Record<string, unknown>)[k] === (b as unknown as Record<string, unknown>)[k]);
}
