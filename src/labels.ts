/** The library's Spanish labels (neutral Spanish). English: labels-en.ts; both: LABELS in i18n.ts. */
import type {
  BeardStyle,
  Eyewear,
  EyeColorId,
  EyeShape,
  Gesture,
  HairStyle,
  HatKind,
  Mood,
  MouthStyle,
  SkinToneId,
  StacheStyle,
} from './index';
import type { HAIR_COLORS, STACHE_COLORS } from './index';

export const MOOD_ES: Record<Mood, string> = {
  idle: 'Tranquilo',
  perk: 'Atento',
  happy: 'Feliz',
  sad: 'Triste',
  angry: 'Decidido',
  amazed: 'Asombrado',
  thinking: 'Pensando',
  sleepy: 'Con sueño',
  asleep: 'Dormido',
  smug: 'Satisfecho',
  meh: 'Indiferente',
  shout: 'Gritando',
  hurt: 'Dolido',
  mew: 'Mewing',
  cry: 'Llorando',
};

/** @deprecated display names for CHARACTER_FACES; games name their own characters */
export const CHAR_ES: Record<string, string> = {
  lola: 'Lola',
  pepe: 'Pepe',
  nico: 'Nico',
  elena: 'Elena',
  andres: 'Andrés',
  rosa: 'Rosa',
  carlos: 'Carlos',
  marta: 'Marta',
  julio: 'Don Julio',
  zorg: 'Papi Zorg',
};

export const SKIN_ES: Record<SkinToneId, string> = {
  yellow: 'Amarillo',
  light: 'Clara',
  mediumLight: 'Clara media',
  medium: 'Media',
  mediumDark: 'Morena',
  dark: 'Oscura',
  green: 'Verde',
  blue: 'Azul',
  pink: 'Rosa',
  purple: 'Morado',
  orange: 'Naranja',
};

export const EYE_ES: Record<EyeColorId, string> = {
  blue: 'Azules',
  green: 'Verdes',
  brown: 'Marrones',
  hazel: 'Avellana',
  amber: 'Ámbar',
  grey: 'Grises',
  teal: 'Turquesa',
  violet: 'Violeta',
  dark: 'Oscuros',
};

export const EYE_SHAPE_ES: Record<EyeShape, string> = {
  round: 'Redondos',
  big: 'Grandes',
  almond: 'Almendrados',
  cat: 'De gato',
  button: 'De botón',
};

export const MOUTH_ES: Record<MouthStyle, string> = {
  smile: 'Sencilla',
  lips: 'Labios',
  teeth: 'Con dientes',
  buck: 'Dientes de conejo',
  fangs: 'Colmillos',
  thin: 'Fina',
  wide: 'Ancha',
};

export const HAIR_ES: Record<HairStyle, string> = {
  short: 'Corto',
  sidePart: 'Raya al lado',
  spiky: 'De punta',
  curly: 'Rizado',
  pompadour: 'Tupé',
  long: 'Largo',
  bob: 'Melena corta',
  ponytail: 'Cola de caballo',
  bun: 'Moño',
  pigtails: 'Dos coletas',
};

export const HAIR_COLOR_ES: Record<keyof typeof HAIR_COLORS, string> = {
  brown: 'Castaño',
  grey: 'Canoso',
  black: 'Negro',
  blond: 'Rubio',
  ginger: 'Pelirrojo',
  white: 'Blanco',
  auburn: 'Caoba',
  pink: 'Rosa',
  blue: 'Azul',
  purple: 'Morado',
};

export const STACHE_ES: Record<StacheStyle, string> = {
  handlebar: 'Manubrio',
  chevron: 'Chevron',
  pencil: 'Lápiz',
  walrus: 'Morsa',
  horseshoe: 'Herradura',
  imperial: 'Imperial',
  fuManchu: 'Fu Manchú',
};

export const STACHE_COLOR_ES: Record<keyof typeof STACHE_COLORS, string> = {
  brown: 'Castaño',
  grey: 'Canoso',
  black: 'Negro',
  blond: 'Rubio',
  ginger: 'Pelirrojo',
  white: 'Blanco',
};

export const BEARD_ES: Record<BeardStyle, string> = {
  full: 'Completa',
  goatee: 'Perilla',
  vandyke: 'Perilla en punta',
  chinstrap: 'Contorno',
  mutton: 'Patillas',
  stubble: 'De tres días',
  long: 'Larga',
};

export const HAT_ES: Record<HatKind, string> = {
  cap: 'Gorra',
  top: 'Chistera',
  cowboy: 'Vaquero',
  beanie: 'Gorro de lana',
  straw: 'Sombrero de paja',
  crown: 'Corona',
  party: 'Gorro de fiesta',
};

export const GESTURE_ES: Record<Gesture, string> = {
  thumbsUp: 'Pulgar arriba',
  thumbsDown: 'Pulgar abajo',
  rub: 'Frotarse las manos',
  clap: 'Aplaudir',
  wave: 'Saludar',
  shrug: 'Encogerse de hombros',
  facepalm: 'Mano en la cara',
  chin: 'Mano en la barbilla',
  mewing: 'Mewing',
};

export const EYEWEAR_ES: Record<Eyewear, string> = {
  round: 'Redondas',
  square: 'Cuadradas',
  aviators: 'De aviador',
  sunglasses: 'De sol',
  catEye: 'Ojo de gato',
  monocle: 'Monóculo',
  eyepatch: 'Parche de pirata',
};

export const BROW_ES: Record<'plain' | 'thick' | 'raised' | 'aviator', string> = {
  plain: 'Normales',
  thick: 'Gruesas',
  raised: 'Una levantada',
  aviator: 'Rectas',
};

export const LIP_SWATCHES = ['#D9455F', '#B8264A', '#F07A8C', '#C2603E', '#8A3A6E', '#9A5A4A'];
export const HAT_SWATCHES = ['#D9443A', '#2E2A33', '#A86B3C', '#3F74D6', '#E6C46E', '#F2B630', '#7B5CF0', '#2FA36B', '#F2F0EA'];

/** the editor's own texts (buttons, tabs, field titles, notes) */
export const EDITOR_ES = {
  tabs: { cara: 'Cara y ojos', rasgos: 'Cejas y rasgos', boca: 'Boca', pelo: 'Pelo', vello: 'Bigote y barba', accesorios: 'Accesorios' },
  head: 'Cabeza',
  headRound: 'Redonda',
  headAlien: 'Alienígena',
  skin: 'Color de piel',
  eyeColor: 'Color de ojos',
  eyeShape: 'Forma de ojos',
  brows: 'Cejas',
  browColor: 'Color de cejas',
  browLikeHair: 'Como el pelo',
  features: 'Rasgos',
  mouth: 'Estilo de boca',
  lipColor: 'Color de labios',
  hairMen: 'Hombre',
  hairWomen: 'Mujer',
  noHair: 'Sin pelo',
  hairColor: 'Color de pelo',
  stache: 'Bigote',
  noStache: 'Sin bigote',
  stacheColor: 'Color del bigote',
  beard: 'Barba',
  noBeard: 'Sin barba',
  beardColor: 'Color de la barba',
  eyewear: 'Gafas',
  noEyewear: 'Sin gafas',
  hat: 'Sombrero',
  noHat: 'Sin sombrero',
  hatColor: 'Color del sombrero',
  hatOriginal: 'Color original',
  others: 'Otros',
  glovesNote: 'Los guantes se ven cuando la cara hace un gesto con las manos.',
  alienNoBrows: 'La cabeza alienígena no tiene cejas ni rasgos.',
  alienOwnMouth: 'La cabeza alienígena tiene su propia boca.',
  alienNoHair: 'La cabeza alienígena no tiene pelo.',
  alienNoFacialHair: 'La cabeza alienígena no tiene bigote ni barba.',
  mood: 'Ánimo',
  gestures: 'Gestos con las manos',
  random: 'Aleatorio',
  tabsPrev: 'Ver categorías anteriores',
  tabsNext: 'Ver más categorías',
  reset: 'Restablecer',
  otherColor: 'Otro color',
  flags: { lashes: 'Pestañas', freckles: 'Pecas', smirk: 'Sonrisa ladeada', mole: 'Lunar', cool: 'Mirada relajada', flower: 'Flor', gloves: 'Guantes' },
};
export type EditorTexts = typeof EDITOR_ES;
