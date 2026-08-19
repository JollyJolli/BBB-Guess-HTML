import { CONFIG } from "../config.js";

export function selectNewModeEvent({
    round,
    boss,
    lastEvent,
    lives,
    maxLives
}) {
    if (
        round <= 1 ||
        Math.random() > CONFIG.newMode.eventChance ||
        lastEvent
    ) {
        return null;
    }

    const entries = Object.entries(CONFIG.newMode.events)
        .filter(([id]) => {
            if (boss && ["panic", "jackpot", "bossRush"].includes(id)) {
                return false;
            }
            if (id === "secondWind") {
                return round >= 3 && lives < maxLives;
            }
            if (id === "bossRush") {
                return !CONFIG.newMode.bossRounds.includes(round + 1);
            }
            return true;
        });

    if (!entries.length) return null;
    const [id, event] = entries[Math.floor(Math.random() * entries.length)];
    return { id, ...event };
}

export function applyEventToRound(round, event) {
    if (!event) return round;

    round.event = event;
    if (event.timerMultiplier) {
        round.timer = Math.max(4, Math.round(round.timer * event.timerMultiplier));
    }
    if (event.forceBoss) {
        round.boss = true;
    }
    return round;
}
