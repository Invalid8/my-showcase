export type Craft = {
  slug: string;
  title: string;
  blurb: string;
  tags: string[];
  href: string;
  line?: string;
  intro?: string;
  made?: { title: string; body: string }[];
};

export const crafts: Craft[] = [
  {
    slug: "say-it-with-flowers",
    title: "Say It With Flowers",
    blurb:
      "Photographs repainted as flowing strokes. Each stroke follows the petal's edge and takes its colour from the pixel it starts on.",
    tags: ["Canvas", "Image"],
    href: "https://crafts.dalgoridim.com/flower-flow",
  },
  {
    slug: "record-player",
    title: "Record player",
    blurb:
      "The turntable above: gradients and transforms, a tonearm that drops when you pick a record, wired to a real playlist.",
    tags: ["CSS", "Audio"],
    href: "/crafts/record-player",
    line: "A turntable built out of gradients and transforms.",
    intro:
      "Wired to a real YouTube playlist: what I actually have on repeat. Pick a record below and drop the needle.",
    made: [
      {
        title: "Gradients, not images",
        body: "The deck, platter, grooves and tonearm are gradients and transforms. The only image is the record's label, which shows the song's cover art, or reads Empty deck when nothing is on.",
      },
      {
        title: "The arm follows the song",
        body: "When a record plays, the tonearm swings in and then creeps across the grooves as the track progresses, the way a real needle does. Stop it and the arm parks.",
      },
      {
        title: "It still plays offline",
        body: "If YouTube can't be reached, the player falls back to a local playlist instead of showing an empty deck.",
      },
    ],
  },
  {
    slug: "desert",
    title: "A desert in characters",
    blurb:
      "The band on my home page. Lizards dart, a snake slithers, cacti bloom when you get close, and everything you touch scatters and settles.",
    tags: ["ASCII", "Motion"],
    href: "/crafts/desert",
    line: "A living desert, 24 rows of monospace.",
    intro:
      "Move your pointer through it. The animals run from you, the cacti bloom when you come close, and every character you touch scatters and finds its way back.",
    made: [
      {
        title: "One ridge, chosen by slope",
        body: "Each column picks its ground character from where the height falls inside the cell and how steep it is: flat - and _, rising ' and ., falling ` and ., steep / and \\. A second far ridge was cut; one line reads calmer.",
      },
      {
        title: "A sun drawn by hand",
        body: "A circle computed by maths falls apart into doubled slashes at this size, so the quarter sun peeking in from the corner is drawn by hand and filled with : that shimmers to . like heat.",
      },
      {
        title: "Only what reads",
        body: "A tumbleweed and a walking camel never looked right in characters, so they were cut. If a subject can't be drawn well in ASCII, it doesn't ship.",
      },
      {
        title: "Rebuilt every 33 ms",
        body: "The scene is redrawn as text about thirty times a second and fed through the same piece engine as the rest of the site, so it scrambles in on load and the cursor can push it.",
      },
    ],
  },
  {
    slug: "characters-not-pixels",
    title: "Characters, not pixels",
    blurb:
      "Rendering my own objects into ASCII by the shape of each character, so curves stay curves.",
    tags: ["ASCII", "Rendering"],
    href: "/crafts/characters-not-pixels",
    line: "Every character is a shape, not a brightness.",
    intro:
      "A brightness ramp treats each cell as a pixel and blurs every edge. Matching by shape treats each character as a small drawing, so edges come out as real curves.",
    made: [
      {
        title: "Six circles per cell",
        body: "Every candidate character is rendered in JetBrains Mono and measured by how much ink falls inside six circles laid out two by three. The image is sampled with the same six circles, and the closest character wins.",
      },
      {
        title: "Contrast from the neighbours",
        body: "Ten more circles reach into the neighbouring cells and sharpen each sample against them, which is what turns a soft edge into _vYTT\" or .Y' instead of a smear.",
      },
      {
        title: "Outlines render, solid tiles don't",
        body: "The turntable, the Fillyr page and pen and the VScrybe waveform read well. An icon on a solid coloured tile turns into a block of ::: unless the glyph is pulled out first.",
      },
      {
        title: "A short alphabet",
        body: "Letters and digits read as noise, and ligatures turn -> into arrows, so the renderer only chooses from punctuation and a few thin letters, with ligatures switched off.",
      },
    ],
  },
  {
    slug: "rope",
    title: "Rope of characters",
    blurb:
      "Threads drawn with | / \\ that hang, swing and get pushed by the pointer.",
    tags: ["Physics"],
    href: "/crafts/rope",
    line: "A thread that bends by changing its characters.",
    intro:
      "Run your pointer across the threads. They swing away, sway on their own and settle back.",
    made: [
      {
        title: "Verlet points",
        body: "Each thread is a chain of points with gravity and a slow sideways breeze, held to its anchor at the top and kept the same length by eight passes of constraints per frame.",
      },
      {
        title: "A character per segment",
        body: "Every segment picks | when it hangs nearly straight, and \\ or / once it leans, so the bend is drawn by the characters themselves rather than by rotating text.",
      },
    ],
  },
  {
    slug: "motto",
    title: "A motto that decodes",
    blurb:
      "A different line on every visit, resolving out of scrambled letters.",
    tags: ["Type", "Motion"],
    href: "/crafts/motto",
    line: "Never the same line twice in a row.",
    intro:
      "Every visit picks a line I'd actually say and resolves it letter by letter from scrambled ones. Press the button to pick another.",
    made: [
      {
        title: "Left to right, with a little chance",
        body: "Each letter settles 38 ms after the one before it, plus up to 120 ms of randomness, so it feels typed rather than printed. Spaces never scramble, so the shape of the line is there from the start.",
      },
      {
        title: "Remembered, not repeated",
        body: "The last line shown is kept in local storage and skipped next time.",
      },
    ],
  },
  {
    slug: "ascii-record-player",
    title: "The record player, in characters",
    blurb:
      "The same turntable rendered into ASCII by the shape of each character, then spun: 36 frames, the arm held still while the record turns beneath it.",
    tags: ["ASCII", "New"],
    href: "/crafts/ascii-record-player",
    line: "36 frames, one turn every five seconds.",
    intro:
      "The record is rotated in the source image ten degrees at a time with the tonearm masked back on top, and every frame is rendered offline by shape. The page just swaps frames.",
    made: [
      {
        title: "Rendered offline",
        body: "All 36 frames are shape-matched ahead of time, so the browser does no image work at all: it only replaces a block of text every 140 ms.",
      },
      {
        title: "The arm holds still",
        body: "Only the disc turns. The tonearm is masked back onto every frame, so it stays put the way a real one does while the record spins under it.",
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
