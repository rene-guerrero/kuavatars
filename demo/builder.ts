/** Demo: the face creator — a live preview, tabbed controls with option thumbnails, and the FaceSpec. */
import {
  BEARDS,
  DEFAULT_ALIEN_SKIN,
  DEFAULT_LIPS,
  DEFAULT_SKIN,
  EYE_COLORS,
  EYE_SHAPES,
  EYEWEAR,
  GESTURES,
  HAIR_COLORS,
  HAIR_MEN,
  HAIR_WOMEN,
  HATS,
  HAT_COLORS,
  HUMAN_FACES,
  MOODS,
  MOUTHS,
  SKIN_TONES,
  STACHES,
  STACHE_COLORS,
  facePalette,
  liveFace,
  type FaceSpec,
  type Mood,
} from '../src/index';
import {
  BEARD_ES,
  BROW_ES,
  EYE_ES,
  EYE_SHAPE_ES,
  EYEWEAR_ES,
  GESTURE_ES,
  HAIR_COLOR_ES,
  HAIR_ES,
  HAT_ES,
  HAT_SWATCHES,
  LIP_SWATCHES,
  MOOD_ES,
  MOUTH_ES,
  SKIN_ES,
  STACHE_COLOR_ES,
  STACHE_ES,
} from './labels';
import { button, el, faceBox, field, optionTiles, swatches } from './ui';

type Tab = 'cara' | 'rasgos' | 'boca' | 'pelo' | 'vello' | 'accesorios';
const TABS: [Tab, string][] = [
  ['cara', 'Cara y ojos'],
  ['rasgos', 'Cejas y rasgos'],
  ['boca', 'Boca'],
  ['pelo', 'Pelo'],
  ['vello', 'Bigote y barba'],
  ['accesorios', 'Accesorios'],
];

type Flag = 'lashes' | 'freckles' | 'smirk' | 'mole' | 'cool' | 'flower' | 'gloves';
const FLAG_ES: Record<Flag, string> = {
  lashes: 'Pestañas',
  freckles: 'Pecas',
  smirk: 'Sonrisa ladeada',
  mole: 'Lunar',
  cool: 'Mirada relajada',
  flower: 'Flor',
  gloves: 'Guantes',
};

const keyOf = (table: Record<string, string>, hex: string): string | null =>
  Object.keys(table).find((k) => table[k].toUpperCase() === hex.toUpperCase()) ?? null;
const colorOf = (table: Record<string, string>, v: string | undefined, fallback: string): string => (v ? (table[v] ?? v) : fallback);
const pick = <T>(list: readonly T[]): T => list[Math.floor(Math.random() * list.length)];
const chance = (p: number) => Math.random() < p;
const entries = (table: Record<string, string>, labels: Record<string, string>): [string, string][] => Object.entries(table).map(([k, c]) => [c, labels[k] ?? k]);

export interface Builder {
  setFollow(on: boolean): void;
}

export function mountBuilder(root: HTMLElement, onUse: (spec: FaceSpec) => void): Builder {
  let spec: FaceSpec = { ...HUMAN_FACES[1], hair: 'long', hairColor: 'auburn', skin: SKIN_TONES.mediumLight, mouth: 'lips' };
  let mood: Mood = 'idle';
  let tab: Tab = 'cara';
  let follow = false;
  let live: ReturnType<typeof liveFace> | null = null;

  // ── preview ──
  const stage = el('div', 'stage');
  const moodRow = el('div', 'chips');
  for (const m of MOODS) {
    const b = button(
      MOOD_ES[m],
      () => {
        mood = m;
        live?.setExpr(m);
        for (const c of moodRow.children) c.setAttribute('aria-pressed', String(c === b));
      },
      'chip',
    );
    b.setAttribute('aria-pressed', String(m === mood));
    moodRow.append(b);
  }
  const gestRow = el('div', 'chips');
  for (const g of GESTURES) gestRow.append(button(GESTURE_ES[g], () => live?.gesture(g), 'chip chip-ghost'));
  const code = el('pre', 'code');
  const copyBtn = button(
    'Copiar',
    () => {
      navigator.clipboard.writeText(code.textContent ?? '').then(
        () => (copyBtn.textContent = 'Copiado'),
        () => {
          const r = document.createRange();
          r.selectNodeContents(code);
          getSelection()?.removeAllRanges();
          getSelection()?.addRange(r);
          copyBtn.textContent = 'Texto seleccionado';
        },
      );
      setTimeout(() => (copyBtn.textContent = 'Copiar'), 1600);
    },
    'btn btn-small',
  );
  const preview = el(
    'aside',
    'creator-preview card',
    stage,
    el('div', 'actions', button('Aleatorio', randomize, 'btn btn-accent'), button('Restablecer', reset), button('Usar en la mesa', () => onUse({ ...spec }))),
    el('div', 'mini-title', 'Ánimo'),
    moodRow,
    el('div', 'mini-title', 'Gestos con las manos'),
    gestRow,
    el('div', 'spec', el('div', 'spec-head', el('span', 'mini-title', 'FaceSpec'), copyBtn), code),
  );

  // ── controls ──
  const tabBar = el('div', 'tabs');
  tabBar.setAttribute('role', 'tablist');
  const panel = el('div', 'tab-panel');
  for (const [id, label] of TABS) {
    const b = button(
      label,
      () => {
        tab = id;
        render();
      },
      'tab',
    );
    b.dataset.tab = id;
    b.setAttribute('role', 'tab');
    tabBar.append(b);
  }
  root.append(preview, el('section', 'creator-controls card', tabBar, panel));

  const set = (patch: Partial<FaceSpec>, drop: (keyof FaceSpec)[] = []) => {
    const next = { ...spec, ...patch } as Record<string, unknown>;
    for (const k of drop) delete next[k];
    for (const k of Object.keys(next)) if (next[k] === undefined || next[k] === false) delete next[k];
    spec = next as unknown as FaceSpec;
    sync();
  };

  // ── panels ──
  function panelCara(): Node[] {
    const alien = !!spec.alien;
    const heads = optionTiles<'round' | 'alien'>(
      ['round', 'alien'],
      (v) => (v === 'alien' ? 'Alienígena' : 'Redonda'),
      (v) => (v === 'alien' ? { iris: '#101418', alien: true, skin: spec.skin } : { ...spec, alien: undefined, iris: alien ? EYE_COLORS.blue : spec.iris }),
      alien ? 'alien' : 'round',
      (v) => set(v === 'alien' ? { iris: '#101418', alien: true } : { alien: undefined, iris: EYE_COLORS.blue }),
    );
    const skin = swatches('skin', entries(SKIN_TONES, SKIN_ES), (hex) => set({ skin: hex }));
    skin.refresh(spec.skin ?? (alien ? DEFAULT_ALIEN_SKIN : DEFAULT_SKIN));
    const eyes = swatches('eyes', entries(EYE_COLORS, EYE_ES), (hex) => set({ iris: hex }));
    eyes.refresh(spec.iris);
    const out: Node[] = [field('Cabeza', heads), field('Color de piel', skin.row), field('Color de ojos', eyes.row)];
    if (!alien)
      out.push(
        field(
          'Forma de ojos',
          optionTiles(
            EYE_SHAPES,
            (v) => EYE_SHAPE_ES[v as keyof typeof EYE_SHAPE_ES],
            (v) => ({ ...spec, eyes: v === 'round' ? undefined : (v as FaceSpec['eyes']) }),
            spec.eyes ?? 'round',
            (v) => set({ eyes: v === 'round' ? undefined : (v as FaceSpec['eyes']) }),
          ),
        ),
      );
    return out;
  }

  function panelRasgos(): Node[] {
    if (spec.alien) return [el('p', 'note', 'La cabeza alienígena no tiene cejas ni rasgos.')];
    const brows = optionTiles(
      Object.keys(BROW_ES) as (keyof typeof BROW_ES)[],
      (v) => BROW_ES[v as keyof typeof BROW_ES],
      (v) => ({ ...spec, brows: v === 'plain' ? undefined : (v as FaceSpec['brows']) }),
      spec.brows ?? 'plain',
      (v) => set({ brows: v === 'plain' ? undefined : (v as FaceSpec['brows']) }),
    );
    const browColor = swatches('brow', entries(STACHE_COLORS, STACHE_COLOR_ES), (hex) => set({ browColor: hex }));
    browColor.refresh(spec.browColor ?? facePalette(spec).brow);
    const flags = el('div', 'chips');
    for (const k of ['lashes', 'freckles', 'smirk', 'mole', 'cool'] as Flag[]) {
      const b = button(
        FLAG_ES[k],
        () => {
          const on = !spec[k];
          set({ [k]: on || undefined });
        },
        'chip',
      );
      b.setAttribute('aria-pressed', String(!!spec[k]));
      flags.append(b);
    }
    return [field('Cejas', brows), field('Color de cejas', browColor.row, button('Como el pelo', () => set({}, ['browColor']), 'btn btn-small')), field('Rasgos', flags)];
  }

  function panelBoca(): Node[] {
    if (spec.alien) return [el('p', 'note', 'La cabeza alienígena tiene su propia boca.')];
    const tiles = optionTiles(
      MOUTHS,
      (v) => MOUTH_ES[v as keyof typeof MOUTH_ES],
      (v) => ({ ...spec, mouth: v === 'smile' ? undefined : (v as FaceSpec['mouth']), stache: undefined, beard: undefined }),
      spec.mouth ?? 'smile',
      (v) => set({ mouth: v === 'smile' ? undefined : (v as FaceSpec['mouth']) }, v === 'lips' ? [] : ['lipColor']),
      'happy',
    );
    const out: Node[] = [field('Estilo de boca', tiles)];
    if (spec.mouth === 'lips') {
      const lips = swatches('lips', LIP_SWATCHES.map((c) => [c, c]), (hex) => set({ lipColor: hex }));
      lips.refresh(spec.lipColor ?? DEFAULT_LIPS);
      out.push(field('Color de labios', lips.row));
    }
    return out;
  }

  function panelPelo(): Node[] {
    if (spec.alien) return [el('p', 'note', 'La cabeza alienígena no tiene pelo.')];
    const prev = (v: string): FaceSpec => ({ ...spec, hair: (v || undefined) as FaceSpec['hair'], hat: undefined });
    const choose = (v: string) => set({ hair: (v || undefined) as FaceSpec['hair'] });
    const color = swatches('hair', entries(HAIR_COLORS, HAIR_COLOR_ES), (hex) => set({ hairColor: keyOf(HAIR_COLORS, hex) ?? hex, hair: spec.hair ?? 'short' }));
    color.refresh(colorOf(HAIR_COLORS, spec.hairColor, HAIR_COLORS.brown));
    return [
      field('Hombre', optionTiles(['', ...HAIR_MEN], (v) => (v ? HAIR_ES[v as keyof typeof HAIR_ES] : 'Sin pelo'), prev, spec.hair ?? '', choose)),
      field('Mujer', optionTiles(HAIR_WOMEN, (v) => HAIR_ES[v as keyof typeof HAIR_ES], prev, spec.hair ?? '', choose)),
      field('Color de pelo', color.row),
    ];
  }

  function panelVello(): Node[] {
    if (spec.alien) return [el('p', 'note', 'La cabeza alienígena no tiene bigote ni barba.')];
    const stColor = swatches('stache', entries(STACHE_COLORS, STACHE_COLOR_ES), (hex) => set({ stache: keyOf(STACHE_COLORS, hex) ?? hex }));
    stColor.refresh(colorOf(STACHE_COLORS, spec.stache, STACHE_COLORS.brown));
    const bdColor = swatches('beard', entries(STACHE_COLORS, STACHE_COLOR_ES), (hex) => set({ beardColor: keyOf(STACHE_COLORS, hex) ?? hex }));
    bdColor.refresh(colorOf(STACHE_COLORS, spec.beardColor ?? spec.stache, STACHE_COLORS.brown));
    const stache = optionTiles(
      ['', ...STACHES],
      (v) => (v ? STACHE_ES[v as keyof typeof STACHE_ES] : 'Sin bigote'),
      (v) => ({ ...spec, stache: v ? (spec.stache ?? 'brown') : undefined, stacheStyle: v && v !== 'handlebar' ? (v as FaceSpec['stacheStyle']) : undefined, hat: undefined }),
      spec.stache ? (spec.stacheStyle ?? 'handlebar') : '',
      (v) => (v ? set({ stache: spec.stache ?? 'brown', stacheStyle: v === 'handlebar' ? undefined : (v as FaceSpec['stacheStyle']) }) : set({}, ['stache', 'stacheStyle'])),
    );
    const beard = optionTiles(
      ['', ...BEARDS],
      (v) => (v ? BEARD_ES[v as keyof typeof BEARD_ES] : 'Sin barba'),
      (v) => ({ ...spec, beard: (v || undefined) as FaceSpec['beard'], hat: undefined }),
      spec.beard ?? '',
      (v) => set({ beard: (v || undefined) as FaceSpec['beard'] }, v ? [] : ['beardColor']),
    );
    const out: Node[] = [field('Bigote', stache)];
    if (spec.stache) out.push(field('Color del bigote', stColor.row));
    out.push(field('Barba', beard));
    if (spec.beard) out.push(field('Color de la barba', bdColor.row));
    return out;
  }

  function panelAccesorios(): Node[] {
    const hatColor = swatches('hat', HAT_SWATCHES.map((c) => [c, c]), (hex) => set({ hatColor: hex, hat: spec.hat ?? 'cap' }));
    hatColor.refresh(spec.hatColor ?? (spec.hat ? HAT_COLORS[spec.hat] : ''));
    const flags = el('div', 'chips');
    for (const k of ['flower', 'gloves'] as Flag[]) {
      if (k === 'flower' && spec.alien) continue;
      const b = button(FLAG_ES[k], () => set({ [k]: !spec[k] || undefined }), 'chip');
      b.setAttribute('aria-pressed', String(!!spec[k]));
      flags.append(b);
    }
    const hats = optionTiles(
      ['', ...HATS],
      (v) => (v ? HAT_ES[v as keyof typeof HAT_ES] : 'Sin sombrero'),
      (v) => ({ ...spec, hat: (v || undefined) as FaceSpec['hat'], hatColor: undefined }),
      spec.hat ?? '',
      (v) => set({ hat: (v || undefined) as FaceSpec['hat'] }, ['hatColor']),
      'happy',
    );
    const current = spec.eyewear ?? (spec.aviators ? 'aviators' : spec.glasses ? 'round' : '');
    const glasses = optionTiles(
      ['', ...EYEWEAR],
      (v) => (v ? EYEWEAR_ES[v as keyof typeof EYEWEAR_ES] : 'Sin gafas'),
      (v) => ({ ...spec, glasses: undefined, aviators: undefined, eyewear: (v || undefined) as FaceSpec['eyewear'], hat: undefined }),
      current,
      (v) => set({ eyewear: (v || undefined) as FaceSpec['eyewear'] }, ['glasses', 'aviators']),
    );
    const out: Node[] = [];
    if (!spec.alien) out.push(field('Gafas', glasses));
    out.push(field('Sombrero', hats));
    if (spec.hat) out.push(field('Color del sombrero', hatColor.row, button('Color original', () => set({}, ['hatColor']), 'btn btn-small')));
    out.push(field('Otros', flags, el('p', 'note', 'Los guantes se ven cuando la cara hace un gesto con las manos.')));
    return out;
  }

  const PANELS: Record<Tab, () => Node[]> = { cara: panelCara, rasgos: panelRasgos, boca: panelBoca, pelo: panelPelo, vello: panelVello, accesorios: panelAccesorios };

  function render(): void {
    for (const b of tabBar.children) b.setAttribute('aria-selected', String((b as HTMLElement).dataset.tab === tab));
    panel.replaceChildren(...PANELS[tab]());
  }

  function sync(): void {
    live = liveFace(spec, mood);
    live.follow(follow);
    stage.replaceChildren(faceBox(live.el, 'stage-face'));
    code.textContent = JSON.stringify(spec, null, 2);
    render();
  }

  function reset(): void {
    spec = { ...HUMAN_FACES[0] };
    sync();
  }

  function randomize(): void {
    if (chance(0.06)) {
      spec = { iris: pick(['#101418', EYE_COLORS.violet, EYE_COLORS.teal]), alien: true };
      if (chance(0.5)) spec.skin = pick(Object.values(SKIN_TONES));
      if (chance(0.3)) spec.hat = pick(HATS);
      return sync();
    }
    const natural = [SKIN_TONES.yellow, SKIN_TONES.yellow, SKIN_TONES.light, SKIN_TONES.mediumLight, SKIN_TONES.medium, SKIN_TONES.mediumDark, SKIN_TONES.dark];
    const fem = chance(0.5);
    const s: Record<string, unknown> = {
      iris: pick(Object.values(EYE_COLORS)),
      skin: chance(0.85) ? pick(natural) : pick(Object.values(SKIN_TONES)),
      eyes: chance(0.5) ? undefined : pick(EYE_SHAPES.slice(1)),
      hair: chance(0.88) ? pick(fem ? HAIR_WOMEN : HAIR_MEN) : undefined,
      hairColor: pick(chance(0.85) ? ['brown', 'black', 'blond', 'ginger', 'auburn', 'grey'] : ['pink', 'blue', 'purple']),
      lashes: fem && chance(0.7) ? true : undefined,
      mouth: fem && chance(0.4) ? 'lips' : chance(0.3) ? pick(MOUTHS.slice(2)) : undefined,
      freckles: chance(0.2) || undefined,
      eyewear: chance(0.2) ? pick(EYEWEAR) : undefined,
      hat: chance(0.25) ? pick(HATS) : undefined,
    };
    if (!fem && chance(0.35)) s.stache = pick(['brown', 'black', 'grey', 'ginger', 'blond']);
    if (s.stache && chance(0.5)) s.stacheStyle = pick(STACHES.slice(1));
    if (!fem && chance(0.25)) s.beard = pick(BEARDS);
    if (s.mouth === 'lips') s.lipColor = pick(LIP_SWATCHES);
    for (const k of Object.keys(s)) if (s[k] === undefined) delete s[k];
    spec = s as unknown as FaceSpec;
    sync();
  }

  sync();
  return {
    setFollow(on) {
      follow = on;
      live?.follow(on);
    },
  };
}
