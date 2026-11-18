import { afterEach, describe, expect, it } from 'vitest';
import { AvatarController, CHARACTER_FACES, FACE_COUNT, HUMAN_FACES, MOODS, humanFace, liveFace, staticFace } from '../src/index';

describe('faces', () => {
  it('has the nine pickable faces and every character', () => {
    expect(FACE_COUNT).toBe(9);
    expect(HUMAN_FACES).toHaveLength(9);
    expect(Object.keys(CHARACTER_FACES).sort()).toEqual(['andres', 'carlos', 'elena', 'julio', 'lola', 'marta', 'nico', 'pepe', 'rosa', 'zorg']);
    expect(CHARACTER_FACES.zorg.alien).toBe(true);
  });

  it('clamps a human face index', () => {
    expect(humanFace(-3)).toBe(HUMAN_FACES[0]);
    expect(humanFace(99)).toBe(HUMAN_FACES[8]);
    expect(humanFace(Number.NaN)).toBe(HUMAN_FACES[0]);
    expect(humanFace(3.2)).toBe(HUMAN_FACES[3]);
  });

  it('lists every mood', () => {
    expect([...MOODS].sort()).toEqual(['amazed', 'angry', 'asleep', 'cry', 'happy', 'hurt', 'idle', 'meh', 'mew', 'perk', 'sad', 'shout', 'sleepy', 'smug', 'thinking']);
  });
});

describe('staticFace', () => {
  it('draws every face in every mood', () => {
    const all = [...HUMAN_FACES, ...Object.values(CHARACTER_FACES)];
    for (const f of all) {
      for (const m of MOODS) {
        const svg = staticFace(f, m);
        expect(svg.tagName.toLowerCase()).toBe('svg');
        expect(svg.classList.contains('face')).toBe(true);
      }
    }
  });

  it('draws the features a face asks for', () => {
    expect(staticFace(CHARACTER_FACES.zorg).classList.contains('alien')).toBe(true);
    expect(staticFace(CHARACTER_FACES.zorg).querySelectorAll('.ant')).toHaveLength(2);
    expect(staticFace(CHARACTER_FACES.nico).querySelector('.avi')).not.toBeNull();
    // the moustache replaces the mouth
    const carlos = staticFace(CHARACTER_FACES.carlos);
    expect(carlos.querySelector('.stache')).not.toBeNull();
    expect(carlos.querySelector('.mouth')).toBeNull();
    expect(staticFace(HUMAN_FACES[0]).querySelector('.mouth')?.getAttribute('d')).toMatch(/^M[\d.]+ [\d.]+Q/);
  });

  it('accepts a human face index', () => {
    expect(staticFace(7).querySelector('.avi')).not.toBeNull();
  });

  it('gives each face its own clip-path ids', () => {
    const a = staticFace(0).querySelector('clipPath')!.id;
    const b = staticFace(0).querySelector('clipPath')!.id;
    expect(a).not.toBe(b);
  });
});

describe('liveFace', () => {
  afterEach(() => document.body.replaceChildren());
  it('returns a face that can change mood', () => {
    const lf = liveFace(CHARACTER_FACES.lola, 'happy');
    document.body.append(lf.el);
    expect(lf.el.classList.contains('face')).toBe(true);
    expect(() => lf.setExpr('sad')).not.toThrow();
    expect(() => lf.glint()).not.toThrow();
  });
});

describe('AvatarController', () => {
  it('builds one live face per seat (any seat count)', () => {
    const c = new AvatarController({ seats: 6 });
    expect(c.seats).toBe(6);
    for (let s = 0; s < 6; s++) {
      const el = c.faceEl(s);
      expect(el.classList.contains('av-face')).toBe(true);
      expect(el.querySelector('.av-idle svg.face')).not.toBeNull();
      expect(el.querySelector('.av-shadow')).not.toBeNull();
      expect(el.querySelectorAll('.av-zzz span')).toHaveLength(3);
      // live faces leave the shadow and z's to the HTML
      expect(el.querySelector('svg .shadow')).toBeNull();
    }
  });

  it('defaults to four seats and the given faces', () => {
    const c = new AvatarController({ faces: [HUMAN_FACES[2], CHARACTER_FACES.zorg] });
    expect(c.seats).toBe(4);
    expect(c.faceOf(0)).toBe(HUMAN_FACES[2]);
    expect(c.faceOf(1)).toBe(CHARACTER_FACES.zorg);
    expect(c.faceEl(1).classList.contains('alien')).toBe(true);
    expect(c.faceOf(3)).toBe(HUMAN_FACES[0]);
  });

  it('swaps a seat face in place', () => {
    const c = new AvatarController();
    const el = c.faceEl(2);
    c.setFace(2, CHARACTER_FACES.zorg);
    expect(c.faceEl(2)).toBe(el);
    expect(el.classList.contains('alien')).toBe(true);
    c.setFace(2, 7);
    expect(c.faceOf(2)).toBe(HUMAN_FACES[7]);
    expect(el.classList.contains('alien')).toBe(false);
  });

  it('takes every game hook without throwing', () => {
    const c = new AvatarController();
    c.setPositions(
      [
        { x: 50, y: 90 },
        { x: 90, y: 50 },
        { x: 50, y: 10 },
        { x: 10, y: 50 },
      ],
      { x: 50, y: 50 },
    );
    c.setVisible(true);
    c.setQuality('low');
    expect(() => {
      c.onRoundStart();
      c.onTurn(1);
      c.onPlay(1, true);
      c.onImpact(1, 'slam');
      c.onPass(2, 1);
      c.perk(0);
      c.react(3, 'smug', 1);
      c.onRoundEnd(['happy', 'sad', 'happy', 'sad'], true);
      c.onMatchEnd([true, false, true, false]);
      c.onTurn(null);
      c.setQuiet(true);
      c.onRoundStart();
      c.calmAll();
      c.reset();
    }).not.toThrow();
    expect(c.isQuiet).toBe(true);
  });
});
