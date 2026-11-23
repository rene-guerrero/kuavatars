/**
 * Every label the library shows, per language. The library never guesses the language: the game
 * passes it (createAvatarEditor's `lang`, or reads LABELS[lang] for its own pickers).
 */
import * as EN from './labels-en';
import * as ES from './labels';

export type Lang = 'es' | 'en';
export const LANGS: readonly Lang[] = ['es', 'en'];

/** the option names for each part, plus the editor's own texts */
export interface Labels {
  mood: typeof ES.MOOD_ES;
  skin: typeof ES.SKIN_ES;
  eyeColor: typeof ES.EYE_ES;
  eyeShape: typeof ES.EYE_SHAPE_ES;
  mouth: typeof ES.MOUTH_ES;
  hair: typeof ES.HAIR_ES;
  hairColor: typeof ES.HAIR_COLOR_ES;
  stache: typeof ES.STACHE_ES;
  stacheColor: typeof ES.STACHE_COLOR_ES;
  beard: typeof ES.BEARD_ES;
  hat: typeof ES.HAT_ES;
  gesture: typeof ES.GESTURE_ES;
  eyewear: typeof ES.EYEWEAR_ES;
  brows: typeof ES.BROW_ES;
  editor: ES.EditorTexts;
}

export const LABELS: Record<Lang, Labels> = {
  es: {
    mood: ES.MOOD_ES,
    skin: ES.SKIN_ES,
    eyeColor: ES.EYE_ES,
    eyeShape: ES.EYE_SHAPE_ES,
    mouth: ES.MOUTH_ES,
    hair: ES.HAIR_ES,
    hairColor: ES.HAIR_COLOR_ES,
    stache: ES.STACHE_ES,
    stacheColor: ES.STACHE_COLOR_ES,
    beard: ES.BEARD_ES,
    hat: ES.HAT_ES,
    gesture: ES.GESTURE_ES,
    eyewear: ES.EYEWEAR_ES,
    brows: ES.BROW_ES,
    editor: ES.EDITOR_ES,
  },
  en: {
    mood: EN.MOOD_EN,
    skin: EN.SKIN_EN,
    eyeColor: EN.EYE_EN,
    eyeShape: EN.EYE_SHAPE_EN,
    mouth: EN.MOUTH_EN,
    hair: EN.HAIR_EN,
    hairColor: EN.HAIR_COLOR_EN,
    stache: EN.STACHE_EN,
    stacheColor: EN.STACHE_COLOR_EN,
    beard: EN.BEARD_EN,
    hat: EN.HAT_EN,
    gesture: EN.GESTURE_EN,
    eyewear: EN.EYEWEAR_EN,
    brows: EN.BROW_EN,
    editor: EN.EDITOR_EN,
  },
};

/** the labels for a language (anything that isn't 'en' gets Spanish, the library's original language) */
export const labelsFor = (lang: string | undefined): Labels => (lang === 'en' ? LABELS.en : LABELS.es);
