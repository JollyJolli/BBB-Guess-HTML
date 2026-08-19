# BUNNY QUIZ

> **A0.0.2-Alpha**
> Un juego web musical nacido de un viejo comando de Discord.

**BUNNY QUIZ** es la reinterpretación web de `musicquiz`, un minijuego que originalmente fue creado para un bot de Discord usando **aoi.js**.

El proyecto original consistía en varios juegos musicales conectados a bancos de preguntas almacenados como JSON externos. Años después, la idea vuelve como un juego web hecho con **HTML, CSS y JavaScript vanilla**, manteniendo parte del ADN del bot original pero reconstruyendo completamente la interfaz, progresión y experiencia de juego.

La intención no es hacer una copia del bot.

La intención es hacer el juego que aquel comando podría haber terminado siendo.

---

## Estado del proyecto

```text
Nombre:        BUNNY QUIZ
Versión:       A0.0.2-Alpha
Estado:        Alpha / desarrollo temprano
Frontend:      HTML + CSS + JavaScript
Frameworks:    Ninguno
Backend:       Ninguno actualmente
Persistencia:  localStorage
Datos:         JSONStorage
Audio:         No implementado
Imágenes:      No implementadas en esta Alpha
```

Actualmente todo el proyecto puede vivir dentro de un único archivo:

```text
index.html
```

Ese archivo contiene:

```text
HTML
├── estructura de la aplicación
├── menú
├── pantalla de juego
├── HUD
└── overlays

CSS
├── identidad visual
├── responsive
├── modos especiales
├── estados de respuesta
└── animaciones

JavaScript
├── conexión con los JSON
├── generación de preguntas
├── modos de juego
├── scoring
├── rachas
├── timers
├── NEW MODE
├── OG MODE
└── localStorage
```

---

# Origen

BUNNY QUIZ nació de un comando llamado:

```text
musicquiz
```

Aliases originales:

```text
mq
music
```

El juego funcionaba mediante varios `awaitedCommand` de aoi.js.

La estructura conceptual original era aproximadamente:

```text
musicquiz
   ↓
escoger modalidad
   ↓
iniciar partida
   ↓
generar pregunta desde JSON
   ↓
guardar respuesta
   ↓
esperar mensaje del jugador
   ↓
comprobar respuesta
   ↓
ganar / perder
   ↓
actualizar estadísticas
```

El bot incluía sistemas de tickets, multas, blacklist, mantenimiento, restricciones de servidor y logging.

Esos sistemas **no forman parte de BUNNY QUIZ**.

La versión web se concentra únicamente en el juego.

---

# Filosofía de BUNNY QUIZ

El proyecto sigue algunas reglas intencionales.

### Primero el juego

La interfaz existe para presentar preguntas, respuestas y progresión.

No queremos convertirlo en un dashboard lleno de elementos decorativos.

### Personalidad antes que apariencia genérica

La dirección visual mezcla:

* juego arcade;
* diseño musical/editorial;
* estética oscura;
* tipografía grande;
* verde ácido;
* bastante espacio negativo;
* pequeños elementos retro/digitales.

La intención es evitar una interfaz que parezca una plantilla genérica generada automáticamente.

### El bot original sigue vivo dentro del proyecto

Aunque la experiencia principal esté completamente reinterpretada, existe un **OG MODE** dedicado a conservar el feeling del antiguo MusicQuiz.

---

# Bancos de datos

Actualmente BUNNY QUIZ utiliza cuatro JSON externos.

## 1. Letras

```text
Root:
Letras
```

Contiene canciones agrupadas por álbum o colección.

Actualmente existen categorías como:

```text
X100PRE
OASIS
YHLQMDLG
LQNIAS
EUTDM
UVST
SINGLES
SINGLES2
TOMMY
```

Cada canción utiliza principalmente:

```json
{
    "name": "Nombre de la canción",
    "letra": "Fragmento de letra"
}
```

La aplicación normaliza esta estructura internamente a:

```js
{
    name,
    letra,
    album
}
```

Esto permite reutilizar el mismo banco para muchos juegos distintos.

---

## 2. FEAT

```text
Root:
FEAT
```

Estructura esperada:

```json
{
    "Nombre": "Canción / pregunta",
    "Correcta": "Feat correcto",
    "feat1": "Opción",
    "feat2": "Opción",
    "feat3": "Opción"
}
```

Se utiliza principalmente para:

```text
ADIVINA EL FEAT
```

---

## 3. Benito o No

```text
Root:
benoOno
```

Estructura esperada:

```json
{
    "letra": "Fragmento",
    "name": "Canción",
    "artista": "Artista",
    "beno": "si / no"
}
```

Permite preguntar si una letra pertenece o no a una canción de Benito.

---

## 4. Adivinar canción mediante feat

```text
Root:
ADIVINARFEAT
```

Estructura esperada:

```json
{
    "feat": "Artista invitado",
    "correcta": "Canción correcta",
    "cancion": "Opción",
    "cancion2": "Opción",
    "cancion3": "Opción"
}
```

Este banco alimenta:

```text
FEAT → CANCIÓN
```

---

# Modos de juego

Actualmente existen **7 entradas principales** en el menú.

---

## 01 — LETRA → CANCIÓN

El juego muestra un fragmento de letra.

El jugador debe identificar la canción.

Ejemplo:

```text
ADIVINA LA CANCIÓN

"...fragmento de letra..."

→ DÁKITI
```

### Fácil

Se muestran varias canciones como opciones.

### Difícil

El jugador debe escribir el título.

Puede utilizar timer.

La comprobación de texto es relativamente permisiva:

```text
"Dakiti"
"Dákiti"
"creo que es dakiti"
```

pueden ser reconocidas correctamente dependiendo de la respuesta.

También existe una pequeña tolerancia para errores tipográficos.

---

# 02 — ADIVINA EL FEAT

Se muestra la canción o elemento definido como `Nombre` dentro del JSON.

El jugador debe identificar el feat correcto.

El banco proporciona:

```text
Correcta
feat1
feat2
feat3
```

### Fácil

Multiple choice.

### Difícil

Respuesta escrita y presión de tiempo.

---

# 03 — ¿BENITO O NO?

Se muestra un fragmento de letra.

La pregunta es:

```text
¿ESTA LETRA ES DE BENITO?
```

El jugador responde:

```text
Sí
No
```

Al finalizar la pregunta se puede revelar:

```text
Canción
Artista
```

### Fácil

Sin presión de tiempo.

### Difícil

Timer más agresivo.

---

# 04 — FEAT → CANCIÓN

Se muestra un artista invitado.

Ejemplo:

```text
¿EN CUÁL APARECE DUKI?

Duki

A. Canción A
B. Canción B
C. Canción C
D. Canción D
```

Este modo **siempre muestra las canciones disponibles**.

Esto es intencional.

Mostrar únicamente:

```text
Duki
```

y pedir que el jugador escriba una canción sería ambiguo, ya que un mismo artista puede participar en más de una.

Por eso la dificultad no elimina las opciones.

### Fácil

Opciones y sin demasiada presión.

### Difícil

Las mismas opciones, pero con un timer considerablemente menor.

---

# 05 — NEW MODE

NEW MODE es la primera modalidad completamente nueva creada específicamente para BUNNY QUIZ.

No existía en el bot original.

No consiste en una sola mecánica.

Es una **run completa**.

```text
10 rondas
3 vidas
8 tipos de challenge
combo
multiplicadores
boss rounds
score independiente
recuperación de vidas
ranking de run
```

---

# Sistema de runs

Una partida de NEW MODE comienza con:

```text
Rondas:  10
Vidas:   3
Combo:   0
Multi:   x1.00
```

La run termina cuando:

```text
se completan las 10 rondas
```

o:

```text
las vidas llegan a 0
```

---

# Vidas

El jugador comienza con:

```text
3 vidas
```

Cada respuesta incorrecta elimina una.

```text
■ ■ ■

■ ■ □

■ □ □

□ □ □
```

Con cero vidas termina la run.

---

# Combo

Cada respuesta consecutiva correcta aumenta el combo.

Ejemplo:

```text
COMBO 1
COMBO 2
COMBO 3
COMBO 4
...
```

Una respuesta incorrecta devuelve:

```text
COMBO 0
```

---

# Multiplicador

El combo afecta el multiplicador de puntuación.

Cada dos respuestas correctas consecutivas aumenta aproximadamente:

```text
+0.25x
```

Ejemplo:

```text
x1.00
x1.25
x1.50
x1.75
x2.00
...
```

El máximo actual es:

```text
x2.50
```

Fallando una pregunta vuelve a:

```text
x1.00
```

---

# Recuperación de vidas

NEW MODE también recompensa las rachas largas.

Cada:

```text
4 respuestas correctas consecutivas
```

el jugador puede recuperar una vida perdida.

Nunca puede superar el máximo original de:

```text
3 vidas
```

---

# Boss Rounds

Las rondas:

```text
05
10
```

son **Boss Rounds**.

Tienen:

* menos tiempo;
* retos más complejos;
* puntuación base doble;
* presentación especial.

Ejemplo:

```text
NEW MODE / BOSS ROUND
```

Una victoria puede mostrar:

```text
BOSS CLEAR
```

---

# Challenges de NEW MODE

Actualmente existen **8 tipos**.

---

## SONG → ALBUM

Se muestra una canción.

El jugador debe identificar su álbum o colección.

```text
¿DE DÓNDE SALE?

Estamos Bien

→ X100PRE
```

En Easy puede utilizar opciones.

En Hard puede exigir respuesta escrita.

---

## LYRIC → ALBUM

Se muestra una letra.

En vez de adivinar la canción, hay que identificar de qué álbum o colección procede.

```text
LETRA
↓
ÁLBUM
```

---

## ALBUM → SONG

Se muestra un álbum.

Entre varias canciones, solamente una pertenece a ese álbum.

```text
¿CUÁL SÍ PERTENECE AQUÍ?

YHLQMDLG

A.
B.
C.
D.
```

---

## THE INTRUDER

Se seleccionan tres canciones del mismo álbum y una canción de otro.

El jugador debe encontrar al intruso.

```text
X100PRE

Canción A
Canción B
Canción C
Canción intrusa
```

---

## SAME OR NOT

Se muestran dos canciones.

El jugador debe decidir si pertenecen al mismo álbum o colección.

```text
Canción A
+
Canción B

¿MISMO ORIGEN?

Sí / No
```

---

## 3 SONGS / 1 ORIGIN

Se muestran tres canciones.

Las tres pertenecen al mismo lugar.

El jugador debe identificarlo.

```text
Canción A
/
Canción B
/
Canción C

→ álbum
```

---

## PAIR MATCH

Se muestran diferentes parejas de canciones.

Solamente una pareja pertenece al mismo álbum.

El jugador debe encontrarla.

---

## TITLE / LYRIC CHECK

Se muestra:

```text
Título de canción
+
Fragmento de letra
```

El jugador debe determinar si realmente corresponden.

```text
Sí
No
```

---

# Final de NEW MODE

Al terminar una run se muestra:

```text
Score de la run
Correctas
Incorrectas
Mejor score
Grade
```

El grade depende del rendimiento.

Actualmente:

```text
10 correctas → S+
9 correctas  → S
8 correctas  → A
6–7          → B
4–5          → C
0–3          → D
```

También se guarda:

```text
Best NEW MODE Score
Runs jugadas
Perfect Runs
```

---

# 06 — RANDOM

RANDOM cambia la modalidad en cada ronda.

Puede seleccionar entre:

```text
LETRA → CANCIÓN
ADIVINA EL FEAT
¿BENITO O NO?
FEAT → CANCIÓN
NEW MODE Challenge
```

Un challenge de NEW MODE dentro de RANDOM funciona como una pregunta independiente.

No inicia una run de diez rondas.

---

# 07 — OG MODE

OG MODE existe para conservar el espíritu del juego original.

Solamente utiliza las cuatro modalidades originales:

```text
LETRA → CANCIÓN
ADIVINA EL FEAT
¿BENITO O NO?
FEAT → CANCIÓN
```

NEW MODE está deliberadamente excluido.

La idea es que OG represente:

```text
musicquiz / mq
```

y no todo lo añadido posteriormente.

Visualmente utiliza una interfaz inspirada en el contexto donde nació el juego:

```text
Discord bot
```

Incluye:

* nombre de bot;
* avatar simplificado;
* badge BOT;
* mensaje;
* opciones;
* input;
* timers de aproximadamente 10–13 segundos.

---

# Dificultades

BUNNY QUIZ actualmente tiene dos dificultades generales.

## Fácil

Diseñada para jugar de forma relajada.

Puede incluir:

```text
multiple choice
más tiempo
menos presión
menos puntuación
```

---

## Difícil

Diseñada para rachas y puntuación.

Puede incluir:

```text
respuestas escritas
timers
menos tiempo
más puntuación
```

Sin embargo, cada modo puede adaptar estas reglas.

Por ejemplo:

```text
FEAT → CANCIÓN
```

mantiene multiple choice incluso en Hard porque quitar las opciones haría la pregunta ambigua.

---

# Timer

No todas las preguntas necesitan timer.

El sistema permite que cada modalidad defina:

```js
timer: 0
```

para no utilizar reloj,

o:

```js
timer: 10
```

para dar diez segundos.

La interfaz muestra:

* segundos restantes;
* barra horizontal de progreso.

NEW MODE utiliza timer prácticamente como parte central del gameplay.

---

# Rachas

La racha global aumenta con cada respuesta correcta.

```text
x1
x2
x3
x4
...
```

Una respuesta incorrecta vuelve a:

```text
x0
```

Se almacena también:

```text
mejor racha
```

La racha persiste mediante `localStorage`.

---

# Score global

BUNNY QUIZ tiene una puntuación global persistente.

Los puntos pueden depender de:

```text
dificultad
racha
tiempo restante
modalidad
multiplicador
boss round
```

Una pregunta Hard normalmente vale más que una Easy.

OG tiene su propia puntuación base.

Los retos de NEW MODE dentro de Random también tienen un pequeño bonus adicional.

---

# Persistencia

Actualmente no existe cuenta de usuario ni servidor.

Las estadísticas se guardan localmente mediante:

```js
localStorage
```

Entre otras cosas se almacenan:

```text
correctas
incorrectas
racha
mejor racha
score
NEW MODE best
NEW MODE runs
NEW MODE perfect runs
```

Esto significa que:

```text
cerrar pestaña → conserva stats
refrescar → conserva stats
otro navegador → no conserva stats
borrar almacenamiento → elimina stats
```

---

# Arquitectura JavaScript

La aplicación utiliza un estado global similar a:

```js
state = {
    difficulty,
    sessionMode,
    currentMode,
    currentRound,
    round,
    answered,
    timer,
    data,
    stats,
    newRun
}
```

---

# Flujo de una partida

El flujo general es:

```text
MENU
  ↓
seleccionar dificultad
  ↓
seleccionar modo
  ↓
startSession()
  ↓
nextRound()
  ↓
buildRound()
  ↓
renderRound()
  ↓
respuesta del usuario
  ↓
submitAnswer()
  ↓
validación
  ↓
applyResult()
  ↓
renderResult()
  ↓
nextRound()
```

NEW MODE añade una capa adicional:

```text
startNewRun()
  ↓
nextNewRunRound()
  ↓
buildNewChallenge()
  ↓
resolver
  ↓
actualizar vidas/combo/multiplicador
  ↓
...
  ↓
finishNewRun()
```

---

# Normalización de respuestas

Las respuestas escritas se normalizan antes de compararse.

Por ejemplo:

```text
DÁKITI
dakiti
Dákiti
```

pueden convertirse internamente en algo equivalente a:

```text
dakiti
```

Se eliminan:

* diferencias entre mayúsculas y minúsculas;
* acentos;
* ciertos caracteres especiales;
* espacios innecesarios.

También existe una tolerancia pequeña mediante distancia de Levenshtein para algunos errores tipográficos.

---

# Responsive

BUNNY QUIZ está pensado tanto para:

```text
desktop
tablet
mobile
```

En móvil:

* las preguntas ocupan prácticamente todo el ancho;
* las opciones pasan de dos columnas a una;
* el header se reorganiza;
* los stats cambian de grid;
* el HUD de NEW MODE se compacta;
* los inputs se adaptan al ancho disponible;
* se mantienen targets suficientemente grandes para interacción táctil.

La versión móvil no pretende ser simplemente la versión desktop encogida.

---

# Diseño visual

Actualmente BUNNY QUIZ no utiliza:

```text
framework UI
Bootstrap
Tailwind
React
Vue
component libraries
```

El diseño está escrito específicamente para el juego.

La Alpha utiliza principalmente:

```text
negro
off-white
verde ácido
naranja
azul
rojo
```

Cada color tiene una función.

```text
verde  → identidad principal / aciertos
naranja → NEW MODE
azul    → OG MODE
rojo    → fallos
```

---

# Fotografías

La versión:

```text
A0.0.1-Alpha
```

se planteó específicamente **sin fotografías de Bad Bunny**.

A0.0.2 mantiene esa dirección.

BUNNY QUIZ puede estar claramente inspirado en ese universo musical sin depender todavía de fotografías del artista.

Las imágenes forman parte de una posible etapa futura del diseño.

---

# Audio

Actualmente:

```text
NO AUDIO
```

No existen:

* efectos de acierto;
* efectos de error;
* sonidos del timer;
* música;
* snippets de canciones.

Está previsto experimentar con audio más adelante.

El sistema debe seguir funcionando completamente aunque el usuario tenga el audio desactivado.

---

# Seguridad actual

Actualmente las URLs de JSONStorage contienen la API key directamente dentro del frontend.

En una aplicación completamente cliente:

```text
HTML
↓
JavaScript
↓
fetch()
↓
JSONStorage
```

esa clave puede ser inspeccionada por cualquier usuario.

Esto es aceptable temporalmente durante desarrollo/Alpha, pero no es la arquitectura deseada para una publicación seria.

---

# Ideas a futuro

Esta sección reúne las ideas que han aparecido durante el desarrollo hasta ahora.

No significa que todas vayan a implementarse inmediatamente.

---

## Identidad definitiva de BUNNY QUIZ

El proyecto deja atrás el nombre genérico:

```text
MUSIC QUIZ
```

y pasa oficialmente a:

```text
BUNNY QUIZ
```

El objetivo será construir una identidad visual más reconocible alrededor del nuevo nombre.

---

## Bad Bunny dentro de la dirección visual

La Alpha evita fotografías.

Más adelante se puede experimentar con:

* fotografías;
* arte relacionado con eras;
* referencias visuales a álbumes;
* fondos;
* portadas;
* imágenes contextuales dentro de ciertas preguntas.

La idea no es convertir BUNNY QUIZ en una simple fan page.

Las imágenes deberían formar parte del juego y de la dirección artística.

---

## Identidad diferente por álbum

Los álbumes podrían adquirir personalidad visual propia.

Por ejemplo, una ronda de:

```text
X100PRE
```

podría sentirse ligeramente distinta de una ronda de:

```text
YHLQMDLG
```

sin cambiar por completo la interfaz.

Esto podría incluir:

* tipografía;
* textura;
* pequeños cambios cromáticos;
* animaciones;
* transiciones;
* elementos de fondo.

---

## Audio

Añadir posteriormente:

* sonido de respuesta correcta;
* sonido de respuesta incorrecta;
* tick del timer;
* transición de ronda;
* sonido de Boss Round;
* sonido de combo;
* sonido al recuperar una vida;
* música del menú.

Eventualmente también se podría estudiar una modalidad basada directamente en audio musical si existe una forma adecuada de gestionar las canciones.

---

## Más contenido para NEW MODE

Los ocho challenges actuales son solamente la primera base.

NEW MODE está diseñado precisamente para poder recibir nuevos tipos de pregunta sin crear otro modo completo.

Posibles futuras expansiones pueden seguir mezclando:

```text
canción
álbum
letra
feat
artista
colección
```

El objetivo es que NEW MODE termine siendo el modo con mayor variedad del juego.

---

## Más Boss Rounds

Actualmente:

```text
ronda 5
ronda 10
```

son Boss.

En el futuro pueden existir Boss específicos con mecánicas propias en vez de simplemente versiones más rápidas/difíciles de challenges existentes.

---

## Más profundidad de runs

NEW MODE podría crecer con sistemas como:

```text
runs más largas
rutas alternativas
modificadores de run
eventos
riesgo/recompensa
bonus rounds
perfect bonuses
```

La filosofía sería añadir decisiones interesantes, no sistemas solamente por tener más números.

---

## Expansión de Random

Actualmente Random mezcla los cuatro modos clásicos y challenges de NEW MODE.

En el futuro podría:

* ponderar modalidades;
* evitar repetir el mismo modo consecutivamente;
* aumentar dificultad conforme crece la racha;
* generar sesiones con reglas especiales.

---

## Evolución de OG MODE

OG MODE debe mantenerse deliberadamente más limitado.

Su función no es tener todas las features nuevas.

Su función es conservar la identidad del bot original.

A futuro podría mejorar su fidelidad visual al antiguo Discord sin alterar demasiado sus reglas.

---

## Estadísticas más completas

Actualmente se guardan métricas básicas.

En el futuro podrían añadirse:

```text
accuracy %
partidas totales
preguntas respondidas
modo favorito
mejor modo
peor modo
racha por modalidad
correctas por modalidad
NEW MODE promedio
Bosses derrotados
Perfect Runs
tiempo medio de respuesta
```

---

## Achievements / milestones

Las rachas y runs permiten añadir logros en el futuro.

Ejemplos conceptuales:

```text
primera victoria
racha x10
perfect run
boss perfecto
100 respuestas
1000 respuestas
ganar en todos los modos
```

Todavía no existe un sistema de achievements implementado.

---

## Mejor progresión

Actualmente la progresión depende principalmente de:

```text
score
racha
NEW MODE best
```

En el futuro se puede estudiar una progresión más permanente siempre que no interfiera con la naturaleza rápida del quiz.

---

## Backend

Para una versión pública más seria, una de las prioridades técnicas será dejar de depender directamente de URLs privadas desde el frontend.

Una posible arquitectura:

```text
BUNNY QUIZ
      ↓
API propia
      ↓
bancos de preguntas
```

Esto permitiría:

* ocultar claves;
* controlar acceso;
* validar datos;
* actualizar contenido;
* añadir cuentas;
* sincronizar estadísticas;
* crear leaderboards.

---

## Migrar los JSON

Los bancos actuales proceden directamente del proyecto original.

En algún momento sería recomendable transformarlos a una estructura moderna común.

Por ejemplo:

```json
{
    "id": "song_001",
    "song": "DÁKITI",
    "album": "EL ÚLTIMO TOUR DEL MUNDO",
    "lyrics": "...",
    "artists": [],
    "features": [],
    "tags": []
}
```

De esa forma diferentes juegos podrían compartir la misma información sin necesitar cuatro esquemas totalmente independientes.

---

## Más canciones y preguntas

Los bancos actuales son históricos.

Una parte importante del futuro de BUNNY QUIZ será ampliar:

* canciones;
* letras;
* feats;
* álbumes;
* preguntas;
* artistas relacionados;
* contenido nuevo.

La lógica del juego debería poder crecer sin necesidad de modificar cada modo manualmente por cada canción añadida.

---

## Leaderboards

Si algún día existe backend y cuentas, puede estudiarse:

```text
global score
weekly score
best streak
NEW MODE records
perfect runs
hard mode records
```

No tiene sentido implementar leaderboards reales mientras las estadísticas solamente existan en `localStorage`.

---

## Cuentas y sincronización

Otra posible etapa posterior:

```text
usuario
↓
cuenta
↓
stats sincronizados
↓
jugar desde cualquier dispositivo
```

Actualmente no es necesario para la Alpha.

---

## Compartir resultados

Las runs de NEW MODE podrían generar un resultado compacto para compartir.

Ejemplo:

```text
BUNNY QUIZ

NEW MODE
A0.0.2

8/10
GRADE A
BEST COMBO 6
SCORE 3,840

■■■■■■■■□□
```

Esto permitiría compartir una partida sin necesidad de screenshots.

---

## Accesibilidad

Antes de considerar el juego terminado habrá que revisar especialmente:

* navegación completa con teclado;
* focus states;
* contraste;
* reduced motion;
* lectores de pantalla;
* textos alternativos cuando existan imágenes;
* funcionamiento sin audio;
* tamaño táctil en móvil.

---

## PWA / instalación

Como BUNNY QUIZ es una aplicación bastante autocontenida, en el futuro podría convertirse en una PWA.

Eso permitiría:

```text
Añadir a pantalla de inicio
fullscreen
cache
carga más rápida
experiencia similar a app
```

---

## Animaciones más específicas

Actualmente las animaciones son mínimas.

A futuro se podrían crear transiciones específicas para:

* acierto;
* fallo;
* combo;
* Boss Round;
* pérdida de vida;
* vida recuperada;
* Perfect Run;
* cambio de modalidad en Random.

El objetivo debe seguir siendo que las animaciones comuniquen algo, no añadir movimiento por decoración.

---

# Prioridades aproximadas

Una posible evolución del proyecto sería:

```text
A0.0.x
├── estabilizar gameplay
├── corregir bugs
├── ajustar balance
├── mejorar NEW MODE
└── ampliar bancos

A0.1.x
├── identidad BUNNY QUIZ más definida
├── mejores estadísticas
├── audio inicial
├── animaciones
└── contenido adicional

A0.2.x
├── reestructuración de datos
├── más challenges
├── achievements
└── compartir resultados

Beta
├── backend
├── cuentas opcionales
├── sincronización
├── leaderboards
├── assets visuales definitivos
└── testing amplio

1.0
└── BUNNY QUIZ
```

Este roadmap no es definitivo.

La prioridad sigue siendo que **el juego sea divertido antes de añadir infraestructura enorme alrededor**.

---

# Desarrollo local

Al utilizar `fetch()` hacia servicios externos, abrir directamente:

```text
file:///index.html
```

puede producir problemas dependiendo del navegador y de las políticas CORS.

Es recomendable utilizar un servidor local.

Por ejemplo:

```text
VS Code Live Server
```

o cualquier servidor HTTP estático.

También puede alojarse en servicios como:

```text
GitHub Pages
Netlify
Cloudflare Pages
Vercel
```

siempre que las políticas CORS de las APIs utilizadas permitan las peticiones.

---

# Estructura futura del proyecto

Aunque actualmente un único HTML es suficiente, el proyecto puede separarse cuando realmente lo necesite.

Por ejemplo:

```text
bunny-quiz/
│
├── index.html
│
├── css/
│   └── bunny.css
│
├── js/
│   ├── app.js
│   ├── data.js
│   ├── game.js
│   ├── new-mode.js
│   └── storage.js
│
├── assets/
│   ├── audio/
│   └── images/
│
└── README.md
```

No existe necesidad de hacer esta separación únicamente por parecer un proyecto más grande.

Mientras un solo archivo siga siendo fácil de mantener, puede continuar así.

---

# Créditos / historia

BUNNY QUIZ existe porque años atrás existió un pequeño comando de Discord llamado:

```text
musicquiz
```

Aquella versión utilizaba aoi.js, JSONStorage y una cantidad cuestionable de `awaitedCommand`.

Tenía nombres de comandos como:

```text
mq-start
mq-answer
mq-start-test
mq-start-benosiono
mq-start-adivinarFeat
```

y comentarios históricos de enorme valor técnico.

BUNNY QUIZ no intenta borrar ese código.

Es literalmente la razón por la que existe este proyecto.

---

# License

Por definir.

---

<p align="center">
  <strong>BUNNY QUIZ</strong><br>
  A0.0.2-Alpha<br><br>
  The old bot grew up.
</p>
