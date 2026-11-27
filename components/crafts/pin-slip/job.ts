export type Slip = {
  customerId: string;
  name: string;
  accountNumber: string;
  tempPin: string;
  issuedAt: string;
  by: string;
};

export type Op =
  | { kind: "text"; x: number; y: number; text: string; bold?: boolean }
  | { kind: "pin"; x: number; y: number; text: string }
  | { kind: "logo"; x: number; y: number; height: number }
  | { kind: "band"; x: number; y: number; width: number; height: number }
  | { kind: "bars"; y: number; height: number; bars: [number, number][] };

export const PAPER_WIDTH = 260;
export const COLUMNS = 32;
const MARGIN = 18;
const CELL = 7;
export const FONT_SIZE = CELL / 0.6;
export const PIN_SIZE = FONT_SIZE * 3;
const LINE = 17;
const BASELINE = 12;
const TOOTH = 20;
const TOOTH_DEPTH = 6;
const BAND = 64;
const BARS = 34;
const MODULE = 1.6;
export const HATCH_GAP = 4;

export const INK = "#23252b";
export const PAPER_TOP = "#f8f7f3";
export const PAPER_BOTTOM = "#efeee9";
export const FADE_STOPS: [number, number][] = [
  [0, 1],
  [0.6, 0.96],
  [0.66, 0.74],
  [0.7, 0.72],
  [0.76, 0.94],
  [1, 0.86],
];

export const LOGO =
  "M0 -45L18 -45L18 10.43C26.67 2.98 37.83 -1.5 50 -1.5C77.61 -1.5 100 21.56 100 50C100 52.37 99.84 54.71 99.54 57L81.38 57C81.79 54.74 82 52.4 82 50C82 30.43 67.67 14.57 50 14.57C32.33 14.57 18 30.43 18 50C18 52.4 18.21 54.74 18.62 57L0 57ZM192 0L210 0L210 57L191.38 57C191.79 54.74 192 52.4 192 50C192 30.43 177.67 14.57 160 14.57C142.33 14.57 128 30.43 128 50C128 52.4 128.21 54.74 128.62 57L110.46 57C110.16 54.71 110 52.37 110 50C110 21.56 132.39 -1.5 160 -1.5C172.17 -1.5 183.33 2.98 192 10.43ZM308 0L326 0L326 57L307.38 57C307.79 54.74 308 52.4 308 50C308 30.43 293.67 14.57 276 14.57C258.33 14.57 244 30.43 244 50C244 52.4 244.21 54.74 244.62 57L226.46 57C226.16 54.71 226 52.37 226 50C226 21.56 248.39 -1.5 276 -1.5C288.17 -1.5 299.33 2.98 308 10.43ZM98.13 64C92.21 85.64 72.9 101.5 50 101.5C37.83 101.5 26.67 97.02 18 89.57L18 100L0 100L0 64L20.6 64C25.5 76.6 36.82 85.43 50 85.43C63.18 85.43 74.5 76.6 79.4 64L98.13 64ZM111.87 64L130.6 64C135.5 76.6 146.82 85.43 160 85.43C173.18 85.43 184.5 76.6 189.4 64L210 64L210 100L192 100L192 89.57C183.33 97.02 172.17 101.5 160 101.5C137.1 101.5 117.79 85.64 111.87 64ZM227.87 64L246.6 64C251.5 76.6 262.82 85.43 276 85.43C289.18 85.43 300.5 76.6 305.4 64L326 64L326 100L308 100L308 89.57C299.33 97.02 288.17 101.5 276 101.5C253.1 101.5 233.79 85.64 227.87 64ZM405.44 13.12L389.86 21.16C385.97 15.62 377.82 13.18 370.53 15.37C363.23 17.55 358.89 23.74 360.24 30.04C361.59 36.34 368.24 40.93 376 40.93C388.85 40.93 400.26 47.33 406.03 57L376 57C359.5 57 345.38 46.81 342.52 32.83C339.65 18.85 348.87 5.12 364.37 0.26C379.88 -4.59 397.19 0.83 405.44 13.12ZM389.79 64L409.02 64C409.2 64.64 409.35 65.3 409.48 65.96C412.35 80.43 403.13 94.65 387.63 99.67C372.12 104.7 354.81 99.09 346.56 86.36L362.14 78.32C366.03 84.3 374.18 86.93 381.47 84.57C388.77 82.21 393.11 75.54 391.76 68.75C391.42 67.03 390.74 65.43 389.79 64Z";
export const LOGO_BOX = { x: 0, y: -45, width: 410, height: 146.5 };

const ISSUED = new Intl.DateTimeFormat("en-GB", {
  day: "2-digit",
  month: "short",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
});

export function slipIssued(iso: string) {
  return ISSUED.format(new Date(iso)).replace(",", "").toUpperCase();
}

export function slipReference(slip: Slip) {
  const issued = new Date(slip.issuedAt);
  const hhmm = `${String(issued.getHours()).padStart(2, "0")}${String(issued.getMinutes()).padStart(2, "0")}`;
  const head = slip.customerId
    .replace(/[^0-9a-z]/gi, "")
    .slice(0, 3)
    .toUpperCase();
  return `REF ${head}-${slip.accountNumber.slice(-4)}-${hhmm}`;
}

export function barcodeBars(text: string) {
  const bars: { width: number; ink: boolean }[] = [{ width: 1, ink: true }];
  for (const ch of text.replace(/\s/g, "")) {
    const code = ch.charCodeAt(0);
    bars.push(
      { width: (code % 3) + 1, ink: false },
      { width: ((code >> 2) % 3) + 1, ink: true },
    );
  }
  bars.push({ width: 1, ink: false }, { width: 1, ink: true });
  return bars;
}

const spaced = (account: string) =>
  `${account.slice(0, 4)} ${account.slice(4, 8)} ${account.slice(8)}`;

function wrap(text: string) {
  const lines: string[] = [];
  let line = "";
  for (const word of text.split(" ")) {
    const next = line ? `${line} ${word}` : word;
    if (next.length > COLUMNS) {
      lines.push(line);
      line = word;
    } else line = next;
  }
  return [...lines, line];
}

export const RULE = "-".repeat(COLUMNS);

export function printJob(slip: Slip) {
  const ops: Op[] = [];
  let top = TOOTH_DEPTH + 14;
  const line = (text: string, bold?: boolean) => {
    ops.push({ kind: "text", x: MARGIN, y: top + BASELINE, text, bold });
    top += LINE;
  };
  const row = (key: string, value: string) => {
    ops.push({ kind: "text", x: MARGIN, y: top + BASELINE, text: key });
    ops.push({
      kind: "text",
      x: MARGIN + 10 * CELL,
      y: top + BASELINE,
      text: value,
      bold: true,
    });
    top += LINE;
  };

  ops.push({ kind: "logo", x: MARGIN, y: top, height: 18 });
  top += 18 + 12;
  line("PIN SLIP · PRIVATE", true);
  line(RULE);
  row("CUSTOMER", slip.name.toUpperCase());
  row("ACCOUNT", spaced(slip.accountNumber));
  row("ISSUED", slipIssued(slip.issuedAt));
  row("BY", slip.by.toUpperCase());
  line(RULE);
  line("TEMPORARY PIN");
  top += 4;
  ops.push({
    kind: "band",
    x: MARGIN,
    y: top,
    width: COLUMNS * CELL,
    height: BAND,
  });
  ops.push({
    kind: "pin",
    x: PAPER_WIDTH / 2,
    y: top + BAND / 2 + PIN_SIZE * 0.36,
    text: slip.tempPin.split("").join(" "),
  });
  top += BAND + 6;
  line(RULE);
  for (const text of wrap(
    "AT THE ATM, SIGN IN WITH YOUR ACCOUNT NUMBER AND THIS PIN. IT WILL ASK YOU TO CHOOSE YOUR OWN.",
  ))
    line(text);
  top += LINE / 2;
  for (const text of wrap(
    "NEVER SHARE YOUR PIN. BAAS STAFF WILL NEVER ASK FOR IT.",
  ))
    line(text, true);
  line(RULE);
  top += 4;
  const reference = slipReference(slip);
  const pattern = barcodeBars(reference);
  const total = pattern.reduce((sum, bar) => sum + bar.width, 0) * MODULE;
  let x = (PAPER_WIDTH - total) / 2;
  const bars: [number, number][] = [];
  for (const bar of pattern) {
    if (bar.ink) bars.push([x, bar.width * MODULE]);
    x += bar.width * MODULE;
  }
  ops.push({ kind: "bars", y: top, height: BARS, bars });
  top += BARS + 4;
  ops.push({
    kind: "text",
    x: (PAPER_WIDTH - reference.length * CELL) / 2,
    y: top + BASELINE,
    text: reference,
  });
  top += LINE + 14 + TOOTH_DEPTH;
  return { ops, height: top };
}

export function outline(height: number) {
  const teeth = PAPER_WIDTH / TOOTH;
  let d = `M0 ${TOOTH_DEPTH}`;
  for (let i = 0; i < teeth; i++)
    d += `L${i * TOOTH + TOOTH / 2} 0L${(i + 1) * TOOTH} ${TOOTH_DEPTH}`;
  d += `L${PAPER_WIDTH} ${height - TOOTH_DEPTH}`;
  for (let i = teeth; i > 0; i--)
    d += `L${i * TOOTH - TOOTH / 2} ${height}L${(i - 1) * TOOTH} ${height - TOOTH_DEPTH}`;
  return `${d}Z`;
}

export const firstSlip: Slip = {
  customerId: "7q2a-91",
  name: "Yetunde Bakare",
  accountNumber: "2031009817",
  tempPin: "4729",
  issuedAt: "2026-11-22T11:20:00",
  by: "Kemi Adeyemi",
};

const customers = [
  { customerId: "c81f-04", name: "Chidi Okafor", accountNumber: "2031004462" },
  { customerId: "a3m9-27", name: "Amina Sule", accountNumber: "2031011238" },
  { customerId: "k5t0-63", name: "Tunde Bello", accountNumber: "2031007705" },
  firstSlip,
];

export function nextSlip(count: number): Slip {
  const pin = String(Math.floor(Math.random() * 10000)).padStart(4, "0");
  return {
    ...customers[count % customers.length],
    tempPin: pin,
    issuedAt: new Date().toISOString(),
    by: "Kemi Adeyemi",
  };
}

export const PAPER_HEIGHT = printJob(firstSlip).height;
