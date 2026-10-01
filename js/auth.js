/* SPORTSMEN HR MANAGEMENT SYSTEM — Auth & shared UI helpers
   NOTE: This is a frontend prototype. Replace with server-side authentication
   and a secure backend before any real deployment. */
"use strict";
const SESSION_KEY = "shms_session";
const THEME_KEY = "shms_theme";

const DEMO_USER = { username:"admin", password:"admin123", name:"System Administrator", role:"Administrator" };

function getSession(){ try{ return JSON.parse(localStorage.getItem(SESSION_KEY)); }catch(e){ return null; } }
function setSession(s){ localStorage.setItem(SESSION_KEY, JSON.stringify(s)); }
function clearSession(){ localStorage.removeItem(SESSION_KEY); }

/* Require login on protected pages */
function requireAuth(){
  const s = getSession();
  if(!s){ window.location.href = "index.html"; return null; }
  return s;
}
function doLogin(username, password, remember){
  if(username === DEMO_USER.username && password === DEMO_USER.password){
    setSession({ name: DEMO_USER.name, role: DEMO_USER.role, loginAt: new Date().toISOString() });
    if(remember) localStorage.setItem("shms_remember", username);
    return true;
  }
  return false;
}
function logout(){ clearSession(); window.location.href = "index.html"; }

/* ---------- Theme ---------- */
function applyTheme(t){ document.documentElement.setAttribute("data-theme", t); localStorage.setItem(THEME_KEY, t); }
function toggleTheme(){
  const cur = localStorage.getItem(THEME_KEY) || "light";
  applyTheme(cur === "dark" ? "light" : "dark");
}
(function initTheme(){
  const t = localStorage.getItem(THEME_KEY) || "light";
  document.documentElement.setAttribute("data-theme", t);
})();

/* ---------- Toast ---------- */
function toast(msg, type){
  type = type || "success";
  let box = document.getElementById("toast-box");
  if(!box){ box = document.createElement("div"); box.id = "toast-box"; document.body.appendChild(box); }
  const icons = { success:"✓", err:"✕", info:"ℹ" };
  const el = document.createElement("div");
  el.className = "toast " + (type === "success" ? "" : type);
  el.innerHTML = '<b style="font-size:16px">'+(icons[type]||"✓")+'</b><span>'+escapeHtml(msg)+'</span>';
  box.appendChild(el);
  setTimeout(() => { el.classList.add("out"); setTimeout(() => el.remove(), 350); }, 3200);
}

/* ---------- Confirm modal ---------- */
function confirmModal(message, onConfirm){
  let ov = document.getElementById("confirm-overlay");
  if(!ov){
    ov = document.createElement("div");
    ov.id = "confirm-overlay"; ov.className = "modal-overlay";
    ov.innerHTML = '<div class="modal"><h3>⚠ Confirm Action</h3><p id="confirm-msg"></p>'+
      '<div class="modal-btns"><button class="btn btn-outline" id="confirm-cancel">Cancel</button>'+
      '<button class="btn btn-danger" id="confirm-ok">Delete</button></div></div>';
    document.body.appendChild(ov);
  }
  document.getElementById("confirm-msg").textContent = message;
  ov.classList.add("show");
  const ok = document.getElementById("confirm-ok"), cancel = document.getElementById("confirm-cancel");
  const close = () => { ov.classList.remove("show"); ok.onclick = cancel.onclick = ov.onclick = null; };
  ok.onclick = () => { close(); if(onConfirm) onConfirm(); };
  cancel.onclick = close;
  ov.onclick = (e) => { if(e.target === ov) close(); };
}

/* ---------- Loading ---------- */
function showLoader(){ let l = document.getElementById("loader"); if(!l){ l = document.createElement("div"); l.id="loader"; l.className="loader-overlay"; l.innerHTML='<div class="spinner"></div>'; document.body.appendChild(l);} l.classList.add("show"); }
function hideLoader(){ const l = document.getElementById("loader"); if(l) l.classList.remove("show"); }
function withLoader(fn, ms){ showLoader(); setTimeout(() => { fn(); hideLoader(); }, ms || 500); }

/* ---------- Chart helper (canvas bar chart, no external library) ---------- */
function drawBarChart(canvas, labels, values, opts){
  opts = opts || {};
  const dpr = window.devicePixelRatio || 1;
  const W = canvas.clientWidth || 560, H = opts.height || 260;
  canvas.width = W * dpr; canvas.height = H * dpr;
  const ctx = canvas.getContext("2d"); ctx.scale(dpr, dpr);
  const dark = document.documentElement.getAttribute("data-theme") === "dark";
  const grid = dark ? "#24375a" : "#e2e8f2";
  const txtC = dark ? "#8fa0b8" : "#68788f";
  const max = Math.max.apply(null, values.concat([1]));
  const padL = 32, padB = 46, padT = 14, padR = 8;
  const cw = (W - padL - padR) / labels.length;
  const bh = H - padT - padB;
  /* gridlines */
  ctx.strokeStyle = grid; ctx.fillStyle = txtC; ctx.font = "10.5px Segoe UI"; ctx.textAlign = "right";
  for(let i = 0; i <= 4; i++){
    const y = padT + bh - (bh * i / 4);
    ctx.beginPath(); ctx.moveTo(padL, y); ctx.lineTo(W - padR, y); ctx.stroke();
    ctx.fillText(String(Math.round(max * i / 4)), padL - 6, y + 3.5);
  }
  labels.forEach((lab, i) => {
    const v = values[i];
    const bw = Math.min(42, cw * 0.55);
    const x = padL + cw * i + (cw - bw) / 2;
    const h = Math.max(3, (v / max) * bh);
    const y = padT + bh - h;
    const g = ctx.createLinearGradient(0, y, 0, y + h);
    g.addColorStop(0, "#c9a227"); g.addColorStop(1, "#2b6cb0");
    ctx.fillStyle = g;
    roundRect(ctx, x, y, bw, h, 5); ctx.fill();
    ctx.fillStyle = txtC; ctx.textAlign = "center"; ctx.font = "10px Segoe UI";
    wrapText(ctx, lab, padL + cw * i + cw / 2, H - padB + 13, cw - 4, 11);
    ctx.fillStyle = dark ? "#e6ecf5" : "#233247"; ctx.font = "bold 11px Segoe UI";
    if(v > 0) ctx.fillText(String(v), padL + cw * i + cw / 2, y - 5);
  });
}
function roundRect(ctx, x, y, w, h, r){
  ctx.beginPath();
  ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath();
}
function wrapText(ctx, text, x, y, maxW, lh){
  const words = String(text).split(" "); let line = "", yy = y;
  for(let n = 0; n < words.length; n++){
    const test = line + words[n] + " ";
    if(ctx.measureText(test).width > maxW && n > 0){ ctx.fillText(line.trim(), x, yy); line = words[n] + " "; yy += lh; }
    else line = test;
  }
  ctx.fillText(line.trim(), x, yy);
}

/* ---------- Shared page wiring (topbar, sidebar, user menu, date) ---------- */
function wireApp(activeNav){
  const session = requireAuth(); if(!session) return;
  const uname = document.querySelectorAll(".js-uname");
  uname.forEach(el => el.textContent = session.name);
  const urole = document.querySelectorAll(".js-urole");
  urole.forEach(el => el.textContent = session.role);
  /* date */
  const d = new Date();
  const dateStr = d.toLocaleDateString("en-US", { weekday:"long", year:"numeric", month:"long", day:"numeric" });
  const dateEl = document.getElementById("topbar-date"); if(dateEl) dateEl.textContent = dateStr;
  /* active nav */
  if(activeNav) document.querySelectorAll('.nav a[data-nav="'+activeNav+'"]').forEach(a => a.classList.add("active"));
  /* sidebar mobile */
  const ham = document.getElementById("hamburger"), sb = document.getElementById("sidebar");
  if(ham && sb){
    let ov = null;
    ham.addEventListener("click", () => {
      sb.classList.toggle("open");
      if(sb.classList.contains("open")){
        ov = document.createElement("div"); ov.className = "sidebar-overlay show";
        ov.onclick = () => { sb.classList.remove("open"); ov.remove(); ov = null; };
        document.body.appendChild(ov);
      } else if(ov){ ov.remove(); ov = null; }
    });
    sb.querySelectorAll("a").forEach(a => a.addEventListener("click", () => { if(window.innerWidth <= 900){ sb.classList.remove("open"); if(ov){ ov.remove(); ov = null; } } }));
  }
  /* user menu */
  const chip = document.getElementById("user-chip"), menu = document.getElementById("user-menu");
  if(chip && menu){
    chip.addEventListener("click", (e) => { e.stopPropagation(); menu.classList.toggle("show"); });
    document.addEventListener("click", (e) => { if(!menu.contains(e.target)) menu.classList.remove("show"); });
  }
  /* theme buttons */
  document.querySelectorAll(".js-theme-toggle").forEach(b => b.addEventListener("click", () => {
    toggleTheme();
    document.querySelectorAll(".js-theme-toggle").forEach(x => x.textContent = (localStorage.getItem(THEME_KEY)==="dark" ? "☀" : "🌙"));
    if(window.__redrawCharts) window.__redrawCharts();
  }));
  document.querySelectorAll(".js-theme-toggle").forEach(x => x.textContent = (localStorage.getItem(THEME_KEY)==="dark" ? "☀" : "🌙"));
  /* logout */
  document.querySelectorAll(".js-logout").forEach(b => b.addEventListener("click", (e) => {
    e.preventDefault();
    confirmModal("Are you sure you want to log out of the system?", logout);
  }));
}
function setThemeIcon(){}
