import { describe, expect, it } from 'vitest';
import { AvatarController, HUMAN_FACES, liveFace, staticFace } from '../src/index';

describe('special moods', () => {
  it('cry pours tears; other moods add none', () => {
    const svg = staticFace(HUMAN_FACES[0], 'cry');
    expect(svg.querySelector('.tears')?.getAttribute('display')).toBe('inline');
    expect(staticFace(HUMAN_FACES[0], 'sad').querySelector('.tears')).toBeNull();
  });

  it('rounds tall open mouths and keeps smiles as they were', () => {
    expect(staticFace(HUMAN_FACES[0], 'shout').querySelector('.mouth')?.getAttribute('d')).toContain('C');
    expect(staticFace(HUMAN_FACES[0], 'happy').querySelector('.mouth')?.getAttribute('d')).toContain('Q');
  });

  it('takes the new moods on seats and live faces', () => {
    const c = new AvatarController();
    c.setVisible(true);
    expect(() => {
      c.react(1, 'cry', 2);
      c.react(2, 'mew', 2);
      c.gesture(3, 'mewing');
    }).not.toThrow();
    expect(() => liveFace(HUMAN_FACES[0], 'cry').setExpr('mew')).not.toThrow();
  });
});
