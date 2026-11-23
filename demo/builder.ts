/** Demo: the library's avatar editor, plus the FaceSpec it produces and a button to try it at the table. */
import { HUMAN_FACES, SKIN_TONES, createAvatarEditor, type FaceSpec } from '../src/index';
import { lang, t } from './i18n';
import { button, el } from './ui';

export interface Builder {
  setFollow(on: boolean): void;
}

export function mountBuilder(root: HTMLElement, onUse: (spec: FaceSpec) => void): Builder {
  const code = el('pre', 'code');
  const show = (f: FaceSpec) => (code.textContent = JSON.stringify(f, null, 2));
  const editor = createAvatarEditor(root, {
    lang,
    value: { ...HUMAN_FACES[1], hair: 'long', hairColor: 'auburn', skin: SKIN_TONES.mediumLight, mouth: 'lips' },
    onChange: show,
  });
  show(editor.value);

  const copyBtn = button(
    t('Copiar', 'Copy'),
    () => {
      navigator.clipboard.writeText(code.textContent ?? '').then(
        () => (copyBtn.textContent = t('Copiado', 'Copied')),
        () => {
          const r = document.createRange();
          r.selectNodeContents(code);
          getSelection()?.removeAllRanges();
          getSelection()?.addRange(r);
          copyBtn.textContent = t('Texto seleccionado', 'Text selected');
        },
      );
      setTimeout(() => (copyBtn.textContent = t('Copiar', 'Copy')), 1600);
    },
    'btn btn-small',
  );
  // under the editor's preview: try the face at the table, and the FaceSpec to copy into a game
  const preview = editor.el.querySelector('.kua-preview');
  preview?.append(
    button(t('Usar en la mesa', 'Use at the table'), () => onUse(editor.value), 'kua-btn'),
    el('div', 'spec', el('div', 'spec-head', el('span', 'kua-mini-title', 'FaceSpec'), copyBtn), code),
  );
  return { setFollow: (on) => editor.follow(on) };
}
