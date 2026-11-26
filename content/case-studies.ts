export type Img = { src: string; alt: string; width: number; height: number };

export type Block =
  | {
      type: "text";
      heading?: string;
      body: string;
      note?: string;
      link?: { label: string; href: string };
    }
  | { type: "image"; image: Img; caption: string; wide?: boolean }
  | { type: "pair"; images: [Img, Img]; caption: string }
  | {
      type: "states";
      columns: number;
      items: { image: Img; caption: string }[];
      caption?: string;
    }
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

const vscrybeCode = `const SHORT_BURST: usize = RATE * 3 / 2;

const PHANTOMS: &[(&str, &[&str])] = &[(
    "en",
    &["you", "thank you", "thank you very much", "thanks",
      "thanks for watching", "thank you for watching", "shh", "shhh"],
)];
…
let doubtful = attempt.no_speech_prob > NO_SPEECH_LIMIT
    || chunk.len() < SHORT_BURST;
found.retain(|s| s.text.chars().any(char::is_alphanumeric)
    && !(doubtful && is_phantom(&s.text, &language)));`;

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
          alt: "A VScrybe session with voice notes, their transcripts and timestamps",
          width: 2560,
          height: 1600,
        },
        caption: "A session of voice notes, transcribed on a laptop, offline.",
      },
      {
        type: "text",
        body: "Half my conversations arrive as WhatsApp voice notes. I wanted to search them, quote them and skim them without sending anyone's voice to a server I don't control. VScrybe runs Whisper on your own computer. These are four of the small parts.",
      },
      {
        type: "text",
        heading: "A timestamp you can click",
        body: "Every line starts with the second it was said. Click it and the note plays from there, and the line being spoken stays lit while it plays. Starting one note pauses every other. You can listen while a note is still transcribing, and when the text arrives and the card redraws, playback carries on from the same second instead of stopping.",
      },
      {
        type: "image",
        wide: true,
        image: {
          src: "/work/vscrybe/note-playing.png",
          alt: "A transcribed note playing from 0:18, with that line highlighted",
          width: 1672,
          height: 954,
        },
        caption: "Clicked 0:18. The line stays lit while it plays.",
      },
      {
        type: "text",
        heading: "Nothing starts until you press Send",
        body: "Files you add wait in a tray above the composer until you press Send. Listen to one first, remove it, or add the same file twice and be told it's already there. The tray lives in the browser's IndexedDB, so it's still there after a restart. I dropped the \"Adding N voice notes\" overlay: the copies are local and finish almost at once, so it only flashed on screen.",
      },
      {
        type: "image",
        wide: true,
        image: {
          src: "/work/vscrybe/tray.png",
          alt: "Two files waiting in the tray above the composer, the first playing as a preview",
          width: 1640,
          height: 232,
        },
        caption:
          "Two waiting, the first playing as a preview. Both are still here after a restart.",
      },
      {
        type: "text",
        heading: "Lines Whisper made up",
        body: 'Whisper invents text when there\'s little to hear: "Thank you.", "You" and "Shh." turned up as lines in quiet and noisy stretches. Filtering those phrases everywhere would delete real thanks, so they\'re only dropped when the model already doubts there\'s speech, or the burst is under a second and a half. Lines with no words at all, a lone ".", go too.',
      },
      {
        type: "code",
        file: "src-tauri/src/engine/transcribe.rs",
        lang: "rust",
        code: vscrybeCode,
        caption: "Excerpt, trimmed with …",
      },
      {
        type: "text",
        body: "The bigger loss was silent. When Whisper ended a 30-second window after its first sentence, the rest was thrown away; one test note lost 19 seconds. Decoding now resumes from the last timestamp, retries low-confidence output at rising temperatures and discards repetition loops. Every encoding of the same note now gives 144 to 150 words, where it gave 99 to 136.",
      },
      {
        type: "text",
        heading: "Progress that knows where it's printing",
        body: "The command line rewrites one line in place when it's in a terminal, with an estimate of time left. Piped into a log, that would be thousands of carriage returns, so it prints a plain line every 10% or every 30 seconds instead, and ends each file with how long the audio was and how long it took.",
      },
      {
        type: "terminal",
        lines: [
          "$ vscrybe transcribe jfk.opus long1.opus 2>&1 | cat",
          "...   jfk.opus",
          "      100%  0:11 / 0:11  jfk.opus",
          "done  jfk.txt  0:11 of audio in 0:09 (1.2× real time)",
          "...   long1.opus",
          "        0%  0:00 / 0:33  long1.opus",
          "       66%  0:22 / 0:33  long1.opus",
          "      100%  0:33 / 0:33  long1.opus",
          "done  long1.txt  0:33 of audio in 1:00 (0.5× real time)",
        ],
      },
      {
        type: "text",
        body: "It's free for Linux, macOS and Windows, and nothing you transcribe leaves your computer.",
        link: {
          label: "Download VScrybe",
          href: "https://vscrybe.dalgoridim.com/download/",
        },
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
