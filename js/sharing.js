import { APP_INFO, CONFIG, MODE_INFO } from "./config.js";
import { getSessionMetrics, gradeSession } from "./stats.js";
import { getSessionTheme } from "./themes.js";

function waitForBlob(canvas) {
    return new Promise((resolve, reject) => {
        canvas.toBlob(blob => {
            if (blob) resolve(blob);
            else reject(new Error("No se pudo generar el PNG."));
        }, "image/png");
    });
}

function loadOptionalImage(source) {
    if (!source || typeof Image === "undefined") return Promise.resolve(null);

    return new Promise(resolve => {
        const image = new Image();
        image.onload = () => resolve(image);
        image.onerror = () => resolve(null);
        image.src = source;
    });
}

function drawText(ctx, text, x, y, size, color, options = {}) {
    ctx.fillStyle = color;
    ctx.font = `${options.weight || 700} ${size}px ${options.family || "Arial Narrow, Arial"}`;
    ctx.textAlign = options.align || "left";
    ctx.fillText(text, x, y);
}

function drawPhotoFile(ctx, image, colors) {
    const x = 650;
    const y = 160;
    const width = 310;
    const height = 410;

    ctx.fillStyle = colors.deep;
    ctx.fillRect(x, y, width, height);

    if (image) {
        ctx.drawImage(image, x, y, width, height);
    } else {
        ctx.strokeStyle = colors.secondary;
        ctx.lineWidth = 2;
        ctx.strokeRect(x + 18, y + 18, width - 36, height - 74);
        drawText(ctx, "BQ", x + 38, y + 285, 170, colors.secondary, { weight: 900 });
        drawText(ctx, "VISUAL FILE / NO ASSET", x + 24, y + height - 26, 17, colors.paper, { family: "monospace" });
    }
}

export async function createResultFile(session) {
    const canvas = document.createElement("canvas");
    canvas.width = 1080;
    canvas.height = 1350;
    const ctx = canvas.getContext("2d");
    const metrics = getSessionMetrics(session);
    const grade = gradeSession(session);
    const mode = MODE_INFO[session.mode]?.label || session.mode.toUpperCase();
    const theme = getSessionTheme(session);
    const colors = theme.colors;
    const optionalPhoto = await loadOptionalImage(CONFIG.assets.photos.result);

    ctx.fillStyle = colors.stage;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = colors.primary;
    ctx.fillRect(0, 0, 20, canvas.height);
    ctx.fillStyle = colors.signal;
    ctx.fillRect(20, 0, 9, 320);

    ctx.strokeStyle = colors.deep;
    ctx.lineWidth = 2;
    ctx.strokeRect(72, 68, 936, 1215);

    drawText(ctx, "BUNNY QUIZ", 104, 138, 42, colors.paper, { weight: 900 });
    drawText(ctx, APP_INFO.version.toUpperCase(), 970, 132, 20, colors.secondary, { align: "right", family: "monospace" });
    drawText(ctx, `FINAL SCORE / ${theme.label}`, 104, 205, 19, colors.primary, { family: "monospace" });

    drawPhotoFile(ctx, optionalPhoto, colors);

    drawText(ctx, "GRADE", 104, 300, 18, colors.secondary, { family: "monospace" });
    drawText(ctx, grade, 104, 515, 245, colors.signal, { weight: 900 });

    drawText(ctx, mode, 104, 620, 27, colors.paper, { family: "monospace" });
    ctx.strokeStyle = colors.primary;
    ctx.beginPath();
    ctx.moveTo(104, 655);
    ctx.lineTo(970, 655);
    ctx.stroke();

    drawText(ctx, String(session.score), 104, 885, 190, colors.paper, { weight: 900 });
    drawText(ctx, "POINTS", 970, 875, 28, colors.secondary, { align: "right", family: "monospace" });

    drawText(ctx, `${metrics.correct}/${metrics.questions}`, 104, 972, 68, colors.primary, { weight: 900 });
    drawText(ctx, `${metrics.accuracy}% ACCURACY`, 104, 1015, 20, colors.secondary, { family: "monospace" });
    drawText(ctx, `BEST COMBO ×${metrics.bestCombo}`, 970, 958, 27, colors.paper, { align: "right", family: "monospace" });
    drawText(ctx, `BEST STREAK ×${metrics.bestStreak}`, 970, 1007, 27, colors.paper, { align: "right", family: "monospace" });

    const blockWidth = 72;
    const gap = 13;
    session.answers.slice(0, 10).forEach((answer, index) => {
        ctx.fillStyle = answer.correct ? colors.primary : colors.deep;
        ctx.fillRect(104 + index * (blockWidth + gap), 1085, blockWidth, 64);
        if (!answer.correct) {
            ctx.strokeStyle = colors.signal;
            ctx.strokeRect(104 + index * (blockWidth + gap), 1085, blockWidth, 64);
        }
    });

    drawText(ctx, "MUSIC MAGAZINE / ARCADE / ARCHIVE", 104, 1232, 18, colors.secondary, { family: "monospace" });
    drawText(ctx, "THE OLD BOT GREW UP.", 970, 1232, 18, colors.signal, { align: "right", family: "monospace" });

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
