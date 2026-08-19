# BUNNY QUIZ

> **A.0.1-B**
> Una revista musical convertida en arcade, con la historia de MusicQuiz archivada detrás.

BUNNY QUIZ es un juego web de letras, canciones, feats y álbumes de Bad Bunny. Está construido con HTML, CSS y JavaScript vanilla, sin frameworks ni proceso de build.

## Dirección visual

Esta versión reconstruye la interfaz alrededor de tres lenguajes que comparten un mismo sistema:

- revista musical para la tipografía, las fotografías y la composición;
- arcade para las preguntas, el score y las respuestas;
- archivo para OG Mode, el museo y la historia real del proyecto.

El sistema visual usa bordes secos, escala tipográfica extrema, líneas, metadata y color con significado. Las eras de álbum intervienen acentos, timer y detalles sin reemplazar la identidad base de Bunny Quiz.

## Modos

```text
01  LETRA → CANCIÓN                10 SEC
02  ADIVINA EL FEAT                FEAT
03  ¿BENITO O NO?                  YES / NO
04  FEAT → CANCIÓN                 4 CHOICES
05  NEW MODE                       RUN
06  RANDOM                         ∞
07  OG MODE                        LEGACY
```

NEW MODE es una run de diez rondas con tres vidas, challenges, bosses, combo, multiplicadores y eventos. OG MODE conserva las cuatro modalidades originales como una pieza jugable del archivo.

## Estructura

```text
index.html
│
├── assets/images/
│   ├── editorial/
│   ├── eras/
│   └── archive/
│
├── css/
│   ├── styles.css
│   ├── records.css
│   ├── museum.css
│   └── responsive.css
│
├── js/
│   ├── app.js
│   ├── config.js
│   ├── themes.js
│   ├── photos.js
│   ├── cursor.js
│   ├── sharing.js
│   ├── storage.js
│   ├── scoring.js
│   ├── stats.js
│   ├── mastery.js
│   ├── versions.js
│   ├── data/changelog.js
│   ├── new-mode/events.js
│   └── museum/
│       ├── artifacts.js
│       └── museum.js
│
└── CODIGO-ANTIGUO-og/
```

`config.js` es la fuente única para versión, fuentes de datos, reglas y temas de álbum. `themes.js` resuelve álbumes conocidos y desconocidos hacia custom properties compartidas. `app.js` conserva el flujo principal del juego.

## Fotografía

La interfaz incluye slots editoriales, pero no descarga ni enlaza fotografías externas. Los assets locales se organizan en `assets/images/` y se activan desde `CONFIG.assets.photos`. Si un archivo no existe, el fallback tipográfico conserva la composición sin mostrar una imagen rota.

## Datos y persistencia

Los cuatro bancos siguen cargándose desde JSONStorage. Las estadísticas se guardan únicamente en el navegador mediante `localStorage`.

```text
storage actual:  bunny-quiz-profile-v2
storage legado:  musicquiz-alpha-stats
```

El perfil incluye estadísticas globales, estadísticas por modo, mastery por álbum, records de NEW MODE y metadata de versión. No hay cuentas, backend ni sincronización entre dispositivos.

## Desarrollo

Sirve esta carpeta mediante HTTP para que `fetch()` y los módulos ES funcionen correctamente. No requiere instalación ni compilación.

```text
HTML + CSS + JavaScript
frameworks: ninguno
build: ninguno
```

THE ARCHIVE es una entrada pública de la interfaz y se construye con las fuentes históricas conservadas en `CODIGO-ANTIGUO-og/`. Su cronología comienza ahora con **ORIGIN / ERA 0**, el snapshot de 2021 del bot comunitario completo que existió antes de MusicQuiz, y continúa con las dos etapas del quiz de Discord hasta Bunny Quiz.

> THE OLD BOT GREW UP.
