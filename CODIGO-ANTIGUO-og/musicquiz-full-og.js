 module.exports = [{
      name: "musicquiz",
      aliases: ["mq", "music"],
      error: `$channelSendMessage[848733329003118594;{author:$userTag:$authorAvatar}{description:$userTag tuvo un problema con $commandName}{field:Problema:$error}{color:$getVar[Rojo]}]`,
      nonPrefixed: false,
     $if: "v4",
      description: "Adivina la cancion!",
      usage: "mq",
      code: `
$if[1==$random[1;4]]
$awaitMessages[$authorID;10s;yes;mq-start-test;El tiempo acabo]
$reply[$messageID;$get[msg];yes]

$let[msg;Debes pagar **10,000** tickets para poder usar este comando, escribe **\`yes\`** para pagar y poder usar el comando.]
      
      $channelSendMessage[$getVar[ComandosCH];{author:$userTag uso un comando!:$authorAvatar}{description:**$userTag** uso un comando en **$serverName**.\n**Commando**:\n\n$commandName}{color:$getVar[azul]}{thumbnail:$authorAvatar}]
      $suppressErrors[$getVar[error]]     	
      $onlyIf[$getUserVar[Multa]<$getVar[multaMAX];$getVar[MultaPagar] \`|\` $getUserVar[Multa]]
      $onlyIf[$getVar[mantenimiento]==0;$getVar[matenimientoMSG]]
      $onlyIf[$getGlobalUserVar[Blacklist;$authorID]==false;$getVar[BlacklistMSG]]
      $onlyForServers[815444468152795138;$getVar[errorSV]]

$onlyIf[$jsonRequest[$get[link];FEAT#RIGHT#$random[0;$get[randomMAX]]#LEFT#.Nombre;Error en la api bro]!=Error en la api bro;Error de api.]

$let[randomMAX;27]
$let[link;https://api.jsonstorage.net/v1/json/4c6ba042-3b80-490c-99ef-fa590b19537f/027a039c-998f-496c-9311-3ee565cbed71?apiKey=e2161a50-71d9-4dcb-a53e-282f4945b77c]

$onlyIf[$getUserVar[Boletos]>10000;No tienes dinero suficiente para poder jugar este juego.]
$elseif[2==$random[1;4]]

$awaitMessages[$authorID;10s;yes;mq-start-benosiono;El tiempo acabo]

$reply[$messageID;$get[msg];yes]

$let[msg;Debes pagar **10,000** tickets para poder usar este comando, escribe **\`yes\`** para pagar y poder usar el comando.]
      
      $channelSendMessage[$getVar[ComandosCH];{author:$userTag uso un comando!:$authorAvatar}{description:**$userTag** uso un comando en **$serverName**.\n**Commando**:\n\n$commandName}{color:$getVar[azul]}{thumbnail:$authorAvatar}]
      $suppressErrors[$getVar[error]]     	
      $onlyIf[$getUserVar[Multa]<$getVar[multaMAX];$getVar[MultaPagar] \`|\` $getUserVar[Multa]]
      $onlyIf[$getVar[mantenimiento]==0;$getVar[matenimientoMSG]]
      $onlyIf[$getGlobalUserVar[Blacklist;$authorID]==false;$getVar[BlacklistMSG]]
      $onlyForServers[815444468152795138;$getVar[errorSV]]

$onlyIf[$jsonRequest[$get[link];benoOno#RIGHT#$get[random]#LEFT#.name;Error en la api bro]!=Error en la api bro;Error de api.]

$let[link;https://api.jsonstorage.net/v1/json/4c6ba042-3b80-490c-99ef-fa590b19537f/dfa489d2-7e55-482f-93e2-c82b93b8103b?apiKey=e2161a50-71d9-4dcb-a53e-282f4945b77c]
$let[random;$random[0;26]]

$onlyIf[$getUserVar[Boletos]>10000;No tienes dinero suficiente para poder jugar este juego.]
$endElseIf

$elseif[3==$random[1;4]]
$awaitMessages[$authorID;10s;yes;mq-start-adivinarFeat;El tiempo acabo]
$reply[$messageID;$get[msg];yes]

$let[msg;Debes pagar **10,000** tickets para poder usar este comando, escribe **\`yes\`** para pagar y poder usar el comando.]
      
      $channelSendMessage[$getVar[ComandosCH];{author:$userTag uso un comando!:$authorAvatar}{description:**$userTag** uso un comando en **$serverName**.\n**Commando**:\n\n$commandName}{color:$getVar[azul]}{thumbnail:$authorAvatar}]
      $suppressErrors[$getVar[error]]     	
      $onlyIf[$getUserVar[Multa]<$getVar[multaMAX];$getVar[MultaPagar] \`|\` $getUserVar[Multa]]
      $onlyIf[$getVar[mantenimiento]==0;$getVar[matenimientoMSG]]
      $onlyIf[$getGlobalUserVar[Blacklist;$authorID]==false;$getVar[BlacklistMSG]]
      $onlyForServers[815444468152795138;$getVar[errorSV]]

$onlyIf[$jsonRequest[$get[link];ADIVINARFEAT#RIGHT#$random[0;$get[randomMAX]]#LEFT#.correcta;Error en la api bro]!=Error en la api bro;Error de api.]

$let[randomMAX;21]
$let[link;https://api.jsonstorage.net/v1/json/4c6ba042-3b80-490c-99ef-fa590b19537f/35c8da25-3cca-4d1f-b913-2a506c32ea48?apiKey=e2161a50-71d9-4dcb-a53e-282f4945b77c]

$onlyIf[$getUserVar[Boletos]>10000;No tienes dinero suficiente para poder jugar este juego.]
$endElseIf

$else
$awaitMessages[$authorID;10s;yes;mq-start;El tiempo acabo]

$reply[$messageID;$get[msg];yes]

$let[msg;Debes pagar **10,000** tickets para poder usar este comando, escribe **\`yes\`** para pagar y poder usar el comando.]
      
      $channelSendMessage[$getVar[ComandosCH];{author:$userTag uso un comando!:$authorAvatar}{description:**$userTag** uso un comando en **$serverName**.\n**Commando**:\n\n$commandName}{color:$getVar[azul]}{thumbnail:$authorAvatar}]	
      $onlyIf[$getUserVar[Multa]<$getVar[multaMAX];$getVar[MultaPagar] \`|\` $getUserVar[Multa]]
      $onlyIf[$getVar[mantenimiento]==0;$getVar[matenimientoMSG]]
      $onlyIf[$getGlobalUserVar[Blacklist;$authorID]==false;$getVar[BlacklistMSG]]
      $onlyForServers[815444468152795138;$getVar[errorSV]]

$onlyIf[$jsonRequest[$get[link];Letras#RIGHT#0#LEFT#.$get[LUGAR]#RIGHT#$get[random]#LEFT#.name;Error en la api bro]!=Error en la api bro;Error de api.]

$let[random;$random[0;7]]
$let[LUGAR;$randomText[X100PRE;OASIS;YHLQMDLG;LQNIAS;EUTDM;UVST;SINGLES;SINGLES2;TOMMY]]
$let[link;https://api.jsonstorage.net/v1/json/4c6ba042-3b80-490c-99ef-fa590b19537f/0a52e232-5186-4185-973d-7c131a540395?apiKey=e2161a50-71d9-4dcb-a53e-282f4945b77c]
$endIf
$onlyIf[$getUserVar[Boletos]>10000;No tienes dinero suficiente para poder jugar este juego.]
      `,
  }, { /// NO OLVIDES EDITAR ABAJO!!!!
      type: "awaitedCommand",
     $if: "v4",
      name: "mq-start",
      code: `
$setUserVar[Boletos;$sub[$getUserVar[Boletos];10000]]
$awaitMessages[$authorID;10s;everything;mq-answer;Respuesta: ~ **$get[linkFINAL]**]

$setUserVar[MQname;$get[linkFINAL]]
$setUserVar[MQlugar;$get[LUGAR]]

      $author[Adivina la cancion;$authoravatar]
      $description[> **\`$jsonRequest[$get[link];Letras#RIGHT#0#LEFT#.$get[LUGAR]#RIGHT#$get[random]#LEFT#.letra;La api esta que arde]\`**]
      $footer[Tienes 10 segundos para responder.;$client[avatar]]
     $color[$getVar[colorMes]]

$let[linkFINAL;$jsonRequest[$get[link];Letras#RIGHT#0#LEFT#.$get[LUGAR]#RIGHT#$get[random]#LEFT#.name;La api esta que arde]]

$let[random;$random[0;7]]
$let[LUGAR;$randomText[X100PRE;OASIS;YHLQMDLG;LQNIAS;EUTDM;UVST;SINGLES;SINGLES2;TOMMY]]
$let[link;https://api.jsonstorage.net/v1/json/4c6ba042-3b80-490c-99ef-fa590b19537f/0a52e232-5186-4185-973d-7c131a540395?apiKey=e2161a50-71d9-4dcb-a53e-282f4945b77c]`
  }, {
      name: "mq-answer",
      type: "awaitedCommand",
     $if: "v4",
      code: `
$awaitMessages[$authorID;10s;stats;mq-stats; ]
$if[$checkContains[$tolowercase[$message];$tolowercase[$getUserVar[MQname]]]==true]
$setUserVar[Boletos;$sum[$getUserVar[Boletos];25000]]

$reply[$messageID;**Adivinaste**! Tu recompensa es 15,000 tickets!;yes]
$setUserVar[MQwin;$sum[$getUserVar[MQwin];1]]

> Escribe **\`stats\`** para ver tus stats.
$else
$if[$getUserVar[MQlugar]==TOMMY]
$if[1==$random[1;10]]
$reply[$messageID;{author:No adivinaste:$authorAvatar}{description:esta canción se llama: "**\`$getuservar[MQname]\`**" ~ Sabias que Benito (**\`Bad Bunny\`**) participo como Compositor en el album de Tommy Torres? Por eso lo incluimos en esta lista}{color:$getVar[inv]}]
$else
$reply[$messageID;{author:No adivinaste:$authorAvatar}{description:La canción se llama: "**\`$getuservar[MQname] - Tommy Torres\`**"}{color:$getVar[inv]}]
$endif
$else
$reply[$messageID;{author:No adivinaste:$authorAvatar}{description:La canción se llama: "**\`$getuservar[MQname]\`**"}{color:$getVar[inv]}]
$endif
$setUserVar[MQlose;$sum[$getUserVar[MQlose];1]]

> Escribe **\`stats\`** para ver tus stats.
$endIf
`
  }, {
      name: "mq-stats",
      type: "awaitedCommand",
     $if: "v4",
      code: `
Has **GANADO** $getUserVar[MQwin] partidas y has **PERDIDO** $getUserVar[MQlose] partidas.

`
  }, { /// FEATS
      type: "awaitedCommand",
     $if: "v4",
      name: "mq-start-test",
      code: `
$setUserVar[Boletos;$sub[$getUserVar[Boletos];10000]]
$awaitMessages[$authorID;13s;everything;mq-answer-test;{author:Respuesta: ~ **$get[respuesta]**:$authorAvatar}{color:$getVar[Inv]}]
$setUserVar[MQname;$get[respuesta]]

      $author[Adivina el feat;$authoravatar]
      $description[> **\`$get[name]\`**\n\n **\`$get[feats]\`**]
      $footer[Tienes 13 segundos para responder.;$client[avatar]]
     $color[$getVar[colorMes]]

$let[feats;$randomText[$get[respuesta]\n$get[feat1]\n$get[feat2]\n$get[feat3];$get[feat1]\n$get[feat2]\n$get[feat3]\n$get[respuesta];$get[feat2]\n$get[feat3]\n$get[respuesta]\n$get[feat1];$get[feat3]\n$get[respuesta]\n$get[feat1]\n$get[feat2]]]
$let[feat1;$jsonRequest[$get[link];FEAT#RIGHT#$random[0;$get[randomMAX]]#LEFT#.feat1;Error en la api bro]]
$let[feat2;$jsonRequest[$get[link];FEAT#RIGHT#$random[0;$get[randomMAX]]#LEFT#.feat2;Error en la api bro]]
$let[feat3;$jsonRequest[$get[link];FEAT#RIGHT#$random[0;$get[randomMAX]]#LEFT#.feat3;Error en la api bro]]
$let[name;$jsonRequest[$get[link];FEAT#RIGHT#$random[0;$get[randomMAX]]#LEFT#.Nombre;Error en la api bro]]
$let[respuesta;$jsonRequest[$get[link];FEAT#RIGHT#$random[0;$get[randomMAX]]#LEFT#.Correcta;Error en la api bro]]
$let[randomMAX;27]
$let[link;https://api.jsonstorage.net/v1/json/4c6ba042-3b80-490c-99ef-fa590b19537f/027a039c-998f-496c-9311-3ee565cbed71?apiKey=e2161a50-71d9-4dcb-a53e-282f4945b77c]`
  }, {
      name: "mq-answer-test",
      type: "awaitedCommand",
     $if: "v4",
      code: `
$awaitMessages[$authorID;13s;stats;mq-stats; ]
$if[$checkContains[$tolowercase[$message];$tolowercase[$getUserVar[MQname]]]==true]
$setUserVar[Boletos;$sum[$getUserVar[Boletos];25000]]

$reply[$messageID;**Adivinaste**! Tu recompensa es 15,000 tickets!;yes]
$setUserVar[MQwin;$sum[$getUserVar[MQwin];1]]

> Escribe **\`stats\`** para ver tus stats.
$else
$reply[$messageID;{author:No adivinaste:$authorAvatar}{description:el feat se llama: "**\`$getuservar[MQname]\`**"}{color:$getVar[inv]}]
$setUserVar[MQlose;$sum[$getUserVar[MQlose];1]]

> Escribe **\`stats\`** para ver tus stats.
$endIf
`
  }, { /// BenitoSioNo
      type: "awaitedCommand",
     $if: "v4",
      name: "mq-start-benosiono",
      code: `
$setUserVar[Boletos;$sub[$getUserVar[Boletos];10000]]
$awaitMessages[$authorID;13s;everything;mq-answer-benosiono;{author:Respuesta: ~ **$get[respuesta]**:$authorAvatar}{color:$getVar[Inv]}]

$setUserVar[MQname;$get[respuesta]]
$setUserVar[MQlugar;$get[info]]

**¿Esta letra es de una cancion de Benito?**\n> $jsonRequest[$get[link];benoOno#RIGHT#$get[random]#LEFT#.letra;error]\n\n\n> Responde con "**si**" o "**no**".

$let[info;**Nombre de la Canción**: $jsonRequest[$get[link];benoOno#RIGHT#$get[random]#LEFT#.name;Error]\n**Artista**: $jsonRequest[$get[link];benoOno#RIGHT#$get[random]#LEFT#.artista;Error]]
$let[respuesta;$jsonRequest[$get[link];benoOno#RIGHT#$get[random]#LEFT#.beno;error]]
$let[link;https://api.jsonstorage.net/v1/json/4c6ba042-3b80-490c-99ef-fa590b19537f/dfa489d2-7e55-482f-93e2-c82b93b8103b?apiKey=e2161a50-71d9-4dcb-a53e-282f4945b77c]
$let[random;$random[0;26]]` // uso MQlugar para guardar El artista, nombre de la cancion y ya, como si fuera un "MQextra"
  }, {
      name: "mq-answer-benosiono",
      type: "awaitedCommand",
     $if: "v4",
      code: `
$awaitMessages[$authorID;13s;stats;mq-stats;{author:Respuesta: ~ **$get[respuesta]**:$authorAvatar}{color:$getVar[Inv]}]
$if[$checkContains[$tolowercase[$message];$tolowercase[$getUserVar[MQname]]]==true]
$setUserVar[Boletos;$sum[$getUserVar[Boletos];25000]]

$reply[$messageID;**Adivinaste**! Tu recompensa es 15,000 tickets!;yes]
$setUserVar[MQwin;$sum[$getUserVar[MQwin];1]]

> Escribe **\`stats\`** para ver tus stats.
$else
$reply[$messageID;{author:No adivinaste:$authorAvatar}{description:La respuesta es: "**\`$getuservar[MQname]\`**"}{color:$getVar[inv]};yes]
$setUserVar[MQlose;$sum[$getUserVar[MQlose];1]]

> Escribe **\`stats\`** para ver tus stats.
$endIf
`
  }, { /// FEATS ADIVINAR CANCION
      type: "awaitedCommand",
     $if: "v4",
      name: "mq-start-adivinarFeat",
      code: `
$setUserVar[Boletos;$sub[$getUserVar[Boletos];10000]]
$awaitMessages[$authorID;13s;everything;mq-answer-adivinarFeat;{author:Respuesta: ~ **$get[respuesta]**:$authorAvatar}{color:$getVar[Inv]}]
$setUserVar[MQname;$get[respuesta]]

      $author[Adivina la canción con el feat;$authoravatar]
      $description[> **\`$get[name]\`**\n\n **\`$get[feats]\`**]
      $footer[Tienes 13 segundos para responder.;$client[avatar]]
     $color[$getVar[colorMes]]

$let[feats;$randomText[$get[respuesta]\n$get[feat1]\n$get[feat2]\n$get[feat3];$get[feat1]\n$get[feat2]\n$get[feat3]\n$get[respuesta];$get[feat2]\n$get[feat3]\n$get[respuesta]\n$get[feat1];$get[feat3]\n$get[respuesta]\n$get[feat1]\n$get[feat2]]]
$let[feat1;$jsonRequest[$get[link];ADIVINARFEAT#RIGHT#$random[0;$get[randomMAX]]#LEFT#.cancion;Error en la api bro]]
$let[feat2;$jsonRequest[$get[link];ADIVINARFEAT#RIGHT#$random[0;$get[randomMAX]]#LEFT#.cancion2;Error en la api bro]]
$let[feat3;$jsonRequest[$get[link];ADIVINARFEAT#RIGHT#$random[0;$get[randomMAX]]#LEFT#.cancion3;Error en la api bro]]
$let[name;$jsonRequest[$get[link];ADIVINARFEAT#RIGHT#$random[0;$get[randomMAX]]#LEFT#.feat;Error en la api bro]]
$let[respuesta;$jsonRequest[$get[link];ADIVINARFEAT#RIGHT#$random[0;$get[randomMAX]]#LEFT#.correcta;Error en la api bro]]
$let[randomMAX;21]
$let[link;https://api.jsonstorage.net/v1/json/4c6ba042-3b80-490c-99ef-fa590b19537f/35c8da25-3cca-4d1f-b913-2a506c32ea48?apiKey=e2161a50-71d9-4dcb-a53e-282f4945b77c]`
  }, { //Los lets de FEAT[1-3] serian las canciones, pero que paja cambiarlo
      name: "mq-answer-adivinarFeat",
      type: "awaitedCommand",
     $if: "v4",
      code: `
$awaitMessages[$authorID;13s;stats;mq-stats; ]
$if[$checkContains[$tolowercase[$message];$tolowercase[$getUserVar[MQname]]]==true]
$setUserVar[Boletos;$sum[$getUserVar[Boletos];25000]]

$reply[$messageID;**Adivinaste**! Tu recompensa es 15,000 tickets!;yes]
$setUserVar[MQwin;$sum[$getUserVar[MQwin];1]]

> Escribe **\`stats\`** para ver tus stats.
$else
$reply[$messageID;{author:No adivinaste:$authorAvatar}{description:La canción se llama: "**\`$getuservar[MQname]\`**"}{color:$getVar[inv]}]
$setUserVar[MQlose;$sum[$getUserVar[MQlose];1]]

> Escribe **\`stats\`** para ver tus stats.
$endIf
`
  }]