/**
 * KuAvatars: animated 2D emoji avatars for table games.
 * Import the styles once as well: `import 'kuavatars/avatars.css'`.
 */
export { CHARACTER_FACES, FACE_COUNT, HUMAN_FACES, type CharacterId, type FaceSpec } from './faces';
export { EYE_SHAPES, type EyeShape } from './eyes';
export { EYEWEAR, type Eyewear } from './eyewear';
export { GESTURES, type Gesture } from './hands';
export { DEFAULT_LIPS, MOUTHS, type MouthStyle } from './mouths';
export { BEARDS, HAIRS, HAIR_COLORS, HAIR_MEN, HAIR_WOMEN, HATS, HAT_COLORS, STACHES, STACHE_COLORS, type BeardStyle, type HairStyle, type HatKind, type StacheStyle } from './parts';
export {
  DEFAULT_ALIEN_SKIN,
  DEFAULT_SKIN,
  EYE_COLORS,
  SKIN_TONES,
  alienPalette,
  facePalette,
  type AlienPalette,
  type EyeColorId,
  type FacePalette,
  type SkinToneId,
} from './colors';
export {
  AV_STATS,
  AvatarController,
  Face,
  MOODS,
  humanFace,
  liveFace,
  restMotion,
  setMiniQuality as setLiveFaceQuality,
  staticFace,
  type AvatarControllerOptions,
  type AvatarExpr,
  type FaceMotion,
  type Level as AvatarQuality,
  type Mood,
  type Point,
} from './avatars';
