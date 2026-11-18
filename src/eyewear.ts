/**
 * Eyewear: round glasses, square glasses, aviators, sunglasses, cat-eye glasses, a monocle and a
 * pirate eye patch. Round glasses and aviators are drawn by the face itself (they predate this file
 * and keep their exact markup); this file draws the rest. Sunglasses reuse the aviators' animation
 * (they slide down the nose to peek when amazed, droop when asleep, and a glint crosses the lenses).
 */
import type { FaceSpec } from './faces';

export type Eyewear = 'round' | 'square' | 'aviators' | 'sunglasses' | 'catEye' | 'monocle' | 'eyepatch';
export const EYEWEAR: readonly Eyewear[] = ['round', 'square', 'aviators', 'sunglasses', 'catEye', 'monocle', 'eyepatch'];

/** the eyewear a face wears (the older `glasses` / `aviators` flags still work) */
export const eyewearOf = (f: FaceSpec): Eyewear | undefined => (f.alien ? undefined : (f.eyewear ?? (f.aviators ? 'aviators' : f.glasses ? 'round' : undefined)));

/** frames that sit over both eyes and lift the brows a little (like round glasses) */
export const liftsBrows = (e: Eyewear | undefined): boolean => e === 'round' || e === 'square' || e === 'catEye';
/** dark lenses that hide the eyes and take flat brows on the frame (like aviators) */
export const darkLenses = (e: Eyewear | undefined): boolean => e === 'aviators' || e === 'sunglasses';

const SG_L = 'M35 57.6 L67 57.6 C68.2 57.6 68.4 58.6 68.1 60 L65.4 75 C64.6 79 61.6 81 57.6 81 L44.4 81 C40.4 81 37.4 79 36.6 75 L33.9 60 C33.6 58.6 33.8 57.6 35 57.6 Z';
const SG_R = 'M105 57.6 L73 57.6 C71.8 57.6 71.6 58.6 71.9 60 L74.6 75 C75.4 79 78.4 81 82.4 81 L95.6 81 C99.6 81 102.6 79 103.4 75 L106.1 60 C106.4 58.6 106.2 57.6 105 57.6 Z';
/** lens outline for the glint clip (sunglasses) */
export const SUNGLASS_LENSES = `${SG_L} ${SG_R}`;

/** sunglasses (wayfarers): drawn as the moving `.avi` group, with a `.glint` clipped to the lenses */
export function sunglassesMarkup(uid: string): string {
  return `<g class="avi">
  <path d="M33.6 59 L19 56 M106.4 59 L121 56" stroke="#15171B" stroke-width="3" stroke-linecap="round" fill="none"/>
  <path d="${SG_L}" fill="#1D2027"/><path d="${SG_R}" fill="#1D2027"/>
  <g clip-path="url(#${uid}v)">
    <path d="M36 70 L67 70 L65 78 Q63 81 58 81 L44 81 Q39 81 37.6 78 Z M73 70 L104 70 L102.4 78 Q101 81 96 81 L82 81 Q77 81 75 78 Z" fill="#2E3440"/>
    <g class="glint" opacity="0"><path d="M50 50 L58 50 L46 86 L38 86 Z M62 50 L65 50 L53 86 L50 86 Z" fill="#fff"/></g>
  </g>
  <path d="${SG_L}" fill="none" stroke="#15171B" stroke-width="2.6" stroke-linejoin="round"/><path d="${SG_R}" fill="none" stroke="#15171B" stroke-width="2.6" stroke-linejoin="round"/>
  <path d="M33 58.2 H107" stroke="#15171B" stroke-width="4.2" stroke-linecap="round"/>
  <path d="M67.6 62 Q70 60.4 72.4 62" stroke="#15171B" stroke-width="2.6" stroke-linecap="round" fill="none"/>
  <path d="M40 61.6 L46 61.6" stroke="#fff" stroke-width="1.6" stroke-linecap="round" opacity=".3"/>
</g>`;
}

/** the other frames (square, cat-eye, monocle, eye patch), drawn over the eyes */
export function eyewearMarkup(e: Eyewear | undefined): string {
  switch (e) {
    case 'square':
      return `<g fill="none" stroke="#2B2D35" stroke-width="3.2" stroke-linejoin="round" stroke-linecap="round"><rect x="36.6" y="56" width="31.4" height="24.4" rx="6.4" fill="#fff" fill-opacity=".1"/><rect x="72" y="56" width="31.4" height="24.4" rx="6.4" fill="#fff" fill-opacity=".1"/><path d="M68 62.4 Q70 60.4 72 62.4"/><path d="M36.6 61 L22 58"/><path d="M103.4 61 L118 58"/></g><path d="M41 59.6 L48 59.6" stroke="#fff" stroke-width="2" stroke-linecap="round" opacity=".5"/>`;
    case 'catEye': {
      const lens = 'M66.6 63.4 C66.2 72.4 60.4 78.6 52.6 78.6 C44.2 78.6 38.6 72.4 38 64.6 C37.6 59.6 34.4 56.6 31 54.8 C37.4 54.4 44.6 55.8 52.4 56.4 C60.6 57 67 58 66.6 63.4 Z';
      const frame = `<path d="${lens}" fill="#fff" fill-opacity=".12" stroke="#C3354B" stroke-width="3" stroke-linejoin="round"/>`;
      return `${frame}<g transform="matrix(-1 0 0 1 140 0)">${frame}</g><path d="M66.6 61.8 Q70 59 73.4 61.8" stroke="#C3354B" stroke-width="2.6" stroke-linecap="round" fill="none"/><path d="M42 60.6 Q46 59 50 59.4" stroke="#fff" stroke-width="1.8" stroke-linecap="round" fill="none" opacity=".55"/><circle cx="33.4" cy="56" r="1.3" fill="#FFE7A8"/><circle cx="106.6" cy="56" r="1.3" fill="#FFE7A8"/>`;
    }
    case 'monocle':
      return `<path d="M100.6 76 C108 84 112 92 112.6 106" stroke="#C9A23A" stroke-width="1.5" stroke-linecap="round" stroke-dasharray="2.2 1.8" fill="none"/><circle cx="87" cy="68" r="15.4" fill="#fff" fill-opacity=".14" stroke="#C9A23A" stroke-width="3"/><circle cx="87" cy="68" r="12.8" fill="none" stroke="#8C6A1E" stroke-width="1" opacity=".6"/><path d="M78 60 Q81.6 56.6 86 56.4" stroke="#fff" stroke-width="2" stroke-linecap="round" fill="none" opacity=".6"/><circle cx="100.8" cy="76" r="1.8" fill="#C9A23A"/>`;
    case 'eyepatch':
      return `<path d="M40 57.8 L22.6 47.4 M66 57.6 L103 40.6 L119.4 37" stroke="#1C1A1A" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round" fill="none"/><path d="M38.4 61 C38 55.6 46 52.6 53 52.6 C60 52.6 67.4 55.6 67.2 61 C67 72 60.6 80.6 53 80.6 C45.2 80.6 38.8 72 38.4 61 Z" fill="#1C1A1A"/><path d="M38.4 61 C38 55.6 46 52.6 53 52.6 C60 52.6 67.4 55.6 67.2 61" stroke="#3A3535" stroke-width="1.4" fill="none"/><path d="M44 60 Q48 57.4 53 57.2" stroke="#fff" stroke-width="1.6" stroke-linecap="round" fill="none" opacity=".18"/>`;
    default:
      return '';
  }
}
