import { afterEach, describe, expect, it } from 'vitest';
import { LABELS, createAvatarEditor, labelsFor } from '../src/index';

const keysDeep = (o: object): string[] =>
  Object.entries(o)
    .flatMap(([k, v]) => (v && typeof v === 'object' ? keysDeep(v).map((s) => `${k}.${s}`) : [k]))
    .sort();

describe('labels', () => {
  it('English and Spanish name exactly the same things', () => {
    expect(keysDeep(LABELS.en)).toEqual(keysDeep(LABELS.es));
  });

  it('no English label is empty or left in Spanish', () => {
    const es = new Map(keysDeep(LABELS.es).map((k) => [k, k.split('.').reduce((o: any, p) => o[p], LABELS.es)]));
    // names that are the same word in both languages
    const same = new Set(['Imperial', 'Chevron', 'Mewing']);
    for (const k of keysDeep(LABELS.en)) {
      const en = k.split('.').reduce((o: any, p) => o[p], LABELS.en) as string;
      expect(en.trim(), k).not.toBe('');
      if (!same.has(en)) expect(en, k).not.toBe(es.get(k));
      expect(en, k).not.toMatch(/[áéíóúñ¿¡]/i);
    }
  });

  it('labelsFor falls back to Spanish', () => {
    expect(labelsFor('en')).toBe(LABELS.en);
    expect(labelsFor('es')).toBe(LABELS.es);
    expect(labelsFor(undefined)).toBe(LABELS.es);
  });
});

describe('editor language', () => {
  afterEach(() => document.body.replaceChildren());

  const tabs = (ed: { el: HTMLElement }) => [...ed.el.querySelectorAll('.kua-tab')].map((b) => b.textContent);

  it('is Spanish by default', () => {
    const ed = createAvatarEditor(document.body.appendChild(document.createElement('div')), { ambient: false });
    expect(tabs(ed)[0]).toBe('Cara y ojos');
    ed.destroy();
  });

  it('speaks English with lang: en, option names included', () => {
    const ed = createAvatarEditor(document.body.appendChild(document.createElement('div')), { lang: 'en', ambient: false });
    expect(tabs(ed)).toEqual(Object.values(LABELS.en.editor.tabs));
    const text = ed.el.textContent ?? '';
    expect(text).toContain('Skin color');
    expect(text).toContain('Calm'); // mood chips
    expect(text).toContain('Thumbs up'); // gesture chips
    expect(text).not.toMatch(/Aleatorio|Restablecer|Color de piel/);
    ed.destroy();
  });

  it('texts still override single strings on top of lang', () => {
    const ed = createAvatarEditor(document.body.appendChild(document.createElement('div')), { lang: 'en', texts: { random: 'Surprise me' }, ambient: false });
    expect(ed.el.textContent).toContain('Surprise me');
    ed.destroy();
  });
});
