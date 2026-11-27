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
    title: "A count-up in three versions",
    blurb:
      "Fefys counts up meals cooked and weeks planned. Three versions in forty minutes: text that changed, my own odometer wheels, then knowing when to hand it to NumberFlow.",
    tags: ["React Native", "Motion"],
    line: "Nothing should shift while a number counts.",
    intro:
      "Three versions of the same small component, side by side, and what each one taught me.",
    blocks: [
      {
        type: "loop",
        src: "/crafts/count-up/count-up.mp4",
        poster: "/crafts/count-up/count-up.jpg",
        label:
          "Three versions of the Fefys count-up fed the same numbers, 7, 12, 98, 104, 999, 1,000 and 12,480: the first jumps to each value, the second rolls digit wheels with gaps between them, the third rolls and grows its width as digits arrive",
        caption: "All three versions, fed the same numbers.",
      },
      {
        type: "text",
        heading: "Three versions in forty minutes",
        body: "Fefys celebrates with numbers: meals cooked, a week planned, everything bought. Each one counts up. It took three versions, forty minutes apart, to get a count-up I'd let near a celebration.",
      },
      {
        type: "text",
        heading: "Text that changes",
        body: "The first animated the text of a read-only TextInput from a worklet, the usual trick for drawing a number every frame without re-rendering. With tabular figures the digits at least kept their width, but the number grew a character at a time and dragged everything beside it along. On Android it did worse: it jumped straight to the final value.",
      },
      {
        type: "text",
        heading: "A wheel per digit",
        body: "The second was my own odometer. Every place is a wheel of eleven digits, 0 to 9 and 0 again, in a slot exactly as wide as a measured 0, so nothing can shift sideways. The part I liked is the carry: a wheel above the units only turns during the last step of the place below it, the way a real odometer's tens drum waits for the units to come round.",
      },
      {
        type: "code",
        file: "src/lib/count.ts",
        lang: "ts",
        code: "export function wheelPosition(shown: number, place: number) {\n  'worklet';\n  const unit = 10 ** place;\n  if (place === 0) return shown % 10;\n  const base = Math.floor(shown / unit) % 10;\n  const lower = shown % unit;\n  const carry = Math.max(0, lower - (unit - 1));\n  return base + carry;\n}",
        caption:
          "From the version in commit be6d98f. With shown at 129.4, the units wheel sits at 9.4 and the tens wheel at 2.4: it's already rolling towards 3.",
      },
      {
        type: "text",
        heading: "What the wheels got wrong",
        body: "It never shifted, but on the phone it had its own faults. A slot as wide as a 0 leaves a 1 floating in space. Places the number hasn't reached yet were only hidden, so they kept their room and left a gap in front. The comma sat on a different line from the digits. Fixing all of that meant building a text layout engine for numbers.",
      },
      {
        type: "text",
        heading: "Knowing when to stop",
        body: "So the third version is NumberFlow, which does exactly that: every digit rolls, the width animates as digits arrive or leave, and the edges fade so the roll reads as motion, not a cut. My part shrank to what the app owns: the type scale, tabular figures, the weight-matched font file, and starting from a number one frame after mount so it always visibly counts. Forty minutes of building my own taught me precisely what I needed, which is the only reason I knew what to reach for.",
      },
      {
        type: "code",
        file: "src/components/motion/CountUp.tsx",
        lang: "tsx",
        code: "export function CountUp({ value, from = 0, variant = 'display', tone = 'ink', prefix, suffix, continuous = true, weight }: CountUpProps) {\n  const { colors } = useTheme();\n  const [shown, setShown] = useState(from);\n  const type = Type[variant];\n\n  useEffect(() => {\n    const frame = requestAnimationFrame(() => setShown(value));\n    return () => cancelAnimationFrame(frame);\n  }, [value]);\n\n  return (\n    <NumberFlow\n      value={shown}\n      locales=\"en\"\n      prefix={prefix}\n      suffix={suffix}\n      continuous={continuous}\n      style={{\n        fontSize: type.fontSize,\n        fontFamily: familyForWeight(weight ?? type.fontWeight),\n        fontVariant: ['tabular-nums'],\n        letterSpacing: type.letterSpacing,\n        color: colors[tone],\n      }}\n    />\n  );\n}",
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
