const code = (...lines) => lines.join("\n");

export const MUSEUM_ERAS = Object.freeze([
    {
        id: "era-i",
        label: "ERA I",
        title: "MUSICQUIZ / FULL OG",
        medium: "Discord · aoi.js v4 · awaitedCommands",
        date: "DATE UNKNOWN"
    },
    {
        id: "era-ii",
        label: "ERA II",
        title: "MUSICQUIZ / LATE DISCORD ERA",
        medium: "Interactions · buttons · embeds",
        date: "DATE UNKNOWN"
    },
    {
        id: "era-iii",
        label: "ERA III",
        title: "BUNNY QUIZ",
        medium: "Web · HTML · CSS · JavaScript",
        date: "NOW"
    }
]);

export const MUSEUM_ARTIFACTS = Object.freeze([
    {
        id: "state-machine",
        number: "001",
        era: "ERA I",
        title: "THE AWAITED MACHINE",
        caption: "START → WAIT → ANSWER → STATS",
        description: "Cuatro comandos separados funcionaban juntos como una pequeña máquina de estados. El navegador hace hoy algo más ordenado; la idea central ya estaba aquí.",
        code: code(
            'name: "mq-start",',
            "$awaitMessages[$authorID;10s;everything;mq-answer;Respuesta: ~ **$get[linkFINAL]**]",
            "",
            'name: "mq-answer",',
            "$awaitMessages[$authorID;10s;stats;mq-stats; ]",
            "",
            'name: "mq-stats"'
        ),
        size: "wide",
        rotation: -0.5
    },
    {
        id: "start-test",
        number: "002",
        era: "ERA I",
        title: "TEST THAT MADE IT TO PRODUCTION",
        caption: "Empezó como test. Terminó siendo una modalidad real. El nombre sobrevivió.",
        description: "mq-start-test arrancaba el modo para adivinar el feat. Era estable, tenía timer y guardaba la respuesta. Solo el nombre seguía diciendo que aquello era temporal.",
        code: code(
            '{ /// FEATS',
            '    type: "awaitedCommand",',
            '    name: "mq-start-test",',
            '    code: `',
            "$awaitMessages[$authorID;13s;everything;mq-answer-test;... ]",
            "$setUserVar[MQname;$get[respuesta]]"
        ),
        size: "hero",
        rotation: 0.7
    },
    {
        id: "benosiono",
        number: "003",
        era: "ERA I",
        title: "BENOSIONO",
        caption: "El naming era directo. Extremadamente directo.",
        description: "Este comando se encargaba de una sola pregunta: ¿esta letra es de Benito? El nombre nunca fingió hacer otra cosa.",
        code: code(
            'name: "mq-start-benosiono",',
            'type: "awaitedCommand",',
            "",
            "**¿Esta letra es de una cancion de Benito?**",
            '> Responde con "**si**" o "**no**".'
        ),
        size: "normal",
        rotation: -0.8
    },
    {
        id: "mqlugar",
        number: "004",
        era: "ERA I",
        title: "MQLUGAR → MQEXTRA",
        caption: "Primer trabajo: álbum o categoría. Segundo trabajo: lo que haga falta ahora mismo.",
        description: "MQlugar comenzó ubicando una canción. En Benito Sí/No terminó guardando artista, título y metadata adicional. El propio comentario documentó la promoción de la variable.",
        code: code(
            "$setUserVar[MQlugar;$get[info]]",
            "",
            "$let[info;**Nombre de la Canción**: $jsonRequest[...]",
            "**Artista**: $jsonRequest[...]]",
            "",
            '// uso MQlugar para guardar El artista, nombre de la cancion y ya, como si fuera un "MQextra"'
        ),
        size: "hero",
        rotation: 0.4
    },
    {
        id: "warning",
        number: "005",
        era: "ERA I",
        title: "A WARNING FROM THE PAST",
        caption: "El desarrollador dejó una advertencia para su desarrollador futuro. Era la misma persona.",
        description: "La nota estaba colocada justo antes de los awaitedCommands que también había que modificar. No era elegante. Sí era imposible ignorarla.",
        code: code(
            "}, {",
            "",
            "/// NO OLVIDES EDITAR ABAJO!!!!",
            "",
            'type: "awaitedCommand",',
            'name: "mq-start"'
        ),
        size: "hero marked",
        rotation: -0.35
    },
    {
        id: "before-after-name",
        number: "006",
        era: "ERA I → ERA II",
        title: "THE ANSWER REFUSED",
        caption: "El inicio obtuvo nombre nuevo. La respuesta se negó.",
        description: "La segunda era cambió el comienzo por start-choice-quiz y añadió un botón. El handler siguió llamándose mq-answer-test. Nueva fachada; el mismo cerebro debajo.",
        code: code(
            "ERA I",
            'name: "mq-start-test"',
            'name: "mq-answer-test"',
            "",
            "──────────────",
            "",
            "ERA II",
            'name: "start-choice-quiz"',
            "$awaitMessages[...;mq-answer-test;...]"
        ),
        size: "wide",
        rotation: 0
    },
    {
        id: "paja",
        number: "007",
        era: "ERA I",
        title: "PERO QUE PAJA CAMBIARLO",
        caption: "El naming estaba mal. El código lo sabía. El programador también. La decisión quedó documentada.",
        description: "feat1, feat2 y feat3 ya no representaban feats: eran canciones. Se detectó, se explicó y se decidió conscientemente no tocarlo. La pieza central del archivo.",
        code: code(
            "$let[feat1;$jsonRequest[...#.cancion;Error en la api bro]]",
            "$let[feat2;$jsonRequest[...#.cancion2;Error en la api bro]]",
            "$let[feat3;$jsonRequest[...#.cancion3;Error en la api bro]]",
            "",
            "//Los lets de FEAT[1-3] serian las canciones, pero que paja cambiarlo"
        ),
        size: "monument",
        rotation: -0.2
    },
    {
        id: "random",
        number: "008",
        era: "ERA I",
        title: "FOUR DOORS",
        caption: "El comando original ya era un selector de modalidades.",
        description: "El condicional utilizaba el resultado de $random[1;4] para escoger uno de cuatro recorridos: letras, feats, Benito Sí/No o feat a canción.",
        code: code(
            "$if[1==$random[1;4]]",
            "    ...",
            "$elseif[2==$random[1;4]]",
            "    ...",
            "$elseif[3==$random[1;4]]",
            "    ...",
            "$else",
            "    ...",
            "$endIf"
        ),
        size: "normal",
        rotation: 0.8
    },
    {
        id: "jsonstorage",
        number: "009",
        era: "ERA I / ERA II",
        title: "FOUR SMALL DATABASES",
        caption: "Las preguntas vivían fuera del bot.",
        description: "Cuatro JSON especializados alimentaban letras, feats y respuestas. La clave se muestra redactada: el artefacto importa; el secreto no.",
        code: code(
            "$let[link;https://api.jsonstorage.net/v1/json/...",
            "    ?apiKey=[REDACTED]]",
            "",
            "$jsonRequest[$get[link];Letras#RIGHT#0#LEFT#.$get[LUGAR]... ]"
        ),
        size: "wide",
        rotation: -0.6
    },
    {
        id: "tommy",
        number: "010",
        era: "ERA I → ERA II",
        title: "TOMMY TORRES",
        caption: "SURVIVED MULTIPLE VERSIONS",
        description: "Tommy Torres consiguió su propio easter egg con una probabilidad especial. No era necesario. Precisamente por eso había que conservarlo.",
        code: code(
            "$if[$getUserVar[MQlugar]==TOMMY]",
            "$if[1==$random[1;10]]",
            "... Benito (Bad Bunny) participo como Compositor",
            "en el album de Tommy Torres ...",
            "$endif"
        ),
        size: "normal",
        rotation: 0.55
    },
    {
        id: "tickets",
        number: "011",
        era: "ERA I → ERA II",
        title: "10,000 IN / 25,000 OUT",
        caption: "Antes de los puntos existía una economía completa.",
        description: "Jugar costaba 10,000 tickets y acertar pagaba 25,000. Bunny Quiz retiró esa economía; el museo solo conserva el recibo.",
        code: code(
            "$setUserVar[Boletos;$sub[$getUserVar[Boletos];10000]]",
            "",
            "$setUserVar[Boletos;$sum[$getUserVar[Boletos];25000]]"
        ),
        size: "normal",
        rotation: -0.9
    },
    {
        id: "buttons",
        number: "012",
        era: "ERA II",
        title: "PRESS TO PLAY",
        caption: "La segunda era dejó de pedir yes y empezó a utilizar interactions.",
        description: "El flujo se modernizó: embed, botón JUGAR, interaction y luego awaitMessages. Debajo seguían viviendo los awaited handlers.",
        code: code(
            "$title[🎵 MUSIC QUIZ - Adivina la Canción]",
            "$addButton[1;🎵 ¡JUGAR AHORA!;primary;start-lyric-quiz;false]",
            "",
            'name: "start-lyric-quiz",',
            'type: "interaction",',
            'prototype: "button"'
        ),
        size: "wide",
        rotation: 0.35
    },
    {
        id: "interface-evolution",
        number: "013",
        era: "ERA I → ERA II",
        title: "NEW FACADE / SAME BRAIN",
        caption: "Texto directo se convirtió en embeds y botones sin reemplazar de golpe el sistema interno.",
        description: "ERA I pedía escribir yes. ERA II mostraba un botón. Ambas desembocaban en awaitMessages y en los mismos handlers de respuesta.",
        code: code(
            "ERA I",
            'escribe "yes"',
            "↓ awaitMessages",
            "↓ pregunta",
            "",
            "ERA II",
            "embed",
            '↓ botón "JUGAR"',
            "↓ interaction",
            "↓ awaitMessages"
        ),
        size: "normal",
        rotation: -0.4
    },
    {
        id: "stats-evolution",
        number: "014",
        era: "ERA I → ERA III",
        title: "MQWIN / MQLOSE",
        caption: "Las primeras stats eran literalmente victorias y derrotas.",
        description: "Luego llegaron ratio, dinero ganado y dinero gastado. En Bunny Quiz el mismo hilo termina en stats por modo, tiempos, records y mastery por álbum.",
        code: code(
            "$setUserVar[MQwin;$sum[$getUserVar[MQwin];1]]",
            "$setUserVar[MQlose;$sum[$getUserVar[MQlose];1]]",
            "",
            "Has GANADO $getUserVar[MQwin] partidas",
            "y has PERDIDO $getUserVar[MQlose] partidas.",
            "",
            "MQwin / MQlose → ratio → mode stats → album mastery"
        ),
        size: "wide",
        rotation: 0.6
    },
    {
        id: "four-modes",
        number: "015",
        era: "ERA I → ERA III",
        title: "THE ORIGINAL FOUR",
        caption: "Los cuatro modos terminaron convirtiéndose en el núcleo histórico de Bunny Quiz.",
        description: "Letras, feats, Benito Sí/No y feat a canción sobrevivieron al cambio de Discord a la web. OG MODE existe para mantener esa línea intacta.",
        code: code(
            "01  LETRA → CANCIÓN       mq-start",
            "02  ADIVINA EL FEAT       mq-start-test",
            "03  BENITO SÍ / NO        mq-start-benosiono",
            "04  FEAT → CANCIÓN        mq-start-adivinarFeat"
        ),
        size: "monument",
        rotation: 0
    }
]);
