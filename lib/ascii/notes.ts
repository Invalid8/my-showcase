import { easeOut } from "./random";

type Note = {
  el: HTMLSpanElement;
  x: number;
  y: number;
  t0: number;
  life: number;
  drift: number;
  phase: number;
};

export class Notes {
  private readonly notes: Note[] = [];

  constructor(private readonly stage: HTMLElement) {}

  spawn(x: number, y: number, t: number) {
    const el = document.createElement("span");
    el.className = "ascii-note";
    el.textContent = Math.random() < 0.5 ? "♪" : "♫";
    this.stage.append(el);
    this.notes.push({
      el,
      x,
      y,
      t0: t,
      life: 2600 + Math.random() * 900,
      drift: (Math.random() - 0.5) * 30,
      phase: Math.random() * 6,
    });
  }

  step(t: number) {
    for (let i = this.notes.length - 1; i >= 0; i--) {
      const n = this.notes[i];
      const k = (t - n.t0) / n.life;
      if (k >= 1) {
        n.el.remove();
        this.notes.splice(i, 1);
        continue;
      }
      const y = n.y - easeOut(k) * 110;
      const x = n.x + n.drift * k + Math.sin(k * 6 + n.phase) * 5;
      n.el.style.opacity = (k < 0.2 ? k / 0.2 : 1 - (k - 0.2) / 0.8).toFixed(2);
      n.el.style.transform = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px)`;
    }
  }
}
