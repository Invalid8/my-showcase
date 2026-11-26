export const SCRAMBLE = "!-_\\/[]{}=+*^?#:;.,'`\"~|ilI17YVvTLJ";
export const AGITATE = ".:;'`~^\",";

export function pick(chars: string) {
  return chars[Math.floor(Math.random() * chars.length)];
}

export const easeOut = (x: number) => 1 - (1 - x) ** 3;

export const easeInOut = (x: number) =>
  x < 0.5 ? 4 * x * x * x : 1 - (-2 * x + 2) ** 3 / 2;
