const canvas = document.querySelector("#material");
const root = document.documentElement;
const body = document.body;
const progressElement = document.querySelector(".sr-progress");
const rendererLabel = document.querySelector("#renderer-label");
const fpsLabel = document.querySelector("#fps-label");
const resolutionLabel = document.querySelector("#render-resolution");
const pulseButton = document.querySelector("#pulse-button");
const chapters = [...document.querySelectorAll(".chapter[data-scene]")];
const stageLinks = [...document.querySelectorAll(".stage-nav a")];
const prefersReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
);

// Never let a slow shader compiler trap someone behind the intro.
const bootDeadline = window.setTimeout(
  () => body.classList.add("is-ready"),
  2200
);

const accents = [
  "oklch(84% 0.13 188)",
  "oklch(72% 0.2 334)",
  "oklch(88% 0.16 112)",
  "oklch(72% 0.22 34)",
  "oklch(70% 0.2 278)",
  "oklch(94% 0.08 88)",
];

const vertexSource = `#version 300 es
in vec2 a_position;
out vec2 v_uv;

void main() {
  v_uv = a_position * 0.5 + 0.5;
  gl_Position = vec4(a_position, 0.0, 1.0);
}
`;

const fragmentSource = `#version 300 es
precision highp float;

in vec2 v_uv;
out vec4 fragColor;

uniform vec2 u_resolution;
uniform vec2 u_pointer;
uniform float u_time;
uniform float u_scroll;
uniform float u_scene;
uniform float u_energy;

#define PI 3.14159265359
#define MAX_STEPS 88

mat2 rotate2d(float angle) {
  float s = sin(angle);
  float c = cos(angle);
  return mat2(c, -s, s, c);
}

float hash12(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * 0.1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}

float hash13(vec3 p3) {
  p3 = fract(p3 * 0.1031);
  p3 += dot(p3, p3.zyx + 31.32);
  return fract((p3.x + p3.y) * p3.z);
}

float noise3(vec3 p) {
  vec3 i = floor(p);
  vec3 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);

  return mix(
    mix(mix(hash13(i + vec3(0, 0, 0)), hash13(i + vec3(1, 0, 0)), f.x),
        mix(hash13(i + vec3(0, 1, 0)), hash13(i + vec3(1, 1, 0)), f.x), f.y),
    mix(mix(hash13(i + vec3(0, 0, 1)), hash13(i + vec3(1, 0, 1)), f.x),
        mix(hash13(i + vec3(0, 1, 1)), hash13(i + vec3(1, 1, 1)), f.x), f.y),
    f.z
  );
}

float fbm(vec3 p) {
  float value = 0.0;
  float amplitude = 0.5;
  mat3 basis = mat3(
    0.00, 0.80, 0.60,
    -0.80, 0.36, -0.48,
    -0.60, -0.48, 0.64
  );
  for (int i = 0; i < 4; i++) {
    value += amplitude * noise3(p);
    p = basis * p * 2.03 + 0.13;
    amplitude *= 0.5;
  }
  return value;
}

float sdSphere(vec3 p, float radius) {
  return length(p) - radius;
}

float sdTorus(vec3 p, vec2 radius) {
  vec2 q = vec2(length(p.xz) - radius.x, p.y);
  return length(q) - radius.y;
}

float sdRoundedBox(vec3 p, vec3 bounds, float radius) {
  vec3 q = abs(p) - bounds + radius;
  return min(max(q.x, max(q.y, q.z)), 0.0) + length(max(q, 0.0)) - radius;
}

float smoothUnion(float a, float b, float radius) {
  float h = clamp(0.5 + 0.5 * (b - a) / radius, 0.0, 1.0);
  return mix(b, a, h) - radius * h * (1.0 - h);
}

float sceneDistance(int index, vec3 p) {
  if (index == 0) {
    float wave = sin(p.y * 7.0 + u_time * 1.25) * 0.035;
    wave += sin(p.x * 4.0 - u_time * 0.8) * 0.025;
    float core = sdSphere(p, 0.78 + wave);
    vec3 signal = p;
    signal.x += sin(signal.z * 3.0 + u_time) * 0.18;
    float filament = length(signal.xy) - 0.095;
    return smoothUnion(core, filament, 0.18);
  }

  if (index == 1) {
    vec3 q = p;
    q.xz *= rotate2d(u_time * 0.12);
    float shell = abs(sdSphere(q, 0.78)) - 0.045;
    float ringA = sdTorus(q, vec2(0.87, 0.045));
    q.xy *= rotate2d(PI * 0.5);
    float ringB = sdTorus(q, vec2(0.64, 0.032));
    return min(shell, min(ringA, ringB));
  }

  if (index == 2) {
    vec3 q = p;
    q.xy *= rotate2d(0.22 + sin(u_time * 0.3) * 0.08);
    q.xz *= rotate2d(-0.5);
    float frame = abs(sdRoundedBox(q, vec3(0.74), 0.1)) - 0.035;
    vec3 cell = mod(q + 0.145, 0.29) - 0.145;
    float nodes = sdRoundedBox(cell, vec3(0.032), 0.012);
    nodes = max(nodes, sdSphere(q, 0.95));
    return min(frame, nodes);
  }

  if (index == 3) {
    vec3 q = p;
    q.xy *= rotate2d(u_time * 0.09);
    float displacement = (fbm(q * 2.4 + vec3(0.0, u_time * 0.16, 0.0)) - 0.5) * 0.25;
    return sdSphere(q, 0.82 + displacement);
  }

  if (index == 4) {
    float layers = 10.0;
    for (int i = 0; i < 5; i++) {
      float fi = float(i) - 2.0;
      vec3 q = p;
      q.y += fi * 0.255;
      q.xz *= rotate2d(0.32 + fi * 0.13 + sin(u_time * 0.35) * 0.08);
      q.x += sin(u_time * 0.35 + fi) * 0.08;
      layers = min(layers, sdRoundedBox(q, vec3(0.78, 0.035, 0.57), 0.05));
    }
    return layers;
  }

  vec3 q = p;
  float breath = sin(u_time * 1.7) * 0.025 + u_energy * 0.18;
  float orb = sdSphere(q, 0.57 + breath);
  float rays = 10.0;
  for (int i = 0; i < 6; i++) {
    float angle = float(i) * PI / 3.0 + u_time * 0.06;
    vec3 r = q;
    r.xy *= rotate2d(angle);
    rays = min(rays, length(r.yz) - 0.014);
  }
  rays = max(rays, -sdSphere(q, 1.08 + u_energy * 0.5));
  return smoothUnion(orb, rays, 0.04);
}

float mapScene(vec3 p) {
  float scene = clamp(u_scene, 0.0, 5.0);
  int base = int(floor(scene));
  int next = min(base + 1, 5);
  float blend = smoothstep(0.0, 1.0, fract(scene));
  float a = sceneDistance(base, p);
  float b = sceneDistance(next, p);
  return mix(a, b, blend);
}

vec3 sceneColor(int index) {
  if (index == 0) return vec3(0.22, 0.94, 0.86);
  if (index == 1) return vec3(0.95, 0.24, 0.72);
  if (index == 2) return vec3(0.76, 0.98, 0.24);
  if (index == 3) return vec3(1.00, 0.26, 0.08);
  if (index == 4) return vec3(0.44, 0.30, 1.00);
  return vec3(1.00, 0.91, 0.58);
}

vec3 getNormal(vec3 p) {
  vec2 e = vec2(0.0015, 0.0);
  return normalize(vec3(
    mapScene(p + e.xyy) - mapScene(p - e.xyy),
    mapScene(p + e.yxy) - mapScene(p - e.yxy),
    mapScene(p + e.yyx) - mapScene(p - e.yyx)
  ));
}

vec3 spectral(float value) {
  return 0.52 + 0.48 * cos(6.28318 * (value + vec3(0.02, 0.29, 0.57)));
}

void main() {
  vec2 frag = v_uv * u_resolution;
  vec2 uv = (frag * 2.0 - u_resolution) / min(u_resolution.x, u_resolution.y);
  vec2 pointer = (u_pointer - 0.5) * 2.0;

  vec3 rayOrigin = vec3(pointer.x * 0.2, -pointer.y * 0.14, 3.25);
  vec3 rayDirection = normalize(vec3(uv, -1.72));
  rayDirection.xz *= rotate2d(pointer.x * 0.1);
  rayDirection.yz *= rotate2d(-pointer.y * 0.07);

  float travel = 0.0;
  float glow = 0.0;
  float minDistance = 10.0;
  vec3 point = vec3(0.0);
  bool hit = false;

  for (int i = 0; i < MAX_STEPS; i++) {
    point = rayOrigin + rayDirection * travel;
    point.xz *= rotate2d(u_time * 0.055 + u_scroll * 0.36);
    point.xy *= rotate2d(sin(u_time * 0.18) * 0.08);
    float distance = mapScene(point);
    minDistance = min(minDistance, abs(distance));
    glow += exp(-abs(distance) * 28.0) * 0.0035;
    if (abs(distance) < 0.0018) {
      hit = true;
      break;
    }
    travel += max(abs(distance) * 0.68, 0.008);
    if (travel > 7.0) break;
  }

  float scene = clamp(u_scene, 0.0, 5.0);
  int base = int(floor(scene));
  int next = min(base + 1, 5);
  vec3 accent = mix(sceneColor(base), sceneColor(next), smoothstep(0.0, 1.0, fract(scene)));

  float radius = length(uv);
  float angle = atan(uv.y, uv.x);
  float grid = pow(1.0 - min(1.0, abs(sin(uv.x * 23.0)) * 9.0), 6.0);
  grid += pow(1.0 - min(1.0, abs(sin(uv.y * 23.0)) * 9.0), 6.0);
  grid *= 0.018 * smoothstep(1.5, 0.15, radius);

  vec2 starCell = floor(uv * 95.0);
  float star = step(0.994, hash12(starCell));
  star *= 0.15 + 0.3 * sin(hash12(starCell + 2.0) * 10.0 + u_time * 1.8);

  vec3 color = vec3(0.008, 0.008, 0.014);
  color += accent * (0.022 / (0.1 + minDistance * minDistance * 9.0));
  color += accent * glow * 0.52;
  color += accent * grid + star;

  float halo = exp(-abs(radius - (0.8 + u_energy * 0.45)) * (12.0 - u_energy * 6.0));
  color += accent * halo * (0.018 + u_energy * 0.16);

  if (hit) {
    vec3 normal = getNormal(point);
    vec3 lightDirection = normalize(vec3(-0.45, 0.72, 0.55));
    float diffuse = max(dot(normal, lightDirection), 0.0);
    float backLight = max(dot(normal, -lightDirection), 0.0);
    float fresnel = pow(1.0 - max(dot(normal, -rayDirection), 0.0), 2.4);
    float bands = 0.5 + 0.5 * sin(point.y * 8.0 + point.x * 3.0 - u_time * 0.6);
    vec3 iridescence = spectral(fresnel * 0.55 + bands * 0.18 + u_scene * 0.07);

    vec3 surface = accent * (0.12 + diffuse * 0.58);
    surface += iridescence * fresnel * 0.9;
    surface += accent * backLight * 0.13;
    surface += vec3(1.0) * pow(max(dot(reflect(rayDirection, normal), lightDirection), 0.0), 42.0);
    surface += accent * u_energy * 0.75;
    color = mix(color, surface, min(1.0, 0.72 + fresnel * 0.32));
  }

  float scan = sin(frag.y * 1.4 + u_time * 12.0) * 0.012;
  float vignette = smoothstep(1.65, 0.24, radius);
  float grain = hash12(frag + fract(u_time) * 431.17) - 0.5;
  color *= 0.64 + 0.5 * vignette;
  color += scan * 0.2 + grain * 0.025;
  color = color / (color + vec3(0.82));
  color = pow(max(color, 0.0), vec3(0.86));

  fragColor = vec4(color, 1.0);
}
`;

function compileShader(gl, type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const message = gl.getShaderInfoLog(shader);
    gl.deleteShader(shader);
    throw new Error(`Shader compilation failed: ${message}`);
  }

  return shader;
}

function createRenderer() {
  const gl = canvas.getContext("webgl2", {
    alpha: false,
    antialias: false,
    depth: false,
    powerPreference: "high-performance",
    preserveDrawingBuffer: false,
  });

  if (!gl) return null;

  const program = gl.createProgram();
  const vertexShader = compileShader(gl, gl.VERTEX_SHADER, vertexSource);
  const fragmentShader = compileShader(gl, gl.FRAGMENT_SHADER, fragmentSource);

  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    throw new Error(`Shader link failed: ${gl.getProgramInfoLog(program)}`);
  }

  gl.deleteShader(vertexShader);
  gl.deleteShader(fragmentShader);
  gl.useProgram(program);

  const positionLocation = gl.getAttribLocation(program, "a_position");
  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([-1, -1, 3, -1, -1, 3]),
    gl.STATIC_DRAW
  );
  gl.enableVertexAttribArray(positionLocation);
  gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

  const uniforms = Object.fromEntries(
    [
      "u_resolution",
      "u_pointer",
      "u_time",
      "u_scroll",
      "u_scene",
      "u_energy",
    ].map(name => [name, gl.getUniformLocation(program, name)])
  );

  return { gl, program, uniforms };
}

const state = {
  renderer: null,
  startTime: performance.now(),
  previousTime: 0,
  activeScene: -1,
  scene: 0,
  targetScene: 0,
  pointer: { x: 0.5, y: 0.5, tx: 0.5, ty: 0.5 },
  energy: 0,
  pulseStarted: 0,
  dpr: 1,
  quality: 1,
  frames: 0,
  fpsFrames: 0,
  fpsStarted: performance.now(),
  isVisible: !document.hidden,
  lastReducedFrame: 0,
  scroll: 0,
  scrollFrame: 0,
};

function setScene(index) {
  if (state.activeScene === index) return;

  state.activeScene = index;
  state.targetScene = index;
  root.style.setProperty("--accent", accents[index]);
  body.dataset.scene = String(index);

  chapters.forEach(chapter => {
    chapter.classList.toggle(
      "is-active",
      Number(chapter.dataset.scene) === index
    );
  });

  stageLinks.forEach(link => {
    const target = link.getAttribute("href").slice(1);
    const chapter = document.getElementById(target);
    const isActive = Number(chapter?.dataset.scene) === index;
    link.classList.toggle("is-active", isActive);
    if (isActive) link.setAttribute("aria-current", "step");
    else link.removeAttribute("aria-current");
  });
}

function updateScrollState() {
  const scrollable = Math.max(
    1,
    document.documentElement.scrollHeight - innerHeight
  );
  const progress = Math.min(1, Math.max(0, scrollY / scrollable));
  state.scroll = progress;
  root.style.setProperty("--page-progress", progress.toFixed(4));
  progressElement.setAttribute(
    "aria-valuenow",
    String(Math.round(progress * 100))
  );

  const viewportFocus = innerHeight * 0.5;
  let closest = chapters[0];
  let closestDistance = Infinity;

  for (const chapter of chapters) {
    const bounds = chapter.getBoundingClientRect();
    const distance = Math.abs(bounds.top + bounds.height * 0.5 - viewportFocus);
    if (distance < closestDistance) {
      closest = chapter;
      closestDistance = distance;
    }
  }

  if (closest) setScene(Number(closest.dataset.scene));
  return progress;
}

function getDpr() {
  const memory = navigator.deviceMemory || 8;
  const cores = navigator.hardwareConcurrency || 8;
  const mobileScale = matchMedia("(max-width: 700px)").matches ? 0.82 : 1;
  const capabilityScale = memory <= 4 || cores <= 4 ? 0.8 : 1;
  return (
    Math.min(devicePixelRatio || 1, 1.65) *
    state.quality *
    mobileScale *
    capabilityScale
  );
}

function resizeRenderer() {
  if (!state.renderer) return;

  state.dpr = getDpr();
  const width = Math.max(1, Math.round(innerWidth * state.dpr));
  const height = Math.max(1, Math.round(innerHeight * state.dpr));

  if (canvas.width !== width || canvas.height !== height) {
    canvas.width = width;
    canvas.height = height;
    state.renderer.gl.viewport(0, 0, width, height);
  }

  resolutionLabel.textContent = `${width} × ${height} px`;
}

function emitFrame() {
  state.pulseStarted = performance.now();
  state.energy = 1;
  root.style.setProperty("--pulse", "1");

  const label = pulseButton.querySelector("span");
  const mutate = () => {
    label.textContent = "Frame emitted";
    window.setTimeout(() => {
      label.textContent = "Emit one frame";
      root.style.setProperty("--pulse", "0");
    }, 900);
  };

  if (typeof pulseButton.startViewTransition === "function") {
    pulseButton.startViewTransition(mutate);
  } else {
    mutate();
  }
}

function updateFps(now) {
  state.fpsFrames += 1;
  const elapsed = now - state.fpsStarted;
  if (elapsed < 900) return;

  const fps = Math.round((state.fpsFrames * 1000) / elapsed);
  fpsLabel.textContent = `${fps} FPS`;
  state.fpsFrames = 0;
  state.fpsStarted = now;

  if (state.frames > 45 && fps < 43 && state.quality > 0.7) {
    state.quality = 0.7;
    resizeRenderer();
  }
}

function render(now) {
  requestAnimationFrame(render);
  if (!state.renderer || !state.isVisible) return;

  if (prefersReducedMotion.matches && now - state.lastReducedFrame < 120)
    return;
  state.lastReducedFrame = now;

  const { gl, uniforms } = state.renderer;
  const time = (now - state.startTime) / 1000;
  const delta = Math.min(0.05, (now - state.previousTime) / 1000 || 0.016);
  state.previousTime = now;

  const scroll = state.scroll;
  const sceneEase = 1 - Math.pow(0.0008, delta);
  const pointerEase = 1 - Math.pow(0.002, delta);
  state.scene += (state.targetScene - state.scene) * sceneEase;
  state.pointer.x += (state.pointer.tx - state.pointer.x) * pointerEase;
  state.pointer.y += (state.pointer.ty - state.pointer.y) * pointerEase;
  state.energy *= Math.pow(0.05, delta);

  gl.uniform2f(uniforms.u_resolution, canvas.width, canvas.height);
  gl.uniform2f(uniforms.u_pointer, state.pointer.x, state.pointer.y);
  gl.uniform1f(uniforms.u_time, prefersReducedMotion.matches ? 0.75 : time);
  gl.uniform1f(uniforms.u_scroll, scroll);
  gl.uniform1f(uniforms.u_scene, state.scene);
  gl.uniform1f(uniforms.u_energy, state.energy);
  gl.drawArrays(gl.TRIANGLES, 0, 3);

  state.frames += 1;
  updateFps(now);
}

function initialize() {
  try {
    state.renderer = createRenderer();
  } catch (error) {
    console.warn(error);
  }

  if (state.renderer) {
    body.classList.add("has-webgl");
    rendererLabel.textContent = "WebGL 2";
    resizeRenderer();
  } else {
    rendererLabel.textContent = "CSS";
    fpsLabel.textContent = "Fallback";
    resolutionLabel.textContent = "CSS raster";
  }

  updateScrollState();
  window.setTimeout(() => {
    clearTimeout(bootDeadline);
    body.classList.add("is-ready");
  }, 650);
  requestAnimationFrame(render);
}

let resizeFrame = 0;
window.addEventListener("resize", () => {
  cancelAnimationFrame(resizeFrame);
  resizeFrame = requestAnimationFrame(() => {
    resizeRenderer();
    updateScrollState();
  });
});

window.addEventListener(
  "scroll",
  () => {
    if (state.scrollFrame) return;
    state.scrollFrame = requestAnimationFrame(() => {
      state.scrollFrame = 0;
      updateScrollState();
    });
  },
  { passive: true }
);

window.addEventListener(
  "pointermove",
  event => {
    state.pointer.tx = event.clientX / innerWidth;
    state.pointer.ty = 1 - event.clientY / innerHeight;
    root.style.setProperty(
      "--pointer-x",
      `${(state.pointer.tx * 100).toFixed(2)}%`
    );
    root.style.setProperty(
      "--pointer-y",
      `${((1 - state.pointer.ty) * 100).toFixed(2)}%`
    );
    body.classList.add("has-moved");
  },
  { passive: true }
);

window.addEventListener(
  "pointerdown",
  event => {
    if (event.target.closest("button, a, .field-notes")) return;
    state.energy = Math.max(state.energy, 0.45);
  },
  { passive: true }
);

document.addEventListener("visibilitychange", () => {
  state.isVisible = !document.hidden;
  if (state.isVisible) {
    state.previousTime = performance.now();
    state.fpsStarted = performance.now();
    state.fpsFrames = 0;
  }
});

canvas.addEventListener("webglcontextlost", event => {
  event.preventDefault();
  state.renderer = null;
  body.classList.remove("has-webgl");
  rendererLabel.textContent = "CSS";
  fpsLabel.textContent = "Context lost";
});

canvas.addEventListener("webglcontextrestored", () => {
  state.renderer = createRenderer();
  body.classList.add("has-webgl");
  rendererLabel.textContent = "WebGL 2";
  resizeRenderer();
});

pulseButton.addEventListener("click", emitFrame);

prefersReducedMotion.addEventListener("change", () => {
  state.previousTime = performance.now();
});

initialize();
