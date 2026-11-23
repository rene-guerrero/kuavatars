/**
 * The demo's language. A choice made with the switch is saved in this browser and always wins. With
 * no saved choice: Spanish when the browser's preferred language is Spanish (navigator.languages[0],
 * else navigator.language, starting with "es"), English otherwise.
 */
import { labelsFor, type Lang } from '../src/index';

const KEY = 'kuavatars-lang';
const isLang = (v: unknown): v is Lang => v === 'es' || v === 'en';

function saved(): Lang | null {
  try {
    const v = localStorage.getItem(KEY);
    return isLang(v) ? v : null;
  } catch {
    return null; // private window / blocked storage
  }
}

/** "es-MX" → Spanish; "en-US", "fr" or nothing → English */
export function browserLang(nav: { languages?: readonly string[]; language?: string } = navigator): Lang {
  const first = (nav.languages?.[0] ?? nav.language ?? '').toLowerCase();
  return first.startsWith('es') ? 'es' : 'en';
}

function detectLang(): Lang {
  // ?lang= (set by the switch) keeps working where storage is blocked
  const q = new URLSearchParams(location.search).get('lang');
  return saved() ?? (isLang(q) ? q : null) ?? browserLang();
}

export const lang: Lang = detectLang();
/** the library's option names and editor texts in the page language */
export const L = labelsFor(lang);
/** pick the text for the page language */
export const t = (es: string, en: string): string => (lang === 'es' ? es : en);

/** save the choice and show the page again in that language */
export function setLang(l: Lang): void {
  try {
    localStorage.setItem(KEY, l);
  } catch {
    /* not remembered: the ?lang= below still switches this visit */
  }
  if (l === lang) return;
  const u = new URL(location.href);
  u.searchParams.set('lang', l);
  location.replace(u.href);
}

/** static page text: elements carry the English text and a data-es attribute with the Spanish one */
export function translatePage(): void {
  document.documentElement.lang = lang;
  if (lang !== 'es') return;
  for (const e of document.querySelectorAll<HTMLElement>('[data-es]')) e.textContent = e.dataset.es ?? '';
  for (const e of document.querySelectorAll<HTMLElement>('[data-es-label]')) e.setAttribute('aria-label', e.dataset.esLabel ?? '');
}
