import { APP_INFO } from "./config.js";

export function applyAppInfo(root = document) {
    root.querySelectorAll("[data-app-version]").forEach(node => {
        node.textContent = APP_INFO.version;
    });
    root.querySelectorAll("[data-app-channel]").forEach(node => {
        node.textContent = APP_INFO.channel;
    });
    document.title = `${APP_INFO.name} — ${APP_INFO.version}`;
}

export function currentReleaseLabel() {
    return `${APP_INFO.version} / ${APP_INFO.releaseDate}`;
}
