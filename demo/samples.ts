/**
 * The demo's own sample characters. They're demo data, not part of the library: each game defines its
 * own CPU characters' faces (any FaceSpec) and names.
 */
import { EYE_COLORS, SKIN_TONES, type FaceSpec } from '../src/index';

export const SAMPLES: { name: string; face: FaceSpec }[] = [
  { name: 'Lucía', face: { iris: EYE_COLORS.green, skin: SKIN_TONES.mediumLight, hair: 'pigtails', hairColor: 'ginger', freckles: true, lashes: true, mouth: 'teeth' } },
  { name: 'Mateo', face: { iris: EYE_COLORS.violet, skin: SKIN_TONES.medium, hair: 'spiky', hairColor: 'black', brows: 'raised', smirk: true } },
  { name: 'Sofía', face: { iris: EYE_COLORS.hazel, skin: SKIN_TONES.mediumDark, hair: 'bob', hairColor: 'black', lashes: true, mouth: 'lips', lipColor: '#B8435A' } },
  { name: 'Diego', face: { iris: EYE_COLORS.blue, skin: SKIN_TONES.light, eyes: 'big', freckles: true, hat: 'cap', hatColor: '#3F74D6' } },
  { name: 'Valeria', face: { iris: EYE_COLORS.teal, skin: SKIN_TONES.light, hair: 'bun', hairColor: 'grey', eyewear: 'catEye', lashes: true, mouth: 'lips' } },
  { name: 'Tomás', face: { iris: EYE_COLORS.blue, skin: SKIN_TONES.mediumDark, hair: 'short', hairColor: 'black', stache: 'black', stacheStyle: 'walrus', eyewear: 'sunglasses' } },
  { name: 'Don Ramón', face: { iris: EYE_COLORS.brown, skin: SKIN_TONES.mediumDark, hair: 'short', hairColor: 'white', stache: 'white', stacheStyle: 'walrus', eyewear: 'round', hat: 'straw', browColor: '#E9E6DE' } },
  { name: 'Zorg', face: { iris: '#101418', alien: true } },
];

/** a sample by name (the table and the galleries use a few) */
export const sample = (name: string): FaceSpec => SAMPLES.find((s) => s.name === name)?.face ?? SAMPLES[0].face;
