/**
 * The avatar editor: a live preview and tabbed controls where every option is a thumbnail of the
 * player's own face wearing it. Framework-free; styled by `kuavatars/editor.css` through CSS
 * variables, and it fits any width (it stacks on narrow containers).
 *
 *   const ed = createAvatarEditor(box, { lang: 'en', value: saved, onChange: (face) => save(face) });
 *
 * New parts added to the library show up here by themselves, so games never change for them.
 */
import { DEFAULT_ALIEN_SKIN, DEFAULT_SKIN, EYE_COLORS, SKIN_TONES, facePalette } from './colors';
import { liveFace, staticFace, MOODS, type Mood } from './avatars';
import { EYE_SHAPES } from './eyes';
import { EYEWEAR } from './eyewear';
import { HUMAN_FACES, type FaceSpec } from './faces';
import { GESTURES, type Gesture } from './hands';
import { labelsFor, type Lang } from './i18n';
import { HAT_SWATCHES, LIP_SWATCHES, type EditorTexts } from './labels';
import { DEFAULT_LIPS, MOUTHS } from './mouths';
import { BEARDS, HAIR_COLORS, HAIR_MEN, HAIR_WOMEN, HATS, HAT_COLORS, STACHES, STACHE_COLORS } from './parts';
import { sanitizeFace } from './sanitize';

export interface AvatarEditorOptions {
  /** the face to start from (a FaceSpec, or a HUMAN_FACES index) */
  value?: FaceSpec | number;
  /** called with a fresh FaceSpec on every change */
  onChange?(face: FaceSpec): void;
  /** the language of every text and option name: 'es' (default, neutral Spanish) or 'en' */
  lang?: Lang;
  /** override any of the editor's texts (on top of `lang`) */
  texts?: Partial<EditorTexts>;
  /** show the big live preview (default true) */
  preview?: boolean;
  /** mood chips under the preview (default true) */
  moods?: boolean;
  /** hand-gesture chips under the preview (default true) */
  gestures?: boolean;
  /** the Random / Reset buttons (default true) */
  actions?: boolean;
  /** offer the alien head (default true) */
  alien?: boolean;
  /**
   * the preview comes alive on its own: every 6–12 s a random hand gesture or a short mood, never
   * while the player is editing (3 s after the last touch) and not when the game sets the reduce-motion
   * class on <html> (default true)
   */
  ambient?: boolean;
  /** what Reset goes back to (default HUMAN_FACES[0]) */
  resetTo?: FaceSpec;
}

export interface AvatarEditor {
  /** the root element (already in the container) */
  readonly el: HTMLElement;
  /** the current face (a copy) */
  readonly value: FaceSpec;
  /** replace the face (no onChange) */
  set(face: FaceSpec | number): void;
  /** the preview's eyes follow the cursor */
  follow(on: boolean): void;
  /** the preview plays a hand gesture */
  gesture(g: Gesture): void;
  /** the preview shows a mood for a few seconds, then goes back */
  react(mood: Mood, seconds?: number): void;
  /** remove it from the page (and stop its timers) */
  destroy(): void;
}

type Tab = keyof EditorTexts['tabs'];
type Flag = keyof EditorTexts['flags'];

// ───────── tiny DOM helpers ─────────

type Kid = Node | string | null | false | undefined;
function el<K extends keyof HTMLElementTagNameMap>(tag: K, cls = '', ...kids: Kid[]): HTMLElementTagNameMap[K] {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  for (const k of kids) if (k) e.append(k);
  return e;
}
function btn(label: string, onClick: () => void, cls: string): HTMLButtonElement {
  const b = el('button', cls, label);
  b.type = 'button';
  b.onclick = onClick;
  return b;
}
const faceBox = (svg: SVGSVGElement, cls: string) => {
  const b = el('span', `face-static ${cls}`);
  b.append(svg);
  return b;
};
const field = (title: string, ...kids: Kid[]) => el('div', 'kua-field', el('div', 'kua-field-title', title), ...kids);
const pick = <T>(list: readonly T[]): T => list[Math.floor(Math.random() * list.length)];
const chance = (p: number) => Math.random() < p;
const keyOf = (table: Record<string, string>, hex: string): string | null => Object.keys(table).find((k) => table[k].toUpperCase() === hex.toUpperCase()) ?? null;
const colorOf = (table: Record<string, string>, v: string | undefined, fallback: string): string => (v ? (table[v] ?? v) : fallback);
const entries = (table: Record<string, string>, labels: Record<string, string>): [string, string][] => Object.entries(table).map(([k, c]) => [c, labels[k] ?? k]);

export function createAvatarEditor(container: HTMLElement, opts: AvatarEditorOptions = {}): AvatarEditor {
  const L = labelsFor(opts.lang);
  const base = L.editor;
  const T: EditorTexts = { ...base, ...opts.texts, tabs: { ...base.tabs, ...opts.texts?.tabs }, flags: { ...base.flags, ...opts.texts?.flags } };
  const resetTo = opts.resetTo ?? HUMAN_FACES[0];
  const allowAlien = opts.alien !== false;
  let spec: FaceSpec = sanitizeFace(opts.value ?? resetTo);
  let mood: Mood = 'idle';
  let tab: Tab = 'cara';
  let following = false;
  let live: ReturnType<typeof liveFace> | null = null;

  const root = el('div', 'kua-editor');
  const layout = el('div', 'kua-layout');
  root.append(layout);

  // ── swatches ──
  function swatches(colors: [string, string][], current: string, onPick: (hex: string) => void): HTMLDivElement {
    const row = el('div', 'kua-swatches');
    const cur = current.toUpperCase();
    let known = false;
    for (const [hex, label] of colors) {
      const b = btn('', () => onPick(hex), 'kua-swatch');
      b.style.setProperty('--c', hex);
      b.title = label;
      b.setAttribute('aria-label', label);
      const on = hex.toUpperCase() === cur;
      known ||= on;
      b.setAttribute('aria-pressed', String(on));
      row.append(b);
    }
    const pickEl = el('input', `kua-swatch-pick${known ? '' : ' on'}`);
    pickEl.type = 'color';
    pickEl.title = T.otherColor;
    pickEl.setAttribute('aria-label', T.otherColor);
    if (/^#[0-9A-F]{6}$/.test(cur)) pickEl.value = cur.toLowerCase();
    pickEl.onchange = () => onPick(pickEl.value.toUpperCase());
    row.append(pickEl);
    return row;
  }

  // ── option tiles (each shows the face with that option) ──
  function tiles<V extends string>(options: readonly V[], label: (v: V) => string, preview: (v: V) => FaceSpec, current: V, onPick: (v: V) => void, m: Mood = 'idle'): HTMLDivElement {
    const grid = el('div', 'kua-tiles');
    for (const v of options) {
      const b = el('button', 'kua-tile', faceBox(staticFace(preview(v), m), 'kua-thumb'), el('span', 'kua-tile-label', label(v)));
      b.type = 'button';
      b.setAttribute('aria-pressed', String(v === current));
      b.onclick = () => onPick(v);
      grid.append(b);
    }
    return grid;
  }

  const set = (patch: Partial<FaceSpec>, drop: (keyof FaceSpec)[] = []) => {
    lastTouch = Date.now();
    const next = { ...spec, ...patch } as Record<string, unknown>;
    for (const k of drop) delete next[k];
    spec = sanitizeFace(next);
    sync(true);
  };

  // ── preview ──
  const stage = el('div', 'kua-stage');
  const side = el('div', 'kua-preview', stage);
  if (opts.actions !== false) {
    side.append(el('div', 'kua-actions', btn(T.random, randomize, 'kua-btn kua-btn-accent'), btn(T.reset, () => ((spec = sanitizeFace(resetTo)), sync(true)), 'kua-btn')));
  }
  if (opts.moods !== false) {
    const row = el('div', 'kua-chips');
    for (const m of MOODS) {
      const b = btn(
        L.mood[m],
        () => {
          mood = m;
          live?.setExpr(m);
          for (const c of row.children) c.setAttribute('aria-pressed', String(c === b));
        },
        'kua-chip',
      );
      b.setAttribute('aria-pressed', String(m === mood));
      row.append(b);
    }
    side.append(el('div', 'kua-mini-title', T.mood), row);
  }
  if (opts.gestures !== false) {
    const row = el('div', 'kua-chips');
    for (const g of GESTURES) row.append(btn(L.gesture[g], () => live?.gesture(g), 'kua-chip kua-chip-ghost'));
    side.append(el('div', 'kua-mini-title', T.gestures), row);
  }
  if (opts.preview !== false) layout.append(side);

  // ── controls ──
  const tabBar = el('div', 'kua-tabs');
  tabBar.setAttribute('role', 'tablist');
  const panel = el('div', 'kua-panel');
  for (const id of Object.keys(T.tabs) as Tab[]) {
    const b = btn(T.tabs[id], () => ((tab = id), render()), 'kua-tab');
    b.dataset.tab = id;
    b.setAttribute('role', 'tab');
    tabBar.append(b);
  }
  // arrows instead of a scrollbar: each scrolls the row by about a page; dimmed at its end, gone when all tabs fit
  const arrow = (dir: -1 | 1) => {
    const a = btn(dir < 0 ? '‹' : '›', () => {
      const smooth = !document.documentElement.classList.contains('reduce-motion');
      tabBar.scrollBy({ left: dir * Math.max(80, tabBar.clientWidth * 0.8), behavior: smooth ? 'smooth' : 'auto' });
    }, `kua-tabs-arrow kua-tabs-${dir < 0 ? 'prev' : 'next'}`);
    a.setAttribute('aria-label', dir < 0 ? T.tabsPrev : T.tabsNext);
    a.tabIndex = -1; // keyboard users reach every tab with Tab already
    a.hidden = true;
    return a;
  };
  const prev = arrow(-1);
  const next = arrow(1);
  const updateArrows = () => {
    // the arrows show only when the tabs don't fit the whole row (their own width counted back in)
    const row = tabBar.clientWidth + (prev.hidden ? 0 : prev.offsetWidth + next.offsetWidth);
    prev.hidden = next.hidden = tabBar.scrollWidth <= row + 1;
    const max = tabBar.scrollWidth - tabBar.clientWidth;
    prev.disabled = tabBar.scrollLeft <= 1;
    next.disabled = tabBar.scrollLeft >= max - 1;
  };
  tabBar.addEventListener('scroll', updateArrows, { passive: true }); // browsers already send these once a frame
  const tabsResize = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(updateArrows);
  tabsResize?.observe(tabBar);
  layout.append(el('div', 'kua-controls', el('div', 'kua-tabrow', prev, tabBar, next), panel));
  container.append(root);

  const note = (t: string) => el('p', 'kua-note', t);

  function panelCara(): Node[] {
    const alien = !!spec.alien;
    const out: Node[] = [];
    if (allowAlien)
      out.push(
        field(
          T.head,
          tiles<'round' | 'alien'>(
            ['round', 'alien'],
            (v) => (v === 'alien' ? T.headAlien : T.headRound),
            (v) => (v === 'alien' ? { iris: '#101418', alien: true, skin: spec.skin } : { ...spec, alien: undefined, iris: alien ? EYE_COLORS.blue : spec.iris }),
            alien ? 'alien' : 'round',
            (v) => set(v === 'alien' ? { iris: '#101418', alien: true } : { iris: EYE_COLORS.blue }, v === 'alien' ? [] : ['alien']),
          ),
        ),
      );
    out.push(field(T.skin, swatches(entries(SKIN_TONES, L.skin), spec.skin ?? (alien ? DEFAULT_ALIEN_SKIN : DEFAULT_SKIN), (hex) => set({ skin: hex }))));
    out.push(field(T.eyeColor, swatches(entries(EYE_COLORS, L.eyeColor), spec.iris, (hex) => set({ iris: hex }))));
    if (!alien)
      out.push(
        field(
          T.eyeShape,
          tiles(EYE_SHAPES, (v) => L.eyeShape[v], (v) => ({ ...spec, eyes: v === 'round' ? undefined : v }), spec.eyes ?? 'round', (v) => (v === 'round' ? set({}, ['eyes']) : set({ eyes: v }))),
        ),
      );
    return out;
  }

  function panelRasgos(): Node[] {
    if (spec.alien) return [note(T.alienNoBrows)];
    const browKeys = Object.keys(L.brows) as (keyof typeof L.brows)[];
    const flags = el('div', 'kua-chips');
    for (const k of ['lashes', 'freckles', 'smirk', 'mole', 'cool'] as Flag[]) {
      const b = btn(T.flags[k], () => (spec[k] ? set({}, [k]) : set({ [k]: true })), 'kua-chip');
      b.setAttribute('aria-pressed', String(!!spec[k]));
      flags.append(b);
    }
    return [
      field(T.brows, tiles(browKeys, (v) => L.brows[v], (v) => ({ ...spec, brows: v === 'plain' ? undefined : v }), spec.brows ?? 'plain', (v) => (v === 'plain' ? set({}, ['brows']) : set({ brows: v })))),
      field(T.browColor, swatches(entries(STACHE_COLORS, L.stacheColor), spec.browColor ?? facePalette(spec).brow, (hex) => set({ browColor: hex })), btn(T.browLikeHair, () => set({}, ['browColor']), 'kua-btn kua-btn-small')),
      field(T.features, flags),
    ];
  }

  function panelBoca(): Node[] {
    if (spec.alien) return [note(T.alienOwnMouth)];
    const out: Node[] = [
      field(T.mouth, tiles(MOUTHS, (v) => L.mouth[v], (v) => ({ ...spec, mouth: v === 'smile' ? undefined : v, stache: undefined, beard: undefined }), spec.mouth ?? 'smile', (v) => (v === 'smile' ? set({}, ['mouth', 'lipColor']) : set({ mouth: v }, v === 'lips' ? [] : ['lipColor'])), 'happy')),
    ];
    if (spec.mouth === 'lips') out.push(field(T.lipColor, swatches(LIP_SWATCHES.map((c) => [c, c]), spec.lipColor ?? DEFAULT_LIPS, (hex) => set({ lipColor: hex }))));
    return out;
  }

  function panelPelo(): Node[] {
    if (spec.alien) return [note(T.alienNoHair)];
    const prev = (v: string): FaceSpec => ({ ...spec, hair: (v || undefined) as FaceSpec['hair'], hat: undefined });
    const choose = (v: string) => (v ? set({ hair: v as FaceSpec['hair'] }) : set({}, ['hair', 'hairColor']));
    return [
      field(T.hairMen, tiles(['', ...HAIR_MEN], (v) => (v ? L.hair[v as keyof typeof L.hair] : T.noHair), prev, spec.hair ?? '', choose)),
      field(T.hairWomen, tiles<string>(HAIR_WOMEN, (v) => L.hair[v as keyof typeof L.hair], prev, spec.hair ?? '', choose)),
      field(T.hairColor, swatches(entries(HAIR_COLORS, L.hairColor), colorOf(HAIR_COLORS, spec.hairColor, HAIR_COLORS.brown), (hex) => set({ hairColor: keyOf(HAIR_COLORS, hex) ?? hex, hair: spec.hair ?? 'short' }))),
    ];
  }

  function panelVello(): Node[] {
    if (spec.alien) return [note(T.alienNoFacialHair)];
    const out: Node[] = [
      field(
        T.stache,
        tiles(
          ['', ...STACHES],
          (v) => (v ? L.stache[v] : T.noStache),
          (v) => ({ ...spec, stache: v ? (spec.stache ?? 'brown') : undefined, stacheStyle: v && v !== 'handlebar' ? v : undefined, hat: undefined }),
          spec.stache ? (spec.stacheStyle ?? 'handlebar') : '',
          (v) => (v ? set({ stache: spec.stache ?? 'brown', stacheStyle: v === 'handlebar' ? undefined : v }, v === 'handlebar' ? ['stacheStyle'] : []) : set({}, ['stache', 'stacheStyle'])),
        ),
      ),
    ];
    if (spec.stache) out.push(field(T.stacheColor, swatches(entries(STACHE_COLORS, L.stacheColor), colorOf(STACHE_COLORS, spec.stache, STACHE_COLORS.brown), (hex) => set({ stache: keyOf(STACHE_COLORS, hex) ?? hex }))));
    out.push(field(T.beard, tiles(['', ...BEARDS], (v) => (v ? L.beard[v] : T.noBeard), (v) => ({ ...spec, beard: v || undefined, hat: undefined }), spec.beard ?? '', (v) => (v ? set({ beard: v }) : set({}, ['beard', 'beardColor'])))));
    if (spec.beard) out.push(field(T.beardColor, swatches(entries(STACHE_COLORS, L.stacheColor), colorOf(STACHE_COLORS, spec.beardColor ?? spec.stache, STACHE_COLORS.brown), (hex) => set({ beardColor: keyOf(STACHE_COLORS, hex) ?? hex }))));
    return out;
  }

  function panelAccesorios(): Node[] {
    const out: Node[] = [];
    if (!spec.alien) {
      const current = spec.eyewear ?? (spec.aviators ? 'aviators' : spec.glasses ? 'round' : '');
      out.push(
        field(
          T.eyewear,
          tiles(['', ...EYEWEAR], (v) => (v ? L.eyewear[v] : T.noEyewear), (v) => ({ ...spec, glasses: undefined, aviators: undefined, eyewear: v || undefined, hat: undefined }), current, (v) =>
            v ? set({ eyewear: v }, ['glasses', 'aviators']) : set({}, ['eyewear', 'glasses', 'aviators']),
          ),
        ),
      );
    }
    out.push(field(T.hat, tiles(['', ...HATS], (v) => (v ? L.hat[v] : T.noHat), (v) => ({ ...spec, hat: v || undefined, hatColor: undefined }), spec.hat ?? '', (v) => (v ? set({ hat: v }, ['hatColor']) : set({}, ['hat', 'hatColor'])), 'happy')));
    if (spec.hat) out.push(field(T.hatColor, swatches(HAT_SWATCHES.map((c) => [c, c]), spec.hatColor ?? HAT_COLORS[spec.hat], (hex) => set({ hatColor: hex })), btn(T.hatOriginal, () => set({}, ['hatColor']), 'kua-btn kua-btn-small')));
    const flags = el('div', 'kua-chips');
    for (const k of ['flower', 'gloves'] as Flag[]) {
      if (k === 'flower' && spec.alien) continue;
      const b = btn(T.flags[k], () => (spec[k] ? set({}, [k]) : set({ [k]: true })), 'kua-chip');
      b.setAttribute('aria-pressed', String(!!spec[k]));
      flags.append(b);
    }
    out.push(field(T.others, flags, note(T.glovesNote)));
    return out;
  }

  const PANELS: Record<Tab, () => Node[]> = { cara: panelCara, rasgos: panelRasgos, boca: panelBoca, pelo: panelPelo, vello: panelVello, accesorios: panelAccesorios };

  function render(): void {
    for (const b of tabBar.children) {
      const on = (b as HTMLElement).dataset.tab === tab;
      b.setAttribute('aria-selected', String(on));
      // keep the chosen tab in view (the arrows may have scrolled it away)
      if (on) {
        const r = b.getBoundingClientRect();
        const bar = tabBar.getBoundingClientRect();
        if (r.left < bar.left) tabBar.scrollLeft += r.left - bar.left - 8;
        else if (r.right > bar.right) tabBar.scrollLeft += r.right - bar.right + 8;
      }
    }
    panel.replaceChildren(...PANELS[tab]());
    updateArrows();
  }

  function sync(changed: boolean): void {
    if (opts.preview !== false) {
      live = liveFace(spec, mood);
      live.follow(following);
      stage.replaceChildren(faceBox(live.el, 'kua-stage-face'));
    }
    render();
    if (changed) opts.onChange?.({ ...spec });
  }

  function randomize(): void {
    if (allowAlien && chance(0.06)) {
      const a: FaceSpec = { iris: pick(['#101418', EYE_COLORS.violet, EYE_COLORS.teal]), alien: true };
      if (chance(0.5)) a.skin = pick(Object.values(SKIN_TONES));
      if (chance(0.3)) a.hat = pick(HATS);
      spec = a;
      return sync(true);
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
    spec = sanitizeFace(s);
    sync(true);
  }

  // ── ambient life: a gesture or a short mood now and then, while the player isn't editing ──
  const AMBIENT_MOODS: Mood[] = ['happy', 'smug', 'amazed', 'thinking', 'perk', 'meh'];
  let lastTouch = 0;
  let ambientTimer = 0;
  let moodTimer = 0;
  const touch = () => (lastTouch = Date.now());
  root.addEventListener('pointerdown', touch, { passive: true });
  root.addEventListener('keydown', touch);
  // the game's own "less motion" setting (the reduce-motion class on <html>, like the rest of the library)
  const reducedMotion = () => document.documentElement.classList.contains('reduce-motion');

  function react(m: Mood, seconds = 1.8): void {
    if (!live) return;
    clearTimeout(moodTimer);
    live.setExpr(m);
    moodTimer = window.setTimeout(() => live?.setExpr(mood), seconds * 1000);
  }
  function scheduleAmbient(delay = 6000 + Math.random() * 6000): void {
    clearTimeout(ambientTimer);
    ambientTimer = window.setTimeout(() => {
      if (!root.isConnected) return; // removed from the page: stop
      const idle = Date.now() - lastTouch;
      if (idle < 3000 || document.hidden || reducedMotion() || opts.preview === false) return scheduleAmbient(Math.max(3000 - idle, 0) + 2000 + Math.random() * 3000);
      if (Math.random() < 0.55) live?.gesture(pick(GESTURES));
      else react(pick(AMBIENT_MOODS));
      scheduleAmbient();
    }, delay);
  }
  if (opts.ambient !== false) scheduleAmbient();

  sync(false);
  return {
    el: root,
    get value() {
      return { ...spec };
    },
    set(face) {
      spec = sanitizeFace(face);
      sync(false);
    },
    follow(on) {
      following = on;
      live?.follow(on);
    },
    gesture(g) {
      live?.gesture(g);
    },
    react(m, seconds) {
      react(m, seconds);
    },
    destroy() {
      clearTimeout(ambientTimer);
      clearTimeout(moodTimer);
      tabsResize?.disconnect();
      root.remove();
    },
  };
}
