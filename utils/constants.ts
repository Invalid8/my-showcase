import type { Playlist } from "@/components/shared/MusicPlayer/types";

export const PLAYLIST_ID = "PLAUiPkcsdMQU";

export const playlist: Playlist = {
  name: "Daniel",
  tracks: [
    {
      id: "dQw4w9WgXcQ",
      url: `https://music.youtube.com/watch?v=dQw4w9WgXcQ&list=${PLAYLIST_ID}`,
      title: "Never Gonna Give You Up",
      artist: "Rick Astley",
      duration: 213,
    },
  ],
};

export const projects = [
  {
    name: "Fillyr",
    descriptor: "Form systems · Web application",
    description:
      "Turn any flyer into a fillable experience. Upload your design, map your fields, share a link. Anyone fills it and downloads their personalised copy instantly.",
    image: "/work/fillyr.webp",
    href: "https://fillyr.com",
  },
  {
    name: "Waysdrop",
    descriptor: "Logistics platform · Web & mobile",
    description:
      "A logistics platform for scheduling, dispatching and tracking deliveries, with a mobile app for riders and a live operations view on the web.",
    image: "/work/waysdrop.webp",
    href: "https://waysdrop.com",
  },
  {
    name: "CBI Digital",
    descriptor: "Marketing site · Frontend",
    description:
      "The public face of CBI, built to load fast, read clearly on every screen and let the editorial team publish without touching code.",
    image: "/work/cbi-digital.webp",
    href: "https://cbinews.tv",
  },
  {
    name: "Fillyr 1",
    descriptor: "Form systems · Web application",
    description:
      "Turn any flyer into a fillable experience. Upload your design, map your fields, share a link. Anyone fills it and downloads their personalised copy instantly.",
    image: "/work/fillyr.webp",
    href: "https://fillyr.com",
  },
  {
    name: "Waysdrop 1",
    descriptor: "Logistics platform · Web & mobile",
    description:
      "A logistics platform for scheduling, dispatching and tracking deliveries, with a mobile app for riders and a live operations view on the web.",
    image: "/work/waysdrop.webp",
    href: "https://waysdrop.com",
  },
  {
    name: "CBI Digital 1",
    descriptor: "Marketing site · Frontend",
    description:
      "The public face of CBI, built to load fast, read clearly on every screen and let the editorial team publish without touching code.",
    image: "/work/cbi-digital.webp",
    href: "https://cbinews.tv",
  },
];

export const socials = [
  {
    name: "GitHub",
    href: "https://github.com/Invalid8",
  },
  {
    name: "LinkedIn",
    href: "https://www.linkedin.com/in/daniel-fadamitan/",
  },
  {
    name: "X (Twitter)",
    href: "https://x.com/dalgoridim",
  },
  {
    name: "Resume",
    href: "https://drive.google.com/file/d/17ESHvWc8aV7ZrPCSM_X2Map--_rlOvDk/view",
  },
];

export const capabilities = [
  {
    title: "Interface Systems",
    description:
      "Design systems and component libraries a team can build on, with consistent tokens, states and accessible primitives.",
  },
  {
    title: "Responsive Layout",
    description:
      "Layouts that hold up from small phones to wide desktops, without a separate set of rules for every breakpoint.",
  },
  {
    title: "Motion & Interaction",
    description:
      "Transitions, gestures and micro-interactions that clarify what changed, and stay comfortable for repeat use.",
  },
  {
    title: "Data-Driven Interfaces",
    description:
      "Wiring interfaces to real APIs with loading, empty and error states treated as part of the design, not an afterthought.",
  },
  {
    title: "Auth & Secure Flows",
    description:
      "Sign-in, verification and session handling across web and mobile, including OTP, biometrics and protected routes.",
  },
  {
    title: "Media & File Handling",
    description:
      "Upload, cropping, preview and export pipelines that stay responsive while the heavy work happens.",
  },
  {
    title: "Realtime & Location",
    description:
      "Live views built on maps, sockets and streaming updates, kept readable while the underlying data keeps moving.",
  },
  {
    title: "Performance",
    description:
      "Fast first paint and smooth interaction through careful rendering, image strategy and bundle discipline.",
  },
  {
    title: "Accessibility",
    description:
      "Keyboard paths, focus management, semantics and contrast handled as a baseline rather than a retrofit.",
  },
];

export const feedItems = [
  {
    slug: "scroll-driven-animations",
    date: "04 JUL 2026",
    title: "CSS Scroll-Driven Animations",
    description:
      "A practical guide to scroll timelines, view timelines, and real UI demos.",
    tags: ["CSS", "Animation", "Performance"],
    href: "/feed/scroll-driven-animations",
  },
  {
    slug: "product-requirements-over-screens",
    date: "18 JUN 2026",
    title: "Product Requirements Over Screens",
    description:
      "Why the strongest interfaces usually start with a workflow, not a polished screen.",
    tags: ["Product", "Interface", "Systems"],
    href: "/feed/product-requirements-over-screens",
  },
  {
    slug: "the-quiet-mobile-flow",
    date: "29 MAY 2026",
    title: "The Quiet Mobile Flow",
    description:
      "Small decisions that make a mobile experience feel calm, clear, and ready for real use.",
    tags: ["Mobile", "UX", "Interaction"],
    href: "/feed/the-quiet-mobile-flow",
  },
];
