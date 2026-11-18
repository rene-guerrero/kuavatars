import { describe, expect, it } from 'vitest';
import { CHARACTER_FACES, EYEWEAR, MOODS, liveFace, staticFace } from '../src/index';

describe('eyewear', () => {
  it('has seven styles, monocle and eye patch included', () => {
    expect(EYEWEAR).toHaveLength(7);
    expect(EYEWEAR).toContain('monocle');
    expect(EYEWEAR).toContain('eyepatch');
  });

  it('draws every style in every mood', () => {
    for (const eyewear of EYEWEAR) for (const m of MOODS) expect(() => staticFace({ iris: '#3F7FD9', eyewear }, m)).not.toThrow();
  });

  it('keeps the older flags working (same markup as the new field)', () => {
    const norm = (svg: SVGSVGElement) => svg.outerHTML.replace(/av[a-z0-9]{4}\d+/g, 'ID');
    expect(norm(staticFace({ iris: '#3F7FD9', glasses: true }))).toBe(norm(staticFace({ iris: '#3F7FD9', eyewear: 'round' })));
    expect(norm(staticFace({ iris: '#3F7FD9', aviators: true }))).toBe(norm(staticFace({ iris: '#3F7FD9', eyewear: 'aviators' })));
    expect(staticFace(CHARACTER_FACES.julio).innerHTML).toContain('r="16"');
  });

  it('gives sunglasses the moving aviator group and glint', () => {
    const svg = staticFace({ iris: '#3F7FD9', eyewear: 'sunglasses' });
    expect(svg.querySelector('.avi')).not.toBeNull();
    expect(svg.querySelector('.glint')).not.toBeNull();
    expect(() => liveFace({ iris: '#3F7FD9', eyewear: 'sunglasses' }).glint()).not.toThrow();
  });

  it('ignores eyewear on the alien head', () => {
    expect(staticFace({ iris: '#101418', alien: true, eyewear: 'monocle' }).innerHTML).not.toContain('#C9A23A');
  });
});
