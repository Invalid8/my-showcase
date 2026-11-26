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

export const feedItems = [
  {
    slug: "scroll-driven-animations",
    date: "04 JUL 2026",
    title: "CSS Scroll-Driven Animations",
    description:
      "A practical guide to scroll timelines, view timelines, and real UI demos.",
    tags: ["CSS", "Animation", "Performance"],
    href: "/writing/scroll-driven-animations",
  },
  {
    slug: "product-requirements-over-screens",
    date: "18 JUN 2026",
    title: "Product Requirements Over Screens",
    description:
      "Why the strongest interfaces usually start with a workflow, not a polished screen.",
    tags: ["Product", "Interface", "Systems"],
    href: "/writing/product-requirements-over-screens",
  },
  {
    slug: "the-quiet-mobile-flow",
    date: "29 MAY 2026",
    title: "The Quiet Mobile Flow",
    description:
      "Small decisions that make a mobile experience feel calm, clear, and ready for real use.",
    tags: ["Mobile", "UX", "Interaction"],
    href: "/writing/the-quiet-mobile-flow",
  },
];
