import { describe, expect, it } from 'vitest';
import {
  AvatarController,
  BEARDS,
  EYE_SHAPES,
  GESTURES,
  HAIRS,
  HAIR_MEN,
  HAIR_WOMEN,
  HATS,
  HUMAN_FACES,
  MOODS,
  MOUTHS,
  STACHES,
  liveFace,
  staticFace,
  type FaceSpec,
} from '../src/index';

const base: FaceSpec = { iris: '#3F7FD9' };
const draws = (spec: FaceSpec) => {
  for (const m of MOODS) expect(() => staticFace(spec, m)).not.toThrow();
};

describe('face parts', () => {
  it('has at least five of every part', () => {
    expect(HATS.length).toBeGreaterThanOrEqual(5);
    expect(STACHES.length).toBeGreaterThanOrEqual(5);
    expect(BEARDS.length).toBeGreaterThanOrEqual(5);
    expect(EYE_SHAPES.length - 1).toBeGreaterThanOrEqual(4);
    expect(MOUTHS.length - 1).toBeGreaterThanOrEqual(5);
    expect(HAIR_MEN.length).toBe(5);
    expect(HAIR_WOMEN.length).toBe(5);
    expect(GESTURES.length).toBeGreaterThanOrEqual(5);
  });

  it('draws every hat, on the round head and the alien', () => {
    for (const hat of HATS) {
      expect(staticFace({ ...base, hat }).querySelector('.hat')).not.toBeNull();
      expect(staticFace({ iris: '#101418', alien: true, hat }).querySelector('.hat')).not.toBeNull();
    }
  });

  it('draws every moustache and beard in every mood', () => {
    for (const stacheStyle of STACHES) draws({ ...base, stache: 'black', stacheStyle });
    for (const beard of BEARDS) draws({ ...base, beard });
    expect(staticFace({ ...base, beard: 'full' }).querySelector('.beard')).not.toBeNull();
    // thin moustaches leave the mouth visible, bushy ones replace it
    expect(staticFace({ ...base, stache: 'brown', stacheStyle: 'pencil' }).querySelector('.mouth')).not.toBeNull();
    expect(staticFace({ ...base, stache: 'brown', stacheStyle: 'walrus' }).querySelector('.mouth')).toBeNull();
  });

  it('draws every eye shape with the animated parts', () => {
    for (const eyes of EYE_SHAPES) {
      const svg = staticFace({ ...base, eyes });
      const eye = svg.querySelectorAll('.eye');
      expect(eye).toHaveLength(2);
      for (const e of eye) for (const part of ['.open', '.iris', '.pupil', '.lid', '.lash', '.dlid', '.closed', '.happy']) expect(e.querySelector(part)).not.toBeNull();
      draws({ ...base, eyes });
    }
  });

  it('dresses the mouth for every style', () => {
    for (const mouth of MOUTHS) draws({ ...base, mouth });
    expect(staticFace({ ...base, mouth: 'lips' }).querySelector('.lips')?.getAttribute('d')).toMatch(/^M/);
    expect(staticFace({ ...base, mouth: 'teeth' }, 'happy').querySelector('.mteeth')).not.toBeNull();
    expect(staticFace({ ...base, mouth: 'fangs' }).querySelectorAll('.mfang')).toHaveLength(2);
  });

  it('draws every hairstyle, with and without a hat', () => {
    for (const hair of HAIRS) {
      draws({ ...base, hair });
      expect(staticFace({ ...base, hair }).querySelector('.hair')).not.toBeNull();
      expect(() => staticFace({ ...base, hair, hat: 'cap' })).not.toThrow();
    }
    expect(staticFace({ ...base, hair: 'long' }).querySelector('.hair-back')).not.toBeNull();
  });
});

describe('hands', () => {
  it('poses every gesture on a static face', () => {
    for (const g of GESTURES) {
      const svg = staticFace(HUMAN_FACES[0], 'idle', { gesture: g });
      const hands = svg.querySelector('.hands');
      expect(hands?.getAttribute('display')).toBe('inline');
      const shown = svg.querySelectorAll('.hp[display="inline"]');
      expect(shown.length).toBeGreaterThanOrEqual(1);
    }
  });

  it('adds no hands until a face gestures', () => {
    expect(staticFace(HUMAN_FACES[0]).querySelector('.hands')).toBeNull();
  });

  it('takes gestures on live faces and seats', () => {
    const lf = liveFace(HUMAN_FACES[0]);
    expect(() => lf.gesture('wave')).not.toThrow();
    expect(() => lf.follow(true)).not.toThrow();
    const c = new AvatarController();
    c.setVisible(true);
    for (const g of GESTURES) expect(() => c.gesture(1, g)).not.toThrow();
    expect(() => c.followPointer(true)).not.toThrow();
    c.followPointer(false);
  });
});
