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
import { BEARD_ES, EYEWEAR_ES, EYE_SHAPE_ES, GESTURE_ES, HAIR_ES, HAT_ES, MOOD_ES, MOUTH_ES, SKIN_ES, STACHE_ES } from '../src/labels';
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

export const GALLERY: { id: string; title: string; lead: string; build: () => HTMLElement }[] = [
  {
    id: 'ojos',
    title: 'Formas de ojos',
    lead: 'Todas parpadean, miran alrededor y cambian con el ánimo.',
    build: () => grid(...EYE_SHAPES.map((e) => tile(EYE_SHAPE_ES[e], [[{ iris: EYE_COLORS.blue, eyes: e }, 'idle'], [{ iris: EYE_COLORS.green, eyes: e, lashes: true }, 'happy'], [{ iris: EYE_COLORS.hazel, eyes: e }, 'amazed']]))),
  },
  {
    id: 'gafas',
    title: 'Gafas',
    lead: 'Siete estilos, del monóculo al parche de pirata. Las de sol bajan por la nariz al asombrarse.',
    build: () =>
      grid(
        ...EYEWEAR.map((e) =>
          tile(EYEWEAR_ES[e], [
            [{ iris: EYE_COLORS.blue, eyewear: e }, 'idle'],
            [{ iris: EYE_COLORS.green, eyewear: e, skin: SKIN_TONES.mediumLight }, 'happy'],
            [{ iris: EYE_COLORS.brown, eyewear: e, skin: SKIN_TONES.mediumDark }, 'amazed'],
          ]),
        ),
      ),
  },
  {
    id: 'bocas',
    title: 'Bocas',
    lead: 'Cada estilo viste la misma boca animada, así que funciona con todos los ánimos.',
    build: () => grid(...MOUTHS.map((m) => tile(MOUTH_ES[m], [[{ iris: EYE_COLORS.green, mouth: m }, 'idle'], [{ iris: EYE_COLORS.green, mouth: m, skin: SKIN_TONES.medium }, 'happy'], [{ iris: EYE_COLORS.green, mouth: m }, 'shout']]))),
  },
  {
    id: 'peinados',
    title: 'Peinados',
    lead: 'Cinco para hombre y cinco para mujer, en cualquier color. Las cejas toman el color del pelo.',
    build: () =>
      grid(
        ...HAIRS.map((h) =>
          tile(HAIR_ES[h], [
            [{ iris: EYE_COLORS.blue, hair: h }, 'idle'],
            [{ iris: EYE_COLORS.green, skin: SKIN_TONES.light, hair: h, hairColor: 'blond', lashes: true }, 'happy'],
            [{ iris: EYE_COLORS.brown, skin: SKIN_TONES.mediumDark, hair: h, hairColor: 'black' }, 'idle'],
          ]),
        ),
      ),
  },
  {
    id: 'bigotes',
    title: 'Bigotes',
    lead: 'Siguen la expresión de la boca: suben al sonreír y caen con la tristeza.',
    build: () => grid(...STACHES.map((s) => tile(STACHE_ES[s], [[{ iris: EYE_COLORS.brown, stache: 'brown', stacheStyle: s }, 'idle'], [{ iris: EYE_COLORS.brown, stache: 'black', stacheStyle: s, skin: SKIN_TONES.light }, 'happy'], [{ iris: EYE_COLORS.brown, stache: 'grey', stacheStyle: s, skin: SKIN_TONES.mediumDark }, 'sad']]))),
  },
  {
    id: 'barbas',
    title: 'Barbas',
    lead: 'Se combinan con cualquier bigote y por defecto toman su color.',
    build: () =>
      grid(
        ...BEARDS.map((b) =>
          tile(BEARD_ES[b], [
            [{ iris: EYE_COLORS.brown, beard: b }, 'idle'],
            [{ iris: EYE_COLORS.blue, beard: b, stache: 'black', stacheStyle: 'chevron', skin: SKIN_TONES.light }, 'happy'],
            [{ iris: EYE_COLORS.hazel, beard: b, stache: 'ginger', skin: SKIN_TONES.medium }, 'amazed'],
          ]),
        ),
      ),
  },
  {
    id: 'sombreros',
    title: 'Sombreros',
    lead: 'Cada sombrero acepta cualquier color; las sombras se calculan solas.',
    build: () => grid(...HATS.map((h) => tile(HAT_ES[h], [[{ ...HUMAN_FACES[0], hat: h }, 'happy'], [{ iris: EYE_COLORS.brown, skin: SKIN_TONES.medium, hair: 'short', hat: h }, 'idle'], [{ ...sample('Zorg'), hat: h }, 'happy']], 'gtile-tall'))),
  },
  {
    id: 'gestos',
    title: 'Gestos con las manos',
    lead: 'Manos flotantes, sin brazos. La mano derecha aparece a la izquierda de la cara.',
    build: () => grid(...GESTURES.map((g) => tile(GESTURE_ES[g], [[HUMAN_FACES[0], 'idle', g], [{ iris: EYE_COLORS.brown, skin: SKIN_TONES.mediumDark, gloves: true }, 'idle', g]], 'gtile-hands'))),
  },
  {
    id: 'tonos',
    title: 'Tonos de piel',
    lead: 'Las sombras, el rubor y las líneas se calculan a partir del color de piel.',
    build: () => grid(...(Object.keys(SKIN_TONES) as (keyof typeof SKIN_TONES)[]).map((k) => tile(SKIN_ES[k], [[{ ...HUMAN_FACES[0], skin: SKIN_TONES[k] }, 'happy'], [{ ...sample('Tomás'), skin: SKIN_TONES[k] }, 'idle'], [{ ...sample('Zorg'), skin: SKIN_TONES[k] }, 'idle']]))),
  },
];

/** small live faces (pickers / cards); returns their handles */
export function mountLiveFaces(root: HTMLElement, onMoodSelect: HTMLSelectElement): ReturnType<typeof liveFace>[] {
  const faces: [string, FaceSpec][] = [
    ...HUMAN_FACES.map((s, i): [string, FaceSpec] => [`Jugador ${i + 1}`, s]),
    ...SAMPLES.map((s): [string, FaceSpec] => [s.name, s.face]),
  ];
  for (const m of MOODS) onMoodSelect.append(new Option(MOOD_ES[m], m));
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
  for (const m of MOODS) head.append(el('th', '', MOOD_ES[m]));
  table.append(el('thead', '', head));
  const body = el('tbody');
  const faces: [string, FaceSpec][] = [
    ...HUMAN_FACES.map((s, i): [string, FaceSpec] => [`Jugador ${i + 1}`, s]),
    ...SAMPLES.map((s): [string, FaceSpec] => [s.name, s.face]),
  ];
  for (const [name, spec] of faces) {
    const tr = el('tr', '', el('th', 'sticky-col', name));
    for (const m of MOODS) tr.append(el('td', '', faceBox(staticFace(spec, m), 'cell-face')));
    body.append(tr);
  }
  table.append(body);
}
