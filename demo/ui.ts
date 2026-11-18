/** Small DOM helpers for the demo. */
import { staticFace, type FaceSpec, type Mood } from '../src/index';

type Kids = (Node | string | null | false | undefined)[];

export function el<K extends keyof HTMLElementTagNameMap>(tag: K, cls = '', ...kids: Kids): HTMLElementTagNameMap[K] {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  for (const k of kids) if (k) e.append(k);
  return e;
}

export const $ = <T extends HTMLElement>(id: string): T => document.getElementById(id) as T;

/** a sized box holding a face svg */
export function faceBox(svg: SVGSVGElement, cls = ''): HTMLSpanElement {
  const b = el('span', `face-static ${cls}`.trim());
  b.append(svg);
  return b;
}

export const thumb = (spec: FaceSpec, mood: Mood = 'idle'): HTMLSpanElement => faceBox(staticFace(spec, mood), 'thumb');

/** a button */
export function button(label: string, onClick: () => void, cls = 'btn'): HTMLButtonElement {
  const b = el('button', cls, label);
  b.type = 'button';
  b.onclick = onClick;
  return b;
}

/** an on/off switch with a label */
export function toggle(id: string, label: string, onChange: (on: boolean) => void, on = false): HTMLLabelElement {
  const input = el('input');
  input.type = 'checkbox';
  input.id = id;
  input.checked = on;
  input.setAttribute('role', 'switch');
  input.onchange = () => onChange(input.checked);
  return el('label', 'switch', input, el('span', 'switch-track', el('span', 'switch-knob')), el('span', 'switch-label', label));
}

/** one-of-many buttons */
export function segmented<T extends string>(id: string, options: [T, string][], value: T, onChange: (v: T) => void): HTMLDivElement {
  const wrap = el('div', 'seg');
  wrap.id = id;
  wrap.setAttribute('role', 'radiogroup');
  const btns = options.map(([v, label]) => {
    const b = button(label, () => {
      for (const o of btns) o.setAttribute('aria-checked', String(o === b));
      onChange(v);
    }, 'seg-opt');
    b.setAttribute('role', 'radio');
    b.setAttribute('aria-checked', String(v === value));
    wrap.append(b);
    return b;
  });
  return wrap;
}

export interface Swatches {
  row: HTMLDivElement;
  refresh(current: string): void;
}

/** colour swatches plus a free colour picker */
export function swatches(id: string, colors: [string, string][], onPick: (hex: string) => void): Swatches {
  const row = el('div', 'swatches');
  row.id = id;
  const btns = colors.map(([hex, label]) => {
    const b = button('', () => onPick(hex), 'swatch');
    b.style.setProperty('--c', hex);
    b.title = label;
    b.setAttribute('aria-label', label);
    row.append(b);
    return { b, hex: hex.toUpperCase() };
  });
  const pick = el('input', 'swatch-pick');
  pick.type = 'color';
  pick.id = `${id}-pick`;
  pick.title = 'Otro color';
  pick.setAttribute('aria-label', 'Otro color');
  pick.oninput = () => onPick(pick.value.toUpperCase());
  row.append(pick);
  return {
    row,
    refresh(current: string) {
      const cur = current.toUpperCase();
      let known = false;
      for (const { b, hex } of btns) {
        const on = hex === cur;
        known ||= on;
        b.setAttribute('aria-pressed', String(on));
      }
      pick.classList.toggle('on', !known);
      if (/^#[0-9A-F]{6}$/.test(cur)) pick.value = cur.toLowerCase();
    },
  };
}

/** a grid of option tiles, each showing the face with that option */
export function optionTiles<T extends string>(
  options: readonly (T | '')[],
  label: (v: T | '') => string,
  preview: (v: T | '') => FaceSpec,
  current: T | '',
  onPick: (v: T | '') => void,
  mood: Mood = 'idle',
): HTMLDivElement {
  const grid = el('div', 'tiles');
  for (const v of options) {
    const b = el('button', 'tile', thumb(preview(v), mood), el('span', 'tile-label', label(v)));
    b.type = 'button';
    b.setAttribute('aria-pressed', String(v === current));
    b.onclick = () => onPick(v);
    grid.append(b);
  }
  return grid;
}

/** a labelled block inside a panel */
export const field = (title: string, ...kids: Kids): HTMLDivElement => el('div', 'field', el('div', 'field-title', title), ...kids);
