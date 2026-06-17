/* router.js — navegación por hash + cambio de pestañas.
   Vistas: #inicio #uso #tiradas #arcanos #numerologia
   Enlace directo a carta: #arcano/the-fool (URLs compartibles). */

export const VIEWS = ["inicio", "uso", "tiradas", "arcanos", "numerologia"];

let arcanoHandler = null;   // (id) => void, lo registra sheet/app
let closeSheet = null;      // () => void
let suppressHash = false;   // evita re-rutear cuando escribimos el hash nosotros

export function onArcano(handler) { arcanoHandler = handler; }
export function onSheetClose(fn) { closeSheet = fn; }

export function currentView() {
  const v = document.querySelector(".view.active");
  return v ? v.id.replace("view-", "") : "inicio";
}

export function go(view) {
  const v = VIEWS.includes(view) ? view : "inicio";
  VIEWS.forEach((x) =>
    document.getElementById("view-" + x).classList.toggle("active", x === v)
  );
  document.querySelectorAll("#tabs button").forEach((b) =>
    b.classList.toggle("active", b.dataset.view === v)
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
    if (currentView() !== "arcanos") go("arcanos");
    arcanoHandler(m[1]);
    return;
  }
  if (closeSheet) closeSheet();
  go(VIEWS.includes(h) ? h : "inicio");
}

export function initRouter() {
  document.querySelectorAll("#tabs button").forEach((b) =>
    b.addEventListener("click", () => { location.hash = b.dataset.view; })
  );
  window.addEventListener("hashchange", () => {
    if (suppressHash) { suppressHash = false; return; }
    route();
  });
  route();
}
