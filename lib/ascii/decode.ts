const LETTERS = "abcdefghijklmnopqrstuvwxyz";

export function decoder(final: string, t0: number) {
  const at = [...final].map((_, i) => t0 + 300 + i * 38 + Math.random() * 120);
  return (t: number) => {
    let text = "";
    let done = true;
    for (let i = 0; i < final.length; i++) {
      if (final[i] === " " || t >= at[i]) text += final[i];
      else {
        text += LETTERS[Math.floor(Math.random() * 26)];
        done = false;
      }
    }
    return { text, done };
  };
}
