/* settings.js — menú de configuración (engrane del header).
   Secciones modulares: Mazo activo, Idioma, Tema, Tienda (placeholder) y Acerca de.
   Idioma vía i18n; tema vía store + data-theme; mazos reusa el deck picker. */

import { getTheme, setTheme } from "./store.js";
import { getLang, setLang, t } from "./i18n.js";
import { openDeckPicker } from "./decks-ui.js";
import { lockScroll, unlockScroll } from "./scroll-lock.js";

const overlay = document.getElementById("menuOverlay");
const panel = document.getElementById("menuPanel");

let cfg = { getActiveDeckName: () => "Energía pura" };

const esc = (s = "") =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const META_COLOR = { dark: "#1C1430", light: "#F3F0F5" };

/* Aplica el tema al documento (data-theme + meta theme-color) y lo persiste. */
export function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;
  const m = document.querySelector('meta[name="theme-color"]');
  if (m) m.content = META_COLOR[theme] || META_COLOR.dark;
  setTheme(theme);
}

function isOpen() { return overlay.classList.contains("open"); }

function seg(name, current, opts) {
  return `<div class="seg" data-seg="${name}">
    ${opts.map((o) =>
      `<button data-val="${o.val}" class="${o.val === current ? "active" : ""}">${esc(o.label)}</button>`
    ).join("")}
  </div>`;
}

function render() {
  const theme = getTheme();
  const lang = getLang();
  panel.innerHTML = `
    <div class="menu-head">
      <h2>${esc(t("menu.title"))}</h2>
      <button class="close" aria-label="${esc(t("sheet.close"))}" data-close>✕</button>
    </div>

    <section class="menu-sec">
      <div class="menu-label">${esc(t("menu.activeDeck"))}</div>
      <button class="menu-deck" id="menuChangeDeck">
        <span>${esc(cfg.getActiveDeckName())}</span>
        <span class="md-action">${esc(t("menu.change"))}</span>
      </button>
    </section>

    <section class="menu-sec">
      <div class="menu-label">${esc(t("menu.language"))}</div>
      ${seg("lang", lang, [{ val: "es", label: "Español" }, { val: "en", label: "English" }])}
      <p class="menu-note">${esc(t("menu.langNote"))}</p>
    </section>

    <section class="menu-sec">
      <div class="menu-label">${esc(t("menu.theme"))}</div>
      ${seg("theme", theme, [{ val: "dark", label: t("menu.dark") }, { val: "light", label: t("menu.light") }])}
    </section>

    <section class="menu-sec">
      <div class="menu-label">${esc(t("menu.store"))}</div>
      <div class="menu-store locked">
        <span class="ms-title">${esc(t("menu.storeTitle"))}</span>
        <span class="ms-sub">${esc(t("menu.storeSub"))}</span>
      </div>
    </section>

    <section class="menu-sec">
      <div class="menu-label">${esc(t("menu.about"))}</div>
      <p class="menu-about">${esc(t("menu.aboutText"))}</p>
      <p class="menu-credits">${esc(t("menu.credits"))}</p>
    </section>`;

  panel.querySelector("[data-close]").addEventListener("click", close);
  panel.querySelector("#menuChangeDeck").addEventListener("click", () => {
    close();
    openDeckPicker();
  });
  panel.querySelector('[data-seg="lang"]').addEventListener("click", (e) => {
    const b = e.target.closest("[data-val]");
    if (!b) return;
    setLang(b.dataset.val);   // i18n persiste y notifica a los listeners (re-render)
    render();                 // refresca el estado activo del toggle
  });
  panel.querySelector('[data-seg="theme"]').addEventListener("click", (e) => {
    const b = e.target.closest("[data-val]");
    if (!b) return;
    applyTheme(b.dataset.val);
    render();
  });
}

export function initSettings(options) {
  cfg = { ...cfg, ...options };
  document.getElementById("menuBtn").addEventListener("click", open);
  overlay.querySelector(".scrim").addEventListener("click", close);
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && isOpen()) close();
  });
}

export function open() {
  const wasOpen = isOpen();
  render();
  overlay.classList.add("open");
  overlay.setAttribute("aria-hidden", "false");
  if (!wasOpen) lockScroll();
}

export function close() {
  if (!isOpen()) return;
  overlay.classList.remove("open");
  overlay.setAttribute("aria-hidden", "true");
  unlockScroll();
}
