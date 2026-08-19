import { APP_INFO, MODE_INFO } from "./config.js";
import { getSessionMetrics, gradeSession } from "./stats.js";

function waitForBlob(canvas) {
    return new Promise((resolve, reject) => {
        canvas.toBlob(blob => {
            if (blob) resolve(blob);
            else reject(new Error("No se pudo generar el PNG."));
        }, "image/png");
    });
}

function drawText(ctx, text, x, y, size, color, options = {}) {
    ctx.fillStyle = color;
    ctx.font = `${options.weight || 700} ${size}px ${options.family || "Arial"}`;
    ctx.textAlign = options.align || "left";
    ctx.fillText(text, x, y);
}

export async function createResultFile(session) {
    const canvas = document.createElement("canvas");
    canvas.width = 1080;
    canvas.height = 1350;
    const ctx = canvas.getContext("2d");
    const metrics = getSessionMetrics(session);
    const grade = gradeSession(session);
    const mode = MODE_INFO[session.mode]?.label || session.mode.toUpperCase();

    ctx.fillStyle = "#10100f";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#d7ff3f";
    ctx.fillRect(0, 0, 24, canvas.height);
    ctx.strokeStyle = "#4a493f";
    ctx.lineWidth = 2;
    ctx.strokeRect(74, 70, 932, 1210);

    drawText(ctx, APP_INFO.name, 110, 150, 42, "#f0ead8", { weight: 900 });
    drawText(ctx, APP_INFO.version.toUpperCase(), 970, 146, 22, "#aaa697", { align: "right", family: "monospace" });
    drawText(ctx, mode, 110, 245, 28, "#ff633d", { family: "monospace" });
    drawText(ctx, "FINAL SCORE", 110, 350, 32, "#aaa697", { family: "monospace" });
    drawText(ctx, String(session.score), 110, 560, 190, "#f0ead8", { weight: 900 });
    drawText(ctx, "PTS", 895, 550, 34, "#aaa697", { align: "right", family: "monospace" });

    ctx.fillStyle = "#ff633d";
    ctx.fillRect(765, 320, 150, 150);
    drawText(ctx, grade, 840, 432, 94, "#080807", { align: "center", weight: 900 });

    ctx.strokeStyle = "#4a493f";
    ctx.beginPath();
    ctx.moveTo(110, 650);
    ctx.lineTo(970, 650);
    ctx.stroke();

    drawText(ctx, `${metrics.correct} / ${metrics.questions}`, 110, 760, 80, "#d7ff3f", { weight: 900 });
    drawText(ctx, `${metrics.accuracy}% ACCURACY`, 110, 810, 25, "#aaa697", { family: "monospace" });
    drawText(ctx, `BEST COMBO ×${metrics.bestCombo}`, 110, 905, 31, "#f0ead8", { family: "monospace" });
    drawText(ctx, `BEST STREAK ×${metrics.bestStreak}`, 110, 960, 31, "#f0ead8", { family: "monospace" });

    if (session.mode === "new") {
        drawText(ctx, `${session.bossesDefeated} BOSSES`, 970, 905, 31, "#ff633d", { align: "right", family: "monospace" });
        drawText(ctx, `${session.events} EVENTS`, 970, 960, 31, "#ff633d", { align: "right", family: "monospace" });
    }

    const blockWidth = 70;
    const gap = 14;
    session.answers.slice(0, 10).forEach((answer, index) => {
        ctx.fillStyle = answer.correct ? "#d7ff3f" : "#4a493f";
        ctx.fillRect(110 + index * (blockWidth + gap), 1065, blockWidth, 70);
    });

    drawText(ctx, "THE OLD BOT GREW UP.", 110, 1210, 22, "#aaa697", { family: "monospace" });

    const blob = await waitForBlob(canvas);
    return new File(
        [blob],
        `bunny-quiz-${session.mode}-${Date.now()}.png`,
        { type: "image/png" }
    );
}

export async function downloadResult(session) {
    const file = await createResultFile(session);
    const url = URL.createObjectURL(file);
    const link = document.createElement("a");
    link.href = url;
    link.download = file.name;
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export async function shareResult(session) {
    const file = await createResultFile(session);

    if (
        navigator.share &&
        (!navigator.canShare || navigator.canShare({ files: [file] }))
    ) {
        await navigator.share({
            title: APP_INFO.name,
            text: `${APP_INFO.name} — ${session.score} puntos`,
            files: [file]
        });
        return "shared";
    }

    const url = URL.createObjectURL(file);
    const link = document.createElement("a");
    link.href = url;
    link.download = file.name;
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    return "downloaded";
}
