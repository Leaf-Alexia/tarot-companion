# Cómo usar Velara (uso personal)

Velara es tu guía de tarot offline. No necesita tienda ni publicación: corre en tu
propia compu y en tu teléfono. Aquí están las dos formas de tenerla a la mano.

> **¿Por qué no basta con abrir `index.html` con doble clic?**
> La app carga sus datos y módulos de forma que el navegador solo permite sobre
> `http://…`, no sobre `file://…`. Por eso se usa un mini-servidor local (abajo).
> Es un paso pequeño y una sola vez por sesión.

---

## 💻 En la computadora (Windows)

1. Entra a la carpeta `APP Tarot`.
2. Haz **doble clic en `iniciar-velara.bat`**.
3. Se abre una ventana negra (déjala abierta) y tu navegador con Velara.
   - Si el navegador dice “no se puede conectar”, **refresca una vez**.
4. Para cerrar: cierra la ventana negra.

**Instalarla como app de escritorio (opcional, recomendado):**
- Con Velara abierta en Chrome o Edge, busca el ícono **“Instalar”** en la barra de
  direcciones (a la derecha) y acéptalo.
- Queda como una app con su propio ícono y ventana. Tras instalarla, funciona
  **sin conexión** (aunque solo necesitas la ventana negra abierta para la primera
  carga de cada sesión si no la instalaste).

> ¿No tienes Python? El `.bat` te avisa y te da el enlace. Instala Python desde
> python.org y marca “Add Python to PATH”. Es gratis y de una sola vez.

---

## 📱 En el teléfono (instalar como app, sin tienda)

La forma más cómoda es publicar Velara **solo para ti** en GitHub Pages (gratis) y
luego “agregarla a la pantalla de inicio”. No aparece en ninguna tienda ni se anuncia.

1. **Publicar (una vez):** sube el contenido de `APP Tarot/` a un repositorio de
   GitHub y activa **GitHub Pages** en ese repo (Settings → Pages → rama y carpeta).
   Te dará una URL como `https://tu-usuario.github.io/velara/`.
   - *Consejo:* que el contenido de `APP Tarot/` quede en la **raíz** de la rama que
     Pages sirve, para una URL limpia (evita carpetas con espacios como “APP Tarot”).
2. **En el teléfono:** abre esa URL en Chrome (Android) o Safari (iPhone).
3. **Agregar a pantalla de inicio:**
   - **Android/Chrome:** menú ⋮ → “Agregar a pantalla de inicio” / “Instalar app”.
   - **iPhone/Safari:** botón compartir → “Agregar a pantalla de inicio”.
4. Ábrela desde el ícono nuevo. Tras la primera carga funciona **offline**.

> Alternativa sin publicar: si tu teléfono y tu compu están en la misma red WiFi,
> puedes abrir `http://IP-de-tu-compu:8137/` desde el teléfono mientras la ventana
> negra del `.bat` está abierta. Menos cómodo que instalarla, pero sirve.

---

## 🩷 Tus cosas se guardan solas (y son solo tuyas)

- **Favoritos (♥):** en cada carta hay un corazón; tócalo para marcarla. En
  “Arcanos” el filtro **♥ Favoritas** te muestra solo esas.
- **Notas:** cada carta tiene un cuadro **“Mi nota”**; lo que escribas queda pegado
  a esa carta.
- **Copiar:** el botón **Copiar** pone en el portapapeles el nombre + la energía
  pura + la pincelada del mazo activo, listo para pegar donde quieras.

Todo esto se guarda **en el dispositivo que uses** (no se sube a internet). Ojo: si
usas Velara en la compu y en el teléfono, cada uno tiene sus propios favoritos y
notas por separado.

---

*El plan para publicar en Google Play sigue documentado en `CLAUDE.md`, en pausa.
Puedes retomarlo cuando quieras; nada de lo de arriba lo estorba.*
