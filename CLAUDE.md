# CLAUDE.md — Tarot Companion App

> Lee este archivo completo al inicio de cada sesión antes de tocar cualquier archivo del proyecto.
> Solo puedes escribir dentro de `<progress>`. El resto del documento es de solo lectura.

---

<project_context>

## Visión del producto

**Tarot Companion** es una PWA (Progressive Web App) que funciona como guía de referencia de tarot — sin conexión, sin IA generativa, sin registro obligatorio. Es un diccionario interactivo de arcanos, tiradas y numerología.

### Objetivo de distribución
Publicar en **Google Play Store** via **Trusted Web Activity (TWA)** usando Bubblewrap. La app vive en GitHub Pages como host y el APK es un wrapper que apunta a esa URL. No se requiere código nativo. Lighthouse Performance ≥ 80 es requisito de Google para aceptar el TWA.

### Diferenciador central — arquitectura por capas
1. **Energía pura** del arcano (universal, sin mazo, gratis permanentemente)
2. **Matiz del mazo** (cómo ese arcano se expresa en un deck específico)

Esta separación es el núcleo del producto. Ninguna app del mercado hace esto bien. No comprometerla.

### Propuesta de valor principal
Funciona **completamente offline**. Es la razón de existir de la app. Toda decisión técnica debe preservar esto. Una feature que requiera conexión es aceptable solo si degrada con gracia cuando no hay red.

### Tono y posicionamiento
Guía y acompañante en el camino de la lectura — no oráculo, no predicciones, no IA. El vínculo emocional con la usuaria (segmento principal: mujeres 25–40, lectoras de tarot) es una prioridad de diseño, no un adorno.

### Modelo de negocio objetivo
- **Base gratuita:** energía pura de los 78 arcanos + 1 mazo gratis (RWS Clásico 1909)
- **Expansión de pago:** mazos adicionales (IAP en Play Store, Fase 3)
- **Por encargo:** formulario de contacto para solicitar mazos específicos (Fase 2)
- **Colaboración con artistas:** revenue share con creadores de mazos independientes (Fase 3)

### Derechos y licencias — decisiones tomadas
- Mazo RWS: usar solo imágenes **originales B&N de Pamela Colman Smith (1909)**, dominio público en EE.UU. desde 1966
- Nombre del mazo: **"Tarot Waite-Smith"** o **"RWS Clásico 1909"** — nunca "Rider-Waite" (marca registrada de US Games)
- Contenido del Yōkai Tarot (historias, kanji, traducciones): propiedad de la autora del proyecto — no reutilizar para otras secciones

### Proyecto de referencia
Existe una versión funcional en producción: **Yōkai Tarot Manual** (`yokai-tarot.html` + `sw.js`, GitHub Pages). El rebuild toma esa app como referencia de UX y lógica, pero la separa en módulos mantenibles. No es un port directo — es una reescritura con la misma experiencia y datos migrados.

</project_context>

---

<architecture>

## Estructura de carpetas objetivo

```
/
├── index.html                  # Shell mínima: nav + contenedores vacíos
├── sw.js                       # Service Worker mejorado
├── manifest.json               # Manifest externo (no embebido en HTML)
├── icons/
│   ├── icon-192.png
│   └── icon-512.png
├── .well-known/
│   └── assetlinks.json         # CRÍTICO para TWA — sin esto el APK muestra barra de URL
├── css/
│   ├── tokens.css              # Variables CSS (colores, tipografía, espaciado)
│   ├── layout.css              # Grid, nav, tabs, header
│   ├── components.css          # Cards, sheets, chips, panels, buttons
│   └── themes/
│       ├── base.css            # Tema oscuro base (energía pura)
│       └── rws.css             # Tema del mazo RWS
├── js/
│   ├── router.js               # Navegación por hash, tab switching
│   ├── store.js                # Abstracción de persistencia (localStorage / IndexedDB)
│   ├── deck.js                 # Clase Deck: carga datos, filtra, busca, buildCard()
│   ├── sheet.js                # Detail sheet: render, swipe, teclado, prev/next
│   ├── spreads.js              # Lógica de tiradas
│   └── app.js                  # Punto de entrada, inicialización
├── data/
│   ├── arcana-pure.json        # 78 cartas con energía pura (mazo-agnóstico)
│   └── decks/
│       ├── yokai.json          # Datos del Yōkai Tarot (matiz por carta)
│       └── rws.json            # Datos del RWS Clásico 1909
└── assets/
    └── decks/
        └── rws/                # Imágenes B&N originales (dominio público)
            ├── 00-fool.jpg
            └── ...             # 78 imágenes
```

## Modelo de datos

### `arcana-pure.json` — capa base universal
```json
[
  {
    "id": "the-fool",
    "number": 0,
    "roman": "0",
    "group": "major",
    "en": "The Fool",
    "es": "El Loco",
    "keywords_es": ["Inicio", "Libertad", "Inocencia", "Riesgo", "Potencial"],
    "keywords_en": ["Beginning", "Freedom", "Innocence", "Risk", "Potential"],
    "energy": "Texto de energía pura, mazo-agnóstico (EN)...",
    "energy_es": "Resumen en español de la energía pura...",
    "shadow": "Lectura invertida / shadow aspect (EN)...",
    "shadow_es": "Lectura invertida en español...",
    "numerology_id": "0"
  }
]
```

### `decks/rws.json` — capa de matiz por mazo
```json
{
  "id": "rws",
  "name": "Tarot Waite-Smith",
  "subtitle": "Clásico 1909 · Dominio público",
  "theme": "rws",
  "available": true,
  "cards": [
    {
      "arcana_id": "the-fool",
      "image": "assets/decks/rws/00-fool.jpg",
      "deck_nuance": "Cómo el RWS expresa y matiza la energía de esta carta (EN)...",
      "deck_nuance_es": "Versión en español del matiz..."
    }
  ]
}
```

### Función central — `deck.js`
```js
// Mezcla capas en runtime: energía pura + matiz del mazo activo
function buildCard(arcanaId, deckData = null) {
  const pure = PURE_ARCANA.find(c => c.id === arcanaId);
  if (!deckData) return { ...pure, layer: 'pure' };
  const deckCard = deckData.cards.find(c => c.arcana_id === arcanaId);
  return { ...pure, ...deckCard, layer: 'deck' };
}
```

## Secciones de la app

### 1. Inicio (`#inicio`)
- Cover con presentación del concepto
- CTA a arcanos
- Selector de mazo activo (visible solo si hay más de un mazo disponible)

### 2. Cómo usar el tarot (`#uso`)
- Qué tener en mente antes de una lectura
- Cómo interpretar (no predecir)
- Arcanos mayores vs menores, los cuatro palos
- Posiciones de las cartas

### 3. Tiradas (`#tiradas`)
- **Carta del día** — 1 carta
- **Tres cartas** — con claves intercambiables: Tiempo / Relación / Reto
- **Conoce tu mazo** — 4 posiciones (ver spec completa abajo)
- **Spread Torii** — 6 cartas en forma de torii, 3 capas

#### Spec: Tirada "Conoce tu mazo"
Cuatro posiciones en segunda persona, tono cálido:
1. **La carta que lidera el mazo** — La energía que caracteriza a este deck, su personalidad dominante
2. **Qué puede enseñarte** — El tipo de conocimiento o perspectiva que este mazo ofrece
3. **Cómo quiere ser consultado** — Su "preferencia" de uso: ¿reflexión lenta? ¿preguntas directas?
4. **Qué no malinterpretar** — El error más común al leer este mazo; lo que puede confundir

El copy de cada posición habla a la lectora directamente. Esta tirada construye el vínculo emocional persona-mazo. Es el feature más original del producto.

### 4. Arcanos (`#arcanos`)
- Grid filtrable con búsqueda en tiempo real
- Chips de filtro: Todos / Mayores / Copas / Oros / Bastos / Espadas
- Chip "Carta del día" destacado
- Detail sheet deslizable con dos capas visibles: energía pura (siempre) + matiz del mazo (si hay mazo activo)
- Navegación prev/next, swipe táctil, teclado (flechas + Escape)
- Hash routing para URLs compartibles: `#arcano/the-fool`

### 5. Numerología (`#numerologia`)
- Lista de números 0–21 con significado
- Referencia a qué arcanos llevan cada número

## Service Worker — estrategias por tipo de asset

```
HTML / JS / CSS      →  network-first, fallback a caché
JSON de datos        →  network-first, fallback a caché
Imágenes de cartas   →  cache-first (assets estáticos, no cambian)
Fuentes              →  cache-first
```

El SW debe cachear la shell completa en `install`. Las imágenes de cartas se cachean on-demand (primera vez que se ven). `skipWaiting()` + `clients.claim()` para actualizaciones limpias. Versión del caché en constante `CACHE_VERSION` — incrementar en cada deploy.

## Variables CSS principales (`tokens.css`)

```css
:root {
  --ink:         #0d0b10;
  --ink-2:       #16121c;
  --ink-3:       #1f1928;
  --surface:     #1a1022;
  --cream:       #e8e0d0;
  --muted:       #8a7f98;
  --muted-2:     #5a5268;
  --line:        rgba(255,255,255,.08);
  --line-strong: rgba(255,255,255,.14);
  --gold:        #c9a86a;
  --vermilion:   #ce4e75;
  --vermilion-2: #e8688a;
  --earth:       #9c7b4e;
  --serif:       'Yuji Syuku', Georgia, serif;
  --sans:        'Zen Kaku Gothic New', system-ui, sans-serif;
  --story:       'Klee One', Georgia, serif;
  --accent:      var(--gold); /* override por JS según grupo de carta */
}
.group-cups    { --accent: #6ab4ce; }
.group-coins   { --accent: #c9a86a; }
.group-wands   { --accent: #ce7a4e; }
.group-swords  { --accent: #9c8ece; }
.group-major   { --accent: #ce4e75; }
```

## Lighthouse — checklist para Play Store (TWA)

Antes de correr Bubblewrap, verificar:

- [ ] HTTPS activo (GitHub Pages lo da automáticamente)
- [ ] `manifest.json` externo con: `name`, `short_name`, `start_url`, `display: standalone`, `background_color`, `theme_color`, `icons` (192px y 512px en archivos PNG reales)
- [ ] SW registrado con fetch handler funcional
- [ ] `start_url` responde offline
- [ ] Lighthouse Performance ≥ 80
- [ ] `assetlinks.json` en `.well-known/` (generado por Bubblewrap, subir al repo)
- [ ] Imágenes con `width` y `height` explícitos
- [ ] `loading="lazy"` en imágenes fuera del viewport inicial
- [ ] Scripts con `type="module"` o `defer`
- [ ] Sin dependencias de CDN externo (todo offline)

## Convenciones de código

- **Archivos:** `kebab-case.js`
- **Clases CSS:** `kebab-case`
- **Variables JS:** `camelCase`
- **Constantes:** `UPPER_SNAKE_CASE`
- **IDs del DOM:** `kebab-case`
- **JS:** ES modules (`type="module"`), vanilla JS, sin frameworks, sin bundler en Fase 1
- **CSS:** vanilla con custom properties, mobile-first, breakpoints: 480 / 768 / 1040px
- **Errores:** siempre capturados con try/catch — el offline puede romper cualquier fetch
- **Accesibilidad:** toda interacción con click tiene equivalente de teclado; `aria-label` en botones sin texto; `:focus-visible` outline visible

</architecture>

---

<constraints>

## Reglas que no se negocian

### Técnicas
- ❌ No añadir React, Vue, ni ningún framework — la app debe funcionar sin build step
- ❌ No cargar librerías desde CDN externo — rompe el offline
- ❌ No meter imágenes en base64 dentro del HTML o JS — van en `/assets/`
- ❌ No añadir IA generativa — añade costos, latencia y dependencia de red (contradice el punto de venta)
- ❌ No usar `localStorage` para volúmenes grandes — usar IndexedDB si crece
- ❌ No romper el offline — cada feature nueva debe funcionar sin conexión o degradar con gracia explícita

### Legales / de contenido
- ❌ No usar imágenes coloreadas modernas del RWS — solo originales B&N de 1909
- ❌ No llamar al mazo "Rider-Waite" — es marca registrada de US Games
- ❌ No reutilizar historias/contenido del Yōkai Tarot para otras secciones — es propiedad de la autora
- ❌ No incluir mazos de artistas independientes sin acuerdo escrito previo

### De producto
- ❌ No añadir features de Fase 2 o 3 antes de tener usuarios activos que validen la demanda
- ❌ No optimizar el SW antes de que el contenido esté estable (invalida el caché en cada cambio)

</constraints>

---

<working_mode>

## Cómo debe trabajar Claude Code en este proyecto

### Regla principal sobre este archivo
- Lee `CLAUDE.md` completo al inicio de cada sesión
- **Solo puedes escribir dentro de `<progress>`** — todo lo demás es de solo lectura
- Al terminar cada sesión de trabajo, actualiza `<progress>` con lo que completaste, lo que dejaste pendiente y cualquier decisión técnica relevante tomada

### Antes de escribir código
1. Identifica qué fase del roadmap corresponde a la tarea
2. Verifica que la tarea no contradiga ninguna constraint
3. Si hay ambigüedad, pregunta antes de asumir — especialmente en temas de derechos o arquitectura de datos

### Al escribir código
- Escribe modular desde el inicio — no monolíticos que habrá que refactorizar
- Prefiere código legible sobre código clever
- Comenta decisiones no obvias, no lo que el código ya dice
- Cada módulo JS debe tener una responsabilidad clara (ver arquitectura)
- Si un archivo supera ~200 líneas, considera si debe dividirse

### Al migrar datos del Yōkai original
- Los 78 arcanos están en `index.html` como llamadas `major()` y `minor()` dentro del `<script>`
- Migrarlos a `arcana-pure.json` requiere separar: id, número, grupo, nombres EN/ES, keywords EN/ES, energy (story original), energy_es (resumen), shadow (sombra)
- El campo `energy` de la capa pura NO es la historia del yōkai — es una reescritura mazo-agnóstica. La historia del yōkai va en `yokai.json` como `deck_story`

### Al hacer cambios que afectan el SW
- Incrementar `CACHE_VERSION` en `sw.js`
- Verificar que todos los assets nuevos estén en la lista de precaché si son parte de la shell
- Probar offline en DevTools (Application > Service Workers > Offline) antes de dar por terminado

### Al terminar una tarea
Actualizar la sección `<progress>` con:
```
### Sesión YYYY-MM-DD
**Completado:** [lista de lo que se hizo]
**Pendiente inmediato:** [qué sigue según el roadmap]
**Decisiones tomadas:** [cualquier elección técnica no trivial y por qué]
**Problemas encontrados:** [si hubo blockers o workarounds]
```

### Orden de trabajo del roadmap (Fase 1)
Seguir este orden — cada paso tiene dependencias del anterior:

1. **Migración de datos** — Extraer los 78 arcanos a `arcana-pure.json` y `yokai.json`
2. **Shell HTML** — `index.html` mínima con estructura de navegación y contenedores vacíos
3. **CSS modular** — Extraer y separar estilos en `/css/`
4. **Router** — `router.js` con hash navigation y tab switching
5. **Deck module** — `deck.js` con carga de JSON y `buildCard()`
6. **Vista Arcanos** — Grid, búsqueda, filtros, carta del día
7. **Detail sheet** — `sheet.js` con swipe, teclado, prev/next, capas de contenido
8. **Tiradas** — `spreads.js` con las 4 tiradas (carta del día, tres cartas, conoce tu mazo, torii)
9. **Vista Numerología** — Lista de números con significados
10. **SW mejorado** — Shell completa en caché + imágenes on-demand
11. **Lighthouse audit** — Llegar a Performance ≥ 80 y pasar checklist PWA
12. **Bubblewrap** — Generar APK, subir `assetlinks.json`, preparar ficha de Play Store

</working_mode>

---

<progress>

## Estado del proyecto

**Última actualización:** 2026-06-25
**Fase actual:** Fase 1 — MVP
**Nombre oficial:** **Velara** (antes "Tarot Companion"). Logo: wordmark "V" (sol/luna + horizonte sobre fondo ciruela). Renombrado en index.html (title/brand/apple-title), manifest (name/short_name), strings (`menu.aboutText` ES+EN) y sw.js (comentario + `CACHE_VERSION="velara-v1"`). Los mockups y `CLAUDE.md` aún dicen "Tarot Companion" (el mockup es ley visual, no de naming).
**Paso actual del roadmap:** Pasos 1–9 + i18n + rediseño visual v2 + **contenido 100% bilingüe en las 3 capas** + SW (10). **Íconos PNG reales presentes** (`icons/icon-192/512.png` + `icon-store-512.png`), manifest alineado a la paleta del mockup (`theme_color`/`background_color = #1C1430`). Siguiente: Lighthouse (11), luego Bubblewrap/APK (12).

> Nota: `CLAUDE.md` no está trackeado en git; reconstruido el 2026-06-18 desde contexto. El trabajo de i18n se había perdido en un reset y se **rehízo** el mismo día (ver log). ⚠️ Recordatorio: commitear pronto para no volver a perder cambios sin trackear.

---

### Checklist Fase 1

#### Datos
- [x] `data/arcana-pure.json` — 78 arcanos: campos universales + `energy`/`shadow` **EN+ES completos en los 78** (scripts `author-majors-en/es.mjs` / `author-minors-en/es.mjs`)
- [x] `data/decks/yokai.json` — matiz del Yōkai **bilingüe completo (78)**: `deck_story`+`deck_story_es`, `deck_resumen`+`deck_resumen_es`, `deck_sombra`+`deck_sombra_es` (script `author-yokai-bilingual.mjs`, idempotente; convención `pick`: base=EN, `_es`=ES). El ES original se movió a `_es` y se añadieron las versiones EN + traducción de la historia. `sheet.js` ahora usa `pick()` en las 3 líneas de la capa Yōkai
- [x] `data/decks/rws.json` — 78 cartas con `deck_nuance` **EN+ES completos** (`scripts/build-rws.mjs` con `NUANCE`/`NUANCE_ES`), `available:true`
- [x] `data/decks/index.json` — registro de mazos (yokai + rws, ambos available); el selector se arma desde aquí → añadir mazo = soltar JSON + entrada en el índice
- [x] `assets/decks/rws/` — **78 imágenes B&N originales presentes** (convención `<arcana_id>.jpg`); renombradas desde la nomenclatura corta de la autora (`m00`–`m21`, `c/p/s/w 01`–`14`). `_FILENAMES.txt` documenta el mapeo. El sheet las renderiza y degrada a placeholder solo si falta el archivo

#### Estructura base
- [x] `index.html` — shell + header con engrane + overlays (sheet, picker, menú) + script anti-flash de tema/idioma
- [x] `manifest.json` — externo; `name`/`short_name`="Velara", `theme_color`/`background_color`="#1C1430" (paleta del mockup), íconos 192/512 presentes
- [x] `icons/icon-192.png` y `icons/icon-512.png` — PNG reales (192×192, 512×512) aportados por la autora; + `icon-store-512.png` para la ficha de Play Store. Logo wordmark "V" (Velara) sobre fondo ciruela. La autora los subió a `assets/icons/`; movidos a `icons/` (donde apuntan manifest/sw/index.html)
- [ ] `.well-known/assetlinks.json` — placeholder hasta tener package name de Play Store

#### CSS
- [x] `css/tokens.css` — variables + **tema claro** (`:root[data-theme="light"]`, paleta pergamino + acentos por grupo ajustados)
- [x] `css/layout.css` — header (incl. botón engrane), tabs, vistas
- [x] `css/components.css` — cover, controles, chips, grid, cards, detail sheet, paneles, tiradas, numerología, "cómo usar", botón de mazo, deck picker, menú, arte de carta + placeholder
- [x] `css/themes/base.css` — tema oscuro base
- [x] `css/themes/rws.css` — matiz del mazo RWS (estampa clásica: marco dorado/sepia en la capa de mazo del sheet); se activa vía `:root[data-deck="rws"]` que pone `setDeck()` en `app.js`; no recolorea el arte B&N original

#### JavaScript
- [x] `js/router.js` — hash + tabs + deep link `#arcano/:id`
- [x] `js/store.js` — mazo activo + carta del día + idioma + tema (localStorage, try/catch)
- [x] `js/deck.js` — carga JSON, `buildCard()`, filtro/búsqueda, `loadDeckIndex()`, `cardName()`/`cardMark()` localizados, `deckCardName()`
- [x] `js/strings.js` — diccionario de chrome `UI.es`/`UI.en` (paridad de claves verificada: 58/58)
- [x] `js/i18n.js` — idioma de contenido (`pick`/`pickList`) + `t()` para chrome + `onLangChange`
- [x] `js/sheet.js` — detail sheet 2 capas, prev/next, teclado, idioma, arte/placeholder, `refresh()`; nombre de carta en un solo idioma
- [x] `js/decks-ui.js` — selector de mazo reutilizable (Arcanos + menú); fila "obtener más" bloqueada
- [x] `js/settings.js` — menú: mazo, idioma, tema, tienda (placeholder), acerca de; `applyTheme()`
- [x] `js/spreads.js` — 4 tiradas (bilingüe); sorteo local; cada carta abre el sheet
- [x] `js/numerology.js` — números/figuras/Mayores (bilingüe); enlaza al sheet
- [x] `js/uso.js` — "Cómo usar" (bilingüe)
- [x] `js/app.js` — orquesta 5 vistas + picker + menú; tema/idioma; `applyLanguage()` re-render con preservación de estado

#### Vistas
- [x] Inicio / Cover — cover + CTA (el cambio de mazo se movió a Arcanos + menú)
- [x] Cómo usar el tarot
- [x] Tiradas — carta del día, tres cartas, conoce tu mazo, torii
- [x] Arcanos — grid + filtros + búsqueda + carta del día + detail sheet por capas + botón de mazo
- [x] Numerología
- [x] Menú de configuración (engrane) — mazo, idioma (ES/EN), tema (claro/oscuro), tienda (placeholder), acerca de

#### Idioma (i18n)
- [x] Toggle ES/EN persistente que cambia **TODA la app** (chrome vía `t()` + contenido vía `pick`)
- [x] Identidad de carta en un solo idioma; 2ª línea = nombre del ser del mazo (Yōkai → `yokai_name`) o vacío (RWS/pura)
- [x] Traducción del **contenido de carta** completa en las **3 capas**: pura (`energy_es`+`shadow_es`, 78), RWS (`deck_nuance_es`, 78) y **Yōkai bilingüe total** (`deck_story_es` + `deck_resumen`/`deck_sombra` EN+ES, 78). En modo ES toda la app muestra español propio; en modo EN, inglés propio (sin fallback cruzado)

#### PWA / Play Store
- [x] SW mejorado con caché completa — `sw.js` reescrito (`CACHE_VERSION="tarot-companion-v1"`): precaché de la shell (44 entradas: HTML/CSS/JS/JSON/16 woff2/íconos) **tolerante** (`cache.add` por asset con catch → íconos ausentes no rompen install); network-first para código/datos, cache-first para imágenes/fuentes; navegación offline cae a `index.html`; `skipWaiting`+`clients.claim`. **Registrado en `index.html`** (faltaba; antes solo en `yokai-tarot.html`). Falta prueba offline en DevTools del lado de la usuaria
- [ ] Lighthouse Performance ≥ 80 + checklist PWA (íconos PNG ya presentes → instalabilidad desbloqueada; falta correr la auditoría)
- [ ] APK con Bubblewrap + `assetlinks.json` + ficha de Play Store

---

### Log de sesiones

#### Sesión 2026-06-25 — Rebrand a Velara + íconos + fix bug de idioma/navegación
- **Completado:**
  - **Íconos PNG reales:** la autora aportó `icon-192/512.png` + `icon-store-512.png` (verificados: PNG, dimensiones exactas). Estaban en `assets/icons/`; movidos a `icons/` (raíz) donde apuntan manifest/sw/index.html; `assets/icons/` (duplicado) eliminado. `manifest.json` alineado a la paleta del mockup (`theme_color`/`background_color` `#0d0b10`→`#1C1430`).
  - **Rebrand a "Velara"** (nombre oficial, antes "Tarot Companion"): index.html (`<title>`, `.brand` → wordmark único "Velara", apple-title), manifest (`name`/`short_name`), `strings.js` (`menu.aboutText` ES+EN), `sw.js` (comentario + `CACHE_VERSION` → `velara-v1`). El `.brand span` de dos tonos se reemplazó por palabra única.
  - **Bug resuelto — "tras cambiar idioma no se puede navegar/scroll entre cartas":** causa raíz = `applyLanguage()` re-ejecuta `initTiradas()` → `paintEmpty()` → `renderTorii([nulls])`, que llama `setContext({listIds: [].filter(Boolean)})` = **lista vacía**, pisando el contexto compartido del sheet. Tras eso, abrir una carta del grid daba `indexOf=-1` → **prev/next deshabilitados**. Fix: el handler de carta del grid ahora hace `setContext({listIds: ids})` antes de `openSheet` (igual que daily/discover/numerología), reafirmando su lista de navegación al abrir. Arregla también el bug latente "visitar Tiradas y volver a Arcanos rompía prev/next".
  - **Robustez de scroll (de paso):** (1) bloqueo de scroll centralizado con contador de referencias (`js/scroll-lock.js`) usado por sheet/settings/decks-ui — evita que cerrar un overlay desbloquee el fondo si otro sigue abierto (overlays solapables). (2) `render()` del sheet reinicia `scrollTop=0` (síncrono + rAF) y `.sheet` lleva `overflow-anchor:none` → al navegar prev/next o re-render por idioma no queda atascado desplazado.
  - **Verificado con Chrome headless (puppeteer-core, viewport móvil + touch CDP real):** 12/12 checks: prev/next funciona antes y **después** de cambiar idioma (The Fool→The Magician), scroll reinicia a 0, body se desbloquea solo cuando se cierran todos los overlays, sin fugas del contador, grid scrollea, sin errores de página. Íconos 200, manifest/título/brand = Velara.
- **Decisiones:** (1) brand = palabra única "Velara" (el split de dos tonos no aplica a un nombre de una palabra). (2) Fix del bug en el punto de apertura (grid setContext) en vez de reordenar `applyLanguage`, por consistencia con las demás superficies y porque cubre el bug latente. (3) `CACHE_VERSION` → `velara-v1` por el rebrand.
- **Pendiente / ojo:** la **eliminación de `yokai-tarot.html`** (app de referencia) está en el working tree pero **no la hice yo y NO se incluyó en este commit** — confirmar con la autora si fue intencional. Mockups y prosa de `CLAUDE.md` siguen diciendo "Tarot Companion" (el mockup es ley **visual**, no de naming). Siguiente: Lighthouse (11) + prueba offline en DevTools, luego Bubblewrap/APK (12).

#### Sesión 2026-06-24 — Service Worker (paso 10) + registro en index.html
- **Completado:** Contenido aprobado por la autora (commit `V3`/`3ffd52f`) → se levanta la constraint que difería el SW. `sw.js` reescrito desde el stub heredado: `CACHE_VERSION="tarot-companion-v1"`, precaché de shell (44 entradas), estrategias network-first (código/datos) y cache-first (imágenes/fuentes), fallback de navegación a `index.html`, `skipWaiting`+`clients.claim`. Precaché **tolerante** (un `cache.add` por asset con `.catch` → los íconos PNG aún ausentes no abortan el install). **Añadido el registro del SW en `index.html`** (no existía; solo estaba en la app de referencia `yokai-tarot.html`). Verificado: `node --check sw.js` OK; 42/44 assets del precaché existen en disco (faltan solo `icons/icon-192/512.png`, que aporta la autora).
- **Decisiones:** (1) Precaché tolerante por-asset en vez de `cache.addAll` (que falla en bloque) → robusto ante íconos faltantes y futuros cambios. (2) Ruta de registro relativa `sw.js` → funciona en subcarpeta de GitHub Pages. (3) Íconos: la autora aporta el arte real (no placeholders).
- **Pendiente inmediato:** subir `icons/icon-192.png` y `icons/icon-512.png` (PNG reales) → desbloquea instalabilidad para Lighthouse (paso 11). Prueba offline en DevTools (Application > Service Workers > Offline). Luego Bubblewrap/APK (12). Recordatorio: subir `CACHE_VERSION` en cada deploy.

#### Sesión 2026-06-24 — Traducción `_es` de las capas principales + imágenes RWS
- **Completado:**
  - **Capa pura ES (78×2):** nuevos scripts idempotentes `scripts/author-majors-es.mjs` (22) y `scripts/author-minors-es.mjs` (56) que pueblan `energy_es`/`shadow_es`. Traducción original y fiel del EN, en español natural y **género-neutro** (igual criterio que el contenido yōkai existente: sin adjetivos marcados en género al dirigirse a la lectora). Verificado: 78/78 con `energy_es`+`shadow_es` no vacíos.
  - **Matiz RWS ES (78):** `scripts/build-rws.mjs` ampliado con diccionario `NUANCE_ES` + chequeo de faltantes; `deck_nuance_es` ahora se puebla en cada build. Regenerado `data/decks/rws.json` → 78/78 con `deck_nuance_es`.
  - **Imágenes RWS (78):** la autora subió las 78 con nomenclatura corta (`m00`–`m21` mayores por número; `c/p/s/w` + `01`–`14` para Copas/Oros[p=pentacles]/Bastos/Espadas, ace=01…page=11/knight=12/queen=13/king=14). **Renombradas** a la convención del proyecto `<arcana_id>.jpg` vía PowerShell (mapeo verificado con dry-run: 78 pares, 0 faltantes, 0 colisiones; `_FILENAMES.txt` de la autora confirma orden destino). `sheet.js` ya renderiza `<img>` y degrada a placeholder solo en 404 → ahora se ven. `rws.json` apunta correctamente; 0 imágenes faltantes en disco.
  - **Verificado:** `pick()` en modo ES devuelve español en las capas pura y RWS; cobertura EN+ES completa en ambas (78).
- **Decisiones:** (1) **Renombrar archivos** en vez de mapear en código → mantiene la convención documentada `<arcana_id>.jpg`, no toca `rws.json`/`build-rws.mjs`/CLAUDE.md y deja filenames autodocumentados. (2) Español **género-neutro** para coincidir con el tono del contenido ES preexistente (yōkai). (3) Traducción autorada como contenido original fundamentado en Waite, no traducción automática (calidad para app publicada, segmento hispanohablante).
- **Yōkai bilingüe total (decisión de la autora: paridad ES+EN):** `scripts/author-yokai-bilingual.mjs` (idempotente) lleva las 78 cartas a paridad respetando la convención de `pick` (base=EN, `_es`=ES): mueve el ES preexistente a `deck_resumen_es`/`deck_sombra_es`, añade `deck_resumen`/`deck_sombra` en EN, y `deck_story_es` (traducción de la historia; `deck_story` EN se conserva). Ajuste en `sheet.js`: las 3 líneas de la capa de mazo pasan a `pick(c,"deck_resumen")` / `pick(c,"deck_story")` / `pick(c,"deck_sombra")`. Verificado: 78/78 con los 6 campos; idempotente (2ª corrida no corrompe); `pick()` da EN puro / ES puro. **Las 3 capas (pura + RWS + Yōkai) son 100% bilingües.**
- **Pendiente inmediato:** prueba visual + commit manual; después SW (10) y Lighthouse (11).
- **Problemas:** el sandbox de PowerShell bloqueó un `-replace '\.jpg$'` (lo interpretó como ruta de borrado); se reescribió el mapeo sin regex. `Grep` lanzó `uv_spawn` intermitente en Windows; se usó `Read` directo como alternativa.

#### Sesión 2026-06-22 — Rediseño visual v2 + IA de 3 destinos (mockups)
- **Completado:** Implementado el rediseño de `testing mockups/` (8 pantallas oscuro/claro).
  - **Sistema visual:** `tokens.css` reescrito con paleta "ciruela ahumada" (oscuro) y "velo lavanda" (claro, contraste reforzado: cards en blanco puro sobre fondo lavanda → resuelve el "se lava" del claro anterior). Acentos de palo afinados (Mayores lavanda · Copas aguamarina · Oros oro · Bastos terracota · Espadas periwinkle, en ambos temas). Nuevo token `--on-accent` (texto legible sobre dorado, arregla contraste latente en claro). Radios mayores (`--radius-lg/-xl`), halo radial de fondo en `base.css`.
  - **Tipografías:** Spectral (serif) + Mulish (sans) **auto-hospedadas** vía `scripts/fetch-fonts.mjs` → `assets/fonts/` (16 woff2, subsets latin + latin-ext para acentos y "ō") + `css/fonts.css`. Cumple offline (nada por CDN). Kanji con fallback CJK de sistema (token `--cjk`).
  - **IA de 3 destinos:** barra **inferior** (`.botnav`, `#nav`) con Inicio · Glosario · Tiradas; header solo marca + engrane. `index.html` reestructurado: Glosario y Tiradas son `.view` con control segmentado (`.seg-tabs`) y dos `.subview` cada uno (Arcanos/Números, Cómo leer/Tiradas). `router.js` → 3 vistas + soporte de hash `vista/subvista` (`#glosario/numerologia`, `#tiradas/spreads`) + `onSub`. Enlaces internos de uso.js/spreads.js actualizados a los nuevos hashes.
  - **Inicio = hub explorador (decisión de la usuaria, opción C):** `app.js` `renderInicio()` con saludo por franja horaria, **fase lunar** (`js/moon.js`, cálculo astronómico offline), **carta del día revelar-y-fijar** (no se asigna sola: se elige al tocar "Revelar" y queda fija el día; `store.js` `isDailyRevealed/setDailyRevealed`), tarjeta **"Descubre un arcano"** (aleatorio para quien no quiere "sacar" carta) y dos accesos (Glosario/Tiradas). El sheet recuerda la vista de origen (`returnHash`) y vuelve a ella al cerrar.
  - **Verificado:** `node --check` en 13 módulos OK; paridad de claves ES/EN 75/75; los 16 woff2 referenciados existen; servidor local sirve `/`, CSS, JS, fuentes y JSON con 200.
- **Decisiones:** (1) Inicio = híbrido explorador, no oráculo (carta opcional, no impuesta). (2) Carta del día se revela y se fija al día. (3) Extras: **fase lunar sí** (offline), **saludo personalizado no** (sin onboarding de nombre → saludo genérico por hora). (4) Fuentes auto-hospedadas, no CDN (regla offline). (5) Nombres de variables CSS conservados → el re-skin se propaga sin tocar componentes.
- **Pendiente inmediato:** prueba **visual** en navegador del lado de la usuaria (oscuro/claro, las 3 pestañas, revelar carta, descubrir, deep-link de carta) + commit manual. Diferido: contenido `_es`, imágenes RWS B&N, SW (paso 10), Lighthouse (11). La portada-splash anterior podría reusarse como onboarding de primer arranque (sugerencia del mockup).

#### Sesión 2026-06-17 — Capa pura EN + matiz RWS + vistas
- Capa pura completada en inglés (22 Mayores + 56 Menores) vía scripts idempotentes.
- Vistas faltantes: `uso.js`, `spreads.js` (4 tiradas), `numerology.js`. CSS de las tres.
- Estructura de mazos extensible: `data/decks/index.json` + `loadDeckIndex()`; selector dinámico.
- `data/decks/rws.json` con matiz EN de las 78 cartas (`scripts/build-rws.mjs`), `available:true`.
- **Decisión:** convención de imagen RWS = `<arcana_id>.jpg`; `rws` available aunque falten imágenes (el sheet degrada).

#### Sesión 2026-06-17 — UX: selector de mazo, menú, tema, placeholders
- Selector de mazo reubicado a componente reutilizable (`decks-ui.js`): botón en Arcanos + menú; se quitó de Inicio.
- Menú de configuración (`settings.js`): mazo, idioma, tema claro/oscuro, tienda (placeholder), acerca de.
- Tema claro/oscuro (tokens `:root[data-theme=light]` + script anti-flash + `meta theme-color`).
- Placeholder "Imagen próximamente" en el sheet (capa de mazo), con `loading=lazy` + width/height.

#### Sesión 2026-06-18 — Tema de mazo RWS (`css/themes/rws.css`)
- **Completado:** Creado `css/themes/rws.css` (matiz visual del RWS, scope `:root[data-deck="rws"]`). Hook de tema de mazo en `app.js` → `setDeck()` pone/limpia `document.documentElement.dataset.deck = deckData.theme`. Enlazado `rws.css` en `index.html` tras `base.css`. `node --check js/app.js` OK.
- **Decisiones:** El tema de mazo solo restila la **capa del mazo** del detail sheet (marco dorado/sepia, serif clásica, fondo pergamino del arte/placeholder); la energía pura conserva el tema base. NO se aplica filtro de color al `<img>` para respetar la regla de imágenes B&N originales de 1909. Usa tokens existentes → funciona en tema claro y oscuro. Mecanismo extensible: cualquier mazo nuevo con `theme` en su JSON solo necesita su `css/themes/<theme>.css` + `<link>`.
- **Pendiente inmediato (roadmap):** bloqueado por contenido → imágenes RWS B&N (las aporta la usuaria), traducción `_es` (diferida hasta aprobar EN). SW (paso 10) sigue prematuro por constraint (contenido no estable). Prueba visual del lado de la usuaria + commit.

#### Sesión 2026-06-18 — i18n de toda la app (perdido y REHECHO)
- **Completado:** Infraestructura i18n (`js/strings.js` con `UI.es/UI.en`, `t()` en `i18n.js`); chrome migrado a `t()` en todos los módulos; prosa bilingüe co-localizada en Cómo usar / Numerología / Tiradas. Identidad de carta en un solo idioma (`cardName`, glifo localizado); 2ª línea = nombre del ser del mazo (Yōkai → `yokai_name`) o vacío (RWS/pura). `applyLanguage()` re-render preservando filtro/búsqueda de Arcanos. Toggle ES/EN cambia TODA la app. Verificado: `node --check` OK en 10 módulos, paridad de claves ES/EN 58/58.
- **Incidente:** tras el commit V3, un reset/limpieza del working tree borró todo lo no commiteado (incl. `js/strings.js` y `CLAUDE.md`). Se **rehízo** todo el i18n el mismo día desde el contexto de la sesión. `CLAUDE.md` también reconstruido.
- **Decisiones:** i18n completo del chrome ES+EN; traducción del *contenido de carta* al español diferida (en modo ES el significado cae a inglés hasta esa pasada); palabras clave del sheet a un solo idioma; listeners delegados se adjuntan una sola vez (evita sorteos duplicados al cambiar idioma). Búsqueda en `filterPure` sigue indexando ambos idiomas (encuentra aunque la UI muestre uno).
- **Aprendizaje:** commitear pronto el trabajo grande; no dejarlo sin trackear si habrá operaciones de git.
- **Pendiente:** prueba visual en navegador del lado de la usuaria; commit manual de la usuaria.

</progress>
