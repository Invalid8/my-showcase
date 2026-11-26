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
