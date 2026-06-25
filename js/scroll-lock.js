/* scroll-lock.js — bloqueo de scroll del fondo compartido por todos los overlays.
   Varios overlays pueden solaparse (p. ej. el menú sobre el detail sheet). Si cada
   uno escribiera document.body.style.overflow por su cuenta, al cerrar uno se
   desbloquearía el scroll aunque otro siga abierto (desincronización). Un contador
   de referencias mantiene el bloqueo mientras quede ≥1 overlay abierto y solo lo
   libera cuando se cierran todos. */

let count = 0;

export function lockScroll() {
  count++;
  document.body.style.overflow = "hidden";
}

export function unlockScroll() {
  count = Math.max(0, count - 1);
  if (count === 0) document.body.style.overflow = "";
}
