import { afterEach, describe, expect, it, vi } from 'vitest';

// record what the editor asks its live preview to do
const calls: string[] = [];
vi.mock('../src/avatars', async (importOriginal) => {
  const orig = await importOriginal<typeof import('../src/avatars')>();
  return {
    ...orig,
    liveFace: (...args: Parameters<typeof orig.liveFace>) => {
      const lf = orig.liveFace(...args);
      return { ...lf, gesture: (g: string) => calls.push(`gesture:${g}`), setExpr: (m: string) => calls.push(`mood:${m}`) };
    },
  };
});

const { createAvatarEditor } = await import('../src/editor');

describe('editor ambient life', () => {
  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
    calls.length = 0;
    document.body.replaceChildren();
  });

  it('plays a gesture or a mood on its own, but not while the player is editing', () => {
    vi.useFakeTimers();
    const box = document.createElement('div');
    document.body.append(box);
    const ed = createAvatarEditor(box);
    // the player keeps touching the editor: nothing plays
    for (let i = 0; i < 6; i++) {
      ed.el.dispatchEvent(new Event('pointerdown'));
      vi.advanceTimersByTime(2500);
    }
    expect(calls).toEqual([]);
    // left alone: something plays within the next few seconds, and keeps happening now and then
    vi.advanceTimersByTime(14000);
    expect(calls.length).toBeGreaterThanOrEqual(1);
    const n = calls.length;
    vi.advanceTimersByTime(30000);
    expect(calls.length).toBeGreaterThan(n);
    ed.destroy();
    const after = calls.length;
    vi.advanceTimersByTime(30000);
    expect(calls.length).toBe(after); // destroyed: no more timers
  });

  it('stays still with reduced motion or ambient: false', () => {
    vi.useFakeTimers();
    document.documentElement.classList.add('reduce-motion');
    const a = createAvatarEditor(document.body.appendChild(document.createElement('div')));
    vi.advanceTimersByTime(60000);
    expect(calls).toEqual([]);
    document.documentElement.classList.remove('reduce-motion');
    a.destroy();
    createAvatarEditor(document.body.appendChild(document.createElement('div')), { ambient: false });
    vi.advanceTimersByTime(60000);
    expect(calls).toEqual([]);
  });
});
