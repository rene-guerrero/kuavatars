/**
 * Mouth styles. Every style dresses the same animated mouth (the shape that follows each mood), so
 * all moods work with all of them: lips outline it, teeth sit in its opening, buck teeth and fangs
 * ride on its upper lip, and thin / wide scale it.
 */
import type { FacePalette } from './colors';
import type { FaceSpec } from './faces';

export type MouthStyle = 'smile' | 'lips' | 'teeth' | 'buck' | 'fangs' | 'thin' | 'wide';
export const MOUTHS: readonly MouthStyle[] = ['smile', 'lips', 'teeth', 'buck', 'fangs', 'thin', 'wide'];

/** default lip colour for the 'lips' style */
export const DEFAULT_LIPS = '#D9455F';

export interface MouthParts {
  /** extra transform on the mouth group (thin / wide) */
  wrap: string;
  /** drawn under the mouth (lips) */
  under: string;
  /** drawn over the mouth (teeth, buck teeth, fangs) */
  over: string;
  /** mouth fill / stroke colour override */
  color: string | null;
}

/** what a mouth style adds, or null for the plain mouth */
export function mouthParts(f: FaceSpec, uid: string, C: FacePalette): MouthParts | null {
  const style = f.mouth ?? 'smile';
  if (style === 'smile' || f.alien) return null;
  const line = `stroke="${C.line}" stroke-width=".8" stroke-linejoin="round"`;
  switch (style) {
    case 'lips': {
      const lip = f.lipColor ?? DEFAULT_LIPS;
      return { wrap: '', under: `<path class="lips" fill="none" stroke="${lip}" stroke-width="7.6" stroke-linecap="round" stroke-linejoin="round"/>`, over: '', color: '#5A1A22' };
    }
    case 'teeth':
      return { wrap: '', under: '', over: `<rect class="mteeth" x="40" y="80" width="60" height="14.4" fill="#fff" clip-path="url(#${uid}m)"/>`, color: null };
    case 'buck':
      return {
        wrap: '',
        under: '',
        over: `<g class="mbuck"><rect x="-4" y="-1.2" width="3.8" height="5.6" rx="1.3" fill="#fff" ${line}/><rect x=".2" y="-1.2" width="3.8" height="5.6" rx="1.3" fill="#fff" ${line}/></g>`,
        color: null,
      };
    case 'fangs': {
      const fang = `<path d="M-1.8 -.8 L1.8 -.8 L0 4 Z" fill="#fff" ${line}/>`;
      return { wrap: '', under: '', over: `<g class="mfang">${fang}</g><g class="mfang">${fang}</g>`, color: null };
    }
    case 'thin':
      return { wrap: 'translate(70 98) scale(.74 .58) translate(-70 -98)', under: '', over: '', color: null };
    case 'wide':
      return { wrap: 'translate(70 0) scale(1.2 1.04) translate(-70 0)', under: '', over: '', color: null };
  }
}
