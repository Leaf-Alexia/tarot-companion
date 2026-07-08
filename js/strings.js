/* strings.js — diccionario del chrome compartido (etiquetas, botones, labels).
   La prosa larga de las vistas (Cómo usar, Numerología, Tiradas) vive en cada
   módulo como contenido { es, en }, no aquí. Claves planas, mismas en ambos. */

export const UI = {
  es: {
    // Navegación inferior (3 destinos)
    "tab.inicio": "Inicio",
    "tab.glosario": "Glosario",
    "tab.tiradas": "Tiradas",

    // Sub-pestañas segmentadas
    "seg.arcanos": "Arcanos",
    "seg.numerologia": "Números",
    "seg.uso": "Cómo leer",
    "seg.spreads": "Tiradas",

    // Inicio · hub explorador
    "home.greet.morning": "Buenos días",
    "home.greet.afternoon": "Buenas tardes",
    "home.greet.evening": "Buenas noches",
    "home.headline": "Explora los arcanos a tu ritmo.",
    "home.dailyKicker": "Carta del día",
    "home.dailyHidden": "Una carta te espera para hoy.",
    "home.dailyTapHint": "Toca para revelar",
    "home.dailyReveal": "✦ Revelar la carta del día",
    "home.dailyOpen": "Abrir lectura completa",
    "home.discover": "Descubre un arcano",
    "home.discoverSub": "Uno al azar, solo para aprender",
    "home.glosarioCard": "Glosario",
    "home.glosarioSub": "Los 78 arcanos y los números",
    "home.tiradasCard": "Tiradas",
    "home.tiradasSub": "Cómo leer y las tiradas",

    // Inicio / cover (legado; aún usado por algunas claves)
    "cover.kicker": "Guía y acompañante de lectura",
    "cover.sub": "La energía pura de los 78 arcanos, y cómo cada mazo la matiza.",
    "cover.cta": "Consultar los arcanos →",

    // Arcanos
    "arcanos.search": "Buscar por nombre o palabra clave…",
    "arcanos.searchAria": "Buscar arcano",
    "arcanos.deckAria": "Elegir mazo",
    "arcanos.day": "✦ Carta del día",
    "arcanos.dayTitle": "Extrae un arcano al azar",
    "arcanos.one": "arcano",
    "arcanos.many": "arcanos",
    "arcanos.loadError": "No se pudieron cargar los datos. Reintenta con conexión.",
    "arcanos.noFavs": "Aún no marcas cartas favoritas. Abre una carta y toca el ♥.",

    // Filtros (chips)
    "filter.all": "Todos",
    "filter.major": "Mayores",
    "filter.cups": "Copas",
    "filter.coins": "Oros",
    "filter.wands": "Bastos",
    "filter.swords": "Espadas",
    "filter.fav": "♥ Favoritas",

    // Palos (etiqueta larga)
    "suit.major": "Arcano Mayor",
    "suit.cups": "Copas · Agua",
    "suit.coins": "Oros · Tierra",
    "suit.wands": "Bastos · Fuego",
    "suit.swords": "Espadas · Aire",

    // Sheet
    "sheet.keywords": "Palabras clave",
    "sheet.energy": "Energía pura",
    "sheet.shadow": "Sombra · lectura invertida",
    "sheet.deckNuance": "Matiz del mazo",
    "sheet.deckStory": "Historia del mazo",
    "sheet.deckShadow": "Sombra del mazo",
    "sheet.majorArcanum": "Arcano Mayor",
    "sheet.prev": "← Anterior",
    "sheet.next": "Siguiente →",
    "sheet.close": "Cerrar",
    "sheet.imageSoon": "Imagen próximamente",
    "sheet.copy": "Copiar",
    "sheet.copied": "✓ Copiado",
    "sheet.copyFail": "No se pudo copiar",
    "sheet.fav": "Favorita",
    "sheet.favOn": "Quitar de favoritas",
    "sheet.note": "Mi nota",
    "sheet.notePlaceholder": "Escribe aquí lo que esta carta te dice…",

    // Mazo "energía pura" (pseudo-mazo)
    "deck.pure": "Energía pura",
    "deck.pureSub": "Universal, sin mazo",

    // Selector de mazo
    "picker.title": "Elegir mazo",
    "picker.more": "🔒 Obtener más mazos",
    "picker.soon": "Próximamente",

    // Menú de configuración
    "menu.title": "Configuración",
    "menu.activeDeck": "Mazo activo",
    "menu.change": "Cambiar →",
    "menu.language": "Idioma",
    "menu.langNote": "La traducción al español está en camino; por ahora el significado de las cartas se muestra en inglés.",
    "menu.theme": "Tema",
    "menu.dark": "Oscuro",
    "menu.light": "Claro",
    "menu.store": "Tienda",
    "menu.storeTitle": "🔒 Más mazos, próximamente",
    "menu.storeSub": "Nuevos mazos y colaboraciones con artistas llegarán aquí.",
    "menu.about": "Acerca de",
    "menu.aboutText": "Velara — guía y acompañante de lectura, sin conexión y sin IA. La energía pura de los 78 arcanos, y cómo cada mazo la matiza.",
    "menu.credits": "Tarot Waite-Smith: imágenes de dominio público (Pamela Colman Smith, 1909). Yōkai Tarot: contenido propiedad de la autora del proyecto.",
    "menu.settingsAria": "Configuración",
  },

  en: {
    // Bottom navigation (3 destinations)
    "tab.inicio": "Home",
    "tab.glosario": "Glossary",
    "tab.tiradas": "Spreads",

    // Segmented sub-tabs
    "seg.arcanos": "Arcana",
    "seg.numerologia": "Numbers",
    "seg.uso": "How to read",
    "seg.spreads": "Spreads",

    // Home · explorer hub
    "home.greet.morning": "Good morning",
    "home.greet.afternoon": "Good afternoon",
    "home.greet.evening": "Good evening",
    "home.headline": "Explore the arcana at your own pace.",
    "home.dailyKicker": "Card of the day",
    "home.dailyHidden": "A card is waiting for you today.",
    "home.dailyTapHint": "Tap to reveal",
    "home.dailyReveal": "✦ Reveal the card of the day",
    "home.dailyOpen": "Open full reading",
    "home.discover": "Discover an arcanum",
    "home.discoverSub": "A random one, just to learn",
    "home.glosarioCard": "Glossary",
    "home.glosarioSub": "The 78 arcana and the numbers",
    "home.tiradasCard": "Spreads",
    "home.tiradasSub": "How to read and the spreads",

    // Home / cover (legacy; still used by some keys)
    "cover.kicker": "A guide and reading companion",
    "cover.sub": "The pure energy of the 78 arcana, and how each deck shades it.",
    "cover.cta": "Explore the arcana →",

    // Arcanos
    "arcanos.search": "Search by name or keyword…",
    "arcanos.searchAria": "Search arcanum",
    "arcanos.deckAria": "Choose deck",
    "arcanos.day": "✦ Card of the day",
    "arcanos.dayTitle": "Draw a random arcanum",
    "arcanos.one": "arcanum",
    "arcanos.many": "arcana",
    "arcanos.loadError": "Couldn't load the data. Try again with a connection.",
    "arcanos.noFavs": "You haven't marked any favorites yet. Open a card and tap the ♥.",

    // Filters (chips)
    "filter.all": "All",
    "filter.major": "Major",
    "filter.cups": "Cups",
    "filter.coins": "Coins",
    "filter.wands": "Wands",
    "filter.swords": "Swords",
    "filter.fav": "♥ Favorites",

    // Suits (long label)
    "suit.major": "Major Arcanum",
    "suit.cups": "Cups · Water",
    "suit.coins": "Coins · Earth",
    "suit.wands": "Wands · Fire",
    "suit.swords": "Swords · Air",

    // Sheet
    "sheet.keywords": "Keywords",
    "sheet.energy": "Pure energy",
    "sheet.shadow": "Shadow · reversed",
    "sheet.deckNuance": "Deck nuance",
    "sheet.deckStory": "Deck story",
    "sheet.deckShadow": "Deck shadow",
    "sheet.majorArcanum": "Major Arcanum",
    "sheet.prev": "← Previous",
    "sheet.next": "Next →",
    "sheet.close": "Close",
    "sheet.imageSoon": "Image coming soon",
    "sheet.copy": "Copy",
    "sheet.copied": "✓ Copied",
    "sheet.copyFail": "Couldn't copy",
    "sheet.fav": "Favorite",
    "sheet.favOn": "Remove from favorites",
    "sheet.note": "My note",
    "sheet.notePlaceholder": "Write what this card says to you…",

    // "Pure energy" pseudo-deck
    "deck.pure": "Pure energy",
    "deck.pureSub": "Universal, no deck",

    // Deck picker
    "picker.title": "Choose deck",
    "picker.more": "🔒 Get more decks",
    "picker.soon": "Coming soon",

    // Settings menu
    "menu.title": "Settings",
    "menu.activeDeck": "Active deck",
    "menu.change": "Change →",
    "menu.language": "Language",
    "menu.langNote": "Spanish translation is on the way; for now the card meanings are shown in English.",
    "menu.theme": "Theme",
    "menu.dark": "Dark",
    "menu.light": "Light",
    "menu.store": "Store",
    "menu.storeTitle": "🔒 More decks, coming soon",
    "menu.storeSub": "New decks and artist collaborations will arrive here.",
    "menu.about": "About",
    "menu.aboutText": "Velara — a guide and reading companion, offline and without AI. The pure energy of the 78 arcana, and how each deck shades it.",
    "menu.credits": "Tarot Waite-Smith: public-domain images (Pamela Colman Smith, 1909). Yōkai Tarot: content owned by the project's author.",
    "menu.settingsAria": "Settings",
  },
};
