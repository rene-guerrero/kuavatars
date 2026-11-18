import { afterEach, describe, expect, it } from 'vitest';
import { CHARACTER_FACES, HUMAN_FACES, createAvatarEditor, sameFace, sanitizeFace, type FaceSpec } from '../src/index';
import { sanitizeFace as sanitizeFromFaces } from '../src/faces';

describe('sanitizeFace', () => {
  it('keeps every valid option and drops junk', () => {
    const f = sanitizeFace({ iris: '#3f7fd9', skin: '#AF7E57', hair: 'bob', hairColor: 'auburn', hat: 'cap', hatColor: '#123456', eyewear: 'monocle', stache: 'black', stacheStyle: 'walrus', beard: 'goatee', mouth: 'lips', lipColor: '#D9455F', eyes: 'cat', lashes: true, bogus: 1, freckles: 'yes' });
    expect(f).toEqual({ iris: '#3F7FD9', skin: '#AF7E57', hair: 'bob', hairColor: 'auburn', hat: 'cap', hatColor: '#123456', eyewear: 'monocle', stache: 'black', stacheStyle: 'walrus', beard: 'goatee', mouth: 'lips', lipColor: '#D9455F', eyes: 'cat', lashes: true });
  });

  it('drops unknown values (a newer version saved them) and falls back without an eye colour', () => {
    expect(sanitizeFace({ iris: '#3F7FD9', hair: 'mohawk', hat: 'tiara' })).toEqual({ iris: '#3F7FD9' });
    expect(sanitizeFace({ skin: '#FFFFFF' })).toEqual(HUMAN_FACES[0]);
    expect(sanitizeFace('nope')).toEqual(HUMAN_FACES[0]);
    expect(sanitizeFace(null, CHARACTER_FACES.zorg)).toEqual(CHARACTER_FACES.zorg);
  });

  it('accepts a HUMAN_FACES index and every built-in face unchanged', () => {
    expect(sanitizeFace(3)).toEqual(HUMAN_FACES[3]);
    for (const f of [...HUMAN_FACES, ...Object.values(CHARACTER_FACES)] as FaceSpec[]) expect(sameFace(sanitizeFace(f), f)).toBe(true);
  });

  it('is available from the pure data entry point too', () => {
    expect(sanitizeFromFaces).toBe(sanitizeFace);
  });
});

describe('createAvatarEditor', () => {
  afterEach(() => document.body.replaceChildren());

  it('mounts with a preview, tabs and option tiles', () => {
    const box = document.createElement('div');
    document.body.append(box);
    const ed = createAvatarEditor(box, { value: 5 });
    expect(box.querySelector('.kua-editor')).toBe(ed.el);
    expect(ed.el.querySelectorAll('.kua-tab')).toHaveLength(6);
    expect(ed.el.querySelector('.kua-stage .face')).not.toBeNull();
    expect(ed.value).toEqual(HUMAN_FACES[5]);
  });

  it('reports changes and switches tabs', () => {
    const box = document.createElement('div');
    document.body.append(box);
    const seen: FaceSpec[] = [];
    const ed = createAvatarEditor(box, { onChange: (f) => seen.push(f) });
    (ed.el.querySelector('.kua-tab[data-tab="pelo"]') as HTMLButtonElement).click();
    const tiles = ed.el.querySelectorAll<HTMLButtonElement>('.kua-tile');
    expect(tiles.length).toBeGreaterThanOrEqual(11);
    tiles[1].click(); // first men's hairstyle
    expect(seen.at(-1)?.hair).toBe('short');
    (ed.el.querySelector('.kua-btn-accent') as HTMLButtonElement).click(); // Aleatorio
    expect(seen.length).toBe(2);
  });

  it('can hide the preview, moods and gestures, and take other texts', () => {
    const box = document.createElement('div');
    const ed = createAvatarEditor(box, { preview: false, moods: false, gestures: false, actions: false, texts: { tabs: { cara: 'Face' } as never } });
    expect(ed.el.querySelector('.kua-preview')).toBeNull();
    expect(ed.el.querySelector('.kua-tab')?.textContent).toBe('Face');
    ed.set({ iris: '#2F9B63', hat: 'crown' });
    expect(ed.value.hat).toBe('crown');
    ed.destroy();
    expect(box.querySelector('.kua-editor')).toBeNull();
  });
});
