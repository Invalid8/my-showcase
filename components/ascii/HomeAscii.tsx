"use client";

import { useEffect, useRef } from "react";
import { ART } from "@/lib/ascii/art";
import { decoder } from "@/lib/ascii/decode";
import { Desert } from "@/lib/ascii/desert/scene";
import { Dust } from "@/lib/ascii/dust";
import { prefersReducedMotion, subscribe } from "@/lib/ascii/loop";
import { metrics } from "@/lib/ascii/metrics";
import { Notes } from "@/lib/ascii/notes";
import { ringing } from "@/lib/ascii/phone";
import { Piece } from "@/lib/ascii/piece";
import { FAR, trackPointer, visibleBand } from "@/lib/ascii/pointer";
import { easeInOut } from "@/lib/ascii/random";
import { TURNTABLE_FRAME_MS, TURNTABLE_FRAMES } from "@/lib/ascii/turntable";
import { waveform } from "@/lib/ascii/waveform";

const SCENE_SIZE = 11;
const MOBILE = 720;
const WIDE = 1180;
const MOTTO_KEY = "motto";
const INTRO_KEY = "intro-seen";
const RISE_DELAY = 2300;
const RISE_FOR = 1150;

function storage(area: "local" | "session") {
  try {
    return area === "local" ? localStorage : sessionStorage;
  } catch {
    return null;
  }
}

function pickMotto(count: number) {
  const store = storage("local");
  const last = Number(store?.getItem(MOTTO_KEY) ?? -1);
  let index = Math.floor(Math.random() * count);
  if (count > 1)
    while (index === last) index = Math.floor(Math.random() * count);
  store?.setItem(MOTTO_KEY, String(index));
  return index;
}

function offsetWithin(el: Element, root: Element) {
  const a = el.getBoundingClientRect();
  const b = root.getBoundingClientRect();
  return { x: a.left - b.left, y: a.top - b.top };
}

export function HomeAscii({ mottos }: { mottos: string[] }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stage = ref.current;
    const home = stage?.parentElement;
    const motto = home?.querySelector<HTMLElement>("[data-motto]");
    if (!stage || !home || !motto) return;

    const reduced = prefersReducedMotion();
    const line = mottos[pickMotto(mottos.length)];
    let cleanup = () => {};

    const build = (playIntro: boolean) => {
      cleanup();
      stage.replaceChildren();
      home.querySelector(".motto-float")?.remove();

      const W = home.clientWidth;
      const mobile = W < MOBILE;
      const wide = W >= WIDE;
      const colW = Math.min(640, W - 48);
      const colLeft = (W - colW) / 2;
      const m = metrics(SCENE_SIZE);
      const desert = new Desert(
        mobile ? Math.ceil(W / m.w) : Math.floor(colW / m.w),
        m,
      );
      const now = performance.now();
      const scene = new Piece(stage, {
        lines: desert.render(now),
        size: SCENE_SIZE,
        className: "scene",
        radius: 52,
      });
      const sceneX = mobile ? W - scene.width : (W - scene.width) / 2;
      const GAP = mobile ? 0 : 72;
      const layer = document.createElement("div");
      layer.className = "ascii-layer";
      stage.append(layer);
      const pieces = [scene];
      const top = (selector: string) => {
        const el = home.querySelector(selector);
        return el ? offsetWithin(el, home).y : 0;
      };

      let turntable: Piece | null = null;
      let wave: Piece | null = null;
      let phone: Piece | null = null;
      let dust: Dust | null = null;
      if (wide) {
        const right = colLeft + colW;
        turntable = new Piece(layer, {
          lines: TURNTABLE_FRAMES[0],
          size: 6,
          className: "hero",
          radius: 70,
        });
        turntable.place(colLeft - turntable.width - 40, top("#now") + 10);
        wave = new Piece(layer, { lines: waveform(now, 0), radius: 60 });
        wave.place(right + 100, top("#work") + 30);
        const router = new Piece(layer, { lines: ART.router });
        router.place(right + 70, top("#tools") - 10);
        const fillyr = new Piece(layer, { lines: ART.fillyr, size: 10 });
        fillyr.place(
          colLeft - fillyr.width - 80,
          top('[data-work="fillyr"]') - 60,
        );
        const headphones = new Piece(layer, { lines: ART.headphones });
        headphones.place(right + 80, top("#writing") + 10);
        phone = new Piece(layer, { lines: ART.phone, radius: 60 });
        phone.place(right + 80, top("#connect") + 10);
        pieces.push(turntable, wave, router, fillyr, headphones, phone);
        dust = new Dust(layer, {
          count: 22,
          width: W,
          column: colW,
          top: 520,
          bottom: home.clientHeight - 160,
        });
      }
      const notes = new Notes(layer);

      if (reduced) {
        motto.textContent = line;
        motto.classList.remove("waiting");
        home.dataset.intro = "off";
        scene.place(sceneX, GAP);
        for (const p of pieces) p.draw(now, { x: FAR, y: FAR });
        return;
      }

      const target = offsetWithin(motto, home);
      let landed = !playIntro;
      let contentShown = !playIntro;
      let float: HTMLDivElement | null = null;
      let floatStart = { x: 0, y: 0 };
      let centreY = GAP;
      let decode = decoder(line, now);
      let decodeInto: HTMLElement = motto;

      if (playIntro) {
        motto.classList.add("waiting");
        float = document.createElement("div");
        float.className = "motto motto-float";
        float.textContent = line;
        float.style.whiteSpace = mobile ? "normal" : "nowrap";
        if (mobile) float.style.width = `${colW}px`;
        home.append(float);
        const box = float.getBoundingClientRect();
        centreY = Math.max(
          GAP,
          (innerHeight - (scene.height + 28 + box.height)) / 2,
        );
        floatStart = {
          x: mobile ? colLeft : (W - box.width) / 2,
          y: centreY + scene.height + 28,
        };
        float.style.transform = `translate(${floatStart.x}px, ${floatStart.y}px)`;
        scene.place(sceneX, centreY);
        scene.reveal(now, 1400);
        decode = decoder(line, now + 500);
        decodeInto = float;
      } else {
        motto.classList.remove("waiting");
        home.dataset.intro = "off";
        scene.place(sceneX, GAP);
      }

      const { pointer, release } = trackPointer(stage);
      const vscrybe = home.querySelector('[data-work="vscrybe"] a');
      let hovering = false;
      const enter = () => {
        hovering = true;
      };
      const leave = () => {
        hovering = false;
      };
      vscrybe?.addEventListener("pointerenter", enter);
      vscrybe?.addEventListener("pointerleave", leave);

      const riseAt = now + RISE_DELAY;
      let decoding = true;
      let loud = 0;
      let frame = 0;
      let lastSpin = 0;
      let lastText = 0;
      let nextNote = now + 1500;

      const unsubscribe = subscribe((t, dt) => {
        if (!landed && t >= riseAt) {
          const k = Math.min(1, (t - riseAt) / RISE_FOR);
          const e = easeInOut(k);
          scene.place(sceneX, centreY + (GAP - centreY) * e);
          float?.style.setProperty(
            "transform",
            `translate(${(floatStart.x + (target.x - floatStart.x) * e).toFixed(1)}px, ${(floatStart.y + (target.y - floatStart.y) * e).toFixed(1)}px)`,
          );
          if (k >= 1) {
            landed = true;
            motto.textContent = line;
            motto.classList.remove("waiting");
            float?.remove();
          }
        }
        if (!contentShown && t >= riseAt + 300) {
          contentShown = true;
          home.dataset.intro = "off";
          for (const p of pieces) if (p !== scene) p.reveal(t + 300, 900);
          nextNote = t + 1800;
          storage("session")?.setItem(INTRO_KEY, "1");
        }
        if (decoding) {
          const { text, done } = decode(t);
          decodeInto.textContent = text;
          decoding = !done;
        }

        const band = visibleBand(stage);
        desert.step(t, dt, pointer, scene);
        loud += ((hovering ? 1 : 0) - loud) * 0.06;
        if (turntable && t - lastSpin > TURNTABLE_FRAME_MS) {
          frame = (frame + 1) % TURNTABLE_FRAMES.length;
          turntable.setLines(TURNTABLE_FRAMES[frame]);
          lastSpin = t;
        }
        if (phone) {
          const near =
            Math.hypot(
              phone.x + phone.width / 2 - pointer.x,
              phone.y + phone.height / 2 - pointer.y,
            ) < 170;
          phone.setLines(
            near || t % 9000 < 1600 ? ringing(ART.phone, t) : ART.phone,
          );
        }
        if (turntable && t > nextNote) {
          notes.spawn(
            turntable.x + turntable.width * 0.62,
            turntable.y + turntable.height * 0.3,
            t,
          );
          nextNote = t + 1600 + Math.random() * 1400;
        }
        if (t - lastText > 33) {
          scene.setLines(desert.render(t));
          if (wave) wave.setLines(waveform(t, loud));
          for (const p of pieces) {
            if (p.y > band.bottom || p.y + p.height < band.top) continue;
            p.draw(t, pointer);
          }
          lastText = t;
        }
        dust?.step(t, pointer);
        notes.step(t);
      });

      cleanup = () => {
        unsubscribe();
        release();
        vscrybe?.removeEventListener("pointerenter", enter);
        vscrybe?.removeEventListener("pointerleave", leave);
      };
    };

    const firstIntro =
      !reduced &&
      scrollY === 0 &&
      storage("session")?.getItem(INTRO_KEY) !== "1";
    let width = 0;
    let timer = 0;
    const observer = new ResizeObserver(() => {
      if (home.clientWidth === width) return;
      const first = width === 0;
      width = home.clientWidth;
      clearTimeout(timer);
      if (first) build(firstIntro);
      else timer = window.setTimeout(() => build(false), 250);
    });
    document.fonts.ready.then(() => observer.observe(home));

    return () => {
      observer.disconnect();
      clearTimeout(timer);
      cleanup();
    };
  }, [mottos]);

  return <div ref={ref} className="ascii-stage" aria-hidden="true" />;
}
