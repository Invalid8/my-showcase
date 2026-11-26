export type DetailKind = "interaction" | "ui" | "brand";

export const detailKinds: DetailKind[] = ["interaction", "ui", "brand"];

export type Mark = {
  name: string;
  icon: string;
  palette: string[];
  note: string;
};

export const sheetStates = [
  { src: "/details/bb-sheet-open.png", caption: "01 waiting for an address" },
  { src: "/details/bb-sheet-checking.png", caption: "02 checking" },
  { src: "/details/bb-sheet-failed.png", caption: "03 nothing answered" },
  {
    src: "/details/bb-sheet-above-keyboard.png",
    caption: "04 rides the keyboard",
  },
];

export const marks: Mark[] = [
  {
    name: "VScrybe",
    icon: "/icons/vscrybe.png",
    palette: ["#1C2B4A", "#314367", "#FFFFFF"],
    note: "Five bars, tallest in the middle, white on deep navy. It reads in the dock and in a 16px tab.",
  },
  {
    name: "better-content",
    icon: "/icons/better-content.png",
    palette: ["#20242B", "#FFE24A", "#FAF9F6"],
    note: "Lines of copy with one highlighted, the way an editor marks a draft. The mark is the product.",
  },
  {
    name: "Baseband",
    icon: "/icons/baseband.png",
    palette: ["#1D4ED8", "#3B82F6"],
    note: "Two blues and a single arch, with a tinted version for themed Android icons.",
  },
];
