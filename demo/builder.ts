/** Demo: the library's avatar editor, plus the FaceSpec it produces and a button to try it at the table. */
import { HUMAN_FACES, SKIN_TONES, createAvatarEditor, type FaceSpec } from '../src/index';
import { button, el } from './ui';

export interface Builder {
  setFollow(on: boolean): void;
}

export function mountBuilder(root: HTMLElement, onUse: (spec: FaceSpec) => void): Builder {
  const code = el('pre', 'code');
  const show = (f: FaceSpec) => (code.textContent = JSON.stringify(f, null, 2));
  const editor = createAvatarEditor(root, {
    value: { ...HUMAN_FACES[1], hair: 'long', hairColor: 'auburn', skin: SKIN_TONES.mediumLight, mouth: 'lips' },
    onChange: show,
  });
  show(editor.value);

  const copyBtn = button(
    'Copiar',
    () => {
      navigator.clipboard.writeText(code.textContent ?? '').then(
        () => (copyBtn.textContent = 'Copiado'),
        () => {
          const r = document.createRange();
          r.selectNodeContents(code);
          getSelection()?.removeAllRanges();
          getSelection()?.addRange(r);
          copyBtn.textContent = 'Texto seleccionado';
        },
      );
      setTimeout(() => (copyBtn.textContent = 'Copiar'), 1600);
    },
    'btn btn-small',
  );
  // under the editor's preview: try the face at the table, and the FaceSpec to copy into a game
  const preview = editor.el.querySelector('.kua-preview');
  preview?.append(
    button('Usar en la mesa', () => onUse(editor.value), 'kua-btn'),
    el('div', 'spec', el('div', 'spec-head', el('span', 'kua-mini-title', 'FaceSpec'), copyBtn), code),
  );
  return { setFollow: (on) => editor.follow(on) };
}
