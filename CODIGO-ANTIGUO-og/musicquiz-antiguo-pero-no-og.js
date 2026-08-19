module.exports = [{
  name: "musicquiz",
  aliases: ["mq", "music"],
  nonPrefixed: false,
  $if: "old",
  description: "¡Adivina la canción y gana dinero! 🎵",
  usage: "mq",
  code: `
$if[1==$random[1;4]]
$title[🎵 MUSIC QUIZ - Adivina la Canción]
$description[🔥 **¡Ey!** ¿Te crees que conoces todas las canciones de Benito?\n\n💰 **Costo:** 10,000 $getVar[coinName] $getVar[coinEmoji]\n🏆 **Premio:** 25,000 $getVar[coinName] $getVar[coinEmoji]\n\n🎯 **Modalidad:** Adivina por la letra\n⏰ Solo tienes **10 segundos** pa' demostrar que eres un verdadero fan]
$color[$getVar[color]]
$footer[Bad Bunny Music Quiz • Presiona el botón para jugar]
$addButton[1;🎵 ¡JUGAR AHORA!;primary;start-lyric-quiz;false]

$onlyIf[$getGlobalUserVar[blacklist;$authorID]==false;]
$onlyIf[$jsonRequest[$get[link];FEAT#RIGHT#$random[0;$get[randomMAX]]#LEFT#.Nombre;Error en la api bro]!=Error en la api bro;❌ Error de conexión con la API, intenta de nuevo.]
$let[randomMAX;27]
$let[link;https://api.jsonstorage.net/v1/json/4c6ba042-3b80-490c-99ef-fa590b19537f/027a039c-998f-496c-9311-3ee565cbed71?apiKey=e2161a50-71d9-4dcb-a53e-282f4945b77c]
$onlyIf[$getGlobalUserVar[cash]>9999;{newEmbed:{title:💸 Sin Dinero}{description:Necesitas al menos **10,000** $getVar[coinName] $getVar[coinEmoji] para jugar\n\n💡 Usa otros comandos para ganar dinero y vuelve cuando tengas suficiente}{color:#FF6B6B}}]

$elseif[2==$random[1;4]]
$title[🎵 MUSIC QUIZ - ¿Benito o No?]
$description[🔥 **¡Ey bellaco!** Te voy a mostrar una letra...\n\n💰 **Costo:** 10,000 $getVar[coinName] $getVar[coinEmoji]\n🏆 **Premio:** 25,000 $getVar[coinName] $getVar[coinEmoji]\n\n🎯 **Modalidad:** ¿Es de Bad Bunny o no?\n⏰ Solo tienes **13 segundos** pa' decidir]
$color[$getVar[color]]
$footer[Bad Bunny Music Quiz • ¿Será de Benito?]
$addButton[1;🤔 ¡ADIVINAR!;primary;start-benito-quiz;false]

$onlyIf[$getGlobalUserVar[blacklist;$authorID]==false;]
$onlyIf[$jsonRequest[$get[link];benoOno#RIGHT#$get[random]#LEFT#.name;Error en la api bro]!=Error en la api bro;❌ Error de conexión con la API, intenta de nuevo.]
$let[link;https://api.jsonstorage.net/v1/json/4c6ba042-3b80-490c-99ef-fa590b19537f/dfa489d2-7e55-482f-93e2-c82b93b8103b?apiKey=e2161a50-71d9-4dcb-a53e-282f4945b77c]
$let[random;$random[0;26]]
$onlyIf[$getGlobalUserVar[cash]>9999;{newEmbed:{title:💸 Sin Dinero}{description:Necesitas al menos **10,000** $getVar[coinName] $getVar[coinEmoji] para jugar\n\n💡 Usa otros comandos para ganar dinero y vuelve cuando tengas suficiente}{color:#FF6B6B}}]

$endElseIf

$elseif[3==$random[1;4]]
$title[🎵 MUSIC QUIZ - Adivina por el Feat]
$description[🔥 **¡Ey bellaco!** Te doy el feat y tú me dices la canción\n\n💰 **Costo:** 10,000 $getVar[coinName] $getVar[coinEmoji]\n🏆 **Premio:** 25,000 $getVar[coinName] $getVar[coinEmoji]\n\n🎯 **Modalidad:** Identifica la canción por el featuring\n⏰ Solo tienes **13 segundos** pa' responder]
$color[$getVar[color]]
$footer[Bad Bunny Music Quiz • ¡A ver si conoces los collabs!]
$addButton[1;🎤 ¡JUGAR YA!;primary;start-feat-quiz;false]

$onlyIf[$getGlobalUserVar[blacklist;$authorID]==false;]
$onlyIf[$jsonRequest[$get[link];ADIVINARFEAT#RIGHT#$random[0;$get[randomMAX]]#LEFT#.correcta;Error en la api bro]!=Error en la api bro;❌ Error de conexión con la API, intenta de nuevo.]
$let[randomMAX;21]
$let[link;https://api.jsonstorage.net/v1/json/4c6ba042-3b80-490c-99ef-fa590b19537f/35c8da25-3cca-4d1f-b913-2a506c32ea48?apiKey=e2161a50-71d9-4dcb-a53e-282f4945b77c]
$onlyIf[$getGlobalUserVar[cash]>9999;{newEmbed:{title:💸 Sin Dinero}{description:Necesitas al menos **10,000** $getVar[coinName] $getVar[coinEmoji] para jugar\n\n💡 Usa otros comandos para ganar dinero y vuelve cuando tengas suficiente}{color:#FF6B6B}}]

$endElseIf

$else
$title[🎵 MUSIC QUIZ - Quién Colabora]
$description[🔥 **¡Ey bellaco!** Te doy opciones y tú eliges quién colabora\n\n💰 **Costo:** 10,000 $getVar[coinName] $getVar[coinEmoji]\n🏆 **Premio:** 25,000 $getVar[coinName] $getVar[coinEmoji]\n\n🎯 **Modalidad:** Múltiple opción de featurings\n⏰ Solo tienes **13 segundos** pa' elegir]
$color[$getVar[color]]
$footer[Bad Bunny Music Quiz • ¡Elige sabiamente!]
$addButton[1;🎯 ¡A JUGAR!;primary;start-choice-quiz;false]

$onlyIf[$getGlobalUserVar[blacklist;$authorID]==false;]
$onlyIf[$jsonRequest[$get[link];Letras#RIGHT#0#LEFT#.$get[LUGAR]#RIGHT#$get[random]#LEFT#.name;Error en la api bro]!=Error en la api bro;❌ Error de conexión con la API, intenta de nuevo.]
$let[random;$random[0;7]]
$let[LUGAR;$randomText[X100PRE;OASIS;YHLQMDLG;LQNIAS;EUTDM;UVST;SINGLES;SINGLES2;TOMMY]]
$let[link;https://api.jsonstorage.net/v1/json/4c6ba042-3b80-490c-99ef-fa590b19537f/0a52e232-5186-4185-973d-7c131a540395?apiKey=e2161a50-71d9-4dcb-a53e-282f4945b77c]
$onlyIf[$getGlobalUserVar[cash]>9999;{newEmbed:{title:💸 Sin Dinero}{description:Necesitas al menos **10,000** $getVar[coinName] $getVar[coinEmoji] para jugar\n\n💡 Usa otros comandos para ganar dinero y vuelve cuando tengas suficiente}{color:#FF6B6B}}]

$endIf
$cooldown[5m;Tiempo restante: %time%]
$onlyForIDs[166181471369953280; Comando en mantenimiento :\(]
`,
}, {
  // BOTÓN - QUIZ DE LETRAS
  name: "start-lyric-quiz",
  type: "interaction",
  prototype: "button",
  code: `
$onlyIf[$authorID==$interactionData[user.id];{newEmbed:{title:❌ No Autorizado}{description:Solo quien inició el quiz puede jugar}{color:#FF6B6B}}]
$setGlobalUserVar[cash;$sub[$getGlobalUserVar[cash];10000]]
$setGuildVar[loteriaMoney;$sum[$getGuildVar[loteriaMoney];10000]]
$awaitMessages[$channelID;$authorID;10s;$authorID;mq-answer;{newEmbed:{title:⏰ Tiempo Agotado}{description:La respuesta era: **$get[linkFINAL]**\n\n🔥 ¡Dale que la próxima la clavas!}{color:#FF6B6B}}]

$setGlobalUserVar[MQname;$get[linkFINAL]]
$setGlobalUserVar[MQlugar;$get[LUGAR]]

$interactionUpdate[{newEmbed:
{title:🎵 ADIVINA LA CANCIÓN}
{description:🔥 **¡Dale bellaco!** Lee esta letra y dime qué canción es:\n\n> **"$jsonRequest[$get[link];Letras#RIGHT#0#LEFT#.$get[LUGAR]#RIGHT#$get[random]#LEFT#.letra;Error]"**\n\n⏰ Tienes **10 segundos** para escribir tu respuesta\n💡 Solo escribe el nombre de la canción}
{color:$getVar[color]}
{footer:Music Quiz • ¡A ver si la sabes!}
}]

$let[linkFINAL;$jsonRequest[$get[link];Letras#RIGHT#0#LEFT#.$get[LUGAR]#RIGHT#$get[random]#LEFT#.name;Error]]
$let[random;$random[0;7]]
$let[LUGAR;$randomText[X100PRE;OASIS;YHLQMDLG;LQNIAS;EUTDM;UVST;SINGLES;SINGLES2;TOMMY]]
$let[link;https://api.jsonstorage.net/v1/json/4c6ba042-3b80-490c-99ef-fa590b19537f/0a52e232-5186-4185-973d-7c131a540395?apiKey=e2161a50-71d9-4dcb-a53e-282f4945b77c]
`
}, {
  // BOTÓN - QUIZ BENITO O NO
  name: "start-benito-quiz",
  type: "interaction",
  prototype: "button",
  code: `
$onlyIf[$authorID==$interactionData[user.id];{newEmbed:{title:❌ No Autorizado}{description:Solo quien inició el quiz puede jugar}{color:#FF6B6B}}]
$setGlobalUserVar[cash;$sub[$getGlobalUserVar[cash];10000]]
$setGuildVar[loteriaMoney;$sum[$getGuildVar[loteriaMoney];10000]]
$awaitMessages[$channelID;$authorID;13s;$authorID;mq-answer-benosiono;{newEmbed:{title:⏰ Se Acabó el Tiempo}{description:La respuesta era: **$get[respuesta]**\n\n$get[info]\n\n🔥 ¡La próxima será tu momento!}{color:#FF6B6B}}]

$setGlobalUserVar[MQname;$get[respuesta]]
$setGlobalUserVar[MQlugar;$get[info]]

$interactionUpdate[{newEmbed:
{title:🤔 ¿ES DE BENITO O NO?}
{description:🔥 **¡Ey bellaco!** Te voy a mostrar una letra:\n\n> **"$jsonRequest[$get[link];benoOno#RIGHT#$get[random]#LEFT#.letra;error]"**\n\n❓ **¿Esta letra es de una canción de Bad Bunny?**\n\n⏰ Tienes **13 segundos** para responder\n💡 Responde solo con **"si"** o **"no"**}
{color:$getVar[color]}
{footer:Music Quiz • ¿Será de Benito?}
}]

$let[info;**🎵 Canción:** $jsonRequest[$get[link];benoOno#RIGHT#$get[random]#LEFT#.name;Error]\n**🎤 Artista:** $jsonRequest[$get[link];benoOno#RIGHT#$get[random]#LEFT#.artista;Error]]
$let[respuesta;$jsonRequest[$get[link];benoOno#RIGHT#$get[random]#LEFT#.beno;error]]
$let[link;https://api.jsonstorage.net/v1/json/4c6ba042-3b80-490c-99ef-fa590b19537f/dfa489d2-7e55-482f-93e2-c82b93b8103b?apiKey=e2161a50-71d9-4dcb-a53e-282f4945b77c]
$let[random;$random[0;26]]
`
}, {
  // BOTÓN - QUIZ DE FEAT
  name: "start-feat-quiz",
  type: "interaction",
  prototype: "button",
  code: `
$onlyIf[$authorID==$interactionData[user.id];{newEmbed:{title:❌ No Autorizado}{description:Solo quien inició el quiz puede jugar}{color:#FF6B6B}}]
$setGlobalUserVar[cash;$sub[$getGlobalUserVar[cash];10000]]
$setGuildVar[loteriaMoney;$sum[$getGuildVar[loteriaMoney];10000]]
$awaitMessages[$channelID;$authorID;13s;$authorID;mq-answer-adivinarfeat;{newEmbed:{title:⏰ Game Over}{description:La respuesta era: **$get[respuesta]**\n\n🔥 ¡Sigue practicando que tú puedes!}{color:#FF6B6B}}]

$setGlobalUserVar[MQname;$get[respuesta]]

$interactionUpdate[{newEmbed:
{title:🎤 ADIVINA LA CANCIÓN POR EL FEAT}
{description:🔥 **¡Dale bellaco!** Te doy el featuring y tú me dices la canción:\n\n🎯 **Feat con:** $get[name]\n\n📝 **Opciones:**\n$get[feats]\n\n⏰ Tienes **13 segundos** para escribir tu respuesta\n💡 Solo escribe el nombre de la canción correcta}
{color:$getVar[color]}
{footer:Music Quiz • ¡A ver si conoces los collabs!}
}]

$let[feats;$randomText[> $get[respuesta]\n> $get[feat1]\n> $get[feat2]\n> $get[feat3];> $get[feat1]\n> $get[feat2]\n> $get[feat3]\n> $get[respuesta];> $get[feat2]\n> $get[feat3]\n> $get[respuesta]\n> $get[feat1];> $get[feat3]\n> $get[respuesta]\n> $get[feat1]\n> $get[feat2]]]
$let[feat1;$jsonRequest[$get[link];ADIVINARFEAT#RIGHT#$random[0;$get[randomMAX]]#LEFT#.cancion;Error]]
$let[feat2;$jsonRequest[$get[link];ADIVINARFEAT#RIGHT#$random[0;$get[randomMAX]]#LEFT#.cancion2;Error]]
$let[feat3;$jsonRequest[$get[link];ADIVINARFEAT#RIGHT#$random[0;$get[randomMAX]]#LEFT#.cancion3;Error]]
$let[name;$jsonRequest[$get[link];ADIVINARFEAT#RIGHT#$random[0;$get[randomMAX]]#LEFT#.feat;Error]]
$let[respuesta;$jsonRequest[$get[link];ADIVINARFEAT#RIGHT#$random[0;$get[randomMAX]]#LEFT#.correcta;Error]]
$let[randomMAX;21]
$let[link;https://api.jsonstorage.net/v1/json/4c6ba042-3b80-490c-99ef-fa590b19537f/35c8da25-3cca-4d1f-b913-2a506c32ea48?apiKey=e2161a50-71d9-4dcb-a53e-282f4945b77c]
`
}, {
  // BOTÓN - QUIZ DE OPCIONES
  name: "start-choice-quiz",
  type: "interaction",
  prototype: "button",
  code: `
$onlyIf[$authorID==$interactionData[user.id];{newEmbed:{title:❌ No Autorizado}{description:Solo quien inició el quiz puede jugar}{color:#FF6B6B}}]
$setGlobalUserVar[cash;$sub[$getGlobalUserVar[cash];10000]]
$setGuildVar[loteriaMoney;$sum[$getGuildVar[loteriaMoney];10000]]
$awaitMessages[$channelID;$authorID;13s;$authorID;mq-answer-test;{newEmbed:{title:⏰ Se Te Acabó el Tiempo}{description:La respuesta era: **$get[respuesta]**\n\n🔥 ¡Tranquilo que la próxima la tienes!}{color:#FF6B6B}}]

$setGlobalUserVar[MQname;$get[respuesta]]

$interactionUpdate[{newEmbed:
{title:🎯 ¿QUIÉN COLABORA EN ESTA CANCIÓN?}
{description:🔥 **¡Dale bellaco!** Te doy la canción y las opciones:\n\n🎵 **Canción:** $get[name]\n\n📝 **¿Quién colabora?**\n$get[feats]\n\n⏰ Tienes **13 segundos** para escribir tu respuesta\n💡 Solo escribe el nombre del artista correcto}
{color:$getVar[color]}
{footer:Music Quiz • ¡Elige sabiamente!}
}]

$let[feats;$randomText[> $get[respuesta]\n> $get[feat1]\n> $get[feat2]\n> $get[feat3];> $get[feat1]\n> $get[feat2]\n> $get[feat3]\n> $get[respuesta];> $get[feat2]\n> $get[feat3]\n> $get[respuesta]\n> $get[feat1];> $get[feat3]\n> $get[respuesta]\n> $get[feat1]\n> $get[feat2]]]
$let[feat1;$jsonRequest[$get[link];FEAT#RIGHT#$random[0;$get[randomMAX]]#LEFT#.feat1;Error]]
$let[feat2;$jsonRequest[$get[link];FEAT#RIGHT#$random[0;$get[randomMAX]]#LEFT#.feat2;Error]]
$let[feat3;$jsonRequest[$get[link];FEAT#RIGHT#$random[0;$get[randomMAX]]#LEFT#.feat3;Error]]
$let[name;$jsonRequest[$get[link];FEAT#RIGHT#$random[0;$get[randomMAX]]#LEFT#.Nombre;Error]]
$let[respuesta;$jsonRequest[$get[link];FEAT#RIGHT#$random[0;$get[randomMAX]]#LEFT#.Correcta;Error]]
$let[randomMAX;27]
$let[link;https://api.jsonstorage.net/v1/json/4c6ba042-3b80-490c-99ef-fa590b19537f/027a039c-998f-496c-9311-3ee565cbed71?apiKey=e2161a50-71d9-4dcb-a53e-282f4945b77c]
`
}, {
  // RESPUESTA QUIZ LETRAS
  name: "mq-answer",
  type: "awaited",
  $if: "old",
  code: `
$awaitMessages[$channelID;$authorID;10s;$authorID;mq-stats;]
$if[$checkContains[$tolowercase[$message];$tolowercase[$getGlobalUserVar[MQname]]]==true]
$setGlobalUserVar[cash;$sum[$getGlobalUserVar[cash];25000]]

$sendMessage[
{newEmbed:
{title:🎉 ¡CORRECTO!}
{description:🔥 **¡Ey sí, tú sí que sabes!** \n\n💰 **Has ganado:** 25,000 $getVar[coinName] $getVar[coinEmoji]\n💳 **Tu balance:** $getGlobalUserVar[cash] $getVar[coinName] $getVar[coinEmoji]\n\n🏆 ¡Eres un verdadero fan de Benito!\n\n📊 Escribe **\`stats\`** para ver tus estadísticas}
{color:#00FF00}
{footer:Music Quiz • ¡Sigue así campeón!}
}]

$setGlobalUserVar[MQwin;$sum[$getGlobalUserVar[MQwin];1]]
$else
$if[$getGlobalUserVar[MQlugar]==TOMMY]
$if[1==$random[1;10]]
$sendMessage[
{newEmbed:
{title:❌ No Adivinaste}
{description:🎵 **La canción era:** "$getGlobaluservar[MQname]"\n\n🔥 **¿Sabías que...?** Benito (**Bad Bunny**) participó como compositor en el álbum de Tommy Torres. ¡Por eso lo incluimos en esta lista!\n\n💡 ¡Sigue practicando que la próxima la tienes!\n\n📊 Escribe **\`stats\`** para ver tus estadísticas}
{color:#FF6B6B}
{footer:Music Quiz • ¡No te rindas!}
}]
$else
$sendMessage[
{newEmbed:
{title:❌ No Adivinaste}
{description:🎵 **La canción era:** "$getGlobaluservar[MQname] - Tommy Torres"\n\n💡 ¡Sigue practicando que la próxima la tienes!\n\n📊 Escribe **\`stats\`** para ver tus estadísticas}
{color:#FF6B6B}
{footer:Music Quiz • ¡No te rindas!}
}]
$endif
$else
$sendMessage[
{newEmbed:
{title:❌ No Adivinaste}
{description:🎵 **La canción era:** "$getGlobaluservar[MQname]"\n\n💡 ¡Sigue practicando que la próxima la tienes!\n\n📊 Escribe **\`stats\`** para ver tus estadísticas}
{color:#FF6B6B}
{footer:Music Quiz • ¡No te rindas!}
}]
$endif
$setGlobalUserVar[MQlose;$sum[$getGlobalUserVar[MQlose];1]]
$endIf
`
}, {
  // RESPUESTA QUIZ BENITO
  name: "mq-answer-benosiono",
  type: "awaited",
  $if: "old",
  code: `
$awaitMessages[$channelID;$authorID;13s;$authorID;mq-stats;]
$if[$checkContains[$tolowercase[$message];$tolowercase[$getGlobalUserVar[MQname]]]==true]
$setGlobalUserVar[cash;$sum[$getGlobalUserVar[cash];25000]]

$sendMessage[
{newEmbed:
{title:🎉 ¡CORRECTO!}
{description:🔥 **¡Ey sí, tú sí que sabes!** \n\n💰 **Has ganado:** 25,000 $getVar[coinName] $getVar[coinEmoji]\n💳 **Tu balance:** $getGlobalUserVar[cash] $getVar[coinName] $getVar[coinEmoji]\n\n🏆 ¡Conoces bien la música!\n\n📊 Escribe **\`stats\`** para ver tus estadísticas}
{color:#00FF00}
{footer:Music Quiz • ¡Sigue así campeón!}
}]

$setGlobalUserVar[MQwin;$sum[$getGlobalUserVar[MQwin];1]]
$else
$sendMessage[
{newEmbed:
{title:❌ No Adivinaste}
{description:🎵 **La respuesta era:** "$getGlobaluservar[MQname]"\n\n$getGlobalUserVar[MQlugar]\n\n💡 ¡Sigue practicando que la próxima la tienes!\n\n📊 Escribe **\`stats\`** para ver tus estadísticas}
{color:#FF6B6B}
{footer:Music Quiz • ¡No te rindas!}
}]

$setGlobalUserVar[MQlose;$sum[$getGlobalUserVar[MQlose];1]]
$endIf
`
}, {
  // RESPUESTA QUIZ FEAT
  name: "mq-answer-adivinarfeat",
  type: "awaited",
  $if: "old",
  code: `
$awaitMessages[$channelID;$authorID;13s;$authorID;mq-stats;]
$if[$checkContains[$tolowercase[$message];$tolowercase[$getGlobalUserVar[MQname]]]==true]
$setGlobalUserVar[cash;$sum[$getGlobalUserVar[cash];25000]]

$sendMessage[
{newEmbed:
{title:🎉 ¡CORRECTO!}
{description:🔥 **¡Ey sí, tú sí que sabes!** \n\n💰 **Has ganado:** 25,000 $getVar[coinName] $getVar[coinEmoji]\n💳 **Tu balance:** $getGlobalUserVar[cash] $getVar[coinName] $getVar[coinEmoji]\n\n🏆 ¡Conoces todos los collabs!\n\n📊 Escribe **\`stats\`** para ver tus estadísticas}
{color:#00FF00}
{footer:Music Quiz • ¡Sigue así campeón!}
}]

$setGlobalUserVar[MQwin;$sum[$getGlobalUserVar[MQwin];1]]
$else
$reply[$messageID;true]
$sendMessage[
{newEmbed:
{title:❌ No Adivinaste}
{description:🎵 **La canción era:** "$getGlobaluservar[MQname]"\n\n💡 ¡Sigue practicando que la próxima la tienes!\n\n📊 Escribe **\`stats\`** para ver tus estadísticas}
{color:#FF6B6B}
{footer:Music Quiz • ¡No te rindas!}
}]

$setGlobalUserVar[MQlose;$sum[$getGlobalUserVar[MQlose];1]]
$endIf
`
}, {
  // RESPUESTA QUIZ OPCIONES
  name: "mq-answer-test",
  type: "awaited",
  $if: "old",
  code: `
$awaitMessages[$channelID;$authorID;13s;$authorID;mq-stats;]
$if[$checkContains[$tolowercase[$message];$tolowercase[$getGlobalUserVar[MQname]]]==true]
$setGlobalUserVar[cash;$sum[$getGlobalUserVar[cash];25000]]

$sendMessage[
{newEmbed:
{title:🎉 ¡CORRECTO!}
{description:🔥 **¡Ey sí, tú sí que sabes!** \n\n💰 **Has ganado:** 25,000 $getVar[coinName] $getVar[coinEmoji]\n💳 **Tu balance:** $getGlobalUserVar[cash] $getVar[coinName] $getVar[coinEmoji]\n\n🏆 ¡Eres un experto en featurings!\n\n📊 Escribe **\`stats\`** para ver tus estadísticas}
{color:#00FF00}
{footer:Music Quiz • ¡Sigue así campeón!}
}]

$setGlobalUserVar[MQwin;$sum[$getGlobalUserVar[MQwin];1]]
$else
$sendMessage[
{newEmbed:
{title:❌ No Adivinaste}
{description:🎵 **El feat era:** "$getGlobaluservar[MQname]"\n\n💡 ¡Sigue practicando que la próxima la tienes!\n\n📊 Escribe **\`stats\`** para ver tus estadísticas}
{color:#FF6B6B}
{footer:Music Quiz • ¡No te rindas!}
}]

$setGlobalUserVar[MQlose;$sum[$getGlobalUserVar[MQlose];1]]
$endIf
`
}, {
  // ESTADÍSTICAS
  name: "mq-stats",
  type: "awaited",
  $if: "old",
  code: `
$sendMessage[
{newEmbed:
{title:📊 TUS STATS EN MUSIC QUIZ}
{description:🔥 **¡Ey!** Aquí están tus estadísticas:\n\n🏆 **Victorias:** $getGlobalUserVar[MQwin] partidas\n❌ **Derrotas:** $getGlobalUserVar[MQlose] partidas\n\n📈 **Ratio de Victorias:** $math[$getGlobalUserVar[MQwin]/($getGlobalUserVar[MQwin]+$getGlobalUserVar[MQlose])*100;2]%\n\n💰 **Dinero ganado total:** $math[$getGlobalUserVar[MQwin]*25000] $getVar[coinName] $getVar[coinEmoji]\n💸 **Dinero gastado total:** $math[($getGlobalUserVar[MQwin]+$getGlobalUserVar[MQlose])*10000] $getVar[coinName] $getVar[coinEmoji]\n\n🎯 ¡Sigue jugando para mejorar tus stats!}
{color:$getVar[color]}
{footer:Music Quiz Stats • ¡Que siga la racha!}
}]
`
}]