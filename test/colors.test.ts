import { describe, expect, it } from 'vitest';
import { DEFAULT_ALIEN_SKIN, DEFAULT_SKIN, EYE_COLORS, SKIN_TONES, alienPalette, facePalette, staticFace } from '../src/index';

describe('face colours', () => {
  it('keeps the original colours when no skin is set (or the default one)', () => {
    expect(facePalette({})).toBe(facePalette({ skin: DEFAULT_SKIN.toLowerCase() }));
    expect(facePalette({}).rim).toBe('#EE9D1C');
    expect(alienPalette({}).rim).toBe('#3E9E3A');
    expect(alienPalette({ skin: DEFAULT_ALIEN_SKIN })).toBe(alienPalette({}));
  });

  it('derives the shading from any skin colour', () => {
    const p = facePalette({ skin: SKIN_TONES.blue });
    expect(p.face).toBe(SKIN_TONES.blue.toUpperCase());
    for (const v of Object.values(p)) expect(v).toMatch(/^#[0-9A-F]{6}$/);
    expect(p.rim).not.toBe(p.face);
  });

  it('uses darker lines on dark skin', () => {
    expect(facePalette({ skin: SKIN_TONES.dark }).line).not.toBe(facePalette({}).line);
    expect(facePalette({ skin: SKIN_TONES.light }).line).toBe(facePalette({}).line);
  });

  it('falls back to the default for a bad colour', () => {
    expect(facePalette({ skin: 'banana' })).toBe(facePalette({}));
  });

  it('draws the chosen skin and eye colours', () => {
    const svg = staticFace({ iris: EYE_COLORS.teal, skin: SKIN_TONES.purple });
    const html = svg.outerHTML;
    expect(html).toContain(`fill="${SKIN_TONES.purple}"`);
    expect(html).toContain(`fill="${EYE_COLORS.teal}"`);
    const alien = staticFace({ iris: '#7A1FA8', alien: true, skin: SKIN_TONES.blue }).outerHTML;
    expect(alien).toContain('fill="#7A1FA8"');
    expect(alien).toContain(`fill="${SKIN_TONES.blue}"`);
  });
});
