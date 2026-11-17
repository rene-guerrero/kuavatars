# KuAvatars

Animated 2D SVG "yellow emoji" avatars shared by **Kudominoes** and **KuCards**: composable faces
(lashes, brows, glasses, aviators, moustache, Papi Zorg the alien), 11 moods, idle life (blinks,
winks, glances, nodding off, sleeping with floating z's) and table-game reactions (hops, head
shakes, startled wake-ups).

Framework-free TypeScript and one CSS file, no build step. Each game's Vite compiles it.
It's built to stay cheap on weak phones: idle motion is CSS (run by the compositor), the script
writes to the DOM only when a value changes, and the frame rate is capped per quality level.

```
src/faces.ts     FaceSpec, HUMAN_FACES (pickable), CHARACTER_FACES (by character id). Pure data, no DOM
src/avatars.ts   SVG faces, moods, staticFace, liveFace, AvatarController
src/avatars.css  .av-face / .av-idle / .av-shadow / .av-zzz / .face-static and their keyframes
demo/            every face × every mood, live faces, a 4-seat table with a button per hook
test/            vitest + happy-dom
```

```bash
npm install
npm run dev        # demo at http://localhost:5180
npm test
npm run build      # typecheck + demo build
```

## Install in a game

```jsonc
// package.json: pin a tag
"dependencies": { "kuavatars": "github:rene-guerrero/kuavatars#v0.1.0" }
```

To work on an unreleased change of the avatars from inside a game, run `npm link ../kuavatars`
(a symlink, `package.json` is untouched; the next `npm ci` restores the pinned tag).

**Updating:** change kuavatars → `npm test` + check the demo → commit, `git tag v0.x.y`,
push with tags → in each game bump `#v0.x.y` in `package.json`, `npm install`, commit, push (the
push rebuilds the game).

## CSS

Import once, **before** the game's own stylesheet, so the game can override:

```ts
import 'kuavatars/avatars.css';
import './ui/styles.css';
```

The CSS reads these from the page:

| Convention | Effect |
| --- | --- |
| `--d: <px>` on an ancestor of a seat face | the avatar diameter, used to size the sleepers' z's |
| `<html data-quality="low">` | one still "z" over a sleeper instead of three floating ones |
| `<html class="reduce-motion">` | same, and the small live faces stop glancing and bobbing |

Hiding the avatars (a setting) is up to the game, for example `.no-avatars .av-face { display: none }`
plus `controller.setEnabled(false)`.

## API

```ts
import {
  AvatarController, staticFace, liveFace,
  HUMAN_FACES, CHARACTER_FACES, FACE_COUNT, MOODS, humanFace,
  type FaceSpec, type Mood, type AvatarQuality,
} from 'kuavatars';
// pure data only (servers, engines): import { CHARACTER_FACES, type FaceSpec } from 'kuavatars/faces';
```

### Faces

- `FaceSpec`: `{ iris, lashes?, brows?: 'plain'|'thick'|'raised'|'aviator', browColor?, smirk?, freckles?, glasses?, aviators?, stache?: 'brown'|'grey', alien?, flower?, mole?, cool? }`
- `HUMAN_FACES[0..8]`: the faces a player can pick (store the index; `humanFace(i)` clamps it)
- `CHARACTER_FACES.lola | pepe | nico | elena | andres | rosa | carlos | marta | julio | zorg`.
  Names, levels and descriptions stay in each game (with their i18n).
- Anywhere a face is taken, a number means `HUMAN_FACES[n]`.

### Moods

`idle perk happy sad angry amazed thinking sleepy asleep smug meh` (`MOODS` lists them).

### Static and small live faces (summaries, pickers, cards)

```ts
box.append(staticFace(CHARACTER_FACES.zorg, 'happy'));          // an <svg>, no animation
const lf = liveFace(HUMAN_FACES[3], 'idle');                     // blinks, glances, bobs
box.append(lf.el); lf.setExpr('amazed'); lf.glint();             // glint = aviator sparkle
```

Put either one in a sized `<span class="face-static">` box (width and height set by the game). Live faces share
one frame loop and drop out on their own once their element leaves the document.

### Seat avatars (`AvatarController`)

```ts
const avatars = new AvatarController({ seats: 6, faces: [HUMAN_FACES[0], CHARACTER_FACES.zorg /* … */] });
plateAvatarBox.append(avatars.faceEl(seat));    // a positioned, sized box (the face overflows it a little)
avatars.setPositions(faceCentres, tableCentre); // CSS px, any common origin, for glances; call on layout
avatars.setVisible(true);                       // nothing runs until visible
```

Control: `setFace(seat, face)` · `setEnabled(on)` · `setVisible(v)` · `setPaused(p)` (pause menu) ·
`setHold(h)` (a card covers the table) · `setQuiet(q)` (replaying: keep state, no reactions) ·
`setReducedMotion(r)` · `setQuality('low'|'medium'|'high')` (also caps the small live faces) ·
`reset()` (new match) · `calmAll()`.

Seat 0 is the local human: on its turn the face peeks down at the hand instead of "thinking".

### Mood and event hooks

| Hook | When to call it | What the faces do |
| --- | --- | --- |
| `onTurn(seat \| null)` | every turn change (`null` = nobody) | the seat thinks (seat 0 peeks down); others glance at it. Waiting seats nod off after ~11 s, one after another |
| `perk(seat)` | the human's own turn starts | brows up, a tiny hop |
| `onPlay(seat, strong?)` | a seat played (`strong` = slam / winning play) | others glance at it; strong = a determined look |
| `onImpact(seat, 'clack' \| 'slam' \| 'finish')` | the moment a card or tile hits the table | clack: sleepers stir. slam/finish: everyone startles awake and hops |
| `onPass(seat, forcer?)` | a seat could not play (draws, passes) | sad head shake; `forcer` looks smug, the rest are impressed |
| `react(seat, mood, seconds?)` | anything else: quick phrases, a "¡Ku!" call, a caught player… | that mood for a while, then back to idle |
| `onRoundStart()` | a new round or deal | sleepers wake, everyone looks at the table |
| `onRoundEnd(result[], big?)` | a round ended; `result[seat]` = `'happy'`, `'sad'` or `'meh'` | `big` = surprise first (hop), then the result, and winners hop |
| `onMatchEnd(won[])` | the match ended; `won[seat]` = boolean | winners hop and look up, losers look down |

Hooks are ignored while `setQuiet(true)`.

### KuCards sketch (`src/ui/avatarAdapter.ts`)

```ts
const av = new AvatarController({ seats: m.seats.length, faces });
switch (ev.type) {
  case 'deal':      av.onRoundStart(); break;
  case 'turn':      av.onTurn(ev.seat); if (ev.seat === 0) av.perk(0); break;
  case 'play':      av.onPlay(ev.seat, isActionCard(ev.card)); av.onImpact(ev.seat, isActionCard(ev.card) ? 'slam' : 'clack'); break;
  case 'draw':      if (ev.reason === 'penalty') av.react(ev.seat, 'sad', 1.6); break;
  case 'pass':      av.onPass(ev.seat); break;
  case 'ku':        av.react(ev.seat, 'smug', 1.4); break;
  case 'kuCaught':  av.react(ev.target, 'amazed', 1.2); av.react(ev.by, 'happy', 1.4); break;
  case 'roundEnd':  av.onRoundEnd(seats.map((s) => (s === ev.winner ? 'happy' : 'sad'))); break;
  case 'matchEnd':  av.onMatchEnd(seats.map((s) => s === ev.winner)); break;
}
```

If KuCards needs a new mood, event, size or face feature, add it here (with a demo button and a
test), tag a release, and bump both games.

## Dev measurement

In a Vite dev build, `window.__avStats` counts the avatars' main-thread ms, ticks and DOM writes;
add `?avperf` to the URL to log them every 5 s.
