import type { Contact, ToolGroup, WorkEntry } from "./types";

export const person = {
  name: "Daniel Fadamitan",
  role: "Frontend engineer",
  email: "daniel@dalgoridim.com",
};

export const mottos = [
  "Mostly tools I wanted to exist.",
  "When something annoys me enough, it becomes a tool.",
  "Nothing leaves your device.",
  "Interfaces that stay out of the way.",
  "The details nobody files a ticket for.",
  "One less dependency is a feature.",
  "Made on Linux, for everyone.",
  "Built with love and too many acoustic covers.",
  "Clear constraints, calm interfaces.",
  "Oya, let's build something.",
];

export const intro =
  "I build interfaces for the web, for phones and for the Linux desktop, and once, for a router. When something annoys me enough, it becomes a tool. Open to frontend and product engineering roles.";

export const toolGroups: ToolGroup[] = [
  {
    label: "Made",
    tools: [
      {
        name: "VScrybe",
        href: "https://vscrybe.dalgoridim.com",
        icon: "/icons/vscrybe.png",
      },
      {
        name: "Baseband",
        href: "https://baseband.dalgoridim.com",
        icon: "/icons/baseband.png",
      },
      {
        name: "Cosmic Recorder",
        href: "https://github.com/Invalid8/cosmic-recorder",
        icon: "/icons/recorder.png",
      },
      {
        name: "better-content",
        href: "https://github.com/Invalid8/better-content",
        icon: "/icons/better-content.png",
      },
    ],
  },
  {
    label: "Building",
    tools: [
      { name: "Cosmic Editor", icon: "/icons/cosmic.png" },
      { name: "Cheerkit", href: "https://github.com/Invalid8/cheerkit" },
    ],
  },
  {
    label: "With teams",
    tools: [
      { name: "Fillyr", href: "https://fillyr.app", icon: "/icons/fillyr.png" },
      {
        name: "Waysdrop",
        href: "https://waysdrop.com",
        icon: "/icons/waysdrop.png",
      },
      { name: "CBI Digital", href: "https://cbinews.tv" },
    ],
  },
  {
    label: "For fun",
    tools: [
      {
        name: "Airsofte",
        href: "https://airsofte.vercel.app",
        icon: "/icons/airsofte.png",
      },
    ],
  },
];

export const work: WorkEntry[] = [
  {
    slug: "vscrybe",
    name: "VScrybe",
    icon: "/icons/vscrybe.png",
    description:
      "Voice notes to text on your own computer, in searchable sessions with timestamps from local Whisper models. Nothing is uploaded, it's free under MIT, and it understands Yoruba, Hausa and Swahili.",
    origin: "mine",
    story:
      "Half my conversations arrive as WhatsApp voice notes, and I didn't want to send anyone's voice to a server to read them. So I built a desktop app that runs Whisper on your own computer: designed it, wrote the Rust engine, the command line and the site, and set up releases for Linux, macOS and Windows, five weeks from the first commit of the rewrite to 0.3.1.",
    meta: "2026 · design and engineering · Tauri, Rust, Whisper",
  },
  {
    slug: "baseband",
    name: "Baseband",
    icon: "/icons/baseband.png",
    description:
      "Your router, managed from your phone. It talks straight to the hardware: live speed, data balance, signal, connected devices, reboot and USSD, with no account, no server and no internet connection in between.",
    origin: "mine",
    story:
      "I built the first version in April, for my own MiFi. In September I went back, audited all 21 screens against the real router, and redrew and rebuilt everything: the mark, the type, a design system, a capability model for routers it has never met, and a website with a lending programme so owners can send in routers to support.",
    meta: "2026 · design and engineering · Expo, React Native",
  },
  {
    slug: "fillyr",
    name: "Fillyr",
    icon: "/icons/fillyr.png",
    description:
      "Turn any flyer into a fillable link. Upload a design, map its fields and share it once; everyone who fills it downloads their own personalised copy, with their name and photo, instantly.",
    origin: "mine",
    story:
      "It started with a ₦500 fee a friend and I didn't want to pay. I built it in four days, launched before it had a landing page, and kept going once people were using it for church announcements and weekend events: bulk fill from a CSV, text that fits its box, a colour sampler, and a Product Hunt launch.",
    meta: "2026 · design and engineering · Next.js, Konva",
  },
  {
    slug: "waysdrop",
    name: "Waysdrop",
    icon: "/icons/waysdrop.png",
    description:
      "An on-demand delivery platform connecting people, stores and couriers. Couriers run their day from a mobile app, stores manage stock and orders on the web, and I built across the web app, admin, agent and support tools.",
    origin: "client",
    story:
      "I owned the web frontend: the customer app, the admin, agent and support dashboards, and the chat widget, which I packaged on its own so every app could share it. Most screens are built from a handful of components and hooks I wrote once.",
    meta: "Dec 2025 – Mar 2026 · frontend · Next.js, TanStack, Socket.IO",
  },
];

export const now = [
  "These days I'm shipping VScrybe and Cosmic Editor, and turning better-content into the CMS I'd actually reach for.",
  "I care about the details nobody files a ticket for: a count-up that doesn't jitter, a label that rolls instead of blinking, a receipt that looks like a printer really made it.",
  "Most of it gets written on Pop!_OS with Hozier, Laufey, Daniel Caesar, far too many acoustic covers and a bit of Fatai Rolling Dollar on repeat.",
];

export const contacts: Contact[] = [
  { label: "GitHub", href: "https://github.com/Invalid8" },
  { label: "X", href: "https://x.com/dalgoridim" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/daniel-fadamitan/" },
  { label: "Résumé", href: "/resume" },
];

export const bookingUrl = "https://cal.com/dalgoridim/30min";
