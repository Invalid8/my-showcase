import {
  FADE_STOPS,
  FONT_SIZE,
  HATCH_GAP,
  INK,
  LOGO,
  LOGO_BOX,
  outline,
  PAPER_BOTTOM,
  PAPER_TOP,
  PAPER_WIDTH,
  PIN_SIZE,
  printJob,
  type Slip,
} from "./job";

const logo = () => new Path2D(LOGO);

export function paintSlip(slip: Slip, scale: number, family: string) {
  const { ops, height } = printJob(slip);
  const width = Math.round(PAPER_WIDTH * scale);
  const tall = Math.round(height * scale);

  const ink = document.createElement("canvas");
  ink.width = width;
  ink.height = tall;
  const pen = ink.getContext("2d");
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = tall;
  const ctx = canvas.getContext("2d");
  if (!pen || !ctx) return canvas;

  pen.scale(scale, scale);
  pen.fillStyle = INK;
  pen.strokeStyle = INK;
  for (const op of ops) {
    switch (op.kind) {
      case "text":
        pen.font = `${op.bold ? 700 : 400} ${FONT_SIZE}px ${family}`;
        pen.textAlign = "start";
        pen.fillText(op.text, op.x, op.y);
        break;
      case "pin":
        pen.font = `700 ${PIN_SIZE}px ${family}`;
        pen.textAlign = "center";
        pen.fillText(op.text, op.x, op.y);
        break;
      case "logo": {
        const k = op.height / LOGO_BOX.height;
        pen.save();
        pen.translate(op.x, op.y - LOGO_BOX.y * k);
        pen.scale(k, k);
        pen.fill(logo());
        pen.restore();
        break;
      }
      case "band": {
        pen.save();
        pen.beginPath();
        pen.roundRect(op.x, op.y, op.width, op.height, 4);
        pen.clip();
        pen.globalAlpha = 0.3;
        pen.lineWidth = 0.8;
        for (
          let d = -op.height;
          d < op.width + op.height;
          d += HATCH_GAP * Math.SQRT2
        ) {
          pen.beginPath();
          pen.moveTo(op.x + d, op.y);
          pen.lineTo(op.x + d - op.height, op.y + op.height);
          pen.stroke();
        }
        pen.restore();
        pen.save();
        pen.globalAlpha = 0.45;
        pen.lineWidth = 0.8;
        pen.beginPath();
        pen.roundRect(op.x, op.y, op.width, op.height, 4);
        pen.stroke();
        pen.restore();
        break;
      }
      case "bars":
        for (const [x, w] of op.bars) pen.fillRect(x, op.y, w, op.height);
        break;
    }
  }
  pen.setTransform(1, 0, 0, 1, 0, 0);
  pen.globalCompositeOperation = "destination-in";
  const fade = pen.createLinearGradient(0, 0, width, 0);
  for (const [at, alpha] of FADE_STOPS)
    fade.addColorStop(at, `rgb(0 0 0 / ${alpha})`);
  pen.fillStyle = fade;
  pen.fillRect(0, 0, width, tall);

  ctx.scale(scale, scale);
  const paper = ctx.createLinearGradient(0, 0, 0, height);
  paper.addColorStop(0, PAPER_TOP);
  paper.addColorStop(1, PAPER_BOTTOM);
  ctx.fillStyle = paper;
  ctx.fill(new Path2D(outline(height)));
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.globalCompositeOperation = "source-atop";
  ctx.drawImage(ink, 0, 0);
  return canvas;
}
