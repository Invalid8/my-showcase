import type { Block } from "./case-studies";

export type Craft = {
  slug: string;
  title: string;
  blurb: string;
  tags: string[];
  line: string;
  intro: string;
  blocks: Block[];
};

const drumCode = `digits.current[place]?.forEach((span, digit) => {
  const delta = ((digit - position + 15) % 10) - 5;
  const angle = delta * STEP;
  const facing = Math.cos((angle * Math.PI) / 180);
  span.style.opacity =
    Math.abs(angle) >= 90 ? "0" : String(0.12 + 0.88 * facing ** 2);
  span.style.transform = \`translateZ(\${-radius}px) rotateX(\${-angle}deg) translateZ(\${radius}px)\`;
});`;

const blurCode = `let moved = Math.abs(position - last[place]);
if (moved > 5) moved = 10 - moved;
const speed = (moved / dt) * 1000;
blurs.current[place]?.setAttribute(
  "stdDeviation",
  \`0 \${still ? 0 : Math.min(7, speed * 0.05).toFixed(2)}\`,
);

const durationFor = (distance: number) =>
  Math.min(2600, 420 + 520 * Math.log10(distance + 1));`;

const pointCode = `const ruler = root.querySelector<HTMLElement>('[data-agent="ruler"]');
const pixelsPerFrame = Number(ruler.dataset.pixelsPerFrame);
const along = ruler.getBoundingClientRect();
const view = (ruler.closest('.filmstrip__scroll') ?? ruler).getBoundingClientRect();
const x = clamp(along.left + aim.frame * pixelsPerFrame, view.left, view.left + view.width);
if (aim.kind === 'ruler') return { x, y: centre(along).y };
const lane = root.querySelector(\`[data-lane="\${quoted(aim.trackId)}"]\`);
return lane ? { x, y: centre(lane.getBoundingClientRect()).y } : undefined;`;

const heartCode = `const drift = (Math.random() - 0.5) * 90;
const rise = 70 + Math.random() * 70;
const size = 0.6 + Math.random() * 0.7;
heart.animate(
  [
    { transform: "translate(-50%, 0) scale(0.2)", opacity: 1 },
    {
      transform: \`translate(calc(-50% + \${drift * 0.3}px), -24px) scale(\${size * 1.25})\`,
      opacity: 1,
      offset: 0.2,
    },
    {
      transform: \`translate(calc(-50% + \${drift}px), -\${rise}px) scale(\${size})\`,
      opacity: 0,
    },
  ],
  {
    duration: 900 + Math.random() * 500,
    delay: i * 35,
    easing: "cubic-bezier(0.2, 0.8, 0.3, 1)",
    fill: "backwards",
  },
).finished.then(() => heart.remove());`;

const slipJobCode = `export const RULE = "-".repeat(COLUMNS);

const row = (key: string, value: string) => {
  ops.push({ kind: "text", x: MARGIN, y: top + BASELINE, text: key });
  ops.push({
    kind: "text",
    x: MARGIN + 10 * CELL,
    y: top + BASELINE,
    text: value,
    bold: true,
  });
  top += LINE;
};

row("CUSTOMER", slip.name.toUpperCase());
row("ACCOUNT", spaced(slip.accountNumber));`;

const slipClampCode = `for (let pass = 0; pass < 4; pass++)
  for (let c = 0; c < NX; c++) {
    if (!pinned[c]) continue;
    const max = Math.hypot(restU(index) - restU(c), restV(index));
    const dx = p[0] - pos[c * 3];
    const dy = p[1] - pos[c * 3 + 1];
    const dz = p[2] - pos[c * 3 + 2];
    const d = Math.hypot(dx, dy, dz);
    if (d > max) {
      const k = max / d;
      p[0] = pos[c * 3] + dx * k;
      p[1] = pos[c * 3 + 1] + dy * k;
      p[2] = pos[c * 3 + 2] + dz * k;
    }
  }`;

const slipTearCode = `const started = pinned.some((p) => !p);
if (worst < 0 || over < TEAR_START * (started ? 0.4 : 1)) {
  tearing = Math.max(0, tearing - dt * 4);
  return;
}
tearing += dt * (started ? 70 : 3 + (over - TEAR_START) * 80);
if (tearing < 1) return;
tearing = 0;
pinned[worst] = false;
inv[worst] = 1;
if (pinned.every((p) => !p)) setState("torn");`;

const slipLightCode = `float facing = dot(n, uLight);
float diffuse = clamp(1.0 + 0.62 * (facing - uLight.z), 0.5, 1.06);
vec3 h = normalize(uLight + v);
float gloss = pow(max(dot(n, h), 0.0), 70.0) * 0.38;
float rim = pow(1.0 - max(dot(n, v), 0.0), 5.0) * 0.3;
float slot = 1.0 - vPin * 0.22 * exp(-(vUv.y - uCut) * uLength / 0.018);
vec3 base = back ? vec3(0.9, 0.894, 0.875) * paper.a : paper.rgb;
vec3 lit = base * diffuse * slot + (back ? 0.0 : gloss + rim) * paper.a;`;

export const drawerStates = [
  {
    src: "/crafts/drawer/bb-sheet-open.png",
    caption: "01 waiting for an address",
  },
  { src: "/crafts/drawer/bb-sheet-checking.png", caption: "02 checking" },
  { src: "/crafts/drawer/bb-sheet-failed.png", caption: "03 nothing answered" },
  {
    src: "/crafts/drawer/bb-sheet-above-keyboard.png",
    caption: "04 rides the keyboard",
  },
];

export const crafts: Craft[] = [
  {
    slug: "record-player",
    title: "Record player",
    blurb:
      "A turntable made of gradients and transforms. Pick a record and the arm drops, then creeps across the grooves as the song plays.",
    tags: ["CSS", "Audio"],
    line: "A turntable built out of gradients and transforms.",
    intro: "Wired to a real YouTube playlist: what I actually have on repeat.",
    blocks: [
      {
        type: "demo",
        id: "record-player",
        caption:
          "The player itself. Pick a record; the arm swings in and starts its walk across the grooves.",
        wide: true,
      },
      {
        type: "text",
        heading: "Gradients, not images",
        body: "There isn't a single image of a turntable in it. The plinth is a linear gradient with a hairline of white on its top edge and a long shadow under it, the platter is a conic gradient whose alternating greys catch light like brushed metal, and the grooves are one repeating radial gradient on the disc. The only bitmap is the label in the middle, which is the cover of whatever's playing.",
      },
      {
        type: "code",
        file: "components/shared/MusicPlayer/Disc.tsx",
        lang: "tsx",
        code: '"repeating-radial-gradient(circle closest-side at 50% 50%,\n  rgba(0,0,0,0.4) 0 0.6%, transparent 0.6% 2.9%,\n  rgba(255,255,255,0.04) 2.9% 3.5%, transparent 3.5% 5.8%)"',
        caption:
          "The grooves: a dark ring, a gap, a faint highlight, a gap, repeated to the edge.",
      },
      {
        type: "text",
        body: "Spinning is a CSS animation that never stops existing; pausing a record only sets its play state to paused, so the disc halts where it is instead of snapping back to zero. People who ask for reduced motion get a still record.",
      },
      {
        type: "text",
        heading: "The arm follows the song",
        body: "A real needle doesn't sit in one spot. It starts at the outer edge and drifts toward the label as the side plays, so the arm here does the same: parked at 129°, dropped to 139.1° when a song starts, and from there it's just the song's progress mapped onto the remaining twelve degrees.",
      },
      {
        type: "code",
        file: "components/shared/MusicPlayer/Turnable.tsx",
        lang: "tsx",
        code: "const ARM_PARKED = 129;\nconst ARM_START = 139.1;\nconst ARM_END = 151;\n\nconst ratio = total > 0 ? Math.min(progress / total, 1) : 0;\nconst armAngle = live\n  ? ARM_START + (ARM_END - ARM_START) * ratio\n  : ARM_PARKED;",
      },
      {
        type: "text",
        heading: "What's on it",
        body: "The records are my actual YouTube playlist, read on the server and cached for an hour. YouTube titles are messy, so each one is split into artist and song, anything private or blocked from embedding is dropped before it can fail in the player, and the cover, album and year come from Apple's catalogue because YouTube thumbnails are video stills, not sleeves. If the API key is missing or YouTube is down, the page serves a playlist bundled with the site, so the deck is never empty.",
      },
    ],
  },
  {
    slug: "ascii",
    title: "Drawn in characters",
    blurb:
      "A desert, a few hanging threads and my turntable, all made of monospace text. Every character is chosen for its shape, so curves stay curves.",
    tags: ["ASCII", "Motion"],
    line: "Every character is a shape, not a brightness.",
    intro:
      "Everything on this page is plain text, redrawn about thirty times a second. Run your pointer through it.",
    blocks: [
      {
        type: "demo",
        id: "desert",
        caption:
          "The desert from my home page, 24 rows tall. Move through it: the lizard bolts, the cacti flower when you get close.",
        wide: true,
      },
      {
        type: "text",
        heading: "One engine for all of it",
        body: "Everything here sits on one small engine. A piece is a block of text, and every frame it's redrawn character by character. Each character carries a bit of energy; when the pointer comes within reach it gets kicked away from it, and that energy bleeds off by 7% a frame, so it drifts home instead of snapping back. While it's moving it might show as a speck of dust instead of itself, which is what makes it look scattered rather than shifted.",
      },
      {
        type: "code",
        file: "lib/ascii/piece.ts",
        lang: "ts",
        code: "let e = this.energy[i] * 0.93;\nif (d < radius) {\n  const k = 1 - d / radius;\n  if (k > e) {\n    e = k;\n    this.angle[i] = Math.atan2(dy, dx);\n  }\n}\nif (e > 0.06) {\n  const push = e * e * 3.2;\n  const nc = c + Math.round(Math.cos(this.angle[i]) * push);\n  const nr = r + Math.round(Math.sin(this.angle[i]) * push * 0.55);\n  out[nr][nc] = Math.random() < e * 0.7 ? pick(AGITATE) : ch;\n}",
        caption:
          "Excerpt. Rows move about half as far as columns, because a character cell is twice as tall as it is wide.",
      },
      {
        type: "text",
        heading: "Ground that knows its slope",
        body: "The ground is the part that took longest. It's one ridge, a gentle sine, and each column picks its character from two things: where the line falls inside the cell, and how steep it is there. Steep gets a slash, rising and falling get a tick or a dot, flat gets a dash or an underscore depending on whether the ridge sits high or low in the row. I tried a second, farther ridge; it made the band busy, so it went.",
      },
      {
        type: "code",
        file: "lib/ascii/desert/scene.ts",
        lang: "ts",
        code: 'function heightChar(frac: number, slope: number) {\n  if (slope > 0.9) return "\\\\";\n  if (slope < -0.9) return "/";\n  if (frac < 0.5) return slope < -0.3 ? "\'" : slope > 0.3 ? "`" : "-";\n  if (frac < 0.8) return slope < -0.3 || slope > 0.3 ? "." : "-";\n  return "_";\n}',
      },
      {
        type: "text",
        body: "The sun in the corner is drawn by hand. A circle computed at this size falls apart into doubled slashes, so it's a quarter disc typed out once and filled with colons that flicker to dots, like heat. The same rule cut a tumbleweed and a walking camel: neither ever read as what it was, and if something can't be drawn well in characters, it doesn't go in.",
      },
      {
        type: "demo",
        id: "rope",
        caption: "Threads hanging from the top edge. Push them.",
      },
      {
        type: "text",
        heading: "Threads",
        body: "Each thread is a chain of points under Verlet integration: every point remembers where it was last frame, keeps 96% of that motion, and gets a little gravity and a slow sideways breeze. Then eight passes pull each pair back to its rest length, with the top point pinned. The fun part is the drawing. Nothing is rotated; each segment looks at its own angle and picks a character for it.",
      },
      {
        type: "code",
        file: "lib/ascii/rope.ts",
        lang: "ts",
        code: 'const ang = Math.atan2(b.x - a.x, b.y - a.y);\nspan.textContent = Math.abs(ang) < 0.16 ? "|" : ang > 0 ? "\\\\" : "/";',
        caption:
          "Under about nine degrees it hangs straight; past that it leans.",
      },
      {
        type: "demo",
        id: "turntable",
        caption:
          "The record player from this site, in characters, 36 frames a turn.",
      },
      {
        type: "text",
        heading: "Rendered by shape",
        body: "This is the same turntable, rendered into text by shape rather than brightness. The usual way to make ASCII art treats each cell as a pixel and maps its brightness onto a ramp like .:-=+*#, which blurs every edge. Instead, every candidate character is drawn in JetBrains Mono and measured by how much ink lands in six circles laid out two by three. The picture is sampled with the same six circles, ten more reach into the neighbouring cells to sharpen each sample against what's around it, and the closest character wins. That's how a curved edge comes out as .Y' instead of a smear.",
      },
      {
        type: "text",
        body: "The alphabet is short on purpose. Letters and digits read as noise, and ligatures turn -> into an arrow, so the renderer picks only from punctuation and a few thin letters, with ligatures switched off. To spin it, the record is rotated in the source image ten degrees at a time with the tonearm masked back on top, all 36 frames are rendered ahead of time, and the browser only swaps a block of text every 140 ms. The arm stays put while the record turns under it, the way a real one does.",
      },
    ],
  },
  {
    slug: "drawer",
    title: "A drawer that follows your thumb",
    blurb:
      "Baseband's own bottom drawer: it follows the drag one to one, carries the keyboard in the same motion, grows without jumping and leaves at the speed you flick it.",
    tags: ["React Native", "Motion"],
    line: "Dragged, flicked and carried, all in one transform.",
    intro:
      "Every drawer in Baseband is the same component, tuned until it felt like part of the phone. This is the one that asks for your router's address.",
    blocks: [
      {
        type: "demo",
        id: "drawer",
        caption:
          "The address drawer in Baseband, on an iPhone: waiting, checking, nothing answered, and riding the keyboard.",
        wide: true,
      },
      {
        type: "text",
        heading: "One field, a lot of ways to go wrong",
        body: "Baseband talks to your router directly, and when it can't find it, it asks for the router's address. That one question lives in a drawer, and the drawer has to survive a keyboard opening under it, a phone with a home indicator, a tab bar, a flick, and someone who prefers no motion at all. It's Baseband's own Sheet component, built on Reanimated, Gesture Handler and react-native-keyboard-controller, and everything that moves runs on the UI thread.",
      },
      {
        type: "text",
        heading: "One transform for everything",
        body: "The drawer's position is a single translateY, and everything that moves it adds into that one number: the drag offset while your thumb is on it, the spring when it opens, and the keyboard. keyboard-controller exposes the keyboard's height as a shared value that changes on every frame of the keyboard's own animation, so folding it into the same transform means the drawer and the keys travel together. Drag the drawer while the keyboard is up and both still agree, because there's only one position to agree on.",
      },
      {
        type: "code",
        file: "components/ui/Sheet.tsx",
        lang: "tsx",
        code: "const sheetStyle = useAnimatedStyle(() => ({\n  opacity: opacity.get(),\n  transform: [\n    {\n      translateY:\n        Math.max(offset.get(), 0) +\n        Math.min(0, keyboard.height.get() + WINDOW_BOTTOM),\n    },\n  ],\n}));",
      },
      {
        type: "text",
        body: "The keyboard covers the home indicator area too, and the drawer already pads itself by that inset, so the inset is added back before the drawer moves; otherwise it floats one indicator-height above the keys. That inset comes from the window, not the screen. Opened from a tab, the screen's safe area also counts the tab bar, and the first version stood 49 points too tall on the iPhone because of it.",
      },
      {
        type: "text",
        heading: "Measured, and it never shrinks",
        body: "The drawer measures its content and travels exactly that far, instead of a hardcoded 400 pixels. When something inside grows, like the error line appearing, the offset absorbs the difference and springs back, so the drawer grows upward instead of jumping. It also never shrinks: its minimum height ratchets up to the tallest it has been, and the note under the field always reserves two lines. Going from checking to failed to typing again, the button never moves under your thumb.",
      },
      {
        type: "code",
        file: "components/ui/Sheet.tsx",
        lang: "tsx",
        code: "const onLayout = (e: LayoutChangeEvent) => {\n  const measured = e.nativeEvent.layout.height;\n  const previous = height.get();\n  height.set(measured);\n  if (measured > floor) setFloor(measured);\n  if (!visible || leaving.get()) return;\n  if (previous === 0) {\n    offset.set(measured);\n    show();\n  } else if (measured > previous) {\n    offset.set(offset.get() + measured - previous);\n    show();\n  }\n};",
      },
      {
        type: "text",
        heading: "Flicks, and a fast way out",
        body: "Dragging follows the finger one to one. Letting go doesn't just compare where it stopped: it projects where it was headed, a tenth of a second of velocity ahead, and closes if that lands past half the drawer's height. A short slow drag springs back; a quick flick from anywhere closes it.",
      },
      {
        type: "code",
        file: "components/ui/Sheet.tsx",
        lang: "tsx",
        code: ".onEnd((e) => {\n  if (offset.get() + e.velocityY * FLICK_PROJECTION > height.get() / 2) {\n    hide(e.velocityY);\n    scheduleOnRN(onDismiss);\n  } else {\n    offset.set(\n      withSpring(0, { ...Motion.spring.gentle, velocity: e.velocityY }),\n    );\n  }\n});",
      },
      {
        type: "text",
        body: "It opens on a spring but leaves on a timed slide: 240 ms, shorter when it's flung, so it carries the speed of your finger off the screen. That wasn't for looks. A spring keeps settling for a while after it looks done, the modal stayed up until it finished, and the first tap after closing was being swallowed. With a timed exit the window closes the moment the drawer is gone.",
      },
      {
        type: "text",
        heading: "Honest states",
        body: "While the address is being checked, Cancel is disabled, so the backdrop, the drag and Android's back button refuse too; nothing gets a way out that the visible button doesn't. Each check gets a number, and an answer that comes back for an older one is ignored. The button itself is the same pill the whole time: grey until the text is a valid address, a spinner while it checks, then Try again. The error says what happened, with the address and how long it waited. VoiceOver's escape gesture closes the drawer, and under reduced motion it fades instead of travelling.",
      },
    ],
  },
  {
    slug: "agent-cursor",
    title: "A cursor for the agent",
    blurb:
      "When an AI agent edits a project in Cosmic Studio, a named cursor glides to the place a person would have used for the same edit, rings once, and dims when the agent rests.",
    tags: ["Desktop", "Agents"],
    line: "So you see the hand, not only the result.",
    intro:
      "Cosmic Studio, my video editor, can be driven by agents. This is how you can tell where they are.",
    blocks: [
      {
        type: "loop",
        src: "/crafts/agent-cursor/agent-cursor.mp4",
        narrow: "/crafts/agent-cursor/agent-cursor-phone.mp4",
        poster: "/crafts/agent-cursor/agent-cursor.jpg",
        label:
          "Claude Code editing a Cosmic Studio project over MCP: its cursor glides to the ruler for a seek, the cut frame for a split, the clip's edge for a trim, the keyframe, then the title on the canvas",
        caption:
          "Claude Code driving Cosmic Studio over MCP: a seek, a split, a trim, a keyframe, then a move on the canvas.",
      },
      {
        type: "text",
        heading: "Seeing the hand, not only the result",
        body: "Cosmic Studio is a video editor that agents can drive over MCP. An agent edits faster than anyone can read a timeline, and without something on screen the only account of its work is that the project looks different from a moment ago. That is the kind of thing that makes people stop trusting a tool. So the agent gets a cursor, with its name on it, and the cursor goes where a person's hand would have gone.",
      },
      {
        type: "text",
        heading: "Where a person would do it",
        body: "Every tool call the agent makes comes back to the window as an event: who called it, which tool, the arguments and the result. A single function turns that into an aim. A split points at the exact frame of the cut on that clip's lane, a trim at the clip's front edge, a new duration at its end, a keyframe at its frame, a seek or a marker at the ruler, and Save, Export, Undo or a track toggle at that control. Sixty-nine tools map this way. One that has no place a person would touch, like reading the project, moves nothing.",
      },
      {
        type: "code",
        file: "src/editor/agent-cursor.ts",
        lang: "ts",
        code: "export function aimFor(work: Working, project: Project, before: Project, playhead: number): Aim | undefined {\n  const a = work.arguments, r = work.result;\n  const control = CONTROLS[work.tool];\n  if (control) return { kind: 'control', name: control };\n  const found = (clipId: string) => locate(project, clipId) ?? locate(before, clipId);\n  …\n  switch (work.tool) {\n    case 'split_clip': return onClip(a.clipId, start => start + a.atFrameOffset);\n    case 'trim_clip_start': return onClip(a.clipId, start => start);\n    case 'set_clip_duration': return onClip(a.clipId, (start, duration) => start + duration);\n    case 'add_keyframe': return onClip(a.clipId, () => a.frame);\n    case 'roll_cut': return onClip(a.clipId, (start, duration) => start + duration);\n    case 'add_marker': return { kind: 'ruler', frame: a.frame };\n    case 'set_clip_properties': return { kind: 'canvas', clipId: a.clipId, frame: a.frame };\n    case 'seek': return { kind: 'ruler', frame: a.frame };\n    …\n  }\n}",
        caption:
          "Excerpt, trimmed with …. Clips are looked up in the project before the edit too, so a removed clip can still be pointed at.",
      },
      {
        type: "text",
        heading: "Pointing at real pixels",
        body: "Frames become screen points through the ruler, which carries its own pixels-per-frame, so the aim stays right at any zoom, and the point is clamped to the part of the timeline in view. For edits on the canvas, the window asks the Rust core for that clip's quad at that frame, after its keyframes, so the cursor lands on the clip where it actually is, tilted or scaled. Buttons only need a data-agent name; nothing threads a ref through the app for a feature that usually draws nothing.",
      },
      {
        type: "code",
        file: "src/editor/agent-cursor.ts",
        lang: "ts",
        code: pointCode,
      },
      {
        type: "text",
        heading: "Glide, ring, rest",
        body: "The cursor glides for 900 ms on a soft ease-out. The ring that marks the arrival waits 650 ms before it starts, so it opens just as the arrow lands, not while it's still travelling. Eight seconds after the last call the cursor dims to a third: an agent can stop mid-task, or lose its connection, without ever saying it's finished, and the editor must not look occupied forever. With reduced motion, it moves without the glide or the ring.",
      },
      {
        type: "code",
        file: "src/styles/editor.css",
        lang: "css",
        code: ".agent-cursor {\n  position: fixed;\n  z-index: 60;\n  pointer-events: none;\n  transform: translate(var(--agent-x), var(--agent-y));\n  transition: transform 900ms cubic-bezier(0.22, 1, 0.36, 1), opacity 400ms ease;\n}\n.agent-cursor.is-resting { opacity: 0.35; }\n.agent-cursor__ring {\n  border: 2px solid var(--agent);\n  opacity: 0;\n  animation: agent-arrive 700ms 650ms cubic-bezier(0.22, 1, 0.36, 1);\n}\n@keyframes agent-arrive {\n  from { transform: scale(0.4); opacity: 0.9; }\n  to { transform: scale(1.3); opacity: 0; }\n}\n@media (prefers-reduced-motion: reduce) {\n  .agent-cursor { transition: opacity 400ms ease; }\n  .agent-cursor__ring { animation: none; }\n}",
        caption: "Excerpt.",
      },
      {
        type: "text",
        heading: "Where it started",
        body: "The first version, in Cosmic Editor, announced each tool before it ran rather than after, because a long import is exactly when someone wonders what is happening. Each agent got its own colour, hashed from the name it gives when it connects, so the same agent is the same colour every session and two at once never collide, and none of them borrowed the app's lime, which already meant selected. It sat above every dialog, because an agent working while a dialog is open is when a person most needs to see it. Studio rebuilt it around where a person would act, which is what makes it read as a hand and not a highlight.",
      },
    ],
  },
  {
    slug: "count-up",
    title: "A counter that turns",
    blurb:
      "My own count-up, modelled on a mechanical counter: drums that carry like a real one, blur at speed and coast when you flick them. It grew out of a version I wrote for Fefys.",
    tags: ["Motion", "Web"],
    line: "Drums, not digits.",
    intro:
      "A count-up built the way a real counter is: one drum per place. Play with it.",
    blocks: [
      {
        type: "demo",
        id: "counter",
        caption: "Drag it, flick it, or press a button.",
      },
      {
        type: "text",
        heading: "Where it came from",
        body: "Fefys celebrates with numbers, and in November I went through three versions of its count-up in forty minutes. The app shipped the third, built on a library, which was the right call for an app with a deadline. The one I kept thinking about was the second: an odometer I wrote myself, with a wheel for every digit and a carry that worked like a real one. It had faults I didn't have time for then. This is that idea, finished.",
      },
      {
        type: "text",
        heading: "Drums, not digits",
        body: "A real counter doesn't slide digits in and out. Each place is a drum, a short cylinder with 0 to 9 printed around it, and you see the face that's turned towards you through a window. So that's what this draws. Every frame, each of the ten digits on a drum is rotated to its place on the cylinder, 36 degrees apart, around an axis set back behind the window, so the digit facing you is drawn at its true size and the others shrink as they curve away. A digit fades with the square of how directly it faces you, so the ones curving away darken the way printed numbers do on a real drum, and the window's top and bottom edges fade into shadow.",
      },
      {
        type: "code",
        file: "components/crafts/Counter.tsx",
        lang: "tsx",
        code: drumCode,
      },
      {
        type: "text",
        heading: "The carry",
        body: "The carry is the function from Fefys, unchanged. A drum above the units only turns during the last tenth of the drum below it, the way a real odometer's tens wheel waits for the units to come round. Go from 1,299 to 1,300 and the tens and hundreds drums sit still until the units pass 9, then all three roll over together.",
      },
      {
        type: "code",
        file: "components/crafts/Counter.tsx",
        lang: "ts",
        code: "export function wheelPosition(shown: number, place: number) {\n  const unit = 10 ** place;\n  if (place === 0) return shown % 10;\n  const base = Math.floor(shown / unit) % 10;\n  const lower = shown % unit;\n  const carry = Math.max(0, lower - (unit - 1));\n  return base + carry;\n}",
        caption:
          "With 129.4 showing, the units drum is at 9.4 and the tens drum at 2.4: already rolling towards 3.",
      },
      {
        type: "text",
        heading: "Speed you can see",
        body: "Each drum gets its own blur, vertical only, sized by how fast that drum is turning right now. A big jump smears the units into a streak while the thousands barely move; a +1 stays sharp. How long a move takes grows with the size of the change rather than in proportion to it, so one step is quick and a jump of sixty thousand takes its time without dragging, and every move eases out to rest with no overshoot.",
      },
      {
        type: "code",
        file: "components/crafts/Counter.tsx",
        lang: "ts",
        code: blurCode,
      },
      {
        type: "text",
        heading: "In your hand",
        body: "Drag it and the units drum follows your finger, one drum height per number, with the carries rippling up as you go. Let go and it keeps a third of a second of your speed, coasts and settles on a whole number, never between two. The drums never change size and the leading zeros stay, just dimmed, so the number never shifts while it counts. For anyone who prefers reduced motion, it goes straight to the number.",
      },
      {
        type: "code",
        file: "components/crafts/Counter.tsx",
        lang: "tsx",
        code: "const onPointerUp = () => {\n  if (!drag.current) return;\n  const { speed } = drag.current;\n  drag.current = null;\n  const coast = speed * FLICK_PROJECTION;\n  goTo(shown.current + coast, 380 + Math.min(1600, Math.abs(coast) * 60));\n};",
      },
    ],
  },
  {
    slug: "pin-slip",
    title: "A PIN slip you can tear off",
    blurb:
      "The temporary PIN slip from BAAS, my biometric ATM project, as thermal paper you can handle: it prints out of a slot, bends and sags as you pull it, catches the light, and tears off along the teeth.",
    tags: ["WebGL", "Motion"],
    line: "Thermal paper, not a card.",
    intro:
      "The slip a BAAS staff desk prints when an account is opened, printed again here so you can pick it up.",
    blocks: [
      {
        type: "text",
        heading: "Why a slip at all",
        body: "BAAS is a cardless ATM: you sign in with your account number and a fingerprint or a PIN. When staff open an account or reset a PIN, the server picks four digits, keeps only their hash, and hands the plain PIN to the desk exactly once. The console holds it in memory, never in storage, prints it, and asks staff to confirm the customer has it. Then it forgets it, the audit log records the hand-over, and the PIN is hidden for good. Leaving the page before that warns you, because the PIN can't be shown again. The first time the customer uses a kiosk, it makes them choose their own. A slip of paper is the right object for a secret that should exist once, in one person's hand, so I drew it as one.",
      },
      {
        type: "demo",
        id: "pin-slip",
        caption: "Pull it, bend it, tear it off.",
      },
      {
        type: "text",
        heading: "Printed, not drawn",
        body: "The first design for the console was a tidy white card with the PIN in rounded boxes, and it looked like nothing a printer makes. A 58 mm thermal printer prints 32 columns of one monospace font, so the slip is laid out on that grid: every line is placed by column, keys pad to ten columns, the dashed rules are exactly 32 dashes so they can never wrap, and the PIN is the same font at three times the size, the way a printer's double-size mode does it. The security band behind the PIN is a hatch of thin printed lines rather than a grey fill. The ink is lighter in one band about two thirds of the way across, where a worn head runs light. The barcode and the reference come from the same two functions the console uses.",
      },
      {
        type: "code",
        file: "components/crafts/pin-slip/job.ts",
        lang: "ts",
        code: slipJobCode,
        caption: "Excerpt.",
      },
      {
        type: "text",
        body: "That layout is a print job, a list of text, logo, band and bar operations, and two small renderers read it. One writes an SVG that the server sends with the page, so without JavaScript, on a slow connection, or with reduced motion on, you get the slip at rest and nothing else. The other paints the same job onto a canvas at the resolution it will be shown at, and that becomes the texture on the paper.",
      },
      {
        type: "text",
        heading: "Paper that bends but doesn't stretch",
        body: "The paper is a grid of 15 by 41 points, stepped 120 times a second. Links between neighbours hold its length, diagonal links hold its shape, and links that skip one and three points resist bending, which is the difference between paper that rolls into a loop and paper that crumples like cloth. Air pushes back on whatever part of the sheet moves face first, so it sags and drifts rather than swinging like a rope. While it's still attached, each point is tied to its column at the slot and can never be further from it than the paper is long. Your hand gets the same rule: whatever point you grab can only go as far as the paper allows from every column still held by the printer, so it goes taut and stops instead of stretching.",
      },
      {
        type: "code",
        file: "components/crafts/pin-slip/engine.ts",
        lang: "ts",
        code: slipClampCode,
        caption: "Where your hand can take the point it's holding.",
      },
      {
        type: "text",
        heading: "Tearing along the teeth",
        body: "The distance your hand is past that limit is the pull. The column under the most pull is where the tear starts, and only once that pull passes a tenth of the slip's width, so a nudge never tears it and a tug does. Starting is the hard part: the first column needs a firm pull held for a moment. After that the tear runs, a column at a time, towards the other edge in about a fifth of a second, the way a real slip rips once the teeth have bitten. Ease off halfway and it stays half torn, hanging by its last columns. Both ends of the slip carry the zigzag the teeth leave.",
      },
      {
        type: "code",
        file: "components/crafts/pin-slip/engine.ts",
        lang: "ts",
        code: slipTearCode,
      },
      {
        type: "text",
        heading: "Light on the coating",
        body: "Thermal paper has a smooth coated face and a dull back, and it's the coating that catches the light as the sheet turns. The light sits above and to the left, placed so that its highlight falls off the paper when the slip hangs flat. So the slip at rest is lit exactly like the printed SVG, and the shine only appears when you bend it: lift the bottom into a loop and the highlight runs across the curve, turn an edge away and it brightens at the grazing angle. The back is plain, matte and slightly grey, with no print showing through. Brightness is measured against the flat pose, so the flat slip shows its true colours, and the paper darkens just under the slot where the printer's lip shades it.",
      },
      {
        type: "code",
        file: "components/crafts/pin-slip/engine.ts",
        lang: "glsl",
        code: slipLightCode,
        caption: "Excerpt from the fragment shader.",
      },
      {
        type: "text",
        body: "The shadow is the paper projected along the light onto a wall just behind it, drawn at a quarter of the resolution and blurred, so a corner curling towards you casts a shadow further out and fainter. It's dark enough to hold in both themes.",
      },
      {
        type: "text",
        heading: "Printing, and letting go",
        body: "The printer feeds the slip out over 1.6 seconds, in the slightly uneven steps of a stepper motor, and you can't grab it until it stops. Let go of an attached slip and it sways back on the air, with no spring to throw it past its rest. Let go of a torn one and it eases into place with no overshoot: lying a little below the slot, turned two degrees, the way the console draws it. The engine and the painter are about 7 KB gzipped of my own WebGL2, with no library under it, and it's only fetched when this page mounts the slip. It stops drawing when the paper is still or off screen. Arrow keys sway the slip, and Enter tears it off or prints another.",
      },
    ],
  },
  {
    slug: "tab-bar",
    title: "A tab bar that becomes search",
    blurb:
      "Two glass shapes in the Fefys tab bar: a pill that stretches as it slides, labels that light as it passes, and a morph into search that rides the keyboard only when it should.",
    tags: ["React Native", "Motion"],
    line: "Two shapes, swapping widths.",
    intro:
      "The bar at the bottom of Fefys, and the one morph that turns it into search.",
    blocks: [
      {
        type: "loop",
        src: "/crafts/tab-bar/tab-bar.mp4",
        poster: "/crafts/tab-bar/tab-bar.jpg",
        label:
          "The Fefys tab bar on an Android phone: the pill slides across Explore, Plan and List and back to Today, then the bar morphs into a Home circle and a search field, the keyboard opens and the bar rides it while jollof is typed, then it closes back into tabs",
        caption: "Tabs, then search, then back.",
        phone: true,
      },
      {
        type: "text",
        heading: "Two shapes",
        body: "Fefys has four tabs and a search, and search lives in the tab bar, not in a field on every screen. So the bar is two glass shapes floating over the content: a capsule with the tabs, and a circle with a magnifying glass. Everything it does is those two shapes changing.",
      },
      {
        type: "text",
        heading: "A pill that stretches",
        body: "The pill under the active tab slides in 340 ms, and on its way it stretches: to 1.22 times its width over the first third of the trip, then back. It reads as a drop of something sliding, without the overshoot a spring would add. The first placement doesn't animate at all, so opening the app never shows a pill sliding in from nowhere. Changing tab gives a haptic tap when haptics are on; pressing the tab you're already on gives none, because nothing happened.",
      },
      {
        type: "code",
        file: "src/components/ui/TabBar.tsx",
        lang: "tsx",
        code: "x.set(withTiming(target, { duration: SLIDE, easing: EASE_OUT }));\nstretch.set(\n  withSequence(\n    withTiming(1.22, { duration: SLIDE * 0.35, easing: EASE_OUT }),\n    withTiming(1, { duration: SLIDE * 0.65, easing: EASE_OUT }),\n  ),\n);",
      },
      {
        type: "text",
        heading: "Labels that light as it passes",
        body: "Each label takes its colour from how close the pill is to it, not from which tab is selected. Slide from Today to List and Explore and Plan light up as the pill passes under them and dim as it leaves, so the bar says where the pill is at every frame, not only where it's going.",
      },
      {
        type: "code",
        file: "src/components/ui/TabBar.tsx",
        lang: "tsx",
        code: "const label = useAnimatedStyle(() => {\n  const near = Math.max(0, 1 - Math.abs(x.get() - order * restStep) / TAB.width);\n  return {\n    color: interpolateColor(near, [0, 1], [colors.mute, colors.ink]),\n    opacity: 1 - Math.min(1, morph.get() * 4),\n  };\n});",
      },
      {
        type: "text",
        heading: "One morph, no new pieces",
        body: "Tap search and the two shapes trade widths over 460 ms: the capsule shrinks into a circle and the circle grows into the field. Nothing new appears. As the capsule narrows, the tab slots squeeze their spacing to match and fade out right to left, List first and Today last, each one shrinking a little as it goes. Once they've gone, a house fades in as the Home button in the circle that's left, the magnifying glass glides to the field's left edge, and the field fades in for the second half.",
      },
      {
        type: "text",
        heading: "It rides the keyboard, only when it should",
        body: "The bar only rides the keyboard while it's searching. Its lift is the keyboard's height multiplied by the morph, so on any other screen a keyboard opens under a bar that stays put, and during the morph the two move together. The keyboard itself waits for a tap on the field instead of jumping up the moment search opens, and closing search with the Home circle puts it away.",
      },
      {
        type: "code",
        file: "src/components/ui/TabBar.tsx",
        lang: "tsx",
        code: "const left = useAnimatedStyle(() => ({\n  width: interpolate(morph.get(), [0, 1], [capsuleWide, ROUND]),\n}));\nconst right = useAnimatedStyle(() => ({\n  width: interpolate(morph.get(), [0, 1], [ROUND, capsuleWide]),\n}));\nconst bar = useAnimatedStyle(() => ({\n  transform: [\n    {\n      translateY:\n        morph.get() * Math.min(0, keyboard.height.get() + insets.bottom + FOOTER_GAP - 8),\n    },\n  ],\n}));",
        caption:
          "The same two widths, swapped. The lift is zero until morph moves.",
      },
    ],
  },
  {
    slug: "heart",
    title: "The footer heart",
    blurb:
      "Click the heart in my footer and nine hearts burst out, each with its own drift, rise and size.",
    tags: ["Motion", "WAAPI"],
    line: "Built with ♥, and it means it.",
    intro: "The smallest thing on this site, and one I kept going back to.",
    blocks: [
      {
        type: "demo",
        id: "heart",
        caption: "Click it. Click it again.",
      },
      {
        type: "text",
        heading: "Nine hearts",
        body: "The heart in my footer is a button. Click it and nine small hearts come out of it, swell, drift off and fade. It's one keyframe animation per heart through the Web Animations API, nothing else: no library, no canvas, no requestAnimationFrame loop.",
      },
      {
        type: "code",
        file: "components/site/HeartBurst.tsx",
        lang: "tsx",
        code: heartCode,
        caption: "Excerpt from the loop that makes each heart.",
      },
      {
        type: "text",
        heading: "Burst, then float",
        body: "Every heart rolls its own drift, height, size and duration, so no two clicks look the same and it never feels canned. The middle keyframe is the part I tuned longest: at a fifth of the way in, each heart has popped to a quarter bigger than its final size and moved only a third of its drift, so it bursts first and floats second, the way something light actually leaves your hand.",
      },
      {
        type: "text",
        heading: "Small things",
        body: "A few small things keep it clean. The hearts are fixed-position and appended to the body, so the footer's overflow can't clip them. fill: backwards holds each one invisible and small during its 35 ms stagger, so they don't all flash at the button before their turn. Each heart removes itself when its animation finishes, so a hundred clicks leave nothing behind. The character is ♥ followed by a text variation selector, so iOS doesn't swap it for the red emoji. And for anyone who prefers reduced motion, the click simply does nothing.",
      },
    ],
  },
  {
    slug: "motto",
    title: "The decoding motto",
    blurb:
      "A line I'd actually say, different on every visit, settling letter by letter out of scrambled ones.",
    tags: ["Type", "Motion"],
    line: "Never the same line twice in a row.",
    intro: "The line under my name on the home page, on its own.",
    blocks: [
      {
        type: "demo",
        id: "motto",
        caption: "Press for another line.",
      },
      {
        type: "text",
        heading: "Typed, not printed",
        body: "Each letter gets its own moment to settle: 38 ms after the one before it, plus up to 120 ms of chance. Until then it shows a random letter. Spaces never scramble, so the shape of the sentence is there from the first frame and your eye already knows how long it is.",
      },
      {
        type: "code",
        file: "lib/ascii/decode.ts",
        lang: "ts",
        code: 'export function decoder(final: string, t0: number) {\n  const at = [...final].map((_, i) => t0 + 300 + i * 38 + Math.random() * 120);\n  return (t: number) => {\n    let text = "";\n    let done = true;\n    for (let i = 0; i < final.length; i++) {\n      if (final[i] === " " || t >= at[i]) text += final[i];\n      else {\n        text += LETTERS[Math.floor(Math.random() * 26)];\n        done = false;\n      }\n    }\n    return { text, done };\n  };\n}',
      },
      {
        type: "text",
        body: "The randomness is what sells it. With a fixed step the line wipes in like a progress bar; with a little jitter, neighbouring letters land out of order and it reads like someone typing fast. Once every letter has landed, the loop unsubscribes itself, so a finished motto costs nothing.",
      },
      {
        type: "text",
        heading: "Never twice in a row",
        body: "On my home page the line changes on every visit. The index of the last one is kept in local storage and skipped when the next one is picked, so a reload never shows you the same line twice in a row. If storage is blocked, it just picks at random.",
      },
    ],
  },
];

export function craftNumber(slug: string) {
  return String(crafts.findIndex((craft) => craft.slug === slug) + 1).padStart(
    2,
    "0",
  );
}
