import '../src/avatars.css';
import '../src/editor.css';
import './demo.css';
import type { AvatarQuality } from '../src/index';
import { mountBuilder } from './builder';
import { lang, setLang, t, translatePage } from './i18n';
import { GALLERY, mountAllFaces, mountLiveFaces } from './gallery';
import { mountTable } from './table';
import { $, el, segmented, toggle } from './ui';

translatePage();

// ── sections ──
const ctl = mountTable($('felt'), $('hooks'), $('table-status'));
const builder = mountBuilder($('creator'), (spec) => {
  ctl.setFace(0, spec);
  $('mesa').scrollIntoView({ behavior: 'smooth', block: 'start' });
});
const lives = mountLiveFaces($('live'), $<HTMLSelectElement>('live-mood'));

const galleryRoot = $('gallery');
for (const g of GALLERY()) {
  const sec = el('section', 'block', el('header', 'block-head', el('h2', '', g.title), el('p', 'lead', g.lead)), g.build());
  sec.id = g.id;
  galleryRoot.append(sec);
}
mountAllFaces($<HTMLTableElement>('all-faces'));

// ── theme: dark / light (remembered in this browser; the system setting until picked) ──
const savedTheme = (() => {
  try {
    return localStorage.getItem('kuavatars-theme');
  } catch {
    return null;
  }
})();
const startDark = savedTheme ? savedTheme === 'dark' : !matchMedia('(prefers-color-scheme: light)').matches;
if (savedTheme) document.documentElement.dataset.theme = savedTheme;
const themeToggle = toggle('dark', t('Modo oscuro', 'Dark mode'), (on) => {
  const t = on ? 'dark' : 'light';
  document.documentElement.dataset.theme = t;
  try {
    localStorage.setItem('kuavatars-theme', t);
  } catch {
    /* private window: the choice just isn't remembered */
  }
}, startDark);

// ── global switches (the same ones the games use) ──
$('settings').append(
  segmented('lang', [['en', 'English'], ['es', 'Español']], lang, setLang),
  themeToggle,
  segmented<AvatarQuality>('quality', [['high', t('Alta', 'High')], ['medium', t('Media', 'Medium')], ['low', t('Baja', 'Low')]], 'high', (q) => {
    document.documentElement.dataset.quality = q;
    ctl.setQuality(q);
  }),
  toggle('reduced', t('Menos movimiento', 'Reduce motion'), (on) => {
    document.documentElement.classList.toggle('reduce-motion', on);
    ctl.setReducedMotion(on);
  }),
  toggle('follow', t('Mirar al cursor', 'Follow the cursor'), (on) => {
    ctl.followPointer(on);
    builder.setFollow(on);
    for (const l of lives) l.follow(on);
  }),
);

// ── navigation: highlight the section in view ──
const links = Array.from(document.querySelectorAll<HTMLAnchorElement>('.nav a'));
const spy = new IntersectionObserver(
  (entries) => {
    for (const e of entries) if (e.isIntersecting) for (const a of links) a.classList.toggle('active', a.hash === `#${e.target.id}`);
  },
  { rootMargin: '-30% 0px -60% 0px' },
);
for (const a of links) {
  const t = document.getElementById(a.hash.slice(1));
  if (t) spy.observe(t);
}
