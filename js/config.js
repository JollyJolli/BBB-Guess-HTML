export const APP_INFO = Object.freeze({
    name: "BUNNY QUIZ",
    version: "A0.0.5-Alpha",
    channel: "alpha",
    releaseDate: "2026-08-19"
});

export const CONFIG = Object.freeze({
    app: APP_INFO,

    data: {
        sources: {
            lyrics: {
                name: "Letras",
                root: "Letras",
                url: "https://api.jsonstorage.net/v1/json/4c6ba042-3b80-490c-99ef-fa590b19537f/0a52e232-5186-4185-973d-7c131a540395?apiKey=e2161a50-71d9-4dcb-a53e-282f4945b77c"
            },
            feat: {
                name: "FEAT",
                root: "FEAT",
                url: "https://api.jsonstorage.net/v1/json/4c6ba042-3b80-490c-99ef-fa590b19537f/027a039c-998f-496c-9311-3ee565cbed71?apiKey=e2161a50-71d9-4dcb-a53e-282f4945b77c"
            },
            benito: {
                name: "benoOno",
                root: "benoOno",
                url: "https://api.jsonstorage.net/v1/json/4c6ba042-3b80-490c-99ef-fa590b19537f/dfa489d2-7e55-482f-93e2-c82b93b8103b?apiKey=e2161a50-71d9-4dcb-a53e-282f4945b77c"
            },
            featSong: {
                name: "ADIVINARFEAT",
                root: "ADIVINARFEAT",
                url: "https://api.jsonstorage.net/v1/json/4c6ba042-3b80-490c-99ef-fa590b19537f/35c8da25-3cca-4d1f-b913-2a506c32ea48?apiKey=e2161a50-71d9-4dcb-a53e-282f4945b77c"
            }
        }
    },

    gameplay: {
        sessionRounds: 10,
        timers: {
            lyrics: { easy: 0, hard: 12, og: 10 },
            feat: { easy: 0, hard: 11, og: 13 },
            benito: { easy: 0, hard: 8, og: 13 },
            featSong: { easy: 0, hard: 8, og: 13 }
        }
    },

    scoring: {
        base: {
            easy: 100,
            hard: 200,
            og: 175,
            newEasy: 175,
            newHard: 260
        },
        randomNewBonus: 50,
        timePointRate: 8,
        streakPointRate: 15,
        streakBonusCap: 300,
        bossMultiplier: 2,
        comboStep: 2,
        comboStepValue: 0.25,
        comboMultiplierCap: 2.5,
        comboThresholds: [3, 5, 8, 10]
    },

    mastery: {
        minimumExposure: 3,
        solidExposure: 7,
        masterExposure: 12,
        solidScore: 68,
        masterScore: 85,
        historyWindow: 12
    },

    newMode: {
        rounds: 10,
        lives: 3,
        bossRounds: [5, 10],
        lifeRecoveryCombo: 4,
        eventChance: 0.28,
        eventAnnouncementMs: 950,
        events: {
            doubleDown: {
                label: "DOUBLE DOWN",
                description: "Esta pregunta vale el doble.",
                rarity: "uncommon",
                scoreMultiplier: 2
            },
            panic: {
                label: "PANIC",
                description: "El reloj viene recortado.",
                rarity: "common",
                timerMultiplier: 0.65
            },
            comboShield: {
                label: "COMBO SHIELD",
                description: "Un fallo no rompe el combo.",
                rarity: "rare",
                preserveCombo: true
            },
            secondWind: {
                label: "SECOND WIND",
                description: "Acierta y recupera una vida.",
                rarity: "rare",
                recoverLife: true
            },
            jackpot: {
                label: "JACKPOT",
                description: "Menos tiempo. Recompensa x2.5.",
                rarity: "rare",
                scoreMultiplier: 2.5,
                timerMultiplier: 0.72
            },
            bossRush: {
                label: "BOSS RUSH",
                description: "Esta ronda acaba de convertirse en boss.",
                rarity: "rare",
                forceBoss: true
            }
        }
    },

    storage: {
        key: "bunny-quiz-profile-v2",
        legacyKey: "musicquiz-alpha-stats",
        version: 2
    },

    features: {
        changelog: true,
        resultImage: true,
        share: true,
        statsByMode: true,
        mastery: true,
        newModeEvents: true,
        museum: true
    }
});

export const MODE_INFO = Object.freeze({
    lyrics: { index: "01", label: "LETRA → CANCIÓN" },
    feat: { index: "02", label: "ADIVINA EL FEAT" },
    benito: { index: "03", label: "¿BENITO O NO?" },
    featSong: { index: "04", label: "FEAT → CANCIÓN" },
    new: { index: "05", label: "NEW MODE" },
    random: { index: "06", label: "RANDOM" },
    og: { index: "07", label: "OG MODE" }
});
