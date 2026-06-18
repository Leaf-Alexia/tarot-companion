/* decks-ui.js — selector de mazo reutilizable (única fuente que dibuja la lista).
   Lo invocan tanto el botón de Arcanos como el menú de configuración.
   Modular y escalable: añadir un mazo = soltar su JSON + entrada en index.json. */

const overlay = document.getElementById("pickerOverlay");
const sheet = document.getElementById("pickerSheet");

let cfg = { getDecks: () => [], getActiveId: () => null, onSelect: () => {}, onMore: null };

const esc = (s = "") =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

export function initDeckPicker(options) {
  cfg = { ...cfg, ...options };
  overlay.querySelector(".scrim").addEventListener("click", close);
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && isOpen()) close();
  });
}

function isOpen() { return overlay.classList.contains("open"); }

function render() {
  const decks = cfg.getDecks();
  const active = cfg.getActiveId();
  const rows = decks.map((d) => `
    <button class="deck-row ${d.id === active ? "active" : ""}" data-deck="${d.id ?? ""}">
      <span class="dr-text">
        <span class="dr-name">${esc(d.name)}</span>
        ${d.subtitle ? `<span class="dr-sub">${esc(d.subtitle)}</span>` : ""}
      </span>
      ${d.id === active ? `<span class="dr-check" aria-label="Activo">✓</span>` : ""}
    </button>`).join("");

  sheet.innerHTML = `
    <div class="picker-head">
      <h2>Elegir mazo</h2>
      <button class="close" aria-label="Cerrar" data-close>✕</button>
    </div>
    <div class="deck-rows">${rows}</div>
    <button class="deck-row locked" id="moreDecks" aria-disabled="true">
      <span class="dr-text">
        <span class="dr-name">🔒 Obtener más mazos</span>
        <span class="dr-sub">Próximamente</span>
      </span>
    </button>`;

  sheet.querySelector("[data-close]").addEventListener("click", close);
  sheet.querySelectorAll("[data-deck]").forEach((b) =>
    b.addEventListener("click", () => {
      cfg.onSelect(b.dataset.deck || null);
      close();
    })
  );
  sheet.querySelector("#moreDecks").addEventListener("click", () => {
    if (cfg.onMore) { close(); cfg.onMore(); }
  });
}

export function openDeckPicker() {
  render();
  overlay.classList.add("open");
  overlay.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

export function close() {
  if (!isOpen()) return;
  overlay.classList.remove("open");
  overlay.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}
