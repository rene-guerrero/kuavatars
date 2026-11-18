import { describe, expect, it } from 'vitest';
import { CHARACTER_FACES, HUMAN_FACES, staticFace, type FaceSpec, type Mood } from '../src/index';

/** the moods the snapshot was recorded with (new moods don't change existing faces) */
const MOODS: Mood[] = ['idle', 'happy', 'perk', 'smug', 'sad', 'meh', 'angry', 'amazed', 'thinking', 'sleepy', 'asleep', 'shout', 'hurt'];

/**
 * Guard against unintended visual changes: a hash of the SVG markup of every built-in face in every
 * mood. When a change to a face is intended, check it in the demo and update with `npx vitest -u`.
 */
const fnv = (s: string): string => {
  let h = 0x811c9dc5;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return h.toString(16).padStart(8, '0');
};
const markup = (f: FaceSpec): string =>
  MOODS.map((m) => staticFace(f, m, { gx: 0.3, gy: -0.2 }).outerHTML.replace(/av[a-z0-9]{4}\d+/g, 'ID')).join('');

describe('built-in faces render unchanged', () => {
  it('human faces', () => {
    expect(Object.fromEntries(HUMAN_FACES.map((f, i) => [i, fnv(markup(f))]))).toMatchSnapshot();
  });
  it('character faces', () => {
    expect(Object.fromEntries(Object.entries(CHARACTER_FACES).map(([id, f]) => [id, fnv(markup(f))]))).toMatchSnapshot();
  });
});
