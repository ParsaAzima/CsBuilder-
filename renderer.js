"use strict";

// ─── Game Config ──────────────────────────────────────────────────────────────
const GAME_CONFIG = {
  cs2: {
    name: "Counter-Strike 2",
    defaultFile: "autoexec.cfg",
    maxRate: 786432,
    cmdrate: 64,
    updaterate: 64,
    weapons: [
      "ak47",
      "m4a1",
      "m4a1_silencer",
      "awp",
      "deagle",
      "glock",
      "usp_silencer",
      "sg556",
      "aug",
      "famas",
      "galil",
      "p90",
      "mp5sd",
      "mac10",
      "ump45",
      "xm1014",
      "nova",
      "mag7",
      "negev",
      "m249",
      "p250",
      "cz75a",
      "fiveseven",
      "tec9",
      "revolver",
      "hegrenade",
      "smokegrenade",
      "flashbang",
      "molotov",
      "decoy",
    ],
    specificCmds: ["// CS2 specific", "r_fullscreen_gamma 1.0"],
  },
  css: {
    name: "Counter-Strike: Source",
    defaultFile: "autoexec.cfg",
    maxRate: 128000,
    cmdrate: 100,
    updaterate: 100,
    weapons: [
      "ak47",
      "m4a1",
      "awp",
      "deagle",
      "glock",
      "usp",
      "sg552",
      "aug",
      "famas",
      "galil",
      "p90",
      "mp5navy",
      "mac10",
      "ump45",
      "xm1014",
      "nova",
      "m249",
      "p228",
      "fiveseven",
      "tmp",
      "hegrenade",
      "smokegrenade",
      "flashbang",
      "molotov",
    ],
    specificCmds: ["// CSS specific", "fps_max 101"],
  },
  cs16: {
    name: "Counter-Strike 1.6",
    defaultFile: "userconfig.cfg",
    maxRate: 25000,
    cmdrate: 101,
    updaterate: 101,
    weapons: [
      "ak47",
      "m4a1",
      "awp",
      "deagle",
      "glock18",
      "usp",
      "sg552",
      "aug",
      "famas",
      "galil",
      "p90",
      "mp5",
      "mac10",
      "ump45",
      "xm1014",
      "m3",
      "m249",
      "p228",
      "fiveseven",
      "tmp",
      "hegrenade",
      "smokegrenade",
      "flashbang",
    ],
    specificCmds: ["// CS 1.6 specific", "ex_interp 0.1", "rate 25000"],
  },
};

// ─── State ────────────────────────────────────────────────────────────────────
const state = {
  game: "cs2",
  binds: [
    { key: "F1", cmd: "buy ak47", desc: "Buy AK-47" },
    { key: "F2", cmd: "buy m4a1", desc: "Buy M4A1" },
    { key: "F3", cmd: "buy awp", desc: "Buy AWP" },
    { key: "MOUSE4", cmd: "+jumpthrow alias", desc: "Jump Throw" },
    { key: "SPACE", cmd: "+jump", desc: "Jump" },
  ],
  buyBinds: [],
  selectedWeapons: new Set(["ak47", "awp", "deagle"]),
  customAliases: [],
};

// ─── Game Selector ────────────────────────────────────────────────────────────
document.querySelectorAll(".game-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    const game = btn.dataset.game;
    state.game = game;
    document
      .querySelectorAll(".game-btn")
      .forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    document.body.className = `game-${game}`;
    document.getElementById("gameIndicator").textContent =
      `— ${GAME_CONFIG[game].name}`;
    applyGameDefaults(game);
    renderWeaponGrid();
    updateGameSpecificUI(game);
    updateCFG();
    showToast(`🎮 Switched to ${GAME_CONFIG[game].name}`);
  });
});

function applyGameDefaults(game) {
  const cfg = GAME_CONFIG[game];
  const rateEl = document.getElementById("rate");
  // Update rate options
  const rates =
    game === "cs2"
      ? ["25000", "80000", "128000", "196608", "786432"]
      : game === "css"
        ? ["25000", "80000", "128000", "196608"]
        : ["3500", "7500", "10000", "25000"];
  rateEl.innerHTML = rates
    .map(
      (r) =>
        `<option value="${r}"${r === (game === "cs16" ? "25000" : "128000") ? " selected" : ""}>${r}</option>`,
    )
    .join("");
}

function updateGameSpecificUI(game) {
  // CS2 share code
  const codeGroup = document.getElementById("cs2-sharecode-group");
  if (codeGroup) codeGroup.style.display = game === "cs2" ? "block" : "none";
  // CS2 outline
  const outlineRow = document.getElementById("cs2-outline-row");
  if (outlineRow) outlineRow.style.display = game === "cs2" ? "flex" : "none";
  // CS2 video extras
  const cs2VideoExtras = document.getElementById("cs2-video-extras");
  if (cs2VideoExtras) cs2VideoExtras.classList.toggle("hidden", game !== "cs2");
  // CS2 audio
  const cs2AudioExtra = document.getElementById("cs2-audio-extra");
  if (cs2AudioExtra)
    cs2AudioExtra.style.display = game === "cs2" ? "block" : "none";
}
updateGameSpecificUI("cs2");

// ─── Tab Navigation ───────────────────────────────────────────────────────────
document.querySelectorAll(".nav-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    const tab = btn.dataset.tab;
    document
      .querySelectorAll(".nav-btn")
      .forEach((b) => b.classList.remove("active"));
    document
      .querySelectorAll(".tab-panel")
      .forEach((p) => p.classList.remove("active"));
    btn.classList.add("active");
    document.getElementById("tab-" + tab).classList.add("active");
  });
});

// ─── Window Controls ──────────────────────────────────────────────────────────
if (window.electronAPI) {
  document.getElementById("btnMinimize").onclick = () =>
    window.electronAPI.minimize();
  document.getElementById("btnMaximize").onclick = () =>
    window.electronAPI.maximize();
  document.getElementById("btnClose").onclick = () =>
    window.electronAPI.close();
}

// ─── Range Sliders ────────────────────────────────────────────────────────────
document.querySelectorAll('input[type="range"]').forEach((input) => {
  const valEl = document.getElementById("val-" + input.id);
  if (valEl) {
    valEl.textContent = input.value;
    input.addEventListener("input", () => {
      valEl.textContent = parseFloat(input.value).toString();
      updateCFG();
      if (input.id.startsWith("cl_crosshair")) drawCrosshair();
      if (input.id === "sensitivity") updateEdpi();
    });
  } else {
    input.addEventListener("input", () => {
      updateCFG();
      if (input.id.startsWith("cl_crosshair")) drawCrosshair();
    });
  }
});

document
  .querySelectorAll(
    'select, input[type="checkbox"], input[type="text"], textarea',
  )
  .forEach((el) => {
    el.addEventListener("change", updateCFG);
    if (el.tagName === "TEXTAREA") el.addEventListener("input", updateCFG);
  });

// ─── eDPI Calculator ──────────────────────────────────────────────────────────
const PRO_REFS = [
  { name: "s1mple", sens: 3.09, dpi: 400 },
  { name: "NiKo", sens: 1.25, dpi: 400 },
  { name: "ZywOo", sens: 2.0, dpi: 400 },
  { name: "dev1ce", sens: 1.9, dpi: 400 },
  { name: "sh1ro", sens: 1.8, dpi: 800 },
];

function updateEdpi() {
  const dpi = parseInt(document.getElementById("dpi_value").value) || 400;
  const sens = parseFloat(document.getElementById("sensitivity").value) || 1.8;
  const edpi = Math.round(dpi * sens);
  document.getElementById("edpi-sens").textContent = sens;
  document.getElementById("edpi-result").textContent = edpi;
  const rating = document.getElementById("edpi-rating");
  if (edpi < 400)
    rating.textContent = "⚠️ Very low eDPI — may reduce precision";
  else if (edpi <= 800)
    rating.textContent = "✅ Optimal range (low sens pro style)";
  else if (edpi <= 1200) rating.textContent = "✅ Recommended range: 600–1200";
  else if (edpi <= 2000)
    rating.textContent = "⚠️ High eDPI — consider lowering";
  else rating.textContent = "❌ Very high eDPI — aim control may suffer";

  const proList = document.getElementById("edpiProList");
  const closest = [...PRO_REFS].sort(
    (a, b) => Math.abs(a.sens * a.dpi - edpi) - Math.abs(b.sens * b.dpi - edpi),
  );
  proList.innerHTML =
    `<span style="color:var(--text-dim)">Closest pros: </span>` +
    closest
      .slice(0, 3)
      .map(
        (p) =>
          `<span style="color:var(--text-secondary)">${p.name} (${p.sens * p.dpi})</span>`,
      )
      .join(", ");
}
document.getElementById("dpi_value").addEventListener("input", updateEdpi);
updateEdpi();

// ─── Sensitivity Converter ────────────────────────────────────────────────────
const SENS_MULTIPLIERS = {
  cs2: 1,
  valorant: 3.18,
  apex: 3.18,
  overwatch: 10.6,
  fortnite: 42.38,
};

document.getElementById("btnConvertSens").addEventListener("click", () => {
  const from = document.getElementById("sensConvertFrom").value;
  const input =
    parseFloat(document.getElementById("sensConvertInput").value) || 1;
  const dpi = parseInt(document.getElementById("sensConvertDPI").value) || 400;
  const mult = SENS_MULTIPLIERS[from];
  const cs2sens = (input / mult).toFixed(4);
  const edpi = Math.round(parseFloat(cs2sens) * dpi);
  const res = document.getElementById("sensConvertResult");
  res.innerHTML = `CS2/CSS Sensitivity: <b>${cs2sens}</b>\neDPI: <b>${edpi}</b>`;
  res.classList.add("visible");
  // Apply to sensitivity slider
  const sensSlider = document.getElementById("sensitivity");
  const clamped = Math.min(10, Math.max(0.1, parseFloat(cs2sens)));
  sensSlider.value = clamped;
  document.getElementById("val-sensitivity").textContent = clamped;
  updateEdpi();
  updateCFG();
  showToast("✅ Sensitivity converted & applied!");
});

// ─── Crosshair BG Selector ────────────────────────────────────────────────────
document.querySelectorAll(".bg-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    document
      .querySelectorAll(".bg-btn")
      .forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    document.getElementById("crosshairPreviewContainer").style.background =
      btn.dataset.bg;
    drawCrosshair();
  });
});

// ─── Weapon Grid ─────────────────────────────────────────────────────────────
function renderWeaponGrid() {
  const weapons = GAME_CONFIG[state.game].weapons;
  const grid = document.getElementById("weaponGrid");
  grid.innerHTML = weapons
    .map(
      (w) =>
        `<div class="weapon-item ${state.selectedWeapons.has(w) ? "selected" : ""}" data-weapon="${w}">${w}</div>`,
    )
    .join("");
  grid.querySelectorAll(".weapon-item").forEach((el) => {
    el.addEventListener("click", () => {
      const w = el.dataset.weapon;
      if (state.selectedWeapons.has(w)) state.selectedWeapons.delete(w);
      else state.selectedWeapons.add(w);
      el.classList.toggle("selected");
      updateCFG();
    });
  });
}
renderWeaponGrid();

// Weapon search filter
document.getElementById("weaponSearch").addEventListener("input", (e) => {
  const q = e.target.value.toLowerCase();
  document.querySelectorAll(".weapon-item").forEach((el) => {
    el.classList.toggle("hidden", !el.dataset.weapon.includes(q));
  });
});

// ─── Buy Binds ───────────────────────────────────────────────────────────────
function renderBuyBinds() {
  const list = document.getElementById("buyBindList");
  list.innerHTML = "";
  state.buyBinds.forEach((bb, i) => {
    const row = document.createElement("div");
    row.className = "buybind-row";
    row.innerHTML = `
      <input class="buybind-key" placeholder="KEY" value="${bb.key}"/>
      <input class="buybind-val" placeholder="weapon_xxx" value="${bb.val}"/>
      <button class="buybind-del" data-i="${i}">✕</button>
    `;
    row.querySelector(".buybind-key").addEventListener("input", (e) => {
      state.buyBinds[i].key = e.target.value;
      updateCFG();
    });
    row.querySelector(".buybind-val").addEventListener("input", (e) => {
      state.buyBinds[i].val = e.target.value;
      updateCFG();
    });
    row.querySelector(".buybind-del").addEventListener("click", () => {
      state.buyBinds.splice(i, 1);
      renderBuyBinds();
      updateCFG();
    });
    list.appendChild(row);
  });
}
document.getElementById("addBuyBind").addEventListener("click", () => {
  state.buyBinds.push({ key: "", val: "" });
  renderBuyBinds();
});
renderBuyBinds();

// ─── Key Binds ────────────────────────────────────────────────────────────────
const DEFAULT_BINDS = [
  { key: "W", cmd: "+forward", desc: "Move Forward" },
  { key: "S", cmd: "+back", desc: "Move Back" },
  { key: "A", cmd: "+moveleft", desc: "Strafe Left" },
  { key: "D", cmd: "+moveright", desc: "Strafe Right" },
  { key: "SPACE", cmd: "+jump", desc: "Jump" },
  { key: "CTRL", cmd: "+duck", desc: "Crouch" },
  { key: "MOUSE1", cmd: "+attack", desc: "Primary Fire" },
  { key: "MOUSE2", cmd: "+attack2", desc: "Secondary Fire" },
  { key: "R", cmd: "+reload", desc: "Reload" },
  { key: "E", cmd: "+use", desc: "Use / Defuse" },
  { key: "TAB", cmd: "+showscores", desc: "Scoreboard" },
];

function renderBinds() {
  const tbody = document.getElementById("bindsTableBody");
  tbody.innerHTML = "";
  state.binds.forEach((bind, i) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td><input class="bind-key-input" value="${bind.key}" placeholder="KEY"/></td>
      <td><input class="bind-cmd-input" value="${bind.cmd}" placeholder="+action or alias..."/></td>
      <td><input class="bind-desc-input" value="${bind.desc || ""}" placeholder="description..."/></td>
      <td><button class="bind-del" data-i="${i}">✕</button></td>
    `;
    tr.querySelector(".bind-key-input").addEventListener("input", (e) => {
      state.binds[i].key = e.target.value.toUpperCase();
      updateCFG();
    });
    tr.querySelector(".bind-cmd-input").addEventListener("input", (e) => {
      state.binds[i].cmd = e.target.value;
      updateCFG();
    });
    tr.querySelector(".bind-desc-input").addEventListener("input", (e) => {
      state.binds[i].desc = e.target.value;
    });
    tr.querySelector(".bind-del").addEventListener("click", () => {
      state.binds.splice(i, 1);
      renderBinds();
      updateCFG();
    });
    tbody.appendChild(tr);
  });
}
document.getElementById("addBind").addEventListener("click", () => {
  state.binds.push({ key: "", cmd: "", desc: "" });
  renderBinds();
});
document.getElementById("clearBinds").addEventListener("click", () => {
  if (confirm("Clear all binds?")) {
    state.binds = [];
    renderBinds();
    updateCFG();
  }
});
document
  .getElementById("btnImportDefaultBinds")
  .addEventListener("click", () => {
    state.binds = [...DEFAULT_BINDS];
    renderBinds();
    updateCFG();
    showToast("✅ Default binds imported!");
  });
renderBinds();

// ─── Custom Aliases ───────────────────────────────────────────────────────────
function renderCustomAliases() {
  const container = document.getElementById("customAliasList");
  container.innerHTML = "";
  state.customAliases.forEach((a, i) => {
    const div = document.createElement("div");
    div.className = "alias-item";
    div.style.marginBottom = "8px";
    div.innerHTML = `
      <div class="alias-header" style="justify-content:space-between">
        <input class="text-input" style="flex:1;margin-right:6px" placeholder="alias name" value="${a.name}"/>
        <button class="bind-del">✕</button>
      </div>
      <textarea class="custom-cmds" rows="2" placeholder="alias commands...">${a.body}</textarea>
    `;
    div.querySelector(".text-input").addEventListener("input", (e) => {
      state.customAliases[i].name = e.target.value;
      updateCFG();
    });
    div.querySelector("textarea").addEventListener("input", (e) => {
      state.customAliases[i].body = e.target.value;
      updateCFG();
    });
    div.querySelector(".bind-del").addEventListener("click", () => {
      state.customAliases.splice(i, 1);
      renderCustomAliases();
      updateCFG();
    });
    container.appendChild(div);
  });
}
document.getElementById("addCustomAlias").addEventListener("click", () => {
  state.customAliases.push({ name: "", body: "" });
  renderCustomAliases();
});
renderCustomAliases();

// ─── Practice Quick Commands ──────────────────────────────────────────────────
document.querySelectorAll(".quick-cmd-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    const cmd = btn.dataset.cmd;
    const ta = document.getElementById("customCmds");
    ta.value = (ta.value ? ta.value + "\n" : "") + cmd;
    updateCFG();
    showToast(`✅ Added: ${cmd}`);
  });
});

// ─── CFG Generator ────────────────────────────────────────────────────────────
function getVal(id) {
  return document.getElementById(id)?.value ?? "";
}
function getChecked(id) {
  return document.getElementById(id)?.checked;
}

function generateCFG() {
  const game = state.game;
  const author = getVal("configAuthor") || "Unknown";
  const name = getVal("configName") || "My Config";
  const notes = getVal("configNotes");
  const withComments = getChecked("exportComments") !== false;
  const withHeader = getChecked("exportHeader") !== false;
  const withPractice = getChecked("exportPractice");
  const now = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  const lines = [];
  const sec = (label) => {
    if (withComments)
      lines.push(
        `\n// ─── ${label} ${"─".repeat(Math.max(0, 44 - label.length))}`,
      );
  };
  const add = (...cmds) => lines.push(...cmds);

  if (withHeader) {
    add(
      `// ╔═══════════════════════════════════════════════╗`,
      `// ║   CS CFG Builder Pro — ${now.padEnd(22)}║`,
      `// ║   Game   : ${game.toUpperCase().padEnd(36)}║`,
      `// ║   Config : ${name.padEnd(36)}║`,
      `// ║   Author : ${author.padEnd(36)}║`,
      `// ╚═══════════════════════════════════════════════╝`,
    );
    if (notes) add(`// Notes: ${notes}`);
  }

  // Crosshair
  sec("CROSSHAIR");
  add(
    `cl_crosshairstyle ${getVal("cl_crosshairstyle")}`,
    `cl_crosshairsize ${getVal("cl_crosshairsize")}`,
    `cl_crosshairgap ${getVal("cl_crosshairgap")}`,
    `cl_crosshairthickness ${getVal("cl_crosshairthickness")}`,
    `cl_crosshaircolor ${getVal("cl_crosshaircolor")}`,
    `cl_crosshaircolor_r ${getVal("cl_crosshaircolor_r")}`,
    `cl_crosshaircolor_g ${getVal("cl_crosshaircolor_g")}`,
    `cl_crosshaircolor_b ${getVal("cl_crosshaircolor_b")}`,
    `cl_crosshairalpha ${getVal("cl_crosshairalpha")}`,
    `cl_crosshairusealpha ${getChecked("cl_crosshairusealpha") ? 1 : 0}`,
    `cl_crosshairdot ${getChecked("cl_crosshairdot") ? 1 : 0}`,
    `cl_show_observer_crosshair ${getChecked("cl_show_observer_crosshair") ? 1 : 0}`,
  );
  if (game === "cs2") {
    add(
      `cl_crosshair_drawoutline ${getChecked("cl_crosshair_drawoutline") ? 1 : 0}`,
      `cl_crosshair_outlinethickness ${getVal("cl_crosshair_outlinethickness")}`,
    );
  }

  // Mouse
  sec("MOUSE");
  add(
    `sensitivity ${getVal("sensitivity")}`,
    `zoom_sensitivity_ratio_mouse ${getVal("zoom_sensitivity_ratio")}`,
    `m_rawinput ${getChecked("m_rawinput") ? 1 : 0}`,
    `m_filter ${getChecked("m_filter") ? 1 : 0}`,
    `m_customaccel ${getChecked("m_customaccel") ? 1 : 0}`,
    `m_pitch ${parseFloat(getVal("m_pitch")).toFixed(3)}`,
    `m_yaw ${parseFloat(getVal("m_yaw")).toFixed(3)}`,
  );

  // Viewmodel / Movement
  sec("VIEWMODEL / MOVEMENT");
  add(
    `fov_desired ${getVal("fov_desired")}`,
    `viewmodel_fov ${getVal("viewmodel_fov")}`,
    `viewmodel_offset_x ${getVal("viewmodel_offset_x")}`,
    `viewmodel_offset_y ${getVal("viewmodel_offset_y")}`,
    `viewmodel_offset_z ${getVal("viewmodel_offset_z")}`,
    `cl_bobamt_lat ${getVal("cl_bobamt_lat")}`,
    `cl_bobamt_vert ${getVal("cl_bobamt_vert")}`,
    `cl_bobcycle ${getVal("cl_bobcycle")}`,
  );
  if (getChecked("cl_bob_disable")) add(`cl_bob_lower_amt 0`);

  // Video
  sec("VIDEO");
  add(
    `fps_max ${getVal("fps_max")}`,
    `mat_monitorgamma ${getVal("mat_monitorgamma")}`,
    `mat_picmip ${getVal("mat_picmip")}`,
    `mat_antialias ${getVal("mat_antialias")}`,
    `mat_vsync ${getChecked("mat_vsync") ? 1 : 0}`,
    `mat_queue_mode ${getChecked("mat_queue_mode") ? -1 : 0}`,
  );
  if (getChecked("mat_motion_blur_enabled")) add(`mat_motion_blur_enabled 0`);
  if (getChecked("r_shadows")) add(`r_shadows 0`);
  if (getChecked("r_lod")) add(`r_lod 2`);
  if (game === "cs2") add(`r_fullscreen_gamma ${getVal("r_fullscreen_gamma")}`);

  // Audio
  sec("AUDIO");
  add(
    `volume ${getVal("volume")}`,
    `snd_musicvolume ${getVal("snd_musicvolume")}`,
    `voice_scale ${getVal("voice_scale")}`,
    `snd_mixahead ${getVal("snd_mixahead")}`,
  );
  if (getChecked("voice_enable_disable")) add(`voice_enable 0`);
  if (game === "cs2") add(`snd_hwcompat ${getVal("snd_hwcompat")}`);

  // Network
  sec("NETWORK");
  add(
    `rate ${getVal("rate")}`,
    `cl_cmdrate ${getVal("cl_cmdrate")}`,
    `cl_updaterate ${getVal("cl_updaterate")}`,
    `cl_interp ${parseFloat(getVal("cl_interp")).toFixed(3)}`,
    `cl_interp_ratio ${getVal("cl_interp_ratio")}`,
    `cl_lagcompensation ${getVal("cl_lagcompensation")}`,
  );

  // HUD
  sec("HUD");
  add(
    `cl_radar_rotate ${getChecked("cl_radar_rotate") ? 1 : 0}`,
    `cl_radar_always_centered ${getChecked("cl_radar_always_centered") ? 1 : 0}`,
    `cl_radar_scale ${getVal("cl_radar_scale")}`,
    `cl_showfps ${getChecked("cl_showfps") ? 1 : 0}`,
    `net_graph ${getChecked("net_graph") ? 1 : 0}`,
    `net_graphpos ${getVal("net_graphpos")}`,
    `hud_scaling ${getVal("hud_scaling")}`,
  );

  // Weapon
  sec("WEAPON");
  add(
    `cl_autowepswitch ${getChecked("cl_autowepswitch") ? 1 : 0}`,
    `cl_righthand ${getVal("cl_righthand")}`,
    `hud_fastswitch ${getChecked("hud_fastswitch") ? 1 : 0}`,
  );

  // Aliases
  const aliasEntries = [];
  if (getChecked("alias_jumpthrow")) {
    const k = document.getElementById("bind_jumpthrow")?.value || "ALT";
    aliasEntries.push(`alias "+jumpthrow" "+jump;-attack"`);
    aliasEntries.push(`alias "-jumpthrow" "-jump"`);
    aliasEntries.push(`bind "${k}" "+jumpthrow"`);
  }
  if (getChecked("alias_quickpeek")) {
    const k = document.getElementById("bind_quickpeek")?.value || "MOUSE5";
    aliasEntries.push(`alias "+qpeek" "+right;+attack"`);
    aliasEntries.push(`alias "-qpeek" "-right;-attack"`);
    aliasEntries.push(`bind "${k}" "+qpeek"`);
  }
  if (getChecked("alias_buyscript")) {
    const k = document.getElementById("bind_buyscript")?.value || "KP_0";
    aliasEntries.push(
      `alias "fullbuy" "buy ak47; buy m4a1; buy awp; buy vesthelm; buy defuser"`,
    );
    aliasEntries.push(`bind "${k}" "fullbuy"`);
  }
  if (getChecked("alias_crouchjump")) {
    const k = document.getElementById("bind_crouchjump")?.value || "SPACE";
    aliasEntries.push(`alias "+crouchjump" "+jump;+duck"`);
    aliasEntries.push(`alias "-crouchjump" "-jump;-duck"`);
    aliasEntries.push(`bind "${k}" "+crouchjump"`);
  }
  if (getChecked("alias_volumetoggle")) {
    const k = document.getElementById("bind_volumetoggle")?.value || "KP_MINUS";
    aliasEntries.push(`alias "volupon" "volume 0.8; alias voltoggle voludown"`);
    aliasEntries.push(`alias "voludown" "volume 0; alias voltoggle volupon"`);
    aliasEntries.push(`alias "voltoggle" "volupon"`);
    aliasEntries.push(`bind "${k}" "voltoggle"`);
  }
  state.customAliases.forEach((a) => {
    if (a.name && a.body) aliasEntries.push(`${a.body}`);
  });
  if (aliasEntries.length > 0) {
    sec("ALIASES & SCRIPTS");
    add(...aliasEntries);
  }

  // Key Binds
  if (state.binds.length > 0) {
    sec("KEY BINDS");
    state.binds.forEach((b) => {
      if (b.key && b.cmd) {
        if (withComments && b.desc) lines.push(`// ${b.desc}`);
        lines.push(`bind "${b.key}" "${b.cmd}"`);
      }
    });
  }

  // Buy Binds
  if (state.buyBinds.length > 0) {
    sec("BUY BINDS");
    state.buyBinds.forEach((bb) => {
      if (bb.key && bb.val) lines.push(`bind "${bb.key}" "buy ${bb.val}"`);
    });
  }

  // Quick Buy
  if (state.selectedWeapons.size > 0) {
    sec("QUICK BUY");
    lines.push(
      `alias "quickbuy" "buy ${[...state.selectedWeapons].join("; buy ")}"`,
    );
  }

  // Practice config
  if (withPractice) {
    sec("PRACTICE SERVER CONFIG");
    if (getChecked("sv_infinite_ammo")) add(`sv_infinite_ammo 1`);
    if (getChecked("mp_respawn_on_death_ct")) {
      add(`mp_respawn_on_death_ct 1`, `mp_respawn_on_death_t 1`);
    }
    if (getChecked("sv_showimpacts")) add(`sv_showimpacts 1`);
    if (getChecked("sv_grenade_trajectory"))
      add(
        game === "cs2"
          ? `sv_grenade_trajectory_prac_pipreview 1`
          : `sv_grenade_trajectory 1`,
      );
    if (getChecked("sv_buy_anywhere")) add(`sv_buy_anywhere 1`);
    if (getChecked("mp_buytime_unlimited")) add(`mp_buytime 9999`);
    if (getChecked("bot_kick_all")) add(`bot_kick`);
    if (getChecked("bot_stop")) add(`bot_stop 1`);
    add(
      `mp_startmoney ${getVal("mp_startmoney")}`,
      `mp_roundtime_defuse ${getVal("mp_roundtime")}`,
      `mp_freezetime 0`,
      `bot_difficulty ${getVal("bot_difficulty")}`,
    );
  }

  // Custom Commands
  const custom = getVal("customCmds").trim();
  if (custom) {
    sec("CUSTOM COMMANDS");
    add(custom);
  }

  if (withComments) {
    add(
      ``,
      `// ─── Generated by CS CFG Builder Pro v3.0 ──────`,
      `// ─── Game: ${GAME_CONFIG[game].name.padEnd(35)}──`,
    );
  }

  return lines.join("\n");
}

// ─── Render CFG ───────────────────────────────────────────────────────────────
function updateCFG() {
  const raw = generateCFG();
  const output = document.getElementById("cfgOutput");
  const html = raw
    .split("\n")
    .map((line) => {
      const trim = line.trim();
      if (trim.startsWith("//"))
        return `<span class="cfg-comment">${esc(line)}</span>`;
      if (!trim) return "";
      const parts = line.match(/^(\S+)\s+(.+)$/);
      if (parts)
        return `<span class="cfg-cmd">${esc(parts[1])}</span> <span class="cfg-val">${esc(parts[2])}</span>`;
      return `<span class="cfg-cmd">${esc(line)}</span>`;
    })
    .filter((l) => l !== undefined)
    .join("\n");
  output.innerHTML = html;
  document.getElementById("lineCount").textContent =
    raw.split("\n").length + " lines";
  document.getElementById("charCount").textContent = raw.length + " chars";
}
function esc(s) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

// ─── Crosshair Canvas ─────────────────────────────────────────────────────────
function drawCrosshair() {
  const canvas = document.getElementById("crosshairCanvas");
  const ctx = canvas.getContext("2d");
  const w = canvas.width,
    h = canvas.height;
  ctx.clearRect(0, 0, w, h);
  const bg =
    document.getElementById("crosshairPreviewContainer").style.background ||
    "#1a2030";
  ctx.fillStyle = bg || "#1a2030";
  ctx.fillRect(0, 0, w, h);

  const size =
    parseFloat(document.getElementById("cl_crosshairsize").value) * 6 + 6;
  const gap =
    parseFloat(document.getElementById("cl_crosshairgap").value) * 4 + 4;
  const thick =
    parseFloat(document.getElementById("cl_crosshairthickness").value) * 2 + 1;
  const r = parseInt(document.getElementById("cl_crosshaircolor_r").value);
  const g = parseInt(document.getElementById("cl_crosshaircolor_g").value);
  const b = parseInt(document.getElementById("cl_crosshaircolor_b").value);
  const a = parseInt(document.getElementById("cl_crosshairalpha").value) / 255;
  const dot = document.getElementById("cl_crosshairdot").checked;
  const outline =
    state.game === "cs2" &&
    document.getElementById("cl_crosshair_drawoutline")?.checked;

  const cx = w / 2,
    cy = h / 2;

  if (outline) {
    ctx.strokeStyle = `rgba(0,0,0,${a})`;
    ctx.lineWidth = thick + 2;
    ctx.lineCap = "square";
    ctx.beginPath();
    ctx.moveTo(cx - size - gap, cy);
    ctx.lineTo(cx - gap, cy);
    ctx.moveTo(cx + gap, cy);
    ctx.lineTo(cx + size + gap, cy);
    ctx.moveTo(cx, cy - size - gap);
    ctx.lineTo(cx, cy - gap);
    ctx.moveTo(cx, cy + gap);
    ctx.lineTo(cx, cy + size + gap);
    ctx.stroke();
  }

  ctx.strokeStyle = `rgba(${r},${g},${b},${a})`;
  ctx.lineWidth = thick;
  ctx.lineCap = "square";
  ctx.beginPath();
  ctx.moveTo(cx - size - gap, cy);
  ctx.lineTo(cx - gap, cy);
  ctx.moveTo(cx + gap, cy);
  ctx.lineTo(cx + size + gap, cy);
  ctx.moveTo(cx, cy - size - gap);
  ctx.lineTo(cx, cy - gap);
  ctx.moveTo(cx, cy + gap);
  ctx.lineTo(cx, cy + size + gap);
  ctx.stroke();

  if (dot) {
    ctx.fillStyle = `rgba(${r},${g},${b},${a})`;
    ctx.fillRect(cx - thick / 2, cy - thick / 2, thick, thick);
  }
}
drawCrosshair();

// ─── Presets ──────────────────────────────────────────────────────────────────
const PRESETS = {
  pro: {
    cl_crosshairstyle: "4",
    cl_crosshairsize: "1",
    cl_crosshairgap: "-2",
    cl_crosshairthickness: "0.5",
    cl_crosshaircolor: "5",
    cl_crosshaircolor_r: "0",
    cl_crosshaircolor_g: "255",
    cl_crosshaircolor_b: "0",
    cl_crosshairalpha: "255",
    sensitivity: "1.0",
    fps_max: "400",
    rate: "786432",
    cl_cmdrate: "128",
    cl_updaterate: "128",
    cl_interp: "0",
    cl_interp_ratio: "1",
    volume: "0.6",
    snd_musicvolume: "0",
    mat_picmip: "2",
    mat_antialias: "0",
    mat_monitorgamma: "1.6",
  },
  low: {
    cl_crosshairstyle: "2",
    sensitivity: "2.0",
    fps_max: "120",
    mat_picmip: "2",
    mat_antialias: "0",
    mat_monitorgamma: "2.0",
    rate: "80000",
    cl_cmdrate: "64",
    cl_updaterate: "64",
    volume: "0.7",
    snd_musicvolume: "0",
  },
  faceit: {
    cl_crosshairstyle: "4",
    cl_crosshairsize: "2",
    cl_crosshairgap: "-3",
    cl_crosshairthickness: "1",
    cl_crosshaircolor: "5",
    cl_crosshaircolor_r: "255",
    cl_crosshaircolor_g: "255",
    cl_crosshaircolor_b: "0",
    cl_crosshairalpha: "255",
    sensitivity: "1.5",
    fps_max: "999",
    rate: "786432",
    cl_cmdrate: "128",
    cl_updaterate: "128",
    cl_interp: "0",
    cl_interp_ratio: "1",
    volume: "0.8",
    snd_musicvolume: "0",
    mat_picmip: "2",
    mat_antialias: "0",
    mat_monitorgamma: "1.6",
  },
  casual: {
    cl_crosshairstyle: "2",
    sensitivity: "2.5",
    fps_max: "200",
    mat_picmip: "0",
    mat_antialias: "2",
    mat_monitorgamma: "1.8",
    rate: "128000",
    cl_cmdrate: "64",
    cl_updaterate: "64",
    volume: "0.8",
    snd_musicvolume: "0.3",
  },
  default: {
    cl_crosshairstyle: "2",
    cl_crosshairsize: "2",
    cl_crosshairgap: "1",
    cl_crosshairthickness: "0.5",
    sensitivity: "1.8",
    fps_max: "300",
    rate: "128000",
    cl_cmdrate: "128",
    cl_updaterate: "128",
    volume: "0.8",
    mat_picmip: "1",
  },
};

document.querySelectorAll(".preset-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    const preset = PRESETS[btn.dataset.preset];
    if (!preset) return;
    Object.entries(preset).forEach(([k, v]) => {
      const el = document.getElementById(k);
      if (el) {
        el.value = v;
        const badge = document.getElementById("val-" + k);
        if (badge) badge.textContent = v;
      }
    });
    updateCFG();
    drawCrosshair();
    updateEdpi();
    showToast("✅ Preset applied: " + btn.textContent.trim());
  });
});

// ─── Save / Load / Copy ───────────────────────────────────────────────────────
document.getElementById("btnSave").addEventListener("click", async () => {
  const content = generateCFG();
  if (window.electronAPI) {
    const res = await window.electronAPI.saveCfg(content);
    if (res.success) {
      document.getElementById("currentFile").textContent = res.path
        .split(/[\\/]/)
        .pop();
      showToast("💾 Saved: " + res.path.split(/[\\/]/).pop());
    } else if (res.error) showToast("❌ " + res.error, true);
  } else {
    downloadFile(content, (getVal("configName") || "autoexec") + ".cfg");
    showToast("💾 Downloading CFG...");
  }
});

document.getElementById("btnLoad").addEventListener("click", async () => {
  if (window.electronAPI) {
    const res = await window.electronAPI.loadCfg();
    if (res.success) showToast("📂 Loaded: " + res.path.split(/[\\/]/).pop());
  } else {
    showToast("📂 Load available in desktop app", true);
  }
});

document.getElementById("btnCopy").addEventListener("click", copyAll);
document.getElementById("btnCopyAll").addEventListener("click", copyAll);
async function copyAll() {
  try {
    await navigator.clipboard.writeText(generateCFG());
    showToast("📋 CFG copied to clipboard!");
  } catch (e) {
    showToast("❌ Copy failed", true);
  }
}

function downloadFile(content, filename) {
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([content], { type: "text/plain" }));
  a.download = filename;
  a.click();
}

// ─── Toast ────────────────────────────────────────────────────────────────────
let toastTimer;
function showToast(msg, isError = false) {
  const t = document.getElementById("toast");
  t.textContent = msg;
  t.className = "toast show" + (isError ? " error" : "");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove("show"), 2800);
}

// ─── Init ─────────────────────────────────────────────────────────────────────
updateCFG();
