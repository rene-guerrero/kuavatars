/** Demo: gallery cards (every option of every part) and the small live faces. */
import {
  BEARDS,
  EYE_COLORS,
  EYE_SHAPES,
  EYEWEAR,
  GESTURES,
  HAIRS,
  HATS,
  HUMAN_FACES,
  MOODS,
  MOUTHS,
  SKIN_TONES,
  STACHES,
  liveFace,
  staticFace,
  type FaceSpec,
  type Gesture,
  type Mood,
} from '../src/index';
import { L, t } from './i18n';
import { SAMPLES, sample } from './samples';
import { el, faceBox } from './ui';

type Look = [FaceSpec, Mood, Gesture?];

/** one gallery tile: a few faces in a row and a caption */
function tile(name: string, looks: Look[], cls = ''): HTMLElement {
  const faces = el('div', 'gtile-faces');
  for (const [spec, mood, gesture] of looks) faces.append(faceBox(staticFace(spec, mood, gesture ? { gesture } : {}), 'gface'));
  return el('figure', `gtile ${cls}`.trim(), faces, el('figcaption', '', name));
}

const grid = (...tiles: HTMLElement[]) => el('div', 'ggrid', ...tiles);

export const GALLERY = (): { id: string; title: string; lead: string; build: () => HTMLElement }[] => [
  {
    id: 'ojos',
    title: t('Formas de ojos', 'Eye shapes'),
    lead: t('Todas parpadean, miran alrededor y cambian con el ánimo.', 'They all blink, look around and change with the mood.'),
    build: () => grid(...EYE_SHAPES.map((e) => tile(L.eyeShape[e], [[{ iris: EYE_COLORS.blue, eyes: e }, 'idle'], [{ iris: EYE_COLORS.green, eyes: e, lashes: true }, 'happy'], [{ iris: EYE_COLORS.hazel, eyes: e }, 'amazed']]))),
  },
  {
    id: 'gafas',
    title: t('Gafas', 'Glasses'),
    lead: t('Siete estilos, del monóculo al parche de pirata. Las de sol bajan por la nariz al asombrarse.', 'Seven styles, from a monocle to a pirate eye patch. Sunglasses slide down the nose when the face is amazed.'),
    build: () =>
      grid(
        ...EYEWEAR.map((e) =>
          tile(L.eyewear[e], [
            [{ iris: EYE_COLORS.blue, eyewear: e }, 'idle'],
            [{ iris: EYE_COLORS.green, eyewear: e, skin: SKIN_TONES.mediumLight }, 'happy'],
            [{ iris: EYE_COLORS.brown, eyewear: e, skin: SKIN_TONES.mediumDark }, 'amazed'],
          ]),
        ),
      ),
  },
  {
    id: 'bocas',
    title: t('Bocas', 'Mouths'),
    lead: t('Cada estilo viste la misma boca animada, así que funciona con todos los ánimos.', 'Every style dresses the same animated mouth, so it works with every mood.'),
    build: () => grid(...MOUTHS.map((m) => tile(L.mouth[m], [[{ iris: EYE_COLORS.green, mouth: m }, 'idle'], [{ iris: EYE_COLORS.green, mouth: m, skin: SKIN_TONES.medium }, 'happy'], [{ iris: EYE_COLORS.green, mouth: m }, 'shout']]))),
  },
  {
    id: 'peinados',
    title: t('Peinados', 'Hairstyles'),
    lead: t('Cinco para hombre y cinco para mujer, en cualquier color. Las cejas toman el color del pelo.', 'Five for men and five for women, in any color. The eyebrows take the hair color.'),
    build: () =>
      grid(
        ...HAIRS.map((h) =>
          tile(L.hair[h], [
            [{ iris: EYE_COLORS.blue, hair: h }, 'idle'],
            [{ iris: EYE_COLORS.green, skin: SKIN_TONES.light, hair: h, hairColor: 'blond', lashes: true }, 'happy'],
            [{ iris: EYE_COLORS.brown, skin: SKIN_TONES.mediumDark, hair: h, hairColor: 'black' }, 'idle'],
          ]),
        ),
      ),
  },
  {
    id: 'bigotes',
    title: t('Bigotes', 'Mustaches'),
    lead: t('Siguen la expresión de la boca: suben al sonreír y caen con la tristeza.', 'They follow the mouth: up with a smile, down when sad.'),
    build: () => grid(...STACHES.map((s) => tile(L.stache[s], [[{ iris: EYE_COLORS.brown, stache: 'brown', stacheStyle: s }, 'idle'], [{ iris: EYE_COLORS.brown, stache: 'black', stacheStyle: s, skin: SKIN_TONES.light }, 'happy'], [{ iris: EYE_COLORS.brown, stache: 'grey', stacheStyle: s, skin: SKIN_TONES.mediumDark }, 'sad']]))),
  },
  {
    id: 'barbas',
    title: t('Barbas', 'Beards'),
    lead: t('Se combinan con cualquier bigote y por defecto toman su color.', 'They go with any mustache and take its color by default.'),
    build: () =>
      grid(
        ...BEARDS.map((b) =>
          tile(L.beard[b], [
            [{ iris: EYE_COLORS.brown, beard: b }, 'idle'],
            [{ iris: EYE_COLORS.blue, beard: b, stache: 'black', stacheStyle: 'chevron', skin: SKIN_TONES.light }, 'happy'],
            [{ iris: EYE_COLORS.hazel, beard: b, stache: 'ginger', skin: SKIN_TONES.medium }, 'amazed'],
          ]),
        ),
      ),
  },
  {
    id: 'sombreros',
    title: t('Sombreros', 'Hats'),
    lead: t('Cada sombrero acepta cualquier color; las sombras se calculan solas.', 'Every hat takes any color; the shading is worked out automatically.'),
    build: () => grid(...HATS.map((h) => tile(L.hat[h], [[{ ...HUMAN_FACES[0], hat: h }, 'happy'], [{ iris: EYE_COLORS.brown, skin: SKIN_TONES.medium, hair: 'short', hat: h }, 'idle'], [{ ...sample('Zorg'), hat: h }, 'happy']], 'gtile-tall'))),
  },
  {
    id: 'gestos',
    title: t('Gestos con las manos', 'Hand gestures'),
    lead: t('Manos flotantes, sin brazos. La mano derecha aparece a la izquierda de la cara.', 'Floating hands, no arms. The right hand shows on the left of the face.'),
    build: () => grid(...GESTURES.map((g) => tile(L.gesture[g], [[HUMAN_FACES[0], 'idle', g], [{ iris: EYE_COLORS.brown, skin: SKIN_TONES.mediumDark, gloves: true }, 'idle', g]], 'gtile-hands'))),
  },
  {
    id: 'tonos',
    title: t('Tonos de piel', 'Skin tones'),
    lead: t('Las sombras, el rubor y las líneas se calculan a partir del color de piel.', 'Shading, blush and outlines are all worked out from the skin color.'),
    build: () => grid(...(Object.keys(SKIN_TONES) as (keyof typeof SKIN_TONES)[]).map((k) => tile(L.skin[k], [[{ ...HUMAN_FACES[0], skin: SKIN_TONES[k] }, 'happy'], [{ ...sample('Tomás'), skin: SKIN_TONES[k] }, 'idle'], [{ ...sample('Zorg'), skin: SKIN_TONES[k] }, 'idle']]))),
  },
];

/** small live faces (pickers / cards); returns their handles */
export function mountLiveFaces(root: HTMLElement, onMoodSelect: HTMLSelectElement): ReturnType<typeof liveFace>[] {
  const faces: [string, FaceSpec][] = [
    ...HUMAN_FACES.map((s, i): [string, FaceSpec] => [t(`Jugador ${i + 1}`, `Player ${i + 1}`), s]),
    ...SAMPLES.map((s): [string, FaceSpec] => [s.name, s.face]),
  ];
  for (const m of MOODS) onMoodSelect.append(new Option(L.mood[m], m));
  const lives = faces.map(([name, spec]) => {
    const lf = liveFace(spec, 'idle');
    root.append(el('figure', 'ltile', faceBox(lf.el, 'lface'), el('figcaption', '', name)));
    return lf;
  });
  onMoodSelect.onchange = () => lives.forEach((l) => l.setExpr(onMoodSelect.value as Mood));
  return lives;
}

/** every built-in face in every mood */
export function mountAllFaces(table: HTMLTableElement): void {
  const head = el('tr', '', el('th', 'sticky-col'));
  for (const m of MOODS) head.append(el('th', '', L.mood[m]));
  table.append(el('thead', '', head));
  const body = el('tbody');
  const faces: [string, FaceSpec][] = [
    ...HUMAN_FACES.map((s, i): [string, FaceSpec] => [t(`Jugador ${i + 1}`, `Player ${i + 1}`), s]),
    ...SAMPLES.map((s): [string, FaceSpec] => [s.name, s.face]),
  ];
  for (const [name, spec] of faces) {
    const tr = el('tr', '', el('th', 'sticky-col', name));
    for (const m of MOODS) tr.append(el('td', '', faceBox(staticFace(spec, m), 'cell-face')));
    body.append(tr);
  }
  table.append(body);
}
