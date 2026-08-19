import { CONFIG } from "./config.js";

export function calculateBaseScore({
    difficulty,
    sessionMode,
    currentMode
}) {
    const base = CONFIG.scoring.base;

    if (sessionMode === "new") {
        return difficulty === "hard" ? base.newHard : base.newEasy;
    }

    let points = sessionMode === "og"
        ? base.og
        : difficulty === "hard"
            ? base.hard
            : base.easy;

    if (sessionMode === "random" && currentMode === "new") {
        points += CONFIG.scoring.randomNewBonus;
    }

    return points;
}

export function calculateComboMultiplier(combo, isNewMode = false) {
    if (!isNewMode) {
        return 1;
    }

    const { comboStep, comboStepValue, comboMultiplierCap } = CONFIG.scoring;
    return Math.min(
        comboMultiplierCap,
        1 + Math.floor(combo / comboStep) * comboStepValue
    );
}

export function calculateTimeBonus(secondsLeft) {
    return Math.round(
        Math.max(0, secondsLeft) * CONFIG.scoring.timePointRate
    );
}

export function calculateEventBonus(event) {
    return event?.scoreMultiplier || 1;
}

export function calculateBossBonus(isBoss) {
    return isBoss ? CONFIG.scoring.bossMultiplier : 1;
}

export function calculateStandardScore({
    difficulty,
    sessionMode,
    currentMode,
    streak,
    secondsLeft
}) {
    const base = calculateBaseScore({ difficulty, sessionMode, currentMode });
    const streakBonus = Math.min(
        streak * CONFIG.scoring.streakPointRate,
        CONFIG.scoring.streakBonusCap
    );
    const timeBonus = calculateTimeBonus(secondsLeft);

    return {
        base,
        streakBonus,
        timeBonus,
        total: base + streakBonus + timeBonus
    };
}

export function calculateNewModeScore({
    difficulty,
    combo,
    secondsLeft,
    boss,
    event
}) {
    const base = calculateBaseScore({
        difficulty,
        sessionMode: "new",
        currentMode: "new"
    });
    const timeBonus = calculateTimeBonus(secondsLeft);
    const comboMultiplier = calculateComboMultiplier(combo, true);
    const bossMultiplier = calculateBossBonus(boss);
    const eventMultiplier = calculateEventBonus(event);
    const total = Math.round(
        (base + timeBonus) * comboMultiplier * bossMultiplier * eventMultiplier
    );

    return {
        base,
        timeBonus,
        comboMultiplier,
        bossMultiplier,
        eventMultiplier,
        total
    };
}

export function getComboMilestone(combo) {
    const thresholds = CONFIG.scoring.comboThresholds;

    if (combo >= thresholds[3]) {
        return { level: 4, label: "ON FIRE" };
    }
    if (combo >= thresholds[2]) {
        return { level: 3, label: "NO MISSES" };
    }
    if (combo >= thresholds[1]) {
        return { level: 2, label: "HEATING UP" };
    }
    if (combo >= thresholds[0]) {
        return { level: 1, label: "COMBO" };
    }
    return { level: 0, label: "COMBO" };
}
