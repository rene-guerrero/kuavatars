/** The library's English labels (US spelling). Same keys as the Spanish ones in labels.ts. */
import type { BeardStyle, Eyewear, EyeColorId, EyeShape, Gesture, HairStyle, HatKind, Mood, MouthStyle, SkinToneId, StacheStyle } from './index';
import type { HAIR_COLORS, STACHE_COLORS } from './index';
import type { EditorTexts } from './labels';

export const MOOD_EN: Record<Mood, string> = {
  idle: 'Calm',
  perk: 'Alert',
  happy: 'Happy',
  sad: 'Sad',
  angry: 'Determined',
  amazed: 'Amazed',
  thinking: 'Thinking',
  sleepy: 'Sleepy',
  asleep: 'Asleep',
  smug: 'Pleased',
  meh: 'Indifferent',
  shout: 'Shouting',
  hurt: 'Hurt',
  mew: 'Mewing',
  cry: 'Crying',
};

export const SKIN_EN: Record<SkinToneId, string> = {
  yellow: 'Yellow',
  light: 'Light',
  mediumLight: 'Medium light',
  medium: 'Medium',
  mediumDark: 'Medium dark',
  dark: 'Dark',
  green: 'Green',
  blue: 'Blue',
  pink: 'Pink',
  purple: 'Purple',
  orange: 'Orange',
};

export const EYE_EN: Record<EyeColorId, string> = {
  blue: 'Blue',
  green: 'Green',
  brown: 'Brown',
  hazel: 'Hazel',
  amber: 'Amber',
  grey: 'Gray',
  teal: 'Teal',
  violet: 'Violet',
  dark: 'Dark',
};

export const EYE_SHAPE_EN: Record<EyeShape, string> = {
  round: 'Round',
  big: 'Big',
  almond: 'Almond',
  cat: 'Cat',
  button: 'Button',
};

export const MOUTH_EN: Record<MouthStyle, string> = {
  smile: 'Simple',
  lips: 'Lips',
  teeth: 'Toothy',
  buck: 'Buck teeth',
  fangs: 'Fangs',
  thin: 'Thin',
  wide: 'Wide',
};

export const HAIR_EN: Record<HairStyle, string> = {
  short: 'Short',
  sidePart: 'Side part',
  spiky: 'Spiky',
  curly: 'Curly',
  pompadour: 'Pompadour',
  long: 'Long',
  bob: 'Bob',
  ponytail: 'Ponytail',
  bun: 'Bun',
  pigtails: 'Pigtails',
};

export const HAIR_COLOR_EN: Record<keyof typeof HAIR_COLORS, string> = {
  brown: 'Brown',
  grey: 'Gray',
  black: 'Black',
  blond: 'Blond',
  ginger: 'Red',
  white: 'White',
  auburn: 'Auburn',
  pink: 'Pink',
  blue: 'Blue',
  purple: 'Purple',
};

export const STACHE_EN: Record<StacheStyle, string> = {
  handlebar: 'Handlebar',
  chevron: 'Chevron',
  pencil: 'Pencil',
  walrus: 'Walrus',
  horseshoe: 'Horseshoe',
  imperial: 'Imperial',
  fuManchu: 'Fu Manchu',
};

export const STACHE_COLOR_EN: Record<keyof typeof STACHE_COLORS, string> = {
  brown: 'Brown',
  grey: 'Gray',
  black: 'Black',
  blond: 'Blond',
  ginger: 'Red',
  white: 'White',
};

export const BEARD_EN: Record<BeardStyle, string> = {
  full: 'Full',
  goatee: 'Goatee',
  vandyke: 'Van Dyke',
  chinstrap: 'Chinstrap',
  mutton: 'Mutton chops',
  stubble: 'Stubble',
  long: 'Long',
};

export const HAT_EN: Record<HatKind, string> = {
  cap: 'Cap',
  top: 'Top hat',
  cowboy: 'Cowboy hat',
  beanie: 'Beanie',
  straw: 'Straw hat',
  crown: 'Crown',
  party: 'Party hat',
};

export const GESTURE_EN: Record<Gesture, string> = {
  thumbsUp: 'Thumbs up',
  thumbsDown: 'Thumbs down',
  rub: 'Rub hands',
  clap: 'Clap',
  wave: 'Wave',
  shrug: 'Shrug',
  facepalm: 'Facepalm',
  chin: 'Hand on chin',
  mewing: 'Mewing',
};

export const EYEWEAR_EN: Record<Eyewear, string> = {
  round: 'Round',
  square: 'Square',
  aviators: 'Aviators',
  sunglasses: 'Sunglasses',
  catEye: 'Cat-eye',
  monocle: 'Monocle',
  eyepatch: 'Eye patch',
};

export const BROW_EN: Record<'plain' | 'thick' | 'raised' | 'aviator', string> = {
  plain: 'Plain',
  thick: 'Thick',
  raised: 'One raised',
  aviator: 'Straight',
};

/** the editor's own texts in English */
export const EDITOR_EN: EditorTexts = {
  tabs: { cara: 'Face & eyes', rasgos: 'Brows & features', boca: 'Mouth', pelo: 'Hair', vello: 'Facial hair', accesorios: 'Accessories' },
  head: 'Head',
  headRound: 'Round',
  headAlien: 'Alien',
  skin: 'Skin color',
  eyeColor: 'Eye color',
  eyeShape: 'Eye shape',
  brows: 'Eyebrows',
  browColor: 'Eyebrow color',
  browLikeHair: 'Match hair',
  features: 'Features',
  mouth: 'Mouth style',
  lipColor: 'Lip color',
  hairMen: 'Men',
  hairWomen: 'Women',
  noHair: 'No hair',
  hairColor: 'Hair color',
  stache: 'Mustache',
  noStache: 'No mustache',
  stacheColor: 'Mustache color',
  beard: 'Beard',
  noBeard: 'No beard',
  beardColor: 'Beard color',
  eyewear: 'Glasses',
  noEyewear: 'No glasses',
  hat: 'Hat',
  noHat: 'No hat',
  hatColor: 'Hat color',
  hatOriginal: 'Original color',
  others: 'Other',
  glovesNote: 'The gloves show when the face makes a hand gesture.',
  alienNoBrows: 'The alien head has no eyebrows or features.',
  alienOwnMouth: 'The alien head has its own mouth.',
  alienNoHair: 'The alien head has no hair.',
  alienNoFacialHair: 'The alien head has no mustache or beard.',
  mood: 'Mood',
  gestures: 'Hand gestures',
  random: 'Random',
  tabsPrev: 'Previous categories',
  tabsNext: 'More categories',
  reset: 'Reset',
  otherColor: 'Other color',
  flags: { lashes: 'Eyelashes', freckles: 'Freckles', smirk: 'Smirk', mole: 'Beauty mark', cool: 'Relaxed look', flower: 'Flower', gloves: 'Gloves' },
};
