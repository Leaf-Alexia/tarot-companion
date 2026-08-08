/* router.js — navegación por hash + barra inferior (3 destinos).
   Vistas: #inicio #tarot #glosario
   Enlace directo a carta: #arcano/the-fool (abre Tarot · Arcanos + el sheet). */

export const VIEWS = ["inicio", "tarot", "glosario"];

let arcanoHandler = null;   // (id) => void, lo registra sheet/app
let closeSheet = null;      // () => void
let subHandler = null;      // (view, sub) => void, activa una sub-vista segmentada
let suppressHash = false;   // evita re-rutear cuando escribimos el hash nosotros

export function onArcano(handler) { arcanoHandler = handler; }
export function onSheetClose(fn) { closeSheet = fn; }
export function onSub(fn) { subHandler = fn; }

export function currentView() {
  const v = document.querySelector(".view.active");
  return v ? v.id.replace("view-", "") : "inicio";
}

export function go(view) {
  const v = VIEWS.includes(view) ? view : "inicio";
  VIEWS.forEach((x) =>
    document.getElementById("view-" + x).classList.toggle("active", x === v)
  );
  document.querySelectorAll("#nav button").forEach((b) =>
    b.classList.toggle("active", b.dataset.view === v)
  );
  document.querySelectorAll("#nav button").forEach((b) =>
    b.dataset.view === v ? b.setAttribute("aria-current", "page") : b.removeAttribute("aria-current")
  );
  window.scrollTo({ top: 0, behavior: "instant" });
}

/* Escribe el hash sin disparar el ciclo de ruteo (para abrir/cerrar el sheet). */
export function writeHash(hash) {
  suppressHash = true;
  location.hash = hash;
}

function route() {
  const h = decodeURIComponent(location.hash.slice(1));
  const m = h.match(/^arcano\/(.+)$/);
  if (m && arcanoHandler) {
    if (currentView() !== "tarot") go("tarot");
    arcanoHandler(m[1]); // el handler activa la sub-vista Arcanos y abre el sheet
    return;
  }
  if (closeSheet) closeSheet();
  // Soporta "vista/subvista" (p. ej. glosario/numerologia, tarot/spreads).
  const [view, sub] = h.split("/");
  go(VIEWS.includes(view) ? view : "inicio");
  if (sub && subHandler) subHandler(view, sub);
}

export function initRouter() {
  document.querySelectorAll("#nav button").forEach((b) =>
    b.addEventListener("click", () => { location.hash = b.dataset.view; })
  );
  window.addEventListener("hashchange", () => {
    if (suppressHash) { suppressHash = false; return; }
    route();
  });
  route();
}
