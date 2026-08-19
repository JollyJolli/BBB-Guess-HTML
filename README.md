# BUNNY QUIZ

> **A0.0.5-Alpha**
> Un quiz musical nacido del MusicQuiz original de Discord.

BUNNY QUIZ es un juego web de letras, canciones, feats y álbumes de Bad Bunny. Está construido con HTML, CSS y JavaScript vanilla, sin frameworks ni librerías visuales.

## Esta versión

A0.0.5 añade:

- sesiones de diez preguntas y pantalla completa de resultados;
- PNG de resultado diseñado para descargar o compartir;
- estadísticas globales y por modo;
- mastery por álbum basado en precisión, exposición y consistencia;
- eventos sorpresa y milestones de combo en NEW MODE;
- configuración, scoring, tracking y storage versionado;
- migración automática desde `musicquiz-alpha-stats`;
- changelog dentro del juego;
- **THE ARCHIVE**, un museo secreto construido a partir de las dos versiones históricas reales de MusicQuiz.

## Modos

```text
01  LETRA → CANCIÓN
02  ADIVINA EL FEAT
03  ¿BENITO O NO?
04  FEAT → CANCIÓN
05  NEW MODE
06  RANDOM
07  OG MODE
```

NEW MODE es una run de diez rondas con tres vidas, ocho tipos de challenge, bosses, combo, multiplicadores y eventos. OG MODE conserva las cuatro modalidades originales y una interfaz inspirada en el antiguo bot.

## Estructura

```text
index.html
│
├── css/
│   ├── styles.css
│   ├── a005.css
│   ├── a005-responsive.css
│   └── museum.css
│
├── js/
│   ├── app.js
│   ├── config.js
│   ├── versions.js
│   ├── storage.js
│   ├── scoring.js
│   ├── stats.js
│   ├── mastery.js
│   ├── sharing.js
│   ├── data/changelog.js
│   ├── new-mode/events.js
│   └── museum/
│       ├── artifacts.js
│       └── museum.js
│
└── CODIGO-ANTIGUO-og/
    ├── musicquiz-full-og.js
    └── musicquiz-antiguo-pero-no-og.js
```

`config.js` es la fuente única para versión, URLs, timers, scoring, mastery, eventos y feature flags. `app.js` conserva el flujo principal del juego; los sistemas que necesitan reglas propias viven en módulos separados.

## Datos y persistencia

Los cuatro bancos históricos siguen cargándose desde JSONStorage. Las estadísticas se guardan únicamente en el navegador mediante `localStorage`.

```text
storage actual:  bunny-quiz-profile-v2
storage legado:  musicquiz-alpha-stats
```

El perfil incluye stats globales, stats por modo, mastery por álbum, records de NEW MODE y metadata de versión. No hay cuentas, backend ni sincronización entre dispositivos.

## Desarrollo

Sirve la carpeta mediante HTTP para que `fetch()` y los módulos ES funcionen correctamente. No requiere proceso de build.

```text
HTML + CSS + JavaScript
frameworks: ninguno
build: ninguno
```

## Historia

Antes de Bunny Quiz existía `musicquiz`: un comando de Discord hecho con aoi.js, `awaitedCommand`, botones y cuatro JSON especializados. Las fuentes originales se conservan intactas en `CODIGO-ANTIGUO-og/` y alimentan el museo del proyecto.

> THE OLD BOT GREW UP.
