/**
 * KuAvatars: animated 2D emoji avatars shared by the Ku games.
 * Import the styles once as well: `import 'kuavatars/avatars.css'`.
 */
export { CHARACTER_FACES, FACE_COUNT, HUMAN_FACES, type CharacterId, type FaceSpec } from './faces';
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
