import { PAPER_WIDTH } from "./job";

export type SlipState = "empty" | "printing" | "attached" | "torn";

type Options = {
  canvas: HTMLCanvasElement;
  rest: HTMLElement;
  ratio: number;
  start: "rest" | "empty";
  paint: (scale: number) => HTMLCanvasElement;
  onState: (state: SlipState) => void;
};

const NX = 15;
const NY = 41;
const N = NX * NY;
const STEP = 1 / 120;
const ITERATIONS = 10;
const GRAVITY = 55;
const AIR = 0.9;
const NORMAL_DRAG = 0.14;
const BEND = 0.6;
const FAR_BEND = 0.25;
const WALL = -0.09;
const FEED_TIME = 1.6;
const TEAR_START = 0.1;
const SETTLE = 0.14;
const GAP = 0.06;
const TILT = (-2 * Math.PI) / 180;
const LIGHT = normalize([-0.45, -0.7, 0.55]);
const SHADOW_BLUR = 0.035;
const FOV = (28 * Math.PI) / 180;

function normalize(v: number[]) {
  const l = Math.hypot(v[0], v[1], v[2]);
  return [v[0] / l, v[1] / l, v[2] / l];
}

const PAPER_VS = `#version 300 es
in vec3 aPos;
in vec3 aNor;
in float aPin;
in vec2 aUv;
uniform vec2 uSize;
uniform float uD;
out vec3 vPos;
out vec3 vNor;
out float vPin;
out vec2 vUv;
void main() {
  vPos = aPos; vNor = aNor; vPin = aPin; vUv = aUv;
  float w = uD - aPos.z;
  gl_Position = vec4(
    (aPos.x - uSize.x * 0.5) * uD / (uSize.x * 0.5),
    -(aPos.y - uSize.y * 0.5) * uD / (uSize.y * 0.5),
    -aPos.z / 2000.0 * w,
    w);
}`;

const PAPER_FS = `#version 300 es
precision highp float;
in vec3 vPos;
in vec3 vNor;
in float vPin;
in vec2 vUv;
uniform sampler2D uTex;
uniform vec3 uEye;
uniform vec3 uLight;
uniform float uCut;
uniform float uLength;
uniform float uAlpha;
out vec4 color;
void main() {
  if (vUv.y < uCut) discard;
  vec4 paper = texture(uTex, vUv, -0.5);
  if (paper.a < 0.004) discard;
  vec3 n = normalize(vNor);
  vec3 v = normalize(uEye - vPos);
  bool back = dot(n, v) < 0.0;
  if (back) n = -n;
  float facing = dot(n, uLight);
  float diffuse = clamp(1.0 + 0.62 * (facing - uLight.z), 0.5, 1.06);
  vec3 h = normalize(uLight + v);
  float gloss = pow(max(dot(n, h), 0.0), 70.0) * 0.38;
  float rim = pow(1.0 - max(dot(n, v), 0.0), 5.0) * 0.3;
  float slot = 1.0 - vPin * 0.22 * exp(-(vUv.y - uCut) * uLength / 0.018);
  vec3 base = back ? vec3(0.9, 0.894, 0.875) * paper.a : paper.rgb;
  vec3 lit = base * diffuse * slot + (back ? 0.0 : gloss + rim) * paper.a;
  color = vec4(lit, paper.a) * uAlpha;
}`;

const SHADOW_VS = `#version 300 es
in vec3 aPos;
in vec2 aUv;
uniform vec2 uSize;
uniform float uD;
uniform vec3 uLight;
uniform float uWall;
uniform float uScale;
out vec2 vUv;
out float vFar;
void main() {
  vUv = aUv;
  vec3 dir = -uLight;
  float t = (uWall - aPos.z) / dir.z;
  vec3 q = aPos + dir * t;
  vFar = clamp((aPos.z - uWall) / (0.6 * uScale), 0.0, 1.0);
  float w = uD - q.z;
  gl_Position = vec4(
    (q.x - uSize.x * 0.5) * uD / (uSize.x * 0.5),
    -(q.y - uSize.y * 0.5) * uD / (uSize.y * 0.5),
    0.0,
    w);
}`;

const SHADOW_FS = `#version 300 es
precision highp float;
in vec2 vUv;
in float vFar;
uniform sampler2D uTex;
uniform float uCut;
out vec4 color;
void main() {
  if (vUv.y < uCut) discard;
  float a = texture(uTex, vUv).a * mix(1.0, 0.45, vFar);
  color = vec4(a);
}`;

const QUAD_VS = `#version 300 es
out vec2 vUv;
void main() {
  vec2 p = vec2(float((gl_VertexID << 1) & 2), float(gl_VertexID & 2));
  vUv = p;
  gl_Position = vec4(p * 2.0 - 1.0, 0.0, 1.0);
}`;

const BLUR_FS = `#version 300 es
precision highp float;
in vec2 vUv;
uniform sampler2D uTex;
uniform vec2 uStep;
uniform float uWeights[7];
out vec4 color;
void main() {
  vec4 sum = texture(uTex, vUv) * uWeights[0];
  for (int i = 1; i < 7; i++) {
    vec2 o = uStep * float(i);
    sum += (texture(uTex, vUv + o) + texture(uTex, vUv - o)) * uWeights[i];
  }
  color = sum;
}`;

const SHADE_FS = `#version 300 es
precision highp float;
in vec2 vUv;
uniform sampler2D uTex;
uniform float uStrength;
out vec4 color;
void main() {
  color = vec4(0.0, 0.0, 0.0, min(1.0, texture(uTex, vUv).a) * uStrength);
}`;

function compile(gl: WebGL2RenderingContext, vs: string, fs: string) {
  const program = gl.createProgram();
  for (const [type, source] of [
    [gl.VERTEX_SHADER, vs],
    [gl.FRAGMENT_SHADER, fs],
  ] as const) {
    const shader = gl.createShader(type);
    if (!shader) throw new Error("shader");
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS))
      throw new Error(gl.getShaderInfoLog(shader) ?? "shader");
    gl.attachShader(program, shader);
  }
  const names = ["aPos", "aNor", "aPin", "aUv"];
  names.forEach((name, index) => {
    gl.bindAttribLocation(program, index, name);
  });
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS))
    throw new Error(gl.getProgramInfoLog(program) ?? "link");
  const uniforms = new Map<string, WebGLUniformLocation | null>();
  return {
    program,
    at(name: string) {
      if (!uniforms.has(name))
        uniforms.set(name, gl.getUniformLocation(program, name));
      return uniforms.get(name) ?? null;
    },
  };
}

function gaussian(sigmaTaps: number) {
  const weights = Array.from({ length: 7 }, (_, i) =>
    Math.exp(-(i * i) / (2 * sigmaTaps * sigmaTaps)),
  );
  const total = weights[0] + 2 * weights.slice(1).reduce((a, b) => a + b, 0);
  return weights.map((w) => w / total);
}

export function createEngine({
  canvas,
  rest,
  ratio,
  start,
  paint,
  onState,
}: Options) {
  const context = canvas.getContext("webgl2", {
    alpha: true,
    premultipliedAlpha: true,
    antialias: true,
  });
  if (!context) return null;
  const gl = context;
  const run = gl.useProgram.bind(gl);
  const length = ratio;

  const pos = new Float32Array(N * 3);
  const prev = new Float32Array(N * 3);
  const inv = new Float32Array(N).fill(1);
  const normals = new Float32Array(N * 3);
  const pinned = new Array<boolean>(NX).fill(true);
  const restU = (i: number) => (i % NX) / (NX - 1);
  const restV = (i: number) => (Math.floor(i / NX) / (NY - 1)) * length;

  const pairs: number[] = [];
  const restLength: number[] = [];
  const stiffness: number[] = [];
  const link = (a: number, b: number, k: number) => {
    pairs.push(a, b);
    restLength.push(Math.hypot(restU(a) - restU(b), restV(a) - restV(b)) || 0);
    stiffness.push(k);
  };
  for (let r = 0; r < NY; r++)
    for (let c = 0; c < NX; c++) {
      const i = r * NX + c;
      if (c + 1 < NX) link(i, i + 1, 1);
      if (r + 1 < NY) link(i, i + NX, 1);
      if (c + 1 < NX && r + 1 < NY) {
        link(i, i + NX + 1, 0.9);
        link(i + 1, i + NX, 0.9);
      }
      if (c + 2 < NX) link(i, i + 2, BEND);
      if (r + 2 < NY) link(i, i + 2 * NX, BEND);
      if (c + 4 < NX) link(i, i + 4, FAR_BEND);
      if (r + 4 < NY) link(i, i + 4 * NX, FAR_BEND);
    }
  const links = pairs.length / 2;

  let width = 0;
  let height = 0;
  let dpr = 1;
  let ox = 0;
  let oy = 0;
  let scale = 1;
  let eye = 1;

  let state: SlipState = start === "rest" ? "attached" : "empty";
  let fed = start === "rest" ? length : 0;
  let feedClock = 0;
  let alpha = 1;
  let leaving = 0;
  let still = 0;
  let tearing = 0;
  let grab: {
    index: number;
    offset: number[];
    target: number[];
    z: number;
  } | null = null;
  let script: {
    from: number[];
    to: number[];
    time: number;
    done: number;
  } | null = null;

  const setState = (next: SlipState) => {
    if (next === state) return;
    state = next;
    onState(next);
  };

  const place = (i: number, x: number, y: number, z: number) => {
    pos[i * 3] = x;
    pos[i * 3 + 1] = y;
    pos[i * 3 + 2] = z;
  };

  const restPose = (i: number) => {
    const u = restU(i) - 0.5;
    const v = restV(i) - length / 2;
    const cos = Math.cos(TILT);
    const sin = Math.sin(TILT);
    return [0.5 + u * cos - v * sin, length / 2 + GAP + u * sin + v * cos, 0];
  };

  const hang = () => {
    for (let i = 0; i < N; i++)
      place(i, restU(i), restV(i) - (length - fed), 0);
    prev.set(pos);
  };
  hang();

  const bounds = () => [
    (10 - ox) / scale,
    (width - 10 - ox) / scale,
    (10 - oy) / scale,
    (height - 10 - oy) / scale,
  ];

  const computeNormals = () => {
    for (let r = 0; r < NY; r++)
      for (let c = 0; c < NX; c++) {
        const i = r * NX + c;
        const l = r * NX + Math.max(0, c - 1);
        const rr = r * NX + Math.min(NX - 1, c + 1);
        const u = Math.max(0, r - 1) * NX + c;
        const d = Math.min(NY - 1, r + 1) * NX + c;
        const ax = pos[rr * 3] - pos[l * 3];
        const ay = pos[rr * 3 + 1] - pos[l * 3 + 1];
        const az = pos[rr * 3 + 2] - pos[l * 3 + 2];
        const bx = pos[d * 3] - pos[u * 3];
        const by = pos[d * 3 + 1] - pos[u * 3 + 1];
        const bz = pos[d * 3 + 2] - pos[u * 3 + 2];
        let nx = ay * bz - az * by;
        let ny = az * bx - ax * bz;
        let nz = ax * by - ay * bx;
        const n = Math.hypot(nx, ny, nz) || 1;
        nx /= n;
        ny /= n;
        nz /= n;
        normals[i * 3] = nx;
        normals[i * 3 + 1] = ny;
        normals[i * 3 + 2] = nz;
      }
  };

  const tetherTo = (i: number, top: number, max: number) => {
    const dx = pos[i * 3] - pos[top * 3];
    const dy = pos[i * 3 + 1] - pos[top * 3 + 1];
    const dz = pos[i * 3 + 2] - pos[top * 3 + 2];
    const d = Math.hypot(dx, dy, dz);
    if (d <= max) return;
    const k = max / d;
    place(
      i,
      pos[top * 3] + dx * k,
      pos[top * 3 + 1] + dy * k,
      pos[top * 3 + 2] + dz * k,
    );
  };

  const attached = () => state === "attached" || state === "printing";

  const clampToPaper = (target: number[], index: number) => {
    const [x0, x1, y0, y1] = bounds();
    const p = [
      Math.min(x1, Math.max(x0, target[0])),
      Math.min(y1, Math.max(y0, target[1])),
      target[2],
    ];
    if (!attached()) return p;
    for (let pass = 0; pass < 4; pass++)
      for (let c = 0; c < NX; c++) {
        if (!pinned[c]) continue;
        const max = Math.hypot(restU(index) - restU(c), restV(index));
        const dx = p[0] - pos[c * 3];
        const dy = p[1] - pos[c * 3 + 1];
        const dz = p[2] - pos[c * 3 + 2];
        const d = Math.hypot(dx, dy, dz);
        if (d > max) {
          const k = max / d;
          p[0] = pos[c * 3] + dx * k;
          p[1] = pos[c * 3 + 1] + dy * k;
          p[2] = pos[c * 3 + 2] + dz * k;
        }
      }
    return p;
  };

  const tear = (dt: number) => {
    if (!grab || state !== "attached") return;
    let worst = -1;
    let over = 0;
    for (let c = 0; c < NX; c++) {
      if (!pinned[c]) continue;
      const max = Math.hypot(restU(grab.index) - restU(c), restV(grab.index));
      const d = Math.hypot(
        grab.target[0] - pos[c * 3],
        grab.target[1] - pos[c * 3 + 1],
        grab.target[2] - pos[c * 3 + 2],
      );
      if (d - max > over) {
        over = d - max;
        worst = c;
      }
    }
    const started = pinned.some((p) => !p);
    if (worst < 0 || over < TEAR_START * (started ? 0.4 : 1)) {
      tearing = Math.max(0, tearing - dt * 4);
      return;
    }
    tearing += dt * (started ? 70 : 3 + (over - TEAR_START) * 80);
    if (tearing < 1) return;
    tearing = 0;
    pinned[worst] = false;
    inv[worst] = 1;
    if (pinned.every((p) => !p)) setState("torn");
  };

  const substep = () => {
    const [x0, x1, y0, y1] = bounds();
    const g = GRAVITY * STEP * STEP;
    const air = AIR ** STEP;
    const lift = grab ? 0.6 * STEP * STEP : 0;

    if (state === "printing") {
      const speed =
        (length / FEED_TIME) * (0.7 + 0.3 * Math.abs(Math.sin(feedClock * 38)));
      feedClock += STEP;
      fed = Math.min(length, fed + speed * STEP);
    }

    for (let i = 0; i < N; i++) {
      const r = Math.floor(i / NX);
      const c = i % NX;
      const inside = attached() && restV(i) - (length - fed) < 0;
      const kinematic = inside || (r === 0 && pinned[c] && attached());
      if (kinematic) {
        const j = i * 3;
        prev[j] = pos[j];
        prev[j + 1] = pos[j + 1];
        prev[j + 2] = pos[j + 2];
        place(i, restU(i), Math.min(0, restV(i) - (length - fed)), 0);
        inv[i] = 0;
        continue;
      }
      inv[i] = 1;
      const j = i * 3;
      let vx = (pos[j] - prev[j]) * air;
      let vy = (pos[j + 1] - prev[j + 1]) * air;
      let vz = (pos[j + 2] - prev[j + 2]) * air;
      const along = vx * normals[j] + vy * normals[j + 1] + vz * normals[j + 2];
      vx -= normals[j] * along * NORMAL_DRAG;
      vy -= normals[j + 1] * along * NORMAL_DRAG;
      vz -= normals[j + 2] * along * NORMAL_DRAG;
      prev[j] = pos[j];
      prev[j + 1] = pos[j + 1];
      prev[j + 2] = pos[j + 2];
      pos[j] += vx;
      pos[j + 1] += vy + g;
      pos[j + 2] += vz + lift;
    }

    if (grab) {
      const p = clampToPaper(grab.target, grab.index);
      place(grab.index, p[0], p[1], p[2]);
      inv[grab.index] = 0;
    }

    for (let pass = 0; pass < ITERATIONS; pass++) {
      for (let k = 0; k < links; k++) {
        const a = pairs[k * 2];
        const b = pairs[k * 2 + 1];
        const wa = inv[a];
        const wb = inv[b];
        const w = wa + wb;
        if (w === 0) continue;
        const ja = a * 3;
        const jb = b * 3;
        const dx = pos[jb] - pos[ja];
        const dy = pos[jb + 1] - pos[ja + 1];
        const dz = pos[jb + 2] - pos[ja + 2];
        const d = Math.hypot(dx, dy, dz) || 1e-6;
        const f = ((d - restLength[k]) / (d * w)) * stiffness[k];
        pos[ja] += dx * f * wa;
        pos[ja + 1] += dy * f * wa;
        pos[ja + 2] += dz * f * wa;
        pos[jb] -= dx * f * wb;
        pos[jb + 1] -= dy * f * wb;
        pos[jb + 2] -= dz * f * wb;
      }
    }

    if (attached())
      for (let i = NX; i < N; i++) {
        const c = i % NX;
        if (pinned[c] && inv[i] > 0) tetherTo(i, c, restV(i));
      }

    for (let i = 0; i < N; i++) {
      if (inv[i] === 0) continue;
      const j = i * 3;
      pos[j] = Math.min(x1, Math.max(x0, pos[j]));
      pos[j + 1] = Math.min(y1, Math.max(y0, pos[j + 1]));
      pos[j + 2] = Math.min(0.8, Math.max(WALL + 0.01, pos[j + 2]));
    }

    tear(STEP);
    if (state === "printing" && fed >= length) setState("attached");
  };

  const settle = () => {
    const k = 1 - Math.exp(-STEP / SETTLE);
    let moving = 0;
    for (let i = 0; i < N; i++) {
      const [tx, ty, tz] = restPose(i);
      const j = i * 3;
      const dx = tx - pos[j];
      const dy = ty - pos[j + 1];
      const dz = tz - pos[j + 2];
      moving = Math.max(moving, Math.abs(dx), Math.abs(dy), Math.abs(dz));
      pos[j] += dx * k;
      pos[j + 1] += dy * k;
      pos[j + 2] += dz * k;
    }
    prev.set(pos);
    return moving;
  };

  const vbo = gl.createBuffer();
  const vertices = new Float32Array(N * 7);
  const uvs = new Float32Array(N * 2);
  for (let i = 0; i < N; i++) {
    uvs[i * 2] = (i % NX) / (NX - 1);
    uvs[i * 2 + 1] = Math.floor(i / NX) / (NY - 1);
  }
  const indices = new Uint16Array((NX - 1) * (NY - 1) * 6);
  let n = 0;
  for (let r = 0; r < NY - 1; r++)
    for (let c = 0; c < NX - 1; c++) {
      const i = r * NX + c;
      indices.set([i, i + 1, i + NX, i + 1, i + NX + 1, i + NX], n);
      n += 6;
    }

  const vao = gl.createVertexArray();
  gl.bindVertexArray(vao);
  gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
  gl.bufferData(gl.ARRAY_BUFFER, vertices.byteLength, gl.DYNAMIC_DRAW);
  gl.enableVertexAttribArray(0);
  gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 28, 0);
  gl.enableVertexAttribArray(1);
  gl.vertexAttribPointer(1, 3, gl.FLOAT, false, 28, 12);
  gl.enableVertexAttribArray(2);
  gl.vertexAttribPointer(2, 1, gl.FLOAT, false, 28, 24);
  const uvBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, uvBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, uvs, gl.STATIC_DRAW);
  gl.enableVertexAttribArray(3);
  gl.vertexAttribPointer(3, 2, gl.FLOAT, false, 0, 0);
  const ibo = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibo);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);
  gl.bindVertexArray(null);
  const empty = gl.createVertexArray();

  const paper = compile(gl, PAPER_VS, PAPER_FS);
  const shadow = compile(gl, SHADOW_VS, SHADOW_FS);
  const blur = compile(gl, QUAD_VS, BLUR_FS);
  const shade = compile(gl, QUAD_VS, SHADE_FS);

  const texture = gl.createTexture();
  const anisotropy = gl.getExtension("EXT_texture_filter_anisotropic");
  let painted = 0;
  const upload = () => {
    const wanted = Math.ceil(((scale * dpr) / PAPER_WIDTH) * 4) / 4;
    if (wanted === painted) return;
    painted = wanted;
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);
    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      gl.RGBA,
      gl.RGBA,
      gl.UNSIGNED_BYTE,
      paint(wanted),
    );
    gl.generateMipmap(gl.TEXTURE_2D);
    gl.texParameteri(
      gl.TEXTURE_2D,
      gl.TEXTURE_MIN_FILTER,
      gl.LINEAR_MIPMAP_LINEAR,
    );
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    if (anisotropy)
      gl.texParameterf(
        gl.TEXTURE_2D,
        anisotropy.TEXTURE_MAX_ANISOTROPY_EXT,
        Math.min(8, gl.getParameter(anisotropy.MAX_TEXTURE_MAX_ANISOTROPY_EXT)),
      );
  };

  const targets = [0, 1].map(() => ({
    texture: gl.createTexture(),
    buffer: gl.createFramebuffer(),
  }));
  let shadowW = 1;
  let shadowH = 1;

  const layout = () => {
    const box = canvas.getBoundingClientRect();
    const paperBox = rest.getBoundingClientRect();
    width = box.width;
    height = box.height;
    dpr = Math.min(2, window.devicePixelRatio || 1);
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    ox = paperBox.left - box.left;
    oy = paperBox.top - box.top;
    scale = paperBox.width;
    eye = height / 2 / Math.tan(FOV / 2);
    shadowW = Math.max(1, Math.round(canvas.width / 4));
    shadowH = Math.max(1, Math.round(canvas.height / 4));
    for (const target of targets) {
      gl.bindTexture(gl.TEXTURE_2D, target.texture);
      gl.texImage2D(
        gl.TEXTURE_2D,
        0,
        gl.RGBA,
        shadowW,
        shadowH,
        0,
        gl.RGBA,
        gl.UNSIGNED_BYTE,
        null,
      );
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.bindFramebuffer(gl.FRAMEBUFFER, target.buffer);
      gl.framebufferTexture2D(
        gl.FRAMEBUFFER,
        gl.COLOR_ATTACHMENT0,
        gl.TEXTURE_2D,
        target.texture,
        0,
      );
    }
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    upload();
  };

  const toScreen = (i: number) => {
    const z = pos[i * 3 + 2] * scale;
    const k = eye / (eye - z);
    return [
      width / 2 + (ox + pos[i * 3] * scale - width / 2) * k,
      height / 2 + (oy + pos[i * 3 + 1] * scale - height / 2) * k,
      z,
    ];
  };

  const toWorld = (sx: number, sy: number, z: number) => {
    const k = (eye - z * scale) / eye;
    return [
      (width / 2 + (sx - width / 2) * k - ox) / scale,
      (height / 2 + (sy - height / 2) * k - oy) / scale,
      z,
    ];
  };

  const hit = (sx: number, sy: number) => {
    if (state === "printing" || state === "empty" || leaving) return -1;
    const screen = Array.from({ length: N }, (_, i) => toScreen(i));
    const cut = attached() ? length - fed : 0;
    let best = -1;
    let bestZ = -Infinity;
    for (let r = 0; r < NY - 1; r++) {
      if (restV(r * NX) < cut) continue;
      for (let c = 0; c < NX - 1; c++) {
        const i = r * NX + c;
        const quad = [i, i + 1, i + NX + 1, i + NX];
        for (const [a, b, d] of [
          [quad[0], quad[1], quad[3]],
          [quad[1], quad[2], quad[3]],
        ]) {
          const [ax, ay, az] = screen[a];
          const [bx, by] = screen[b];
          const [dx, dy] = screen[d];
          const det = (by - dy) * (ax - dx) + (dx - bx) * (ay - dy);
          if (Math.abs(det) < 1e-9) continue;
          const l1 = ((by - dy) * (sx - dx) + (dx - bx) * (sy - dy)) / det;
          const l2 = ((dy - ay) * (sx - dx) + (ax - dx) * (sy - dy)) / det;
          if (l1 < 0 || l2 < 0 || l1 + l2 > 1) continue;
          if (az <= bestZ) continue;
          bestZ = az;
          let near = quad[0];
          let nearest = Infinity;
          for (const q of quad) {
            const d2 = (screen[q][0] - sx) ** 2 + (screen[q][1] - sy) ** 2;
            if (d2 < nearest) {
              nearest = d2;
              near = q;
            }
          }
          best = near;
        }
      }
    }
    return best;
  };

  const draw = () => {
    computeNormals();
    for (let i = 0; i < N; i++) {
      const j = i * 3;
      const o = i * 7;
      vertices[o] = ox + pos[j] * scale;
      vertices[o + 1] = oy + pos[j + 1] * scale + leaving ** 2 * scale * 0.5;
      vertices[o + 2] = pos[j + 2] * scale;
      vertices[o + 3] = normals[j];
      vertices[o + 4] = normals[j + 1];
      vertices[o + 5] = normals[j + 2];
      vertices[o + 6] = attached() && pinned[i % NX] ? 1 : 0;
    }
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
    gl.bufferSubData(gl.ARRAY_BUFFER, 0, vertices);

    const cut = attached() ? (length - fed) / length : -1;
    const strength = Number.parseFloat(
      getComputedStyle(canvas).getPropertyValue("--slip-shadow") || "0.3",
    );

    gl.disable(gl.DEPTH_TEST);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

    gl.bindFramebuffer(gl.FRAMEBUFFER, targets[0].buffer);
    gl.viewport(0, 0, shadowW, shadowH);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    run(shadow.program);
    gl.uniform2f(shadow.at("uSize"), width, height);
    gl.uniform1f(shadow.at("uD"), eye);
    gl.uniform3fv(shadow.at("uLight"), LIGHT);
    gl.uniform1f(shadow.at("uWall"), WALL * scale);
    gl.uniform1f(shadow.at("uScale"), scale);
    gl.uniform1f(shadow.at("uCut"), cut);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.uniform1i(shadow.at("uTex"), 0);
    gl.bindVertexArray(vao);
    gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);

    const sigma = (SHADOW_BLUR * scale * shadowW) / width;
    const spacing = Math.max(1, sigma / 2.4);
    const weights = gaussian(sigma / spacing);
    gl.disable(gl.BLEND);
    run(blur.program);
    gl.uniform1fv(blur.at("uWeights"), weights);
    gl.uniform1i(blur.at("uTex"), 0);
    gl.bindVertexArray(empty);
    for (const [from, to, dx, dy] of [
      [0, 1, 1, 0],
      [1, 0, 0, 1],
    ]) {
      gl.bindFramebuffer(gl.FRAMEBUFFER, targets[to].buffer);
      gl.bindTexture(gl.TEXTURE_2D, targets[from].texture);
      gl.uniform2f(
        blur.at("uStep"),
        (dx * spacing) / shadowW,
        (dy * spacing) / shadowH,
      );
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    }

    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(0, 0, 0, 0);
    gl.clearDepth(1);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.enable(gl.BLEND);
    run(shade.program);
    gl.bindTexture(gl.TEXTURE_2D, targets[0].texture);
    gl.uniform1i(shade.at("uTex"), 0);
    gl.uniform1f(shade.at("uStrength"), strength * alpha);
    gl.drawArrays(gl.TRIANGLES, 0, 3);

    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);
    run(paper.program);
    gl.uniform2f(paper.at("uSize"), width, height);
    gl.uniform1f(paper.at("uD"), eye);
    gl.uniform3f(paper.at("uEye"), width / 2, height / 2, eye);
    gl.uniform3fv(paper.at("uLight"), LIGHT);
    gl.uniform1f(paper.at("uCut"), cut);
    gl.uniform1f(paper.at("uLength"), length);
    gl.uniform1f(paper.at("uAlpha"), alpha);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.uniform1i(paper.at("uTex"), 0);
    gl.bindVertexArray(vao);
    gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);
    gl.bindVertexArray(null);
  };

  let frame = 0;
  let last = 0;
  let clock = 0;
  let visible = true;

  const tick = (now: number) => {
    frame = 0;
    const elapsed = Math.min(0.05, last ? (now - last) / 1000 : STEP);
    last = now;
    clock += elapsed;
    let moving = 0;
    while (clock >= STEP) {
      clock -= STEP;
      if (script) {
        const { from, to } = script;
        script.time = Math.min(1, script.time + STEP / 0.7);
        const t = script.time;
        const e = t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2;
        if (grab) grab.target = from.map((f, k) => f + (to[k] - f) * e);
        if (state === "torn" || t >= 1) script.done += STEP;
        if (script.done > 0.25) {
          script = null;
          grab = null;
        }
      }
      if (leaving) {
        leaving = Math.min(1, leaving + STEP / 0.42);
        alpha = 1 - leaving ** 2;
        if (leaving >= 1) {
          leaving = 0;
          alpha = 1;
          begin();
        }
        moving = 1;
        continue;
      }
      if (state === "torn" && !grab) moving = Math.max(moving, settle());
      else {
        substep();
        for (let i = 0; i < N * 3; i++)
          moving = Math.max(moving, Math.abs(pos[i] - prev[i]));
      }
    }
    draw();
    still =
      moving < 2e-5 && !grab && !script && state !== "printing"
        ? still + elapsed
        : 0;
    if (visible && still < 0.4) frame = requestAnimationFrame(tick);
    else last = 0;
  };

  const wake = () => {
    still = 0;
    if (!frame && visible) {
      last = 0;
      frame = requestAnimationFrame(tick);
    }
  };

  const begin = () => {
    pinned.fill(true);
    fed = 0;
    feedClock = 0;
    tearing = 0;
    hang();
    painted = 0;
    upload();
    setState("printing");
    wake();
  };

  const pointer = { id: -1 };
  const local = (event: PointerEvent) => {
    const box = canvas.getBoundingClientRect();
    return [event.clientX - box.left, event.clientY - box.top];
  };
  const onDown = (event: PointerEvent) => {
    if (event.button !== 0 || script) return;
    const [sx, sy] = local(event);
    const index = hit(sx, sy);
    if (index < 0) return;
    event.preventDefault();
    canvas.setPointerCapture(event.pointerId);
    pointer.id = event.pointerId;
    const z = pos[index * 3 + 2];
    const at = toWorld(sx, sy, z);
    grab = {
      index,
      z,
      offset: [0, 1, 2].map((k) => at[k] - pos[index * 3 + k]),
      target: [pos[index * 3], pos[index * 3 + 1], z],
    };
    if (state === "torn") prev.set(pos);
    canvas.style.cursor = "grabbing";
    wake();
  };
  const onMove = (event: PointerEvent) => {
    const [sx, sy] = local(event);
    if (!grab || event.pointerId !== pointer.id) {
      if (event.pointerType === "mouse")
        canvas.style.cursor = hit(sx, sy) >= 0 ? "grab" : "";
      return;
    }
    const at = toWorld(sx, sy, grab.z);
    grab.target = [at[0] - grab.offset[0], at[1] - grab.offset[1], grab.z];
    wake();
  };
  const onUp = (event: PointerEvent) => {
    if (event.pointerId !== pointer.id) return;
    pointer.id = -1;
    grab = null;
    canvas.style.cursor = "grab";
    wake();
  };
  const onTouch = (event: TouchEvent) => {
    if (grab) {
      event.preventDefault();
      return;
    }
    const touch = event.touches[0];
    const box = canvas.getBoundingClientRect();
    if (touch && hit(touch.clientX - box.left, touch.clientY - box.top) >= 0)
      event.preventDefault();
  };

  canvas.addEventListener("pointerdown", onDown);
  canvas.addEventListener("pointermove", onMove);
  canvas.addEventListener("pointerup", onUp);
  canvas.addEventListener("pointercancel", onUp);
  canvas.addEventListener("touchstart", onTouch, { passive: false });
  canvas.addEventListener("touchmove", onTouch, { passive: false });

  layout();
  draw();

  return {
    layout() {
      layout();
      draw();
      wake();
    },
    redraw() {
      draw();
      wake();
    },
    visible(on: boolean) {
      visible = on;
      if (on) wake();
      else if (frame) {
        cancelAnimationFrame(frame);
        frame = 0;
      }
    },
    print() {
      if (state === "empty") begin();
      else if (state === "torn" && !leaving) {
        grab = null;
        leaving = 0.0001;
        wake();
      }
    },
    tear() {
      if (state !== "attached" || script) return;
      const index = N - 1;
      const from = [pos[index * 3], pos[index * 3 + 1], pos[index * 3 + 2]];
      grab = { index, z: from[2], offset: [0, 0, 0], target: from };
      script = {
        from,
        to: [from[0] + 1.2, from[1] - 0.15, from[2] + 0.3],
        time: 0,
        done: 0,
      };
      wake();
    },
    nudge(dx: number, dy: number) {
      if (state !== "attached") return;
      for (let i = NX; i < N; i++) {
        const reach = (restV(i) / length) ** 1.5;
        prev[i * 3] -= dx * 0.02 * reach;
        prev[i * 3 + 1] -= dy * 0.02 * reach;
        prev[i * 3 + 2] -= 0.006 * reach * (dx || dy ? 1 : 0);
      }
      wake();
    },
    destroy() {
      cancelAnimationFrame(frame);
      canvas.removeEventListener("pointerdown", onDown);
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerup", onUp);
      canvas.removeEventListener("pointercancel", onUp);
      canvas.removeEventListener("touchstart", onTouch);
      canvas.removeEventListener("touchmove", onTouch);
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    },
  };
}

export type Engine = NonNullable<ReturnType<typeof createEngine>>;
