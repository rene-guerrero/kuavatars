import '../src/avatars.css';
import { AvatarController, CHARACTER_FACES, HUMAN_FACES, MOODS, liveFace, staticFace, type AvatarQuality, type FaceSpec, type Mood } from '../src/index';

const $ = <T extends HTMLElement>(id: string) => document.getElementById(id) as T;
const el = (tag: string, cls = '', text = ''): HTMLElement => {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (text) e.textContent = text;
  return e;
};

const MOOD_ES: Record<Mood, string> = {
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
};

const faces: { name: string; spec: FaceSpec }[] = [
  ...HUMAN_FACES.map((spec, i) => ({ name: `Jugador ${i}`, spec })),
  ...Object.entries(CHARACTER_FACES).map(([id, spec]) => ({ name: id, spec: spec as FaceSpec })),
];

// ── every face × every mood (static) ──
const grid = $('grid');
const head = el('tr');
head.append(el('th'));
for (const m of MOODS) head.append(el('th', '', MOOD_ES[m]));
grid.append(head);
for (const f of faces) {
  const tr = el('tr');
  tr.append(el('th', 'row', f.name));
  for (const m of MOODS) {
    const td = el('td');
    const cell = el('div', 'cell');
    const box = el('span', 'face-static');
    box.append(staticFace(f.spec, m));
    cell.append(box);
    td.append(cell);
    tr.append(td);
  }
  grid.append(tr);
}

// ── small live faces ──
const liveMood = $<HTMLSelectElement>('liveMood');
for (const m of MOODS) liveMood.append(new Option(MOOD_ES[m], m));
const lives = faces.map((f) => {
  const lf = liveFace(f.spec, 'idle');
  const fig = el('figure');
  const box = el('span', 'face-static');
  box.append(lf.el);
  fig.append(box, el('figcaption', '', f.name));
  $('live').append(fig);
  return lf;
});
liveMood.onchange = () => lives.forEach((l) => l.setExpr(liveMood.value as Mood));

// ── live table ──
const SEAT_POS = [
  [50, 82],
  [86, 50],
  [50, 18],
  [14, 50],
];
const startFaces = [HUMAN_FACES[0], CHARACTER_FACES.carlos, CHARACTER_FACES.elena, CHARACTER_FACES.zorg];
const ctl = new AvatarController({ seats: 4, faces: startFaces });
const table = $('table');
const seatEls = SEAT_POS.map(([x, y], s) => {
  const seat = el('div', 'seat');
  seat.style.left = `${x}%`;
  seat.style.top = `${y}%`;
  seat.append(ctl.faceEl(s), el('span', 'seat-label', `Asiento ${s}`));
  table.append(seat);
  return seat;
});
const layout = () => {
  const r = table.getBoundingClientRect();
  ctl.setPositions(
    SEAT_POS.map(([x, y]) => ({ x: (x / 100) * r.width, y: (y / 100) * r.height })),
    { x: r.width / 2, y: r.height / 2 },
  );
};
layout();
addEventListener('resize', layout);
ctl.setVisible(true);

let turn = 0;
const setTurn = (s: number | null) => {
  turn = s ?? turn;
  seatEls.forEach((e, i) => e.classList.toggle('turn', i === s));
  ctl.onTurn(s);
};

// face pickers per seat
const seatbar = $('seatbar');
for (let s = 0; s < 4; s++) {
  const sel = document.createElement('select');
  faces.forEach((f, i) => sel.append(new Option(f.name, String(i))));
  sel.value = String(faces.findIndex((f) => f.spec === startFaces[s]));
  sel.onchange = () => ctl.setFace(s, faces[Number(sel.value)].spec);
  const lab = el('label', '', `Asiento ${s} `);
  lab.append(sel);
  seatbar.append(lab);
}

const hooks: [string, () => void][] = [
  ['Turno siguiente', () => setTurn((turn + 1) % 4)],
  ['Nadie juega', () => setTurn(null)],
  ['Atento (asiento 0)', () => ctl.perk(0)],
  ['Jugar', () => (ctl.onPlay(turn), ctl.onImpact(turn, 'clack'))],
  ['Golpe fuerte', () => (ctl.onPlay(turn, true), ctl.onImpact(turn, 'slam'))],
  ['Golpe final', () => (ctl.onPlay(turn, true), ctl.onImpact(turn, 'finish'))],
  ['Pasar', () => ctl.onPass(turn, (turn + 3) % 4)],
  ['Nueva ronda', () => ctl.onRoundStart()],
  ['Fin de ronda', () => ctl.onRoundEnd([0, 1, 2, 3].map((s) => (s % 2 === turn % 2 ? 'happy' : 'sad')))],
  ['Fin de ronda sorpresa', () => ctl.onRoundEnd([0, 1, 2, 3].map((s) => (s % 2 === turn % 2 ? 'happy' : 'sad')), true)],
  ['Empate', () => ctl.onRoundEnd(['meh', 'meh', 'meh', 'meh'])],
  ['Fin de partida', () => ctl.onMatchEnd([0, 1, 2, 3].map((s) => s % 2 === turn % 2))],
  ['Reiniciar', () => (ctl.reset(), seatEls.forEach((e) => e.classList.remove('turn')))],
];
for (const [label, fn] of hooks) {
  const b = el('button', '', label);
  b.onclick = fn;
  $('hooks').append(b);
}
const moodSel = document.createElement('select');
for (const m of MOODS) moodSel.append(new Option(`Ánimo: ${MOOD_ES[m]}`, m));
moodSel.onchange = () => ctl.react(turn, moodSel.value as Mood, 2.5);
$('hooks').append(moodSel);

// quality / reduced motion (the same switches the games use)
$<HTMLSelectElement>('quality').onchange = (e) => {
  const q = (e.target as HTMLSelectElement).value as AvatarQuality;
  document.documentElement.dataset.quality = q;
  ctl.setQuality(q);
};
$<HTMLInputElement>('reduced').onchange = (e) => {
  const on = (e.target as HTMLInputElement).checked;
  document.documentElement.classList.toggle('reduce-motion', on);
  ctl.setReducedMotion(on);
};
