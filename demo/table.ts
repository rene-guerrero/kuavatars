/** Demo: a live table with four seats and a button for every controller hook. */
import { AvatarController, GESTURES, HUMAN_FACES, MOODS, type FaceSpec, type Mood } from '../src/index';
import { sample } from './samples';
import { GESTURE_ES, MOOD_ES } from '../src/labels';
import { button, el } from './ui';

const SEATS: [number, number, string][] = [
  [50, 76, 'Tú'],
  [85, 48, 'Rival derecha'],
  [50, 20, 'Compañero'],
  [15, 48, 'Rival izquierda'],
];

export function mountTable(felt: HTMLElement, controls: HTMLElement, status: HTMLElement): AvatarController {
  const start: FaceSpec[] = [
    { ...HUMAN_FACES[0], hair: 'short' },
    sample('Tomás'),
    sample('Sofía'),
    sample('Zorg'),
  ];
  const ctl = new AvatarController({ seats: 4, faces: start });
  const seatEls = SEATS.map(([x, y, label], s) => {
    const seat = el('div', 'seat', el('span', 'seat-label', label));
    seat.style.left = `${x}%`;
    seat.style.top = `${y}%`;
    seat.prepend(ctl.faceEl(s));
    felt.append(seat);
    return seat;
  });
  const layout = () => {
    const r = felt.getBoundingClientRect();
    ctl.setPositions(
      SEATS.map(([x, y]) => ({ x: (x / 100) * r.width, y: (y / 100) * r.height })),
      { x: r.width / 2, y: r.height / 2 },
    );
  };
  layout();
  new ResizeObserver(layout).observe(felt);
  ctl.setVisible(true);

  let turn: number | null = null;
  const say = (t: string) => (status.textContent = t);
  const setTurn = (s: number | null) => {
    turn = s;
    seatEls.forEach((e, i) => e.classList.toggle('turn', i === s));
    ctl.onTurn(s);
    if (s === 0) ctl.perk(0);
    say(s === null ? 'Nadie juega: nadie se duerme.' : `Turno de ${SEATS[s][2].toLowerCase()}. Los demás se duermen si tarda.`);
  };
  const cur = () => turn ?? 0;
  const team = (s: number) => s % 2 === cur() % 2;

  const group = (title: string, ...btns: HTMLElement[]) => el('div', 'hook-group', el('div', 'mini-title', title), el('div', 'chips', ...btns));
  const moodSel = el('select', 'select');
  moodSel.id = 'table-mood';
  moodSel.append(new Option('Elegir ánimo…', ''));
  for (const m of MOODS) moodSel.append(new Option(MOOD_ES[m], m));
  moodSel.onchange = () => {
    if (moodSel.value) ctl.react(cur(), moodSel.value as Mood, 2.5);
    moodSel.value = '';
  };

  controls.append(
    group('Turnos', button('Siguiente turno', () => setTurn(((turn ?? -1) + 1) % 4), 'chip'), button('Nadie juega', () => setTurn(null), 'chip')),
    group(
      'Jugadas',
      button('Jugar', () => (ctl.onPlay(cur()), ctl.onImpact(cur(), 'clack')), 'chip'),
      button('Golpe fuerte', () => (ctl.onPlay(cur(), true), ctl.onImpact(cur(), 'slam')), 'chip'),
      button('Golpe final', () => (ctl.onPlay(cur(), true), ctl.onImpact(cur(), 'finish')), 'chip'),
      button('Pasar', () => ctl.onPass(cur(), (cur() + 3) % 4), 'chip'),
    ),
    group(
      'Ronda y partida',
      button('Nueva ronda', () => ctl.onRoundStart(), 'chip'),
      button('Ganan nosotros', () => ctl.onRoundEnd([0, 1, 2, 3].map((s) => (team(s) ? 'happy' : 'sad'))), 'chip'),
      button('Final sorpresa', () => ctl.onRoundEnd([0, 1, 2, 3].map((s) => (team(s) ? 'happy' : 'sad')), true), 'chip'),
      button('Empate', () => ctl.onRoundEnd(['meh', 'meh', 'meh', 'meh']), 'chip'),
      button('Fin de partida', () => ctl.onMatchEnd([0, 1, 2, 3].map(team)), 'chip'),
      button('Reiniciar', () => (ctl.reset(), setTurn(null)), 'chip chip-ghost'),
    ),
    group('Gestos (asiento del turno)', ...GESTURES.map((g) => button(GESTURE_ES[g], () => ctl.gesture(cur(), g), 'chip'))),
    group('Ánimo (asiento del turno)', moodSel),
  );
  say('Pulsa «Siguiente turno» y espera: los que no juegan se van durmiendo.');
  return ctl;
}
