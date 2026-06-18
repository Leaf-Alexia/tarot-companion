/* strings.js — diccionario del chrome compartido (etiquetas, botones, labels).
   La prosa larga de las vistas (Cómo usar, Numerología, Tiradas) vive en cada
   módulo como contenido { es, en }, no aquí. Claves planas, mismas en ambos. */

export const UI = {
  es: {
    // Tabs
    "tab.inicio": "Inicio",
    "tab.uso": "Cómo usar",
    "tab.tiradas": "Tiradas",
    "tab.arcanos": "Arcanos",
    "tab.numerologia": "Numerología",

    // Inicio / cover
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

    // Filtros (chips)
    "filter.all": "Todos",
    "filter.major": "Mayores",
    "filter.cups": "Copas",
    "filter.coins": "Oros",
    "filter.wands": "Bastos",
    "filter.swords": "Espadas",

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
    "menu.aboutText": "Tarot Companion — guía y acompañante de lectura, sin conexión y sin IA. La energía pura de los 78 arcanos, y cómo cada mazo la matiza.",
    "menu.credits": "Tarot Waite-Smith: imágenes de dominio público (Pamela Colman Smith, 1909). Yōkai Tarot: contenido propiedad de la autora del proyecto.",
    "menu.settingsAria": "Configuración",
  },

  en: {
    // Tabs
    "tab.inicio": "Home",
    "tab.uso": "How to use",
    "tab.tiradas": "Spreads",
    "tab.arcanos": "Arcana",
    "tab.numerologia": "Numerology",

    // Inicio / cover
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

    // Filters (chips)
    "filter.all": "All",
    "filter.major": "Major",
    "filter.cups": "Cups",
    "filter.coins": "Coins",
    "filter.wands": "Wands",
    "filter.swords": "Swords",

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
    "menu.aboutText": "Tarot Companion — a guide and reading companion, offline and without AI. The pure energy of the 78 arcana, and how each deck shades it.",
    "menu.credits": "Tarot Waite-Smith: public-domain images (Pamela Colman Smith, 1909). Yōkai Tarot: content owned by the project's author.",
    "menu.settingsAria": "Settings",
  },
};
