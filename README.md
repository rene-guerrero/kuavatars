# KuAvatars

Animated 2D SVG "yellow emoji" avatars for table games: composable faces (any skin colour, any
eye colour, 5 eye shapes, 7 mouths, 10 hairstyles, 7 moustaches, 7 beards, 7 hats, 7 kinds of
eyewear (monocle and pirate eye patch included), freckles, Papi Zorg the alien), 15 moods, floating hands with 9 gestures, eyes that can follow the
cursor, idle life (blinks, winks, glances, nodding off, sleeping with floating z's) and table-game
reactions (hops, head shakes, startled wake-ups).

Framework-free TypeScript and one CSS file, no build step. Each game's Vite compiles it.
It's built to stay cheap on weak phones: idle motion is CSS (run by the compositor), the script
writes to the DOM only when a value changes, and the frame rate is capped per quality level.

```
src/faces.ts     FaceSpec, HUMAN_FACES (pickable), CHARACTER_FACES (by character id). Pure data, no DOM
src/colors.ts    SKIN_TONES, EYE_COLORS, and the shading derived from a colour
src/eyes.ts      eye shapes (built from the same animated parts as the round eye)
src/eyewear.ts   glasses, sunglasses, monocle, eye patch
src/mouths.ts    mouth styles (dress the same animated mouth)
src/parts.ts     hats, moustaches, beards, hairstyles
src/hands.ts     floating hands: shapes and gesture poses
src/pointer.ts   shared pointer tracking for follow-the-cursor eyes
src/avatars.ts   the face (SVG + writers), moods, staticFace, liveFace, AvatarController
src/avatars.css  .av-face / .av-idle / .av-shadow / .av-zzz / .face-static and their keyframes
demo/            face creator, live table, small live faces, a gallery of every part, every face × mood
test/            vitest + happy-dom; markup.test.ts snapshots every built-in face (update with -u when a
                 visual change is intended)
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
"dependencies": { "kuavatars": "github:rene-guerrero/kuavatars#v0.2.0" }
```

To work on an unreleased change of the avatars from inside a game, run `npm link ../kuavatars`
(a symlink, `package.json` is untouched; the next `npm ci` restores the pinned tag).

**Updating:** change kuavatars → `npm test` + check the demo → commit, `git tag v0.x.y`,
push with tags → in each game that uses it, bump `#v0.x.y` in `package.json`, `npm install`, commit, push (the
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

- `FaceSpec` (every field but `iris` is optional):

  | Field | Values |
  | --- | --- |
  | `iris`, `skin` | any hex colour (see below) |
  | `eyes` | `EYE_SHAPES`: `round` (default) `big` `almond` `cat` `button` |
  | `mouth`, `lipColor` | `MOUTHS`: `smile` (default) `lips` `teeth` `buck` `fangs` `thin` `wide`; `lipColor` for `lips` |
  | `hair`, `hairColor` | `HAIR_MEN`: `short` `sidePart` `spiky` `curly` `pompadour` · `HAIR_WOMEN`: `long` `bob` `ponytail` `bun` `pigtails`; colour = a `HAIR_COLORS` key or hex |
  | `stache`, `stacheStyle` | `stache` = colour (a `STACHE_COLORS` key or hex); `STACHES`: `handlebar` (default) `chevron` `pencil` `walrus` `horseshoe` `imperial` `fuManchu`. Thin ones leave the mouth visible |
  | `beard`, `beardColor` | `BEARDS`: `full` `goatee` `vandyke` `chinstrap` `mutton` `stubble` `long`; colour defaults to the moustache's |
  | `eyewear` | `EYEWEAR`: `round` `square` `aviators` `sunglasses` `catEye` `monocle` `eyepatch`. Sunglasses and aviators slide down the nose when amazed. The older `glasses: true` / `aviators: true` flags still work |
  | `hat`, `hatColor` | `HATS`: `cap` `top` `cowboy` `beanie` `straw` `crown` `party`; any colour, shading derived |
  | `brows`, `browColor` | `plain` `thick` `raised` `aviator`; brows match the hair unless `browColor` is set |
  | flags | `lashes` `freckles` `smirk` `mole` `cool` `flower` `gloves` (white gloves when gesturing) |
  | `alien` | Papi Zorg's head (takes `iris`, `skin`, `hat`, `gloves`) |
- **Colours:** `iris` = eye colour (on Papi Zorg, his big almond eyes); `skin` = any hex colour
  (default: the classic yellow, or green for the alien). The rim, glow, shine, drowsy lid, blush,
  freckles and the line colours are derived from `skin`, so any colour works; dark skins get darker
  lines and brows automatically. Faces without `skin` keep their original colours exactly.
- `SKIN_TONES` (`yellow light mediumLight medium mediumDark dark green blue pink purple orange`) and
  `EYE_COLORS` (`blue green brown hazel amber grey teal violet dark`): ready-made swatches for pickers
  (also in `kuavatars/faces`). `facePalette(spec)` / `alienPalette(spec)` give the derived colours,
  for example to tint a plate ring to match.
- A player's custom face is just a FaceSpec: store it as JSON, e.g.
  `{ ...HUMAN_FACES[1], skin: SKIN_TONES.medium, iris: EYE_COLORS.hazel }`.
- `HUMAN_FACES[0..8]`: the faces a player can pick (store the index; `humanFace(i)` clamps it)
- `CHARACTER_FACES.lola | pepe | nico | elena | andres | rosa | carlos | marta | julio | zorg`.
  Names, levels and descriptions stay in each game (with their i18n).
- Anywhere a face is taken, a number means `HUMAN_FACES[n]`.

### Moods

`idle perk happy sad angry amazed thinking sleepy asleep smug meh shout hurt mew cry` (`MOODS` lists them).
`shout` = calling out (announcing a last card), `hurt` = a wince (hit by a penalty), `mew` = confident
half-closed eyes and pressed lips, `cry` = crying out loud (😭): squeezed eyes,
a wailing mouth, two streams of flowing tears, and sobbing on the seats. All four since v0.2.0.
Tears are added to a face only the first time it cries.

### Static and small live faces (summaries, pickers, cards)

```ts
box.append(staticFace(CHARACTER_FACES.zorg, 'happy'));            // an <svg>, no animation
box.append(staticFace(spec, 'idle', { gesture: 'thumbsUp' }));    // a held hand pose
const lf = liveFace(HUMAN_FACES[3], 'idle');                       // blinks, glances, bobs
box.append(lf.el); lf.setExpr('amazed'); lf.glint();               // glint = aviator sparkle
lf.gesture('wave');                                                // hands pop in, play, pop out
lf.follow(true);                                                   // eyes follow the cursor / finger
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
`reset()` (new match) · `calmAll()` · `followPointer(on)` (awake faces look at the mouse or finger) ·
`gesture(seat, g, { mood?, delay? })`.

### Hands

Floating hands without arms pop in next to the head, play a gesture and pop out. `GESTURES`:
`thumbsUp` `thumbsDown` `rub` (rubbing hands) `clap` `wave` `shrug` `facepalm` (both hands over the
eyes) `chin` (🤔) `mewing` (🤫, then the finger slides along the jawline, with the `mew` face). Each sets a
matching mood unless `mood: false`. One-hand gestures use the right hand, on the viewer's left.
The hands are built only the first time a face gestures and are hidden otherwise, so faces that
never gesture cost nothing extra. The hooks add gestures now and then (a winner's thumbs up or
clap, a forcer rubbing hands, a thinker's hand on the chin); turn that off with
`new AvatarController({ autoGestures: false })`.

Seat 0 is the local human: on its turn the face peeks down at the hand instead of "thinking".

### Mood and event hooks

| Hook | When to call it | What the faces do |
| --- | --- | --- |
| `onTurn(seat \| null)` | every turn change (`null` = nobody) | the seat thinks (seat 0 peeks down); others glance at it. Waiting seats nod off after ~11 s, one after another |
| `perk(seat)` | the human's own turn starts | brows up, a tiny hop |
| `onPlay(seat, strong?)` | a seat played (`strong` = slam / winning play) | others glance at it; strong = a determined look |
| `onImpact(seat, 'clack' \| 'slam' \| 'finish')` | the moment a card or tile hits the table | clack: sleepers stir. slam/finish: everyone startles awake and hops |
| `onPass(seat, forcer?)` | a seat could not play (draws, passes) | sad head shake; `forcer` looks smug, the rest are impressed |
| `react(seat, mood, seconds?)` | anything else: quick phrases, a last-card call, a caught player… | that mood for a while, then back to idle |
| `onRoundStart()` | a new round or deal | sleepers wake, everyone looks at the table |
| `onRoundEnd(result[], big?)` | a round ended; `result[seat]` = `'happy'`, `'sad'` or `'meh'` | `big` = surprise first (hop), then the result, and winners hop |
| `onMatchEnd(won[])` | the match ended; `won[seat]` = boolean | winners hop and look up, losers look down |

Hooks are ignored while `setQuiet(true)`.

The demo's **Crea una cara** panel builds a FaceSpec (skin, eyes, features) and shows it live, in every
mood, and as JSON to copy into a game.

### Example: a card game adapter

The game maps its own events to the hooks; the library knows nothing about the rules.

```ts
const av = new AvatarController({ seats: players.length, faces });
switch (ev.type) {
  case 'deal':      av.onRoundStart(); break;
  case 'turn':      av.onTurn(ev.seat); if (ev.seat === 0) av.perk(0); break;
  case 'play':      av.onPlay(ev.seat, ev.strong); av.onImpact(ev.seat, ev.strong ? 'slam' : 'clack'); break;
  case 'penalty':   av.react(ev.seat, 'hurt', 1.6); break;
  case 'pass':      av.onPass(ev.seat); break;
  case 'lastCard':  av.react(ev.seat, 'shout', 1.2); break;
  case 'caught':    av.react(ev.target, 'amazed', 1.2); av.react(ev.by, 'happy', 1.4); break;
  case 'roundEnd':  av.onRoundEnd(seats.map((s) => (s === ev.winner ? 'happy' : 'sad'))); break;
  case 'matchEnd':  av.onMatchEnd(seats.map((s) => s === ev.winner)); break;
}
```

When a game needs a new mood, event, size or face feature, add it here (with a demo control and a
test), tag a release, and bump the games that use it.

## Size

Built into a game (esbuild, minified): **81 KB JS, 29 KB gzipped**, plus 2.8 KB CSS (1 KB gzipped).
v0.1.0 was 34 KB (13 KB gzipped); the new parts are mostly SVG path data. Hands, hats, hair and
the other parts add nothing to the DOM unless a face uses them.

## Dev measurement

In a Vite dev build, `window.__avStats` counts the avatars' main-thread ms, ticks and DOM writes;
add `?avperf` to the URL to log them every 5 s.
