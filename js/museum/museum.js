import { APP_INFO } from "../config.js";
import { MUSEUM_ARTIFACTS, MUSEUM_ERAS } from "./artifacts.js";

function escapeHTML(value = "") {
    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}

function artifactTemplate(artifact, index) {
    return `
        <article
            class="archive-item archive-item--${artifact.size}"
            style="--artifact-rotation:${artifact.rotation}deg"
        >
            <button
                type="button"
                class="archive-photo"
                data-artifact-id="${escapeHTML(artifact.id)}"
                aria-label="Abrir ${escapeHTML(artifact.title)}"
            >
                <span class="archive-photo-edge" aria-hidden="true">${String(index + 1).padStart(2, "0")}</span>
                <pre tabindex="-1"><code>${escapeHTML(artifact.code)}</code></pre>
            </button>
            <div class="archive-caption">
                <span>ARCHIVE ITEM ${escapeHTML(artifact.number)}</span>
                <span>${escapeHTML(artifact.era)}</span>
                <h3>${escapeHTML(artifact.title)}</h3>
                <p>${escapeHTML(artifact.caption)}</p>
            </div>
        </article>
    `;
}

export function renderMuseum() {
    const eraRail = document.querySelector("#museumEras");
    const artifactRoot = document.querySelector("#museumArtifacts");

    eraRail.innerHTML = MUSEUM_ERAS.map(era => `
        <div class="museum-era">
            <span>${escapeHTML(era.label)}</span>
            <strong>${escapeHTML(era.title)}</strong>
            <small>${escapeHTML(era.medium)} / ${escapeHTML(era.date)}</small>
        </div>
    `).join("");

    artifactRoot.innerHTML = MUSEUM_ARTIFACTS
        .map(artifactTemplate)
        .join("");

    document.querySelector("#museumFinalVersion").textContent = APP_INFO.version;
}

export function initMuseum() {
    renderMuseum();

    const overlay = document.querySelector("#museumArtifactOverlay");
    const closeButton = document.querySelector("#museumArtifactClose");
    let lastTrigger = null;

    const close = () => {
        overlay.classList.add("hidden");
        document.body.classList.remove("museum-artifact-open");
        lastTrigger?.focus();
    };

    const open = trigger => {
        const artifact = MUSEUM_ARTIFACTS.find(
            item => item.id === trigger.dataset.artifactId
        );
        if (!artifact) return;

        lastTrigger = trigger;
        document.querySelector("#museumArtifactIndex").textContent =
            `ARCHIVE ITEM ${artifact.number} / ${artifact.era}`;
        document.querySelector("#museumArtifactTitle").textContent = artifact.title;
        document.querySelector("#museumArtifactCode").textContent = artifact.code;
        document.querySelector("#museumArtifactCaption").textContent = artifact.caption;
        document.querySelector("#museumArtifactDescription").textContent = artifact.description;
        overlay.classList.remove("hidden");
        document.body.classList.add("museum-artifact-open");
        closeButton.focus();
    };

    document.querySelector("#museumArtifacts").addEventListener("click", event => {
        const trigger = event.target.closest("[data-artifact-id]");
        if (trigger) open(trigger);
    });

    closeButton.addEventListener("click", close);
    overlay.addEventListener("click", event => {
        if (event.target === overlay) close();
    });
    document.addEventListener("keydown", event => {
        if (event.key === "Escape" && !overlay.classList.contains("hidden")) {
            close();
        }
    });
}
