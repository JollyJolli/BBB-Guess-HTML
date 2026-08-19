import { CONFIG } from "./config.js";

function normalizeAlbum(album) {
    return String(album || "").trim().toUpperCase();
}

export function updateAlbumMastery(profile, album, correct) {
    const key = normalizeAlbum(album);
    if (!key) return;

    const current = profile.albums[key] || {
        seen: 0,
        correct: 0,
        wrong: 0,
        history: []
    };

    current.seen++;
    current.correct += correct ? 1 : 0;
    current.wrong += correct ? 0 : 1;
    current.history.push(Boolean(correct));
    current.history = current.history.slice(-CONFIG.mastery.historyWindow);
    profile.albums[key] = current;
}

export function calculateMastery(albumStats) {
    const seen = albumStats?.seen || 0;
    const correct = albumStats?.correct || 0;
    const accuracy = seen ? (correct / seen) * 100 : 0;
    const recent = albumStats?.history || [];
    const recentAccuracy = recent.length
        ? (recent.filter(Boolean).length / recent.length) * 100
        : accuracy;
    const consistency = Math.max(0, 100 - Math.abs(accuracy - recentAccuracy));
    const exposure = Math.min(
        1,
        seen / CONFIG.mastery.masterExposure
    );
    const score = Math.round(
        accuracy * 0.7 + consistency * 0.15 + exposure * 15
    );

    let level = "FAMILIAR";
    if (seen < CONFIG.mastery.minimumExposure) {
        level = "UNRANKED";
    } else if (
        seen >= CONFIG.mastery.masterExposure &&
        score >= CONFIG.mastery.masterScore
    ) {
        level = "MASTER";
    } else if (
        seen >= CONFIG.mastery.solidExposure &&
        score >= CONFIG.mastery.solidScore
    ) {
        level = "SOLID";
    }

    return { seen, correct, accuracy: Math.round(accuracy), consistency, score, level };
}

export function getMasteryRows(profile) {
    return Object.entries(profile.albums)
        .map(([album, stats]) => ({
            album,
            ...calculateMastery(stats)
        }))
        .sort((a, b) => b.score - a.score || b.seen - a.seen);
}
