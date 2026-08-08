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
    title: "Image Cropper",
    description:
      "A responsive image cropper with drag selection, preview, and export support.",
    product: {
      name: "Fillyr",
      link: "https://fillyr.com",
      component: "Image Cropper",
    },
  },
  {
    title: "Bulk Generation",
    description:
      "A workflow for generating multiple assets, content pieces, or data sets at once.",
    product: {
      name: "Bulkmailer",
      link: "https://bulkmailer.dev",
      component: "Bulk Generation",
    },
  },
  {
    title: "Mobile Authentication",
    description:
      "A mobile-first authentication flow with OTP, biometric support, and secure session handling.",
    product: {
      name: "Waysdrop",
      link: "https://waysdrop.com",
      component: "Mobile Authentication",
    },
  },
  {
    title: "Publishing Workspace",
    description:
      "A collaborative workspace for publishing content, scheduling, and review.",
    product: {
      name: "CBI News",
      link: "https://cbinews.tv",
      component: "Publishing Workspace",
    },
  },
  {
    title: "News Reading Experience",
    description:
      "An immersive news reader with curated feeds, categories, and offline access.",
    product: {
      name: "CBI News",
      link: "https://cbinews.tv",
      component: "News Reading Experience",
    },
  },
  {
    title: "Live Location Interface",
    description:
      "Real-time location tracking UI with maps, routes, and status updates.",
    product: {
      name: "IRunner",
      link: "https://play.google.com/store/apps/details?id=com.instarunners",
      component: "Live Location Interface",
    },
  },
];

export const feedItems = [
  {
    date: "04 JUL 2026",
    title: "CSS Scroll-Driven Animations",
    description:
      "A practical guide to scroll timelines, view timelines, and real UI demos.",
    tags: ["CSS", "Animation", "Performance"],
    href: "/feed",
  },
];
