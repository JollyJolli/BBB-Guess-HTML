import { APP_INFO } from "../config.js";
import {
    MUSEUM_ARTIFACTS,
    MUSEUM_ERAS,
    MUSEUM_ORIGIN_PROFILE
} from "./artifacts.js";

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
            data-collection="${escapeHTML(artifact.collection || "musicquiz")}"
            style="--artifact-rotation:${artifact.rotation}deg"
        >
            <button
                type="button"
                class="archive-photo"
                data-artifact-id="${escapeHTML(artifact.id)}"
                data-cursor="VIEW"
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
                ${artifact.source
                    ? `<small class="archive-source">${escapeHTML(artifact.source)} / ${escapeHTML(artifact.sourceDate || "DATE UNKNOWN")}</small>`
                    : ""}
            </div>
        </article>
    `;
}

function renderOriginProfile() {
    const profile = MUSEUM_ORIGIN_PROFILE;
    const root = document.querySelector("#museumOriginProfile");
    const maxFiles = Math.max(...profile.systems.map(system => system.files));

    root.innerHTML = `
        <header class="origin-heading">
            <div>
                <p class="section-index">${escapeHTML(profile.label)}</p>
                <h2 id="museumOriginTitle">${escapeHTML(profile.title)}</h2>
            </div>
            <div class="origin-intro">
                <p>${escapeHTML(profile.description)}</p>
                <span>${escapeHTML(profile.date)}</span>
            </div>
        </header>

        <dl class="origin-stats">
            ${profile.stats.map(stat => `
                <div>
                    <dt>${escapeHTML(stat.label)}</dt>
                    <dd>${escapeHTML(stat.value)}</dd>
                </div>
            `).join("")}
        </dl>

        <div class="origin-ledger">
            <div class="origin-tree">
                <span>REPOSITORY / ROOT</span>
                <pre>${escapeHTML(profile.tree.join("\n"))}</pre>
            </div>
            <div class="origin-systems">
                <span>COMMAND TREE / FILES BY SYSTEM</span>
                ${profile.systems.map(system => `
                    <div class="origin-system" style="--system-size:${Math.round((system.files / maxFiles) * 100)}%">
                        <strong>${escapeHTML(system.label)}</strong>
                        <i aria-hidden="true"></i>
                        <b>${system.files}</b>
                    </div>
                `).join("")}
            </div>
        </div>
    `;
}

export function renderMuseum() {
    const eraRail = document.querySelector("#museumEras");
    const artifactRoot = document.querySelector("#museumArtifacts");

    renderOriginProfile();

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

    document.querySelector("#museumArtifactRange").textContent =
        `01—${String(MUSEUM_ARTIFACTS.length).padStart(2, "0")}`;

    document.querySelector("#museumFinalVersion").textContent = APP_INFO.version;
}

export function initMuseum() {
    renderMuseum();

    const overlay = document.querySelector("#museumArtifactOverlay");
    const closeButton = document.querySelector("#museumArtifactClose");
    let lastTrigger = null;

    const close = () => {
        overlay.classList.add("hidden");
        overlay.setAttribute("aria-hidden", "true");
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
        document.querySelector("#museumArtifactSource").textContent = artifact.source
            ? `SOURCE / ${artifact.source} / ${artifact.sourceDate || "DATE UNKNOWN"}`
            : "SOURCE / MUSICQUIZ PRESERVED CODE";
        overlay.setAttribute("aria-hidden", "false");
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

        if (event.key === "Tab" && !overlay.classList.contains("hidden")) {
            const focusable = [...overlay.querySelectorAll("button, [tabindex='0']")];
            const first = focusable[0];
            const last = focusable.at(-1);

            if (event.shiftKey && document.activeElement === first) {
                event.preventDefault();
                last.focus();
            }
            else if (!event.shiftKey && document.activeElement === last) {
                event.preventDefault();
                first.focus();
            }
        }
    });
}
