import { MODE_INFO } from "./config.js";

export function accuracy(correct, wrong) {
    const total = correct + wrong;
    return total ? Math.round((correct / total) * 100) : 0;
}

export function createSession(mode, difficulty, maxRounds) {
    return {
        mode,
        difficulty,
        maxRounds,
        startedAt: Date.now(),
        finishedAt: null,
        answers: [],
        correct: 0,
        wrong: 0,
        score: 0,
        streak: 0,
        bestStreak: 0,
        combo: 0,
        bestCombo: 0,
        maxMultiplier: 1,
        bossesDefeated: 0,
        events: 0,
        eventsSurvived: 0,
        livesRemaining: null
    };
}

function updateMode(modeStats, record) {
    modeStats.played++;
    modeStats.correct += record.correct ? 1 : 0;
    modeStats.wrong += record.correct ? 0 : 1;
    modeStats.bestStreak = Math.max(
        modeStats.bestStreak,
        record.sessionStreak || 0
    );
    modeStats.totalResponseTime += record.responseTime;
    modeStats.averageResponseTime = Math.round(
        modeStats.totalResponseTime / modeStats.played
    );
}

export function recordAnswer(profile, session, record) {
    profile.global.wins += record.correct ? 1 : 0;
    profile.global.losses += record.correct ? 0 : 1;
    profile.global.streak = record.correct
        ? profile.global.streak + 1
        : 0;
    profile.global.bestStreak = Math.max(
        profile.global.bestStreak,
        profile.global.streak
    );
    profile.global.score += record.score || 0;

    session.answers.push(record);
    session.correct += record.correct ? 1 : 0;
    session.wrong += record.correct ? 0 : 1;
    session.score += record.score || 0;
    session.streak = record.correct ? session.streak + 1 : 0;
    session.bestStreak = Math.max(session.bestStreak, session.streak);
    session.combo = record.combo ?? session.streak;
    session.bestCombo = Math.max(session.bestCombo, session.combo);
    session.maxMultiplier = Math.max(
        session.maxMultiplier,
        record.multiplier || 1
    );
    session.bossesDefeated += record.boss && record.correct ? 1 : 0;
    session.events += record.event ? 1 : 0;
    session.eventsSurvived += record.event && record.correct ? 1 : 0;

    const primaryMode = MODE_INFO[session.mode] ? session.mode : record.mode;
    updateMode(profile.modes[primaryMode], {
        ...record,
        sessionStreak: session.streak
    });

    if (
        session.mode === "random" &&
        record.mode !== "random" &&
        profile.modes[record.mode]
    ) {
        updateMode(profile.modes[record.mode], {
            ...record,
            sessionStreak: session.streak
        });
    }

    profile.global.totalResponseTime += record.responseTime;
    const totalAnswers = profile.global.wins + profile.global.losses;
    profile.global.averageResponseTime = totalAnswers
        ? Math.round(profile.global.totalResponseTime / totalAnswers)
        : 0;
    profile.global.fastestResponseTime = profile.global.fastestResponseTime === null
        ? record.responseTime
        : Math.min(profile.global.fastestResponseTime, record.responseTime);
}

export function finalizeSession(profile, session) {
    if (session.finishedAt) {
        return session;
    }

    session.finishedAt = Date.now();
    profile.global.sessions++;

    const mode = profile.modes[session.mode];
    if (mode) {
        mode.sessions++;
        mode.bestScore = Math.max(mode.bestScore, session.score);
    }

    if (session.mode === "new") {
        profile.newMode.runs++;
        profile.newMode.perfectRuns +=
            session.correct === session.maxRounds ? 1 : 0;
        profile.newMode.bestRun = Math.max(
            profile.newMode.bestRun,
            session.score
        );
        profile.newMode.bossesDefeated += session.bossesDefeated;
        profile.newMode.bestCombo = Math.max(
            profile.newMode.bestCombo,
            session.bestCombo
        );
        profile.newMode.eventsSurvived += session.eventsSurvived;
    }

    return session;
}

export function getSessionMetrics(session) {
    const responseTimes = session.answers.map(answer => answer.responseTime);
    const totalTime = responseTimes.reduce((sum, value) => sum + value, 0);

    return {
        questions: session.answers.length,
        correct: session.correct,
        wrong: session.wrong,
        accuracy: accuracy(session.correct, session.wrong),
        bestStreak: session.bestStreak,
        bestCombo: session.bestCombo,
        totalTime,
        averageTime: responseTimes.length
            ? Math.round(responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length)
            : 0,
        fastestTime: responseTimes.length ? Math.min(...responseTimes) : 0
    };
}

export function gradeSession(session) {
    if (session.maxRounds === 10) {
        if (session.correct >= 10) return "S+";
        if (session.correct >= 9) return "S";
        if (session.correct >= 8) return "A";
        if (session.correct >= 6) return "B";
        if (session.correct >= 4) return "C";
        return "D";
    }

    const value = accuracy(session.correct, session.wrong);
    if (value === 100) return "S+";
    if (value >= 90) return "S";
    if (value >= 80) return "A";
    if (value >= 60) return "B";
    if (value >= 40) return "C";
    return "D";
}
