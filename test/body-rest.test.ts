/**
 * A seat face must never stay frozen mid-reaction (stretched, shifted): when the controller's loop
 * stops (paused, hidden, off) the head goes back to rest at once, and the end of every reaction is
 * always written, however small its last step was.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { AvatarController, HUMAN_FACES } from '../src/index';

let frames: FrameRequestCallback[] = [];
let now = 0;

/** run animation frames (16 ms apart) for `ms` of game time */
function play(ms: number): void {
  const end = now + ms;
  while (now < end) {
    now += 16;
    const run = frames;
    frames = [];
    for (const f of run) f(now);
    vi.advanceTimersByTime(16); // the idle poll timer, when the loop leaves frames
  }
}

const svgOf = (c: AvatarController, seat: number) => c.faceEl(seat).querySelector('svg.face') as SVGSVGElement;

beforeEach(() => {
  vi.useFakeTimers();
  frames = [];
  now = 0;
  let id = 0;
  vi.stubGlobal('requestAnimationFrame', (f: FrameRequestCallback) => (frames.push(f), ++id));
  vi.stubGlobal('cancelAnimationFrame', () => {
    frames = [];
  });
});
afterEach(() => {
  vi.unstubAllGlobals();
  vi.useRealTimers();
});

function hopping(): AvatarController {
  const c = new AvatarController({ seats: 4, faces: [HUMAN_FACES[0], HUMAN_FACES[1], HUMAN_FACES[2], HUMAN_FACES[3]] });
  c.setVisible(true);
  c.onMatchEnd([true, false, true, false]); // winners hop
  play(400);
  expect(svgOf(c, 0).style.transform).not.toBe(''); // mid-hop
  return c;
}

describe('reaction transforms', () => {
  it('end at rest when the reaction finishes', () => {
    const c = hopping();
    play(6000);
    expect(svgOf(c, 0).style.transform).toBe('');
  });

  it.each([
    ['paused', (c: AvatarController) => c.setPaused(true)],
    ['hidden', (c: AvatarController) => c.setVisible(false)],
    ['turned off', (c: AvatarController) => c.setEnabled(false)],
    ['held', (c: AvatarController) => c.setHold(true)],
  ])('snap back to rest when the controller is %s mid-hop', (_name, stop) => {
    const c = hopping();
    stop(c);
    expect(svgOf(c, 0).style.transform).toBe('');
    expect(svgOf(c, 2).style.transform).toBe('');
  });

  it('do not restart a half hop after a pause', () => {
    const c = hopping();
    c.setPaused(true);
    c.setPaused(false);
    play(50);
    expect(svgOf(c, 0).style.transform).toBe('');
  });

  it('a new face mid-hop is never left transformed', () => {
    const c = hopping();
    c.setFace(0, HUMAN_FACES[5]);
    play(6000);
    expect(svgOf(c, 0).style.transform).toBe('');
  });
});
