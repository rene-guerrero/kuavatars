/** Demo: a live table with four seats and a button for every controller hook. */
import { AvatarController, GESTURES, HUMAN_FACES, MOODS, type FaceSpec, type Mood } from '../src/index';
import { sample } from './samples';
import { L, t } from './i18n';
import { button, el } from './ui';

const SEATS: [number, number, string][] = [
  [50, 76, t('Tú', 'You')],
  [85, 48, t('Rival derecha', 'Right opponent')],
  [50, 20, t('Compañero', 'Partner')],
  [15, 48, t('Rival izquierda', 'Left opponent')],
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
    say(
      s === null
        ? t('Nadie juega: nadie se duerme.', 'Nobody is playing: nobody dozes off.')
        : s === 0
          ? t('Es tu turno. Los demás se duermen si tardas.', 'Your turn. The others doze off if you take too long.')
          : t(`Turno de ${SEATS[s][2].toLowerCase()}. Los demás se duermen si tarda.`, `${SEATS[s][2]}'s turn. The others doze off if they take too long.`),
    );
  };
  const cur = () => turn ?? 0;
  const team = (s: number) => s % 2 === cur() % 2;

  const group = (title: string, ...btns: HTMLElement[]) => el('div', 'hook-group', el('div', 'mini-title', title), el('div', 'chips', ...btns));
  const moodSel = el('select', 'select');
  moodSel.id = 'table-mood';
  moodSel.append(new Option(t('Elegir ánimo…', 'Pick a mood…'), ''));
  for (const m of MOODS) moodSel.append(new Option(L.mood[m], m));
  moodSel.onchange = () => {
    if (moodSel.value) ctl.react(cur(), moodSel.value as Mood, 2.5);
    moodSel.value = '';
  };

  controls.append(
    group(t('Turnos', 'Turns'), button(t('Siguiente turno', 'Next turn'), () => setTurn(((turn ?? -1) + 1) % 4), 'chip'), button(t('Nadie juega', 'Nobody plays'), () => setTurn(null), 'chip')),
    group(
      t('Jugadas', 'Plays'),
      button(t('Jugar', 'Play'), () => (ctl.onPlay(cur()), ctl.onImpact(cur(), 'clack')), 'chip'),
      button(t('Golpe fuerte', 'Hard slam'), () => (ctl.onPlay(cur(), true), ctl.onImpact(cur(), 'slam')), 'chip'),
      button(t('Golpe final', 'Winning slam'), () => (ctl.onPlay(cur(), true), ctl.onImpact(cur(), 'finish')), 'chip'),
      button(t('Pasar', 'Pass'), () => ctl.onPass(cur(), (cur() + 3) % 4), 'chip'),
    ),
    group(
      t('Ronda y partida', 'Round and match'),
      button(t('Nueva ronda', 'New round'), () => ctl.onRoundStart(), 'chip'),
      button(t('Ganamos nosotros', 'We win'), () => ctl.onRoundEnd([0, 1, 2, 3].map((s) => (team(s) ? 'happy' : 'sad'))), 'chip'),
      button(t('Final sorpresa', 'Surprise finish'), () => ctl.onRoundEnd([0, 1, 2, 3].map((s) => (team(s) ? 'happy' : 'sad')), true), 'chip'),
      button(t('Empate', 'Tie'), () => ctl.onRoundEnd(['meh', 'meh', 'meh', 'meh']), 'chip'),
      button(t('Fin de partida', 'End of match'), () => ctl.onMatchEnd([0, 1, 2, 3].map(team)), 'chip'),
      button(t('Reiniciar', 'Reset'), () => (ctl.reset(), setTurn(null)), 'chip chip-ghost'),
    ),
    group(t('Gestos (asiento del turno)', 'Gestures (seat whose turn it is)'), ...GESTURES.map((g) => button(L.gesture[g], () => ctl.gesture(cur(), g), 'chip'))),
    group(t('Ánimo (asiento del turno)', 'Mood (seat whose turn it is)'), moodSel),
  );
  say(t('Pulsa «Siguiente turno» y espera: los que no juegan se van durmiendo.', 'Press “Next turn” and wait: the players who are waiting slowly doze off.'));
  return ctl;
}
