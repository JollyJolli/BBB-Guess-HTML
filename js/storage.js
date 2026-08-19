import { APP_INFO, CONFIG, MODE_INFO } from "./config.js";

function emptyModeStats() {
    return {
        played: 0,
        sessions: 0,
        correct: 0,
        wrong: 0,
        bestStreak: 0,
        bestScore: 0,
        totalResponseTime: 0,
        averageResponseTime: 0
    };
}

export function createDefaultProfile() {
    const modes = Object.fromEntries(
        Object.keys(MODE_INFO).map(mode => [mode, emptyModeStats()])
    );

    return {
        global: {
            wins: 0,
            losses: 0,
            streak: 0,
            bestStreak: 0,
            score: 0,
            sessions: 0,
            totalResponseTime: 0,
            averageResponseTime: 0,
            fastestResponseTime: null
        },
        modes,
        albums: {},
        newMode: {
            runs: 0,
            perfectRuns: 0,
            bestRun: 0,
            bossesDefeated: 0,
            bestCombo: 0,
            eventsSurvived: 0
        },
        meta: {
            storageVersion: CONFIG.storage.version,
            lastSeenVersion: null,
            museumUnlocked: false,
            migratedFrom: null,
            updatedAt: null
        }
    };
}

function mergeProfile(saved) {
    const defaults = createDefaultProfile();
    const profile = {
        ...defaults,
        ...saved,
        global: { ...defaults.global, ...(saved?.global || {}) },
        newMode: { ...defaults.newMode, ...(saved?.newMode || {}) },
        meta: { ...defaults.meta, ...(saved?.meta || {}) },
        albums: saved?.albums && typeof saved.albums === "object"
            ? saved.albums
            : {},
        modes: { ...defaults.modes }
    };

    Object.keys(defaults.modes).forEach(mode => {
        profile.modes[mode] = {
            ...defaults.modes[mode],
            ...(saved?.modes?.[mode] || {})
        };
    });

    profile.meta.storageVersion = CONFIG.storage.version;
    return profile;
}

function migrateLegacy(legacy) {
    const profile = createDefaultProfile();
    const wins = Number(legacy?.wins) || 0;
    const losses = Number(legacy?.losses) || 0;

    profile.global = {
        ...profile.global,
        wins,
        losses,
        streak: Number(legacy?.streak) || 0,
        bestStreak: Number(legacy?.bestStreak) || 0,
        score: Number(legacy?.score) || 0
    };
    profile.newMode = {
        ...profile.newMode,
        runs: Number(legacy?.newRuns) || 0,
        perfectRuns: Number(legacy?.newPerfectRuns) || 0,
        bestRun: Number(legacy?.newBest) || 0
    };
    profile.meta.lastSeenVersion = "A0.0.2-Alpha";
    profile.meta.migratedFrom = CONFIG.storage.legacyKey;
    return profile;
}

function readJSON(key) {
    try {
        const raw = localStorage.getItem(key);
        return raw ? JSON.parse(raw) : null;
    } catch {
        return null;
    }
}

export function loadProfile() {
    const current = readJSON(CONFIG.storage.key);

    if (current) {
        return mergeProfile(current);
    }

    const legacy = readJSON(CONFIG.storage.legacyKey);
    const profile = legacy ? migrateLegacy(legacy) : createDefaultProfile();
    saveProfile(profile);
    return profile;
}

export function saveProfile(profile) {
    profile.meta.storageVersion = CONFIG.storage.version;
    profile.meta.updatedAt = new Date().toISOString();
    try {
        localStorage.setItem(CONFIG.storage.key, JSON.stringify(profile));
    } catch {
        // El juego sigue funcionando aunque el navegador bloquee storage.
    }
}

export function hasUnseenVersion(profile) {
    return Boolean(
        profile.meta.lastSeenVersion &&
        profile.meta.lastSeenVersion !== APP_INFO.version
    );
}

export function markVersionSeen(profile) {
    profile.meta.lastSeenVersion = APP_INFO.version;
    saveProfile(profile);
}

export function unlockMuseum(profile) {
    profile.meta.museumUnlocked = true;
    saveProfile(profile);
}
