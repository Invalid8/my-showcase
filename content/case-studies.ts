export type Img = { src: string; alt: string; width: number; height: number };

export type Block =
  | { type: "text"; heading?: string; body: string; note?: string }
  | { type: "image"; image: Img; caption: string; wide?: boolean }
  | { type: "pair"; images: [Img, Img]; caption: string }
  | { type: "live"; url: string; caption: string }
  | { type: "code"; file: string; lang: string; code: string; caption?: string }
  | { type: "terminal"; lines: string[] }
  | { type: "list"; heading?: string; items: { title: string; body: string }[] }
  | { type: "quote"; text: string; source: string };

export type CaseStudy = {
  slug: string;
  name: string;
  icon: string;
  line: string;
  facts: { label: string; value: string }[];
  links: { label: string; href: string }[];
  blocks: Block[];
};

const vscrybeCode = `fn builtins() -> Vec<Model> {
    vec![
        builtin("small", "Fast", &[
            ("Systran/faster-whisper-small", "model.bin"), …
        ]),
        builtin("large-v3-turbo", "Accurate", &[
            ("dropbox-dash/faster-whisper-large-v3-turbo", "model.bin"), …
        ]),
    ]
}`;

export const caseStudies: CaseStudy[] = [
  {
    slug: "vscrybe",
    name: "VScrybe",
    icon: "/icons/vscrybe.png",
    line: "Voice notes to text, right on your own computer.",
    facts: [
      { label: "Role", value: "Design and engineering, start to finish" },
      {
        label: "Built with",
        value: "Tauri 2, Rust, OpenAI's open Whisper models",
      },
      { label: "Runs on", value: "Linux, macOS and Windows" },
      { label: "License", value: "MIT, free" },
    ],
    links: [
      {
        label: "vscrybe.dalgoridim.com",
        href: "https://vscrybe.dalgoridim.com",
      },
      { label: "GitHub", href: "https://github.com/Invalid8/vscrybe" },
    ],
    blocks: [
      {
        type: "image",
        wide: true,
        image: {
          src: "/work/vscrybe-dark.png",
          alt: "A VScrybe session with WhatsApp voice notes, their transcripts and timestamps",
          width: 2560,
          height: 1600,
        },
        caption:
          "A session of WhatsApp voice notes, transcribed on a laptop, offline.",
      },
      {
        type: "text",
        heading: "Why I built it",
        body: "Half my conversations arrive as WhatsApp voice notes. I wanted to search them, quote them and skim them, without sending anyone's voice to a server I don't control.",
      },
      {
        type: "text",
        heading: "Two models, named by what they're for",
        body: "Fast (Whisper small) suits most voice notes; Accurate (large-v3-turbo) handles heavy accents and noise. You pick an outcome, not a model size.",
        note: "The first transcription downloads the Fast model, about 480 MB. After that it works offline.",
      },
      {
        type: "live",
        url: "https://vscrybe.dalgoridim.com",
        caption:
          "The real site, embedded. Scroll inside it, switch the theme, try the download menu.",
      },
      {
        type: "list",
        heading: "Decisions",
        items: [
          {
            title: "Sessions, not files",
            body: "Every batch of notes becomes a thread you can rename, search and add to. Each line keeps its timestamp, and clicking it plays that exact moment.",
          },
          {
            title: "Say what isn't done yet",
            body: "The site says plainly that the app isn't code-signed yet, and shows how to open it anyway.",
          },
        ],
      },
      {
        type: "code",
        file: "src-tauri/src/engine/models.rs",
        lang: "rust",
        code: vscrybeCode,
        caption: "Excerpt, trimmed with …",
      },
      {
        type: "terminal",
        lines: [
          "$ vscrybe transcribe ~/Voice\\ Notes",
          "...   ~/Voice Notes/WhatsApp Ptt …09.44.02.opus",
          "done  ~/Voice Notes/WhatsApp Ptt …09.44.02.txt",
          "skip  ~/Voice Notes/WhatsApp Ptt …10.02.55.opus  (already has a .txt)",
        ],
      },
      {
        type: "pair",
        images: [
          {
            src: "/work/vscrybe-dark.png",
            alt: "VScrybe in dark mode",
            width: 2560,
            height: 1600,
          },
          {
            src: "/work/vscrybe-light.png",
            alt: "VScrybe in light mode",
            width: 2560,
            height: 1600,
          },
        ],
        caption:
          "The same session in dark and light. The app follows the system theme.",
      },
      {
        type: "quote",
        text: "Drop in WhatsApp, Telegram or phone recordings and get clean, searchable text in about the time it takes to play them.",
        source: "from the VScrybe site",
      },
      {
        type: "text",
        heading: "Since",
        body: "It understands Yoruba, Hausa and Swahili as well as English, opens every format WhatsApp and phones throw at it, and ships for Linux, macOS and Windows.",
      },
    ],
  },
  {
    slug: "baseband",
    name: "Baseband",
    icon: "/icons/baseband.png",
    line: "Your router, managed from your phone.",
    facts: [
      { label: "Role", value: "Design and engineering, start to finish" },
      { label: "Built with", value: "Expo, React Native" },
      { label: "Price", value: "Free, supported by donations" },
    ],
    links: [
      {
        label: "baseband.dalgoridim.com",
        href: "https://baseband.dalgoridim.com",
      },
    ],
    blocks: [
      {
        type: "text",
        heading: "No account, no server",
        body: "The phone joins the router's Wi-Fi and the app talks to it directly over its local admin interface: no internet, no account and no server in between.",
        note: "Verified on a ZTE MF935 on MTN Nigeria. An adapter for MTN's own router is written but can't sign in yet.",
      },
      {
        type: "pair",
        images: [
          {
            src: "/work/baseband-hub.png",
            alt: "Baseband hub with data left, live speed and quick actions",
            width: 1080,
            height: 2340,
          },
          {
            src: "/work/baseband-stats.png",
            alt: "Baseband stats with months of recorded usage",
            width: 1080,
            height: 2340,
          },
        ],
        caption: "The hub and the stats screen.",
      },
      {
        type: "list",
        heading: "What it does",
        items: [
          {
            title: "Hub",
            body: "A headline that falls back from data left to used this month to connection state, live per-second speed, and restart, dial, top up and share Wi-Fi.",
          },
          {
            title: "Inbox",
            body: "The router's own SMS inbox as threads, replies and new messages to several numbers, readings pulled from network messages, and USSD sessions.",
          },
          {
            title: "Devices",
            body: "Who is on the Wi-Fi, local names, block and unblock, and a scan-to-join code.",
          },
          {
            title: "Stats",
            body: "Months of recorded usage, a monthly limit with warnings, and a speed test.",
          },
        ],
      },
      {
        type: "text",
        heading: "Honest about the hardware",
        body: "Every screen composes itself from what the connected router declares it can do, and says so when something is unknown, unsupported or not written yet.",
      },
    ],
  },
  {
    slug: "fillyr",
    name: "Fillyr",
    icon: "/icons/fillyr.png",
    line: "Turn any flyer into a fillable link.",
    facts: [
      { label: "Role", value: "Fullstack" },
      {
        label: "Built with",
        value: "Next.js, tRPC, Drizzle on Neon, Cloudinary",
      },
    ],
    links: [
      { label: "fillyr.app", href: "https://fillyr.app" },
      {
        label: "The story",
        href: "/writing/what-actually-happened-when-i-shipped-fillyr",
      },
    ],
    blocks: [
      {
        type: "text",
        body: "Upload a design, map its fields on a canvas and share one link. Everyone who fills it downloads their own personalised copy, with their name and photo, instantly.",
      },
      {
        type: "image",
        wide: true,
        image: {
          src: "/work/fillyr-editor.png",
          alt: "The Fillyr editor with fields mapped on top of a flyer",
          width: 2880,
          height: 1800,
        },
        caption: "The editor, where fields are placed on top of the flyer.",
      },
      {
        type: "text",
        heading: "Who it turned out to be for",
        body: "People were making flyers for church announcements, small business promos and events happening this weekend. They needed something fast that looked okay, without first explaining Canva.",
      },
      {
        type: "quote",
        text: "The value isn't the canvas. The value is that you don't have to think.",
        source: "from what actually happened when I shipped Fillyr",
      },
    ],
  },
  {
    slug: "waysdrop",
    name: "Waysdrop",
    icon: "/icons/waysdrop.png",
    line: "On-demand delivery, connecting people, stores and couriers.",
    facts: [
      { label: "Role", value: "Frontend developer" },
      { label: "When", value: "Dec 2025 – Mar 2026" },
    ],
    links: [{ label: "waysdrop.com", href: "https://waysdrop.com" }],
    blocks: [
      {
        type: "text",
        body: "Couriers run their day from a mobile app with labels, messaging and earnings; stores manage stock, orders and sales on the web; and anyone can track nearby couriers live.",
      },
      {
        type: "image",
        wide: true,
        image: {
          src: "/work/waysdrop.webp",
          alt: "Waysdrop",
          width: 1008,
          height: 594,
        },
        caption: "Waysdrop.",
      },
      {
        type: "text",
        heading: "My part",
        body: "I built the web side: the customer web app, the admin, agent and support dashboards, chat and the landing page.",
      },
    ],
  },
];
