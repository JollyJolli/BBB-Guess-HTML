/* =========================================================
   MUSIC QUIZ
   A.0.1-B
   ========================================================= */


import { APP_INFO, CONFIG, MODE_INFO } from "./config.js";
import { CHANGELOG } from "./data/changelog.js";
import {
    hasUnseenVersion,
    loadProfile,
    markVersionSeen,
    saveProfile,
    unlockMuseum
} from "./storage.js";
import {
    calculateNewModeScore,
    calculateStandardScore,
    getComboMilestone
} from "./scoring.js";
import {
    accuracy,
    createSession,
    finalizeSession,
    getSessionMetrics,
    gradeSession,
    recordAnswer
} from "./stats.js";
import { getMasteryRows, updateAlbumMastery } from "./mastery.js";
import { applyEventToRound, selectNewModeEvent } from "./new-mode/events.js";
import { downloadResult, shareResult } from "./sharing.js";
import { applyAppInfo } from "./versions.js";
import { initMuseum } from "./museum/museum.js";
import {
    getAlbumTheme,
    setAlbumTheme
} from "./themes.js";
import { initEditorialCursor } from "./cursor.js";

/* =========================================================
   DATA SOURCES
   ========================================================= */

const SOURCES = CONFIG.data.sources;


/* =========================================================
   STATE
   ========================================================= */

const profile = loadProfile();

const state = {

    difficulty:
        "easy",

    sessionMode:
        null,

    currentMode:
        null,

    currentRound:
        null,

    round:
        0,

    answered:
        false,

    timerId:
        null,

    timerDeadline:
        null,

    timerDuration:
        0,

    questionStartedAt:
        0,

    eventTimerId:
        null,

    data: {

        lyrics:
            null,

        feat:
            null,

        benito:
            null,

        featSong:
            null

    },

    errors: {},

    profile,

    stats:
        profile.global,

    session:
        null,

    newRun:
        null

};


/* =========================================================
   DOM
   ========================================================= */

const $ =
    selector =>
        document.querySelector(
            selector
        );


const $$ =
    selector =>
        [
            ...document.querySelectorAll(
                selector
            )
        ];


const menuScreen =
    $("#menuScreen");


const gameScreen =
    $("#gameScreen");


const statusDot =
    $("#statusDot");


const statusText =
    $("#statusText");


function showScreen(screenId) {

    $$(".screen")
        .forEach(screen =>
            screen.classList.toggle(
                "active",
                screen.id === screenId
            )
        );

    window.scrollTo({ top: 0, behavior: "auto" });

}


/* =========================================================
   LOCAL STORAGE
   ========================================================= */

function saveStats() {
    saveProfile(state.profile);
}


/* =========================================================
   GENERIC HELPERS
   ========================================================= */

function randomItem(array) {

    if (!array?.length) {
        return null;
    }

    return array[
        Math.floor(
            Math.random() *
            array.length
        )
    ];

}


function shuffle(array) {

    const copy =
        [...array];


    for (
        let i =
            copy.length - 1;

        i > 0;

        i--
    ) {

        const j =
            Math.floor(
                Math.random() *
                (i + 1)
            );


        [
            copy[i],
            copy[j]
        ] =
        [
            copy[j],
            copy[i]
        ];

    }


    return copy;

}


function sample(array, amount) {

    return shuffle(array)
        .slice(
            0,
            amount
        );

}


function unique(array) {

    return [
        ...new Set(
            array.filter(Boolean)
        )
    ];

}


function escapeHTML(value = "") {

    return String(value)

        .replaceAll(
            "&",
            "&amp;"
        )

        .replaceAll(
            "<",
            "&lt;"
        )

        .replaceAll(
            ">",
            "&gt;"
        )

        .replaceAll(
            '"',
            "&quot;"
        )

        .replaceAll(
            "'",
            "&#039;"
        );

}


function cleanText(value) {

    if (
        value === null ||
        value === undefined
    ) {
        return "";
    }


    return String(value)
        .trim();

}


function pad(number) {

    return String(number)
        .padStart(
            2,
            "0"
        );

}


/* =========================================================
   TEXT NORMALIZATION
   ========================================================= */

function normalizeAnswer(value) {

    return cleanText(value)

        .normalize("NFD")

        .replace(
            /[\u0300-\u036f]/g,
            ""
        )

        .toLowerCase()

        .replace(
            /&/g,
            " y "
        )

        .replace(
            /[^a-z0-9\s]/g,
            " "
        )

        .replace(
            /\s+/g,
            " "
        )

        .trim();

}


/* =========================================================
   LEVENSHTEIN
   ========================================================= */

function levenshtein(a, b) {

    if (!a.length) {
        return b.length;
    }

    if (!b.length) {
        return a.length;
    }


    const matrix =
        Array.from(

            {
                length:
                    b.length + 1
            },

            () =>
                Array(
                    a.length + 1
                ).fill(0)

        );


    for (
        let i = 0;
        i <= b.length;
        i++
    ) {

        matrix[i][0] =
            i;

    }


    for (
        let j = 0;
        j <= a.length;
        j++
    ) {

        matrix[0][j] =
            j;

    }


    for (
        let i = 1;
        i <= b.length;
        i++
    ) {

        for (
            let j = 1;
            j <= a.length;
            j++
        ) {

            const cost =
                b[i - 1] ===
                a[j - 1]
                    ? 0
                    : 1;


            matrix[i][j] =
                Math.min(

                    matrix[i - 1][j] +
                        1,

                    matrix[i][j - 1] +
                        1,

                    matrix[i - 1][j - 1] +
                        cost

                );

        }

    }


    return matrix[
        b.length
    ][
        a.length
    ];

}


/* =========================================================
   FUZZY ANSWERS
   ========================================================= */

function isTextAnswerCorrect(
    input,
    expected
) {

    const user =
        normalizeAnswer(
            input
        );


    const answer =
        normalizeAnswer(
            expected
        );


    if (
        !user ||
        !answer
    ) {
        return false;
    }


    if (
        user ===
        answer
    ) {
        return true;
    }


    /*
        Spiritualmente heredado del bot.

        "creo que es dakiti"

        puede contar como DAKITI.
    */

    if (
        answer.length >= 4 &&
        user.includes(answer)
    ) {
        return true;
    }


    /*
        Pequeña tolerancia a typo.
    */

    if (
        answer.length >= 7 &&
        Math.abs(
            answer.length -
            user.length
        ) <= 2
    ) {

        return (
            levenshtein(
                user,
                answer
            ) <= 2
        );

    }


    return false;

}


/* =========================================================
   ROUND ANSWER CHECK
   ========================================================= */

function isRoundAnswerCorrect(
    input,
    round
) {

    const accepted =
        round.acceptedAnswers?.length

            ? round.acceptedAnswers

            : [
                round.answer
            ];


    if (
        round.strict
    ) {

        return accepted.some(

            answer =>
                normalizeAnswer(input) ===
                normalizeAnswer(answer)

        );

    }


    return accepted.some(

        answer =>
            isTextAnswerCorrect(
                input,
                answer
            )

    );

}


/* =========================================================
   JSON HELPERS
   ========================================================= */

function maybeParseJSON(value) {

    if (
        typeof value !==
        "string"
    ) {

        return value;

    }


    try {

        return JSON.parse(
            value
        );

    }

    catch {

        return value;

    }

}


function deepFindKey(
    node,
    wanted,
    depth = 0
) {

    if (
        !node ||
        typeof node !==
            "object" ||
        depth > 8
    ) {

        return null;

    }


    if (
        Object.prototype
            .hasOwnProperty
            .call(
                node,
                wanted
            )
    ) {

        return node[wanted];

    }


    for (
        const value
        of Object.values(node)
    ) {

        if (
            value &&
            typeof value ===
                "object"
        ) {

            const result =
                deepFindKey(

                    value,
                    wanted,
                    depth + 1

                );


            if (
                result !== null
            ) {

                return result;

            }

        }

    }


    return null;

}


function objectToArray(value) {

    if (
        Array.isArray(value)
    ) {

        return value
            .filter(Boolean);

    }


    if (
        value &&
        typeof value ===
            "object"
    ) {

        return Object.values(value)

            .filter(

                item =>
                    item &&
                    typeof item ===
                        "object"

            );

    }


    return [];

}


/* =========================================================
   FETCH
   ========================================================= */

async function fetchJSON(source) {

    const response =
        await fetch(

            source.url,

            {
                cache:
                    "no-store"
            }

        );


    if (
        !response.ok
    ) {

        throw new Error(

            `${response.status} ${response.statusText}`

        );

    }


    const rawText =
        await response.text();


    const parsed =
        maybeParseJSON(
            rawText
        );


    if (
        typeof parsed ===
            "string"
    ) {

        throw new Error(
            "La API no devolvió JSON válido."
        );

    }


    return parsed;

}


/* =========================================================
   LOAD SOURCE
   ========================================================= */

async function loadSource(key) {

    const source =
        SOURCES[key];


    try {

        const raw =
            await fetchJSON(
                source
            );


        const root =
            deepFindKey(

                raw,
                source.root

            );


        if (
            root === null ||
            root === undefined
        ) {

            throw new Error(

                `No encontré "${source.root}" en el JSON.`

            );

        }


        state.data[key] =
            normalizeSource(
                key,
                root
            );


        if (
            !state.data[key] ||
            !state.data[key].length
        ) {

            throw new Error(

                `El banco "${source.root}" está vacío o cambió de estructura.`

            );

        }


        delete state.errors[key];


        return true;

    }

    catch (error) {

        console.error(

            `[MusicQuiz] ${key}:`,

            error

        );


        state.errors[key] =
            error.message;


        state.data[key] =
            null;


        return false;

    }

}


/* =========================================================
   LOAD EVERYTHING
   ========================================================= */

async function loadAllSources() {

    setConnectionStatus(
        "loading"
    );


    await Promise.all(

        Object.keys(
            SOURCES
        )
        .map(
            loadSource
        )

    );


    updateConnectionStatus();

}


/* =========================================================
   NORMALIZE SOURCES
   ========================================================= */

function normalizeSource(
    key,
    root
) {

    if (
        key === "lyrics"
    ) {

        return normalizeLyrics(
            root
        );

    }


    return objectToArray(root)

        .filter(

            item =>
                item &&
                typeof item ===
                    "object"

        );

}


/* =========================================================
   NORMALIZE LYRICS
   ========================================================= */

function normalizeLyrics(root) {

    /*
        Código original:

        Letras[0].X100PRE[index]
        Letras[0].OASIS[index]
        Letras[0].YHLQMDLG[index]
        ...

        Aquí lo convertimos a un único array:

        {
            name,
            letra,
            album
        }
    */


    let albumContainer =
        root;


    if (
        Array.isArray(root) &&
        root.length
    ) {

        albumContainer =
            root[0];

    }


    if (
        !albumContainer ||
        typeof albumContainer !==
            "object"
    ) {

        return [];

    }


    const songs =
        [];


    for (
        const [
            album,
            entries
        ]
        of Object.entries(
            albumContainer
        )
    ) {

        const list =
            objectToArray(
                entries
            );


        for (
            const entry
            of list
        ) {

            const name =
                cleanText(

                    entry.name ??
                    entry.Nombre

                );


            const lyric =
                cleanText(

                    entry.letra ??
                    entry.Letra

                );


            if (
                name &&
                lyric
            ) {

                songs.push({

                    ...entry,

                    name,

                    letra:
                        lyric,

                    album

                });

            }

        }

    }


    return songs;

}


/* =========================================================
   ALBUM HELPERS
   ========================================================= */

function prettyAlbum(album) {

    const aliases = {

        SINGLES2:
            "SINGLES II",

        SINGLES:
            "SINGLES",

        TOMMY:
            "TOMMY"

    };


    return aliases[album] ||
        album;

}


function getAlbumGroups() {

    const groups =
        new Map();


    for (
        const song
        of state.data.lyrics || []
    ) {

        if (
            !groups.has(
                song.album
            )
        ) {

            groups.set(
                song.album,
                []
            );

        }


        groups
            .get(song.album)
            .push(song);

    }


    return groups;

}


function getAlbumEntries(
    minimumSongs = 1
) {

    return [
        ...getAlbumGroups()
            .entries()
    ]
    .filter(
        ([, songs]) =>
            songs.length >=
            minimumSongs
    );

}


function getAlbumNames() {

    return getAlbumEntries()

        .map(
            ([album]) =>
                album
        );

}


/* =========================================================
   CONNECTION STATUS
   ========================================================= */

function setConnectionStatus(type) {

    statusDot.className =
        `status-dot ${type}`;


    if (
        type === "loading"
    ) {

        statusText.textContent =
            "DATA 0/4";

    }

}


function updateConnectionStatus() {

    const loaded =
        Object.values(
            state.data
        )
        .filter(Boolean)
        .length;


    if (
        loaded === 4
    ) {

        statusDot.className =
            "status-dot ready";


        statusText.textContent =
            "DATA 4/4";

    }


    else if (
        loaded > 0
    ) {

        statusDot.className =
            "status-dot partial";


        statusText.textContent =
            `DATA ${loaded}/4`;

    }


    else {

        statusDot.className =
            "status-dot error";


        statusText.textContent =
            "DATA 0/4";

    }

}


/* =========================================================
   STATS UI
   ========================================================= */

function updateStatsUI() {

    $("#menuWins").textContent =
        state.stats.wins;


    $("#menuLosses").textContent =
        state.stats.losses;


    $("#menuStreak").textContent =
        `x${state.stats.streak}`;


    $("#menuBest").textContent =
        `x${state.stats.bestStreak}`;


    $("#menuScore").textContent =
        state.stats.score;


    $("#liveStreak").textContent =
        `x${state.stats.streak}`;


    $("#liveScore").textContent =
        state.stats.score;


    $("#newBestLabel").textContent =
        state.profile.newMode.bestRun;


    updateComboUI();

}


function formatDuration(milliseconds) {

    const totalSeconds = Math.max(
        0,
        Math.round(milliseconds / 1000)
    );

    return `${Math.floor(totalSeconds / 60)}:${pad(totalSeconds % 60)}`;

}


function updateComboUI() {

    const combo =
        state.sessionMode === "new"
            ? state.newRun?.combo || 0
            : state.session?.streak || 0;

    const milestone =
        getComboMilestone(combo);

    $("#liveCombo").textContent =
        `x${combo}`;

    $("#liveComboCopy").textContent =
        milestone.level > 0
            ? milestone.label
            : "";

    document.body.classList.remove(
        "combo-level-1",
        "combo-level-2",
        "combo-level-3",
        "combo-level-4"
    );

    if (milestone.level > 0) {
        document.body.classList.add(
            `combo-level-${milestone.level}`
        );
    }

}


/* =========================================================
   RECORDS / RELEASE LOG / SECRET ARCHIVE
   ========================================================= */

let museumInitialized = false;


function renderRecords() {

    const global = state.profile.global;

    $("#recordsGlobalAccuracy").textContent =
        `${accuracy(global.wins, global.losses)}%`;

    $("#modeStatsList").innerHTML =
        Object.entries(MODE_INFO)
            .map(([mode, info]) => {

                const stats = state.profile.modes[mode];
                const modeAccuracy = accuracy(stats.correct, stats.wrong);
                const empty = stats.played === 0;

                return `
                    <article class="mode-record" data-empty="${empty}">
                        <span class="mode-record-index">${escapeHTML(info.index)}</span>
                        <strong class="mode-record-name">${escapeHTML(info.label)}</strong>
                        <span class="mode-record-score">${empty ? "—" : `${modeAccuracy}%`}</span>
                        <span class="mode-record-meta">
                            ${stats.correct} correct · ${stats.wrong} wrong<br>
                            ${stats.sessions} sesiones · streak x${stats.bestStreak}<br>
                            best ${stats.bestScore} · media ${(stats.averageResponseTime / 1000).toFixed(1)}s
                        </span>
                        <span class="record-bar" aria-hidden="true">
                            <span style="width:${modeAccuracy}%"></span>
                        </span>
                    </article>
                `;

            })
            .join("");

    const masteryRows = getMasteryRows(state.profile);

    $("#masteryList").innerHTML = masteryRows.length
        ? masteryRows
            .map((row, index) => {
                const theme = getAlbumTheme(row.album);
                return `
                    <article
                        class="mastery-record"
                        data-level="${escapeHTML(row.level)}"
                        data-era="${escapeHTML(theme.id)}"
                        style="--row-accent:${theme.colors.primary};--row-signal:${theme.colors.signal}"
                    >
                        <span class="mastery-record-index">${pad(index + 1)}</span>
                        <strong class="mastery-record-name">${escapeHTML(row.album)}</strong>
                        <span class="mastery-record-score">${row.score}</span>
                        <span class="mastery-record-level">
                            ${escapeHTML(row.level)}<br>
                            <small>${row.correct}/${row.seen} · ${row.accuracy}%</small>
                        </span>
                        <span class="mastery-bar" aria-hidden="true">
                            <span style="width:${row.score}%"></span>
                        </span>
                    </article>
                `;
            })
            .join("")
        : `
            <p class="empty-record">
                TODAVÍA NO HAY DISCOS MEDIDOS.<br>
                JUEGA CON LETRAS O NEW MODE PARA ABRIR ESTE REGISTRO.
            </p>
        `;

}


function renderChangelog() {

    $("#changelogList").innerHTML = CHANGELOG
        .map(release => `
            <article class="release-entry">
                <header>
                    <span>${escapeHTML(release.version)}</span>
                    <time datetime="${escapeHTML(release.date)}">${escapeHTML(release.date)}</time>
                </header>
                <ol>
                    ${release.changes
                        .map(change => `<li>${escapeHTML(change)}</li>`)
                        .join("")}
                </ol>
            </article>
        `)
        .join("");

}


function showRecords() {
    setAlbumTheme(null);
    renderRecords();
    showScreen("statsScreen");
}


function showChangelog() {

    setAlbumTheme(null);
    renderChangelog();
    markVersionSeen(state.profile);
    $("#whatsNewNotice").classList.add("hidden");
    showScreen("changelogScreen");

}


function revealArchiveAccess() {

    $("#archiveNavButton").classList.remove("hidden");
    $("#footerArchiveTrigger").textContent =
        "ENTER THE ARCHIVE →";

}


function showMuseum() {

    if (!state.profile.meta.museumUnlocked) {
        unlockMuseum(state.profile);
    }

    if (!museumInitialized) {
        initMuseum();
        museumInitialized = true;
    }

    setAlbumTheme(null);
    showScreen("museumScreen");

}


/* =========================================================
   DIFFICULTY
   ========================================================= */

$$(".difficulty-btn")
    .forEach(

        button => {

            button.addEventListener(

                "click",

                () => {

                    state.difficulty =
                        button.dataset
                            .difficulty;


                    $$(".difficulty-btn")
                        .forEach(

                            btn => {

                                btn.classList
                                    .remove(
                                        "active"
                                    );

                                btn.setAttribute(
                                    "aria-pressed",
                                    "false"
                                );

                            }

                        );


                    button.classList
                        .add(
                            "active"
                        );


                    button.setAttribute(
                        "aria-pressed",
                        "true"
                    );

                }

            );

        }

    );


/* =========================================================
   MODE BUTTONS
   ========================================================= */

$$(".mode")
    .forEach(

        button => {

            button.addEventListener(

                "click",

                () => {

                    startSession(
                        button.dataset.mode
                    );

                }

            );


        }

    );


/* =========================================================
   BACK
   ========================================================= */

$("#backBtn")
    .addEventListener(

        "click",

        returnToMenu

    );


$("#brandHome")
    .addEventListener(

        "click",

        () => {

            if (
                !menuScreen.classList
                    .contains("active")
            ) {

                returnToMenu();

                return;

            }

            window.scrollTo({
                top: 0,
                behavior:
                    window.matchMedia(
                        "(prefers-reduced-motion: reduce)"
                    ).matches
                        ? "auto"
                        : "smooth"
            });

        }

    );


$$('[data-return-menu]')
    .forEach(button =>
        button.addEventListener(
            "click",
            returnToMenu
        )
    );


$("#statsNavButton")
    .addEventListener(
        "click",
        showRecords
    );


$("#changelogNavButton")
    .addEventListener(
        "click",
        showChangelog
    );


$("#whatsNewNotice")
    .addEventListener(
        "click",
        showChangelog
    );


$("#archiveNavButton")
    .addEventListener(
        "click",
        showMuseum
    );


$("#versionTrigger")
    .addEventListener(
        "click",
        showChangelog
    );


$("#footerArchiveTrigger")
    .addEventListener(
        "click",
        showMuseum
    );


$("#archiveEntryButton")
    .addEventListener(

        "click",

        showMuseum

    );


function returnToMenu() {

    stopTimer();


    setAlbumTheme(null);


    state.sessionMode =
        null;


    state.currentMode =
        null;


    state.currentRound =
        null;


    state.newRun =
        null;


    state.answered =
        false;


    state.session =
        null;


    document.body
        .classList
        .remove(
            "og-active",
            "new-mode-active",
            "event-announcing",
            "combo-level-1",
            "combo-level-2",
            "combo-level-3",
            "combo-level-4"
        );


    if (state.eventTimerId) {
        clearTimeout(state.eventTimerId);
        state.eventTimerId = null;
    }


    $("#newRunOverlay")
        .classList
        .add("hidden");


    showScreen("menuScreen");


    updateStatsUI();

}


/* =========================================================
   MODE SOURCES
   ========================================================= */

function modeSource(mode) {

    const map = {

        lyrics:
            "lyrics",

        feat:
            "feat",

        benito:
            "benito",

        featSong:
            "featSong",

        new:
            "lyrics"

    };


    return map[mode] ||
        null;

}


/* =========================================================
   AVAILABLE MODES
   ========================================================= */

function availableBaseModes() {

    return [

        "lyrics",
        "feat",
        "benito",
        "featSong"

    ]
    .filter(

        mode =>
            state.data[
                modeSource(mode)
            ]

    );

}


function availableRandomModes() {

    const modes =
        availableBaseModes();


    if (
        state.data.lyrics
    ) {

        modes.push(
            "new"
        );

    }


    return modes;

}


/* =========================================================
   START SESSION
   ========================================================= */

async function startSession(mode) {

    const required =
        modeSource(mode);


    if (
        required &&
        !state.data[required]
    ) {

        await loadSource(
            required
        );


        updateConnectionStatus();

    }


    if (
        (
            mode === "random" ||
            mode === "og"
        ) &&
        !availableBaseModes().length
    ) {

        await loadAllSources();

    }


    if (
        required &&
        !state.data[required]
    ) {

        showDataError(
            required
        );


        return;

    }


    if (
        (
            mode === "random" ||
            mode === "og"
        ) &&
        !availableBaseModes().length
    ) {

        showDataError();


        return;

    }


    state.sessionMode =
        mode;


    state.currentMode =
        null;


    state.currentRound =
        null;


    state.round =
        0;


    state.answered =
        false;


    state.session =
        createSession(
            mode,
            mode === "og"
                ? "og"
                : state.difficulty,
            mode === "new"
                ? CONFIG.newMode.rounds
                : CONFIG.gameplay.sessionRounds
        );


    showScreen("gameScreen");


    $("#newRunOverlay")
        .classList
        .add("hidden");


    document.body
        .classList
        .toggle(
            "og-active",
            mode === "og"
        );


    if (
        mode === "new"
    ) {

        startNewRun();

        return;

    }


    nextRound();

}


/* =========================================================
   STANDARD NEXT ROUND
   ========================================================= */

function nextRound() {

    stopTimer();


    state.answered =
        false;


    if (
        state.sessionMode ===
        "new"
    ) {

        nextNewRunRound();

        return;

    }


    if (
        state.session &&
        state.round >= state.session.maxRounds &&
        state.session.answers.length >= state.session.maxRounds
    ) {
        finishSession();
        return;
    }


    state.round++;


    let mode =
        state.sessionMode;


    if (
        mode === "random"
    ) {

        mode =
            randomItem(
                availableRandomModes()
            );

    }


    if (
        mode === "og"
    ) {

        mode =
            randomItem(
                availableBaseModes()
            );

    }


    state.currentMode =
        mode;


    const isOG =
        state.sessionMode ===
        "og";


    const difficulty =
        isOG
            ? "og"
            : state.difficulty;


    const round =
        buildRound(
            mode,
            difficulty
        );


    if (!round) {

        showDataError(
            modeSource(mode)
        );


        return;

    }


    state.currentRound =
        round;


    state.questionStartedAt =
        Date.now();


    renderRound(
        round,
        isOG
    );


    if (
        round.timer > 0
    ) {

        startTimer(
            round.timer
        );

    }

}


/* =========================================================
   NEW MODE RUN
   ========================================================= */

function startNewRun() {

    state.newRun = {

        maxRounds:
            CONFIG.newMode.rounds,

        round:
            0,

        lives:
            CONFIG.newMode.lives,

        maxLives:
            CONFIG.newMode.lives,

        combo:
            0,

        maxCombo:
            0,

        multiplier:
            1,

        maxMultiplier:
            1,

        score:
            0,

        correct:
            0,

        wrong:
            0,

        bossWins:
            0,

        events:
            [],

        lastEvent:
            null,

        lastChallenge:
            null,

        finished:
            false

    };


    state.round =
        0;


    $("#newRunOverlay")
        .classList
        .add(
            "hidden"
        );


    nextNewRunRound();

}


/* =========================================================
   NEXT NEW RUN ROUND
   ========================================================= */

function nextNewRunRound() {

    stopTimer();


    state.answered =
        false;


    const run =
        state.newRun;


    if (!run) {

        startNewRun();

        return;

    }


    if (
        run.lives <= 0 ||
        run.round >=
            run.maxRounds
    ) {

        finishNewRun();

        return;

    }


    run.round++;


    state.round =
        run.round;


    state.currentMode =
        "new";


    const naturalBoss =
        CONFIG.newMode.bossRounds
            .includes(run.round);


    const event =
        CONFIG.features.newModeEvents
            ? selectNewModeEvent({
                round: run.round,
                boss: naturalBoss,
                lastEvent: run.lastEvent,
                lives: run.lives,
                maxLives: run.maxLives
            })
            : null;


    const boss =
        naturalBoss ||
        Boolean(event?.forceBoss);


    const round =
        buildNewChallenge(

            state.difficulty,

            {
                boss,
                dedicated:
                    true
            }

        );


    if (!round) {

        showDataError(
            "lyrics"
        );


        return;

    }


    applyEventToRound(
        round,
        event
    );


    run.lastEvent =
        event?.id || null;


    if (event) {
        run.events.push(event.id);
    }


    state.currentRound =
        round;


    renderRound(
        round,
        false
    );


    announceEventAndStart(
        round
    );

}


function announceEventAndStart(round) {

    const announcement =
        $("#eventAnnouncement");


    const begin = () => {

        document.body.classList
            .remove("event-announcing");

        announcement.classList
            .add("hidden");

        state.questionStartedAt =
            Date.now();

        if (round.timer > 0) {
            startTimer(round.timer);
        }

    };


    if (!round.event) {
        begin();
        return;
    }


    $("#eventRarity").textContent =
        `${round.event.rarity.toUpperCase()} EVENT`;

    $("#eventName").textContent =
        round.event.label;

    $("#eventDescription").textContent =
        round.event.description;

    announcement.classList
        .remove("hidden");

    document.body.classList
        .add("event-announcing");

    state.eventTimerId =
        setTimeout(
            () => {
                state.eventTimerId = null;
                begin();
            },
            CONFIG.newMode.eventAnnouncementMs
        );

}


/* =========================================================
   BUILD ROUND ROUTER
   ========================================================= */

function buildRound(
    mode,
    difficulty
) {

    switch (mode) {

        case "lyrics":

            return buildLyricsRound(
                difficulty
            );


        case "feat":

            return buildFeatRound(
                difficulty
            );


        case "benito":

            return buildBenitoRound(
                difficulty
            );


        case "featSong":

            return buildFeatSongRound(
                difficulty
            );


        case "new":

            return buildNewChallenge(

                difficulty,

                {
                    boss:
                        false,

                    dedicated:
                        false
                }

            );


        default:

            return null;

    }

}


/* =========================================================
   MODE 1
   LETRA -> CANCIÓN
   ========================================================= */

function buildLyricsRound(
    difficulty
) {

    const bank =
        state.data.lyrics;


    if (
        !bank?.length
    ) {

        return null;

    }


    const song =
        randomItem(
            bank
        );


    const hard =
        difficulty ===
        "hard";


    const og =
        difficulty ===
        "og";


    let choices =
        null;


    if (
        !hard &&
        !og
    ) {

        const distractors =
            shuffle(

                bank

                    .filter(

                        item =>
                            item.name !==
                            song.name

                    )

                    .map(

                        item =>
                            item.name

                    )

            )
            .slice(
                0,
                3
            );


        choices =
            shuffle(

                unique([

                    song.name,

                    ...distractors

                ])

            );

    }


    return {

        mode:
            "lyrics",

        album:
            song.album,

        title:
            "LETRA → CANCIÓN",

        source:
            `LETRAS / ${prettyAlbum(song.album)}`,

        label:
            "ADIVINA LA CANCIÓN",

        question:
            song.letra,

        quote:
            true,

        answer:
            song.name,

        choices,

        input:
            hard || og,

        timer:
            og
                ? 10

                : hard
                    ? 12

                    : 0,

        extra:
            `Álbum / categoría: ${prettyAlbum(song.album)}`,

        ogPrompt:
            "Adivina la canción",

        ogOptions:
            [],

        strict:
            false

    };

}


/* =========================================================
   MODE 2
   ADIVINA FEAT
   ========================================================= */

function buildFeatRound(
    difficulty
) {

    const bank =
        state.data.feat;


    if (
        !bank?.length
    ) {

        return null;

    }


    for (
        let attempt = 0;
        attempt < 20;
        attempt++
    ) {

        const item =
            randomItem(
                bank
            );


        const name =
            cleanText(

                item.Nombre ??
                item.nombre ??
                item.name

            );


        const answer =
            cleanText(

                item.Correcta ??
                item.correcta

            );


        const options =
            unique([

                answer,

                cleanText(
                    item.feat1
                ),

                cleanText(
                    item.feat2
                ),

                cleanText(
                    item.feat3
                )

            ]);


        if (
            !name ||
            !answer
        ) {
            continue;
        }


        const hard =
            difficulty ===
            "hard";


        const og =
            difficulty ===
            "og";


        const shuffled =
            shuffle(
                options
            );


        return {

            mode:
                "feat",

            album:
                null,

            title:
                "ADIVINA EL FEAT",

            source:
                "JSON / FEAT",

            label:
                "¿QUIÉN ES EL FEAT?",

            question:
                name,

            quote:
                false,

            answer,

            choices:
                hard || og
                    ? null
                    : shuffled,

            input:
                hard || og,

            timer:
                og
                    ? 13

                    : hard
                        ? 11

                        : 0,

            extra:
                hard
                    ? "Sin opciones. Te toca sabértelo."
                    : "Una sola respuesta correcta.",

            ogPrompt:
                "Adivina el feat",

            ogOptions:
                shuffled,

            strict:
                false

        };

    }


    return null;

}


/* =========================================================
   MODE 3
   BENITO O NO
   ========================================================= */

function buildBenitoRound(
    difficulty
) {

    const bank =
        state.data.benito;


    if (
        !bank?.length
    ) {

        return null;

    }


    const item =
        randomItem(
            bank
        );


    const lyric =
        cleanText(

            item.letra ??
            item.Letra

        );


    const rawAnswer =
        cleanText(

            item.beno ??
            item.Beno

        );


    const normalized =
        normalizeAnswer(
            rawAnswer
        );


    const yesValues = [

        "si",
        "sí",
        "yes",
        "true",
        "1"

    ];


    const answer =
        yesValues.some(

            value =>
                normalized ===
                normalizeAnswer(value)

        )

            ? "Sí"

            : "No";


    const name =
        cleanText(

            item.name ??
            item.Nombre

        );


    const artist =
        cleanText(

            item.artista ??
            item.Artista

        );


    const og =
        difficulty ===
        "og";


    return {

        mode:
            "benito",

        album:
            null,

        title:
            "¿BENITO O NO?",

        source:
            "JSON / benoOno",

        label:
            "¿ESTA LETRA ES DE BENITO?",

        question:
            lyric,

        quote:
            true,

        answer,

        acceptedAnswers:
            answer === "Sí"

                ? [
                    "si",
                    "sí",
                    "yes"
                ]

                : [
                    "no"
                ],

        choices:
            og
                ? null

                : [
                    "Sí",
                    "No"
                ],

        input:
            og,

        timer:
            og
                ? 13

                : difficulty === "hard"
                    ? 8

                    : 0,

        extra:
            [

                name &&
                    `Canción: ${name}`,

                artist &&
                    `Artista: ${artist}`

            ]
            .filter(Boolean)
            .join(" · "),

        ogPrompt:
            "¿Esta letra es de una canción de Benito?",

        ogOptions:
            [
                "si",
                "no"
            ],

        strict:
            true

    };

}


/* =========================================================
   MODE 4
   FEAT -> CANCIÓN

   FIX A0.0.2:
   SIEMPRE muestra las canciones.
   Hard = menos tiempo.
   No = input imposible con "Duki".
   ========================================================= */

function buildFeatSongRound(
    difficulty
) {

    const bank =
        state.data.featSong;


    if (
        !bank?.length
    ) {

        return null;

    }


    for (
        let attempt = 0;
        attempt < 20;
        attempt++
    ) {

        const item =
            randomItem(
                bank
            );


        const feat =
            cleanText(

                item.feat ??
                item.Feat

            );


        const answer =
            cleanText(

                item.correcta ??
                item.Correcta

            );


        const options =
            unique([

                answer,

                cleanText(
                    item.cancion
                ),

                cleanText(
                    item.cancion2
                ),

                cleanText(
                    item.cancion3
                )

            ]);


        if (
            !feat ||
            !answer ||
            options.length < 2
        ) {
            continue;
        }


        const og =
            difficulty ===
            "og";


        const hard =
            difficulty ===
            "hard";


        const shuffled =
            shuffle(
                options
            );


        return {

            mode:
                "featSong",

            album:
                null,

            title:
                "FEAT → CANCIÓN",

            source:
                "JSON / ADIVINARFEAT",

            label:
                `¿EN CUÁL APARECE ${feat.toUpperCase()}?`,

            question:
                feat,

            quote:
                false,

            answer,

            /*
                Easy + Hard:
                siempre enseñan opciones.

                OG:
                mantiene el feeling antiguo:
                las opciones salen arriba,
                pero escribes respuesta.
            */

            choices:
                og
                    ? null
                    : shuffled,

            input:
                og,

            timer:
                og
                    ? 13

                    : hard
                        ? 8

                        : 0,

            extra:
                hard
                    ? "Tienes las opciones, pero el reloj va en serio."
                    : "Escoge la canción correcta.",

            ogPrompt:
                "Adivina la canción con el feat",

            ogOptions:
                shuffled,

            strict:
                false

        };

    }


    return null;

}


/* =========================================================
   NEW MODE
   ========================================================= */


/*
    NEW MODE no es una sola pregunta.

    En modo dedicado:

        10 rounds
        3 lives
        bosses en 5 y 10
        combo
        multiplier
        run score
        life recovery
        8 challenge types

    En RANDOM:

        puede aparecer un challenge del NEW MODE
        como una ronda normal.
*/


const NEW_CHALLENGES = [

    "SONG_TO_ALBUM",
    "LYRIC_TO_ALBUM",
    "ALBUM_TO_SONG",
    "INTRUDER",
    "SAME_ALBUM",
    "THREE_ONE_ORIGIN",
    "PAIR_MATCH",
    "TITLE_LYRIC_MATCH"

];


const NEW_BOSS_CHALLENGES = [

    "INTRUDER",
    "THREE_ONE_ORIGIN",
    "PAIR_MATCH",
    "TITLE_LYRIC_MATCH"

];


/* =========================================================
   PICK NEW CHALLENGE
   ========================================================= */

function pickNewChallengeType(
    boss,
    dedicated
) {

    let pool =
        boss

            ? NEW_BOSS_CHALLENGES

            : NEW_CHALLENGES;


    if (
        dedicated &&
        state.newRun?.lastChallenge
    ) {

        const filtered =
            pool.filter(

                challenge =>
                    challenge !==
                    state.newRun.lastChallenge

            );


        if (
            filtered.length
        ) {

            pool =
                filtered;

        }

    }


    return randomItem(
        pool
    );

}


/* =========================================================
   BUILD NEW CHALLENGE
   ========================================================= */

function buildNewChallenge(
    difficulty,
    options = {}
) {

    const {
        boss = false,
        dedicated = false
    } = options;


    if (
        !state.data.lyrics?.length
    ) {

        return null;

    }


    const challengeType =
        pickNewChallengeType(
            boss,
            dedicated
        );


    if (
        dedicated &&
        state.newRun
    ) {

        state.newRun.lastChallenge =
            challengeType;

    }


    let round =
        null;


    switch (
        challengeType
    ) {

        case "SONG_TO_ALBUM":

            round =
                newSongToAlbum(
                    difficulty
                );

            break;


        case "LYRIC_TO_ALBUM":

            round =
                newLyricToAlbum(
                    difficulty
                );

            break;


        case "ALBUM_TO_SONG":

            round =
                newAlbumToSong(
                    difficulty
                );

            break;


        case "INTRUDER":

            round =
                newIntruder(
                    difficulty
                );

            break;


        case "SAME_ALBUM":

            round =
                newSameAlbum(
                    difficulty
                );

            break;


        case "THREE_ONE_ORIGIN":

            round =
                newThreeOneOrigin(
                    difficulty
                );

            break;


        case "PAIR_MATCH":

            round =
                newPairMatch(
                    difficulty
                );

            break;


        case "TITLE_LYRIC_MATCH":

            round =
                newTitleLyricMatch(
                    difficulty
                );

            break;

    }


    if (!round) {

        return newSongToAlbum(
            difficulty
        );

    }


    round.mode =
        "new";


    round.title =
        "NEW MODE";


    round.source =
        boss
            ? "NEW / BOSS ROUND"

            : "NEW / ALBUM LAB";


    round.boss =
        boss;


    round.dedicatedNew =
        dedicated;


    if (boss) {

        round.timer =
            Math.max(

                5,

                Math.round(
                    round.timer *
                    .72
                )

            );

    }


    return round;

}


/* =========================================================
   NEW 1
   SONG -> ALBUM
   ========================================================= */

function newSongToAlbum(
    difficulty
) {

    const bank =
        state.data.lyrics;


    const song =
        randomItem(
            bank
        );


    const answer =
        prettyAlbum(
            song.album
        );


    const albums =
        getAlbumNames();


    const distractors =
        sample(

            albums.filter(

                album =>
                    album !==
                    song.album

            ),

            3

        )
        .map(
            prettyAlbum
        );


    const hard =
        difficulty ===
        "hard";


    return {

        challengeName:
            "SONG → ALBUM",

        album:
            song.album,

        label:
            "¿DE DÓNDE SALE?",

        question:
            song.name,

        quote:
            false,

        answer,

        acceptedAnswers: [

            answer,
            song.album

        ],

        choices:
            hard
                ? null

                : shuffle(

                    unique([

                        answer,
                        ...distractors

                    ])

                ),

        input:
            hard,

        timer:
            hard
                ? 9

                : 14,

        extra:
            "Nombre de álbum o colección.",

        strict:
            false

    };

}


/* =========================================================
   NEW 2
   LYRIC -> ALBUM
   ========================================================= */

function newLyricToAlbum(
    difficulty
) {

    const bank =
        state.data.lyrics;


    const song =
        randomItem(
            bank
        );


    const answer =
        prettyAlbum(
            song.album
        );


    const distractors =
        sample(

            getAlbumNames()
                .filter(

                    album =>
                        album !==
                        song.album

                ),

            3

        )
        .map(
            prettyAlbum
        );


    const hard =
        difficulty ===
        "hard";


    return {

        challengeName:
            "LYRIC → ALBUM",

        album:
            song.album,

        label:
            "¿DE QUÉ ÁLBUM / COLECCIÓN VIENE ESTA LETRA?",

        question:
            song.letra,

        quote:
            true,

        answer,

        acceptedAnswers: [

            answer,
            song.album

        ],

        choices:
            hard
                ? null

                : shuffle(

                    unique([

                        answer,
                        ...distractors

                    ])

                ),

        input:
            hard,

        timer:
            hard
                ? 10

                : 15,

        extra:
            `La canción era "${song.name}".`,

        strict:
            false

    };

}


/* =========================================================
   NEW 3
   ALBUM -> SONG
   ========================================================= */

function newAlbumToSong(
    difficulty
) {

    const albums =
        getAlbumEntries(
            2
        );


    const [
        album,
        songs
    ] =
        randomItem(
            albums
        );


    const correct =
        randomItem(
            songs
        );


    const otherSongs =
        state.data.lyrics

            .filter(

                song =>
                    song.album !==
                    album

            );


    const distractors =
        sample(
            otherSongs,
            3
        )
        .map(
            song =>
                song.name
        );


    return {

        challengeName:
            "ALBUM → SONG",

        album,

        label:
            "¿CUÁL SÍ PERTENECE AQUÍ?",

        question:
            prettyAlbum(
                album
            ),

        quote:
            false,

        answer:
            correct.name,

        choices:
            shuffle(

                unique([

                    correct.name,
                    ...distractors

                ])

            ),

        input:
            false,

        timer:
            difficulty === "hard"
                ? 7

                : 12,

        extra:
            "Solo una de las canciones pertenece a esa colección.",

        strict:
            false

    };

}


/* =========================================================
   NEW 4
   INTRUDER
   ========================================================= */

function newIntruder(
    difficulty
) {

    const albums =
        getAlbumEntries(
            3
        );


    const [
        album,
        songs
    ] =
        randomItem(
            albums
        );


    const sameAlbum =
        sample(
            songs,
            3
        );


    const outsiders =
        state.data.lyrics

            .filter(

                song =>
                    song.album !==
                    album

            );


    const intruder =
        randomItem(
            outsiders
        );


    return {

        challengeName:
            "THE INTRUDER",

        album,

        label:
            `¿CUÁL NO PERTENECE A ${prettyAlbum(album)}?`,

        question:
            "Encuentra al intruso.",

        quote:
            false,

        answer:
            intruder.name,

        choices:
            shuffle([

                ...sameAlbum.map(
                    song =>
                        song.name
                ),

                intruder.name

            ]),

        input:
            false,

        timer:
            difficulty === "hard"
                ? 7

                : 11,

        extra:
            `Tres son de ${prettyAlbum(album)}. Una no.`,

        strict:
            false

    };

}


/* =========================================================
   NEW 5
   SAME ALBUM?
   ========================================================= */

function newSameAlbum(
    difficulty
) {

    const groups =
        getAlbumEntries(
            2
        );


    const shouldMatch =
        Math.random() <
        .5;


    let first;
    let second;


    if (
        shouldMatch
    ) {

        const [
            ,
            songs
        ] =
            randomItem(
                groups
            );


        [
            first,
            second
        ] =
            sample(
                songs,
                2
            );

    }

    else {

        const [
            groupA,
            groupB
        ] =
            sample(
                groups,
                2
            );


        first =
            randomItem(
                groupA[1]
            );


        second =
            randomItem(
                groupB[1]
            );

    }


    const answer =
        first.album ===
        second.album

            ? "Sí"

            : "No";


    return {

        challengeName:
            "SAME OR NOT",

        album:
            answer === "Sí"
                ? first.album
                : null,

        label:
            "¿SON DE LA MISMA COLECCIÓN?",

        question:
            `${first.name}\n+\n${second.name}`,

        quote:
            false,

        answer,

        acceptedAnswers:
            answer === "Sí"

                ? [
                    "sí",
                    "si",
                    "yes"
                ]

                : [
                    "no"
                ],

        choices: [
            "Sí",
            "No"
        ],

        input:
            false,

        timer:
            difficulty === "hard"
                ? 5

                : 8,

        extra:
            first.album ===
            second.album

                ? `Las dos son de ${prettyAlbum(first.album)}.`

                : `${first.name}: ${prettyAlbum(first.album)} · ${second.name}: ${prettyAlbum(second.album)}`,

        strict:
            true

    };

}


/* =========================================================
   NEW 6
   THREE SONGS, ONE ORIGIN
   ========================================================= */

function newThreeOneOrigin(
    difficulty
) {

    const groups =
        getAlbumEntries(
            3
        );


    const [
        album,
        songs
    ] =
        randomItem(
            groups
        );


    const selected =
        sample(
            songs,
            3
        );


    const answer =
        prettyAlbum(
            album
        );


    const distractors =
        sample(

            getAlbumNames()
                .filter(

                    value =>
                        value !==
                        album

                ),

            3

        )
        .map(
            prettyAlbum
        );


    const hard =
        difficulty ===
        "hard";


    return {

        challengeName:
            "3 SONGS / 1 ORIGIN",

        album,

        label:
            "TRES CANCIONES. UN SOLO ORIGEN.",

        question:
            selected

                .map(
                    song =>
                        song.name
                )

                .join(
                    "\n/\n"
                ),

        quote:
            false,

        answer,

        acceptedAnswers: [

            answer,
            album

        ],

        choices:
            hard
                ? null

                : shuffle(

                    unique([

                        answer,
                        ...distractors

                    ])

                ),

        input:
            hard,

        timer:
            hard
                ? 8

                : 12,

        extra:
            "Identifica el álbum o colección que comparten.",

        strict:
            false

    };

}


/* =========================================================
   NEW 7
   PAIR MATCH
   ========================================================= */

function newPairMatch(
    difficulty
) {

    const groups =
        getAlbumEntries(
            2
        );


    const [
        correctAlbum,
        correctSongs
    ] =
        randomItem(
            groups
        );


    const samePairSongs =
        sample(
            correctSongs,
            2
        );


    const correctPair =
        `${samePairSongs[0].name} + ${samePairSongs[1].name}`;


    const wrongPairs =
        [];


    let safety =
        0;


    while (
        wrongPairs.length < 3 &&
        safety < 100
    ) {

        safety++;


        const [
            groupA,
            groupB
        ] =
            sample(
                groups,
                2
            );


        if (
            groupA[0] ===
            groupB[0]
        ) {
            continue;
        }


        const songA =
            randomItem(
                groupA[1]
            );


        const songB =
            randomItem(
                groupB[1]
            );


        const pair =
            `${songA.name} + ${songB.name}`;


        if (
            !wrongPairs.includes(
                pair
            )
        ) {

            wrongPairs.push(
                pair
            );

        }

    }


    return {

        challengeName:
            "PAIR MATCH",

        album:
            correctAlbum,

        label:
            "¿QUÉ PAREJA COMPARTE ÁLBUM / COLECCIÓN?",

        question:
            "Solo una pareja viene del mismo lugar.",

        quote:
            false,

        answer:
            correctPair,

        choices:
            shuffle([

                correctPair,
                ...wrongPairs

            ]),

        input:
            false,

        timer:
            difficulty === "hard"
                ? 6

                : 10,

        extra:
            `La pareja correcta comparte ${prettyAlbum(correctAlbum)}.`,

        strict:
            true

    };

}


/* =========================================================
   NEW 8
   TITLE + LYRIC MATCH
   ========================================================= */

function newTitleLyricMatch(
    difficulty
) {

    const bank =
        state.data.lyrics;


    const titleSong =
        randomItem(
            bank
        );


    const shouldMatch =
        Math.random() <
        .5;


    let lyricSong;


    if (
        shouldMatch
    ) {

        lyricSong =
            titleSong;

    }

    else {

        lyricSong =
            randomItem(

                bank.filter(

                    song =>
                        song.name !==
                        titleSong.name

                )

            );

    }


    const answer =
        shouldMatch
            ? "Sí"
            : "No";


    return {

        challengeName:
            "TITLE / LYRIC CHECK",

        album:
            lyricSong.album,

        label:
            "¿ESA LETRA PERTENECE A ESA CANCIÓN?",

        question:
            `"${titleSong.name}"\n\n${lyricSong.letra}`,

        quote:
            true,

        answer,

        acceptedAnswers:
            answer === "Sí"

                ? [
                    "si",
                    "sí",
                    "yes"
                ]

                : [
                    "no"
                ],

        choices: [
            "Sí",
            "No"
        ],

        input:
            false,

        timer:
            difficulty === "hard"
                ? 6

                : 9,

        extra:
            shouldMatch

                ? `Sí. La letra pertenece a "${titleSong.name}".`

                : `No. La letra era de "${lyricSong.name}".`,

        strict:
            true

    };

}


/* =========================================================
   RENDER ROUND
   ========================================================= */

function renderRound(
    round,
    isOG
) {

    const isNew =
        round.mode ===
        "new";


    const activeTheme = setAlbumTheme(
        isOG
            ? null
            : round.album
    );

    $("#gameScreen").dataset.era = activeTheme.label;


    document.body
        .classList
        .toggle(
            "new-mode-active",
            isNew &&
            !isOG
        );


    $("#gameModeTitle")
        .textContent =

            isOG

                ? `OG MODE / ${round.title}`

                : state.sessionMode ===
                    "random"

                    ? `RANDOM / ${round.title}`

                    : round.title;


    $("#roundNumber")
        .textContent =
            pad(
                state.round
            );


    $("#bigQuestionNumber")
        .textContent =
            pad(
                state.round
            );


    $("#roundDifficulty")
        .textContent =

            isOG

                ? "OG MODE"

                : state.difficulty
                    .toUpperCase();


    $("#roundSource")
        .textContent =
            round.source;


    updateStatsUI();


    $("#standardQuestion")
        .classList
        .toggle(
            "hidden",
            isOG
        );


    $("#ogQuestion")
        .classList
        .toggle(
            "hidden",
            !isOG
        );


    const dedicatedNew =
        state.sessionMode ===
        "new";


    $("#newModeHud")
        .classList
        .toggle(
            "hidden",
            !dedicatedNew
        );


    if (
        dedicatedNew
    ) {

        updateNewHUD(
            round
        );

    }


    if (
        isOG
    ) {

        renderOGRound(
            round
        );

    }

    else {

        renderStandardRound(
            round
        );

    }

}


/* =========================================================
   NEW HUD
   ========================================================= */

function updateNewHUD(round) {

    const run =
        state.newRun;


    if (!run) {
        return;
    }


    $("#newChallengeName")
        .innerHTML =

            `${escapeHTML(round.challengeName)}
            ${
                round.boss

                    ? '<span class="boss-tag">BOSS</span>'

                    : ""
            }`;


    $("#newRunProgress")
        .textContent =
            `${run.round} / ${run.maxRounds}`;


    $("#newMultiplier")
        .textContent =
            `x${run.multiplier.toFixed(2)}`;


    const lives =
        $("#newLives");


    lives.innerHTML =
        "";


    for (
        let i = 0;
        i < run.maxLives;
        i++
    ) {

        const life =
            document.createElement(
                "span"
            );


        life.className =
            `life ${
                i < run.lives
                    ? "on"
                    : ""
            }`;


        lives.appendChild(
            life
        );

    }


    const progress =
        (
            run.round /
            run.maxRounds
        ) * 100;


    $("#newProgressBar")
        .style.width =
            `${progress}%`;

}


/* =========================================================
   STANDARD RENDER
   ========================================================= */

function renderStandardRound(round) {

    const text =
        $("#questionText");


    text.textContent =
        round.question;


    text.className =

        round.quote

            ? "question quote pop"

            : "question pop";


    $("#questionLabel")
        .textContent =
            round.label;


    $("#questionSubtitle")
        .textContent =
            round.extra ||
            "";


    const result =
        $("#resultBox");


    result.className =
        "result hidden";


    result.innerHTML =
        "";


    renderAnswerZone(

        $("#answerZone"),

        round,

        false

    );

}


/* =========================================================
   OG RENDER
   ========================================================= */

function renderOGRound(round) {

    $("#ogContent")
        .innerHTML =
            `
                <strong>
                    ${escapeHTML(round.ogPrompt)}
                </strong>

                <br><br>

                &gt;
                ${escapeHTML(round.question)}
            `;


    const options =
        $("#ogOptions");


    if (
        round.ogOptions?.length
    ) {

        options.classList
            .remove("hidden");


        options.innerHTML =

            round.ogOptions

                .map(

                    (option, index) =>
                        `${index + 1}. ${escapeHTML(option)}`

                )

                .join("<br>");

    }

    else {

        options.classList
            .add("hidden");


        options.innerHTML =
            "";

    }


    const result =
        $("#ogResultBox");


    result.className =
        "result hidden";


    result.innerHTML =
        "";


    renderAnswerZone(

        $("#ogAnswerZone"),

        round,

        true

    );

}


/* =========================================================
   ANSWER ZONE
   ========================================================= */

function renderAnswerZone(
    container,
    round,
    isOG
) {

    container.innerHTML =
        "";


    if (
        round.choices &&
        round.choices.length
    ) {

        const choices =
            document.createElement(
                "div"
            );


        choices.className =
            "choices pop";


        round.choices
            .forEach(

                (
                    option,
                    index
                ) => {

                    const button =
                        document.createElement(
                            "button"
                        );


                    button.className =
                        "choice";


                    button.type =
                        "button";


                    button.dataset.cursor =
                        "SELECT";


                    button.dataset.answer =
                        option;


                    button.innerHTML =
                        `
                            <span class="choice-index">
                                ${String.fromCharCode(65 + index)}
                            </span>

                            <span class="choice-text">
                                ${escapeHTML(option)}
                            </span>
                        `;


                    button.addEventListener(

                        "click",

                        () =>

                            submitAnswer(

                                option,
                                false

                            )

                    );


                    choices.appendChild(
                        button
                    );

                }

            );


        container.appendChild(
            choices
        );


        return;

    }


    const form =
        document.createElement(
            "form"
        );


    form.className =
        "text-answer pop";


    const input =
        document.createElement(
            "input"
        );


    input.className =
        "answer-input";


    input.type =
        "text";


    input.autocomplete =
        "off";


    input.spellcheck =
        false;


    input.placeholder =

        round.mode === "benito"

            ? "si / no"

            : isOG

                ? "escribe tu respuesta..."

                : "tu respuesta...";


    input.setAttribute(
        "aria-label",
        round.mode === "benito"
            ? "Responde sí o no"
            : "Escribe tu respuesta"
    );


    const submit =
        document.createElement(
            "button"
        );


    submit.type =
        "submit";


    submit.className =
        "submit-answer";


    submit.textContent =
        "RESPONDER ↗";


    form.append(
        input,
        submit
    );


    form.addEventListener(

        "submit",

        event => {

            event.preventDefault();


            submitAnswer(

                input.value,
                false

            );

        }

    );


    container.appendChild(
        form
    );


    setTimeout(

        () =>
            input.focus(),

        80

    );

}


/* =========================================================
   SUBMIT
   ========================================================= */

function submitAnswer(
    value,
    timedOut = false
) {

    if (
        state.answered ||
        document.body.classList
            .contains("event-announcing")
    ) {
        return;
    }


    state.answered =
        true;


    stopTimer();


    const round =
        state.currentRound;


    const correct =

        timedOut

            ? false

            : isRoundAnswerCorrect(

                value,
                round

            );


    markChoiceButtons(

        value,
        round

    );


    const resultInfo =
        applyResult(

            correct,
            timedOut

        );


    const responseTime =
        Math.max(
            0,
            Date.now() -
                state.questionStartedAt
        );


    if (state.session) {

        recordAnswer(
            state.profile,
            state.session,
            {
                questionStartedAt:
                    state.questionStartedAt,
                answeredAt:
                    Date.now(),
                responseTime,
                correct,
                mode:
                    round.mode ||
                    state.currentMode,
                album:
                    round.album || null,
                event:
                    round.event?.id || null,
                score:
                    resultInfo.points,
                boss:
                    Boolean(round.boss),
                combo:
                    state.sessionMode === "new"
                        ? state.newRun.combo
                        : undefined,
                multiplier:
                    resultInfo.multiplier || 1,
                prompt:
                    round.label,
                answer:
                    round.answer
            }
        );

        if (round.album) {
            updateAlbumMastery(
                state.profile,
                round.album,
                correct
            );
        }

        if (state.sessionMode === "new") {
            state.session.livesRemaining =
                state.newRun.lives;
        }

        saveStats();

    }


    renderResult(

        correct,
        timedOut,
        resultInfo

    );


    updateStatsUI();


    if (
        state.sessionMode ===
        "new"
    ) {

        updateNewHUD(
            round
        );

    }

}


/* =========================================================
   MARK CHOICES
   ========================================================= */

function markChoiceButtons(
    selected,
    round
) {

    $$(".choice")
        .forEach(

            button => {

                button.disabled =
                    true;


                const value =
                    button.dataset.answer;


                const isCorrect =
                    isRoundAnswerCorrect(
                        value,
                        round
                    );


                const isSelected =

                    normalizeAnswer(value) ===
                    normalizeAnswer(selected);


                if (
                    isCorrect
                ) {

                    button.classList
                        .add(
                            "correct"
                        );

                }


                else if (
                    isSelected
                ) {

                    button.classList
                        .add(
                            "wrong"
                        );

                }

            }

        );

}


/* =========================================================
   SCORE ROUTER
   ========================================================= */

function applyResult(
    correct,
    timedOut
) {

    if (
        state.sessionMode ===
        "new"
    ) {

        return applyNewRunResult(

            correct,
            timedOut

        );

    }


    return applyStandardResult(

        correct,
        timedOut

    );

}


/* =========================================================
   STANDARD SCORE
   ========================================================= */

function applyStandardResult(
    correct,
    timedOut
) {

    let points =
        0;

    let breakdown =
        null;


    if (
        correct
    ) {

        breakdown =
            calculateStandardScore({
                difficulty:
                    state.difficulty,
                sessionMode:
                    state.sessionMode,
                currentMode:
                    state.currentRound.mode,
                streak:
                    state.stats.streak + 1,
                secondsLeft:
                    getSecondsLeft()
            });


        points =
            breakdown.total;

    }


    return {

        points,

        breakdown,

        lifeRecovered:
            false,

        multiplier:
            1,

        boss:
            false,

        runScore:
            null

    };

}


/* =========================================================
   NEW MODE SCORE
   ========================================================= */

function applyNewRunResult(
    correct,
    timedOut
) {

    const run =
        state.newRun;


    const round =
        state.currentRound;


    let points =
        0;


    let lifeRecovered =
        false;


    let breakdown =
        null;


    if (
        correct
    ) {

        run.correct++;


        run.combo++;


        run.maxCombo =
            Math.max(
                run.maxCombo,
                run.combo
            );


        /*
            Cada 2 aciertos seguidos:
            +0.25 multiplier.

            Máximo:
            x2.50
        */

        const eventRecovery =
            Boolean(round.event?.recoverLife);


        const comboRecovery =
            run.combo > 0 &&
            run.combo %
                CONFIG.newMode.lifeRecoveryCombo === 0;


        if (
            (eventRecovery || comboRecovery) &&
            run.lives < run.maxLives
        ) {

            run.lives++;


            lifeRecovered =
                true;

        }


        if (
            round.boss
        ) {
            run.bossWins++;
        }


        breakdown =
            calculateNewModeScore({
                difficulty:
                    state.difficulty,
                combo:
                    run.combo,
                secondsLeft:
                    getSecondsLeft(),
                boss:
                    round.boss,
                event:
                    round.event
            });


        run.multiplier =
            breakdown.comboMultiplier;


        run.maxMultiplier =
            Math.max(
                run.maxMultiplier,
                run.multiplier
            );


        points =
            breakdown.total;


        run.score +=
            points;

    }

    else {

        run.wrong++;


        if (!round.event?.preserveCombo) {

            run.combo =
                0;


            run.multiplier =
                1;

        }


        run.lives =
            Math.max(
                0,
                run.lives - 1
            );

    }


    return {

        points,

        breakdown,

        lifeRecovered,

        multiplier:
            run.multiplier,

        boss:
            round.boss,

        runScore:
            run.score

    };

}


/* =========================================================
   TIME BONUS
   ========================================================= */

function getSecondsLeft() {

    if (
        state.timerDuration <= 0 ||
        !state.timerDeadline
    ) {

        return 0;

    }


    const secondsLeft =
        Math.max(

            0,

            (
                state.timerDeadline -
                Date.now()
            ) / 1000

        );


    return secondsLeft;

}


/* =========================================================
   RESULT RENDER
   ========================================================= */

function renderResult(
    correct,
    timedOut,
    info
) {

    const isOG =
        state.sessionMode ===
        "og";


    const box =
        isOG

            ? $("#ogResultBox")

            : $("#resultBox");


    box.className =
        `result ${
            correct
                ? "good"
                : "bad"
        } pop`;


    let kicker;


    if (
        correct
    ) {

        kicker =
            "CORRECTO";

    }

    else if (
        timedOut
    ) {

        kicker =
            "SE ACABÓ EL TIEMPO";

    }

    else {

        kicker =
            "NO ERA ESA";

    }


    if (
        state.sessionMode ===
            "new" &&
        state.currentRound.boss
    ) {

        kicker =
            correct

                ? "BOSS CLEAR"

                : "BOSS MISSED";

    }


    const title =

        correct

            ? getWinMessage()

            : `Era “${state.currentRound.answer}”.`;


    const extra =
        state.currentRound.extra ||
        "";


    const chips =
        [];


    if (
        state.sessionMode ===
        "new"
    ) {

        chips.push(

            `run ${state.newRun.round}/${state.newRun.maxRounds}`

        );


        chips.push(

            `vidas ${state.newRun.lives}/${state.newRun.maxLives}`

        );


        chips.push(

            `combo ${state.newRun.combo}`

        );


        chips.push(

            `x${state.newRun.multiplier.toFixed(2)}`

        );


        if (state.currentRound.event) {

            chips.push(
                state.currentRound.event.label.toLowerCase()
            );


        }


        if (
            info.lifeRecovered
        ) {

            chips.push(
                "vida recuperada"
            );

        }


        if (
            state.currentRound.boss &&
            correct
        ) {

            chips.push(
                "boss x2"
            );

        }

    }


    const terminal =
        state.sessionMode === "new"
            ? (
                state.newRun.lives <= 0 ||
                state.newRun.round >= state.newRun.maxRounds
            )
            : Boolean(
                state.session &&
                state.session.answers.length >=
                    state.session.maxRounds
            );


    box.innerHTML =
        `
            <div class="result-kicker">
                ${escapeHTML(kicker)}
            </div>

            <h2 class="result-title">
                ${escapeHTML(title)}
            </h2>

            ${
                extra

                    ? `
                        <div class="result-extra">
                            ${escapeHTML(extra)}
                        </div>
                    `

                    : ""
            }

            ${
                chips.length

                    ? `
                        <div class="result-bonus">

                            ${
                                chips

                                    .map(

                                        chip =>

                                            `
                                                <span class="result-chip ${
                                                    chip.includes("boss") ||
                                                    chip.includes("vida") ||
                                                    chip.startsWith("x")
                                                        ? "hot"
                                                        : ""
                                                }">
                                                    ${escapeHTML(chip)}
                                                </span>
                                            `

                                    )

                                    .join("")
                            }

                        </div>
                    `

                    : ""
            }

            <div class="result-actions">

                <button
                    type="button"
                    id="nextRoundBtn"
                    class="next-btn"
                    data-cursor="NEXT"
                >
                    ${
                        terminal
                            ? "VER RESULTADOS ↗"
                            : "SIGUIENTE ↗"
                    }
                </button>

                <span class="result-score">

                    ${
                        correct

                            ? `+${info.points} puntos · racha x${state.stats.streak}`

                            : state.sessionMode === "new"

                                ? `vida perdida · run ${state.newRun.score}`

                                : `racha perdida · score ${state.stats.score}`
                    }

                </span>

            </div>
        `;


    $("#nextRoundBtn")
        .addEventListener(

            "click",

            () => {

                if (
                    terminal
                ) {

                    if (state.sessionMode === "new") {
                        finishNewRun();
                    }
                    else {
                        finishSession();
                    }

                }

                else {

                    nextRound();

                }

            }

        );

}


/* =========================================================
   WIN COPY
   ========================================================= */

function getWinMessage() {

    if (
        state.sessionMode ===
            "new" &&
        state.currentRound.boss
    ) {

        return randomItem([

            "BOSS BORRADO.",
            "NO TE TEMBLÓ.",
            "BOSS CLEAR.",
            "ESA VALÍA DOBLE."

        ]);

    }


    const streak =
        state.stats.streak;


    if (
        streak >= 12
    ) {

        return "BROTHER, YA BASTA.";

    }


    if (
        streak >= 10
    ) {

        return "NAH, ESTÁS ENFERMO.";

    }


    if (
        streak >= 7
    ) {

        return "NO ESTÁS FALLANDO.";

    }


    if (
        streak >= 5
    ) {

        return "YA HAY RACHA.";

    }


    if (
        streak >= 3
    ) {

        return "COGIÓ CALOR.";

    }


    return randomItem([

        "ESA ERA.",
        "CLARO QUE SÍ.",
        "CORRECTÍSIMO.",
        "BIEN JUGADO.",
        "TE LA SABÍAS.",
        "LIMPIO.",
        "FÁCIL."

    ]);

}


/* =========================================================
   FINISH NEW RUN
   ========================================================= */

function finishNewRun() {

    const run =
        state.newRun;

    if (!run) {
        return;
    }

    run.finished = true;

    if (state.session) {
        state.session.livesRemaining = run.lives;
        state.session.bestCombo = Math.max(
            state.session.bestCombo,
            run.maxCombo
        );
        state.session.maxMultiplier = Math.max(
            state.session.maxMultiplier,
            run.maxMultiplier
        );
        state.session.bossesDefeated = run.bossWins;
        state.session.events = run.events.length;
    }

    finishSession();

}


function finishSession() {

    stopTimer();

    const session =
        state.session;

    if (!session) {
        return;
    }

    finalizeSession(
        state.profile,
        session
    );

    saveStats();

    const metrics =
        getSessionMetrics(session);

    const grade =
        gradeSession(session);

    const modeLabel =
        MODE_INFO[session.mode]?.label ||
        session.mode.toUpperCase();

    $("#finalResultMode").textContent =
        `${modeLabel} / FINAL SCORE`;

    $("#newRunGrade").textContent =
        grade;

    $("#summaryRunScore").textContent =
        session.score;

    $("#summaryCorrect").textContent =
        metrics.correct;

    $("#summaryWrong").textContent =
        metrics.wrong;

    $("#summaryQuestions").textContent =
        metrics.questions;

    $("#summaryAccuracy").textContent =
        `${metrics.accuracy}%`;

    $("#summaryCombo").textContent =
        `x${metrics.bestCombo}`;

    $("#summaryStreak").textContent =
        `x${metrics.bestStreak}`;

    $("#summaryTotalTime").textContent =
        formatDuration(metrics.totalTime);

    $("#summaryAverageTime").textContent =
        `${(metrics.averageTime / 1000).toFixed(1)}s`;

    $("#summaryFastestTime").textContent =
        `${(metrics.fastestTime / 1000).toFixed(1)}s`;

    $("#summaryDifficulty").textContent =
        session.difficulty.toUpperCase();

    $("#summaryBest").textContent =
        session.mode === "new"
            ? state.profile.newMode.bestRun
            : state.profile.modes[session.mode]?.bestScore ||
                session.score;

    const isNew =
        session.mode === "new";

    $("#summaryLivesRow").classList
        .toggle("hidden", !isNew);
    $("#summaryBossesRow").classList
        .toggle("hidden", !isNew);
    $("#summaryEventsRow").classList
        .toggle("hidden", !isNew);
    $("#summaryMultiplierRow").classList
        .toggle("hidden", !isNew);

    if (isNew) {
        $("#summaryLives").textContent =
            session.livesRemaining ?? 0;
        $("#summaryBosses").textContent =
            session.bossesDefeated;
        $("#summaryEvents").textContent =
            session.events;
        $("#summaryMultiplier").textContent =
            `x${session.maxMultiplier.toFixed(2)}`;
    }

    let title =
        "SESIÓN TERMINADA.";

    let message =
        `${metrics.correct} correctas de ${metrics.questions}. El archivo queda actualizado.`;

    if (metrics.accuracy === 100 && metrics.questions >= 10) {
        title = "PERFECT RUN.";
        message = "No dejaste absolutamente nada vivo.";
    }
    else if (isNew && session.livesRemaining <= 0) {
        title = "NO QUEDAN VIDAS.";
        message = `Llegaste hasta la pregunta ${metrics.questions}. La próxima run empieza desde cero.`;
    }
    else if (["S", "S+"].includes(grade)) {
        message = "Eso fue una barbaridad.";
    }
    else if (grade === "A") {
        message = "Partida muy seria. Casi perfecta.";
    }

    $("#newRunEndTitle").textContent =
        title;

    $("#newRunEndText").textContent =
        message;

    $("#resultTimeline").innerHTML =
        session.answers
            .map((answer, index) => `
                <span class="${answer.correct ? "correct" : "wrong"}">
                    ${pad(index + 1)}
                </span>
            `)
            .join("");

    $("#shareStatus").textContent = "";

    $("#newRunOverlay").classList
        .remove("hidden");

    $(".final-result").focus();

    renderRecords();
    updateStatsUI();

}


/* =========================================================
   FINAL RESULT ACTIONS
   ========================================================= */

$("#newRunAgainBtn")
    .addEventListener(

        "click",

        () => {

            const mode =
                state.session?.mode ||
                state.sessionMode;

            $("#newRunOverlay")
                .classList
                .add(
                    "hidden"
                );


            if (mode) {
                startSession(mode);
            }

        }

    );


async function runShareAction(action) {

    const session = state.session;
    const status = $("#shareStatus");
    const buttons = $$(".final-share-actions button");

    if (!session || buttons.some(button => button.disabled)) {
        return;
    }

    buttons.forEach(button => {
        button.disabled = true;
    });

    status.textContent = "GENERANDO PNG…";

    try {

        const outcome = await action(session);

        status.textContent = outcome === "shared"
            ? "RESULTADO COMPARTIDO."
            : "PNG DESCARGADO.";

    }
    catch (error) {

        status.textContent = error?.name === "AbortError"
            ? "COMPARTIR CANCELADO."
            : "NO SE PUDO GENERAR EL PNG.";

    }
    finally {

        buttons.forEach(button => {
            button.disabled = false;
        });

    }

}


$("#downloadResultBtn")
    .addEventListener(
        "click",
        () => runShareAction(async session => {
            await downloadResult(session);
            return "downloaded";
        })
    );


$("#shareResultBtn")
    .addEventListener(
        "click",
        () => runShareAction(shareResult)
    );


$("#newRunMenuBtn")
    .addEventListener(

        "click",

        returnToMenu

    );


/* =========================================================
   TIMER
   ========================================================= */

function startTimer(seconds) {

    stopTimer();


    const wrap =
        $("#timerWrap");


    const bar =
        $("#timerBar");


    const number =
        $("#timerNumber");


    wrap.classList
        .remove(
            "hidden"
        );


    number.classList
        .remove(
            "hidden"
        );


    state.timerDuration =
        seconds;


    state.timerDeadline =
        Date.now() +
        seconds * 1000;


    bar.style.transform =
        "scaleX(1)";


    state.timerId =
        setInterval(

            () => {

                const remaining =
                    Math.max(

                        0,

                        state.timerDeadline -
                            Date.now()

                    );


                const ratio =
                    remaining /
                    (
                        state.timerDuration *
                        1000
                    );


                bar.style.transform =
                    `scaleX(${ratio})`;


                number.textContent =
                    `${(remaining / 1000).toFixed(1)}s`;


                if (
                    remaining <= 0
                ) {

                    stopTimer(
                        false
                    );


                    submitAnswer(
                        "",
                        true
                    );

                }

            },

            50

        );

}


/* =========================================================
   STOP TIMER
   ========================================================= */

function stopTimer(
    hide = true
) {

    if (
        state.timerId
    ) {

        clearInterval(
            state.timerId
        );


        state.timerId =
            null;

    }


    if (
        hide
    ) {

        $("#timerWrap")
            .classList
            .add(
                "hidden"
            );


        $("#timerNumber")
            .classList
            .add(
                "hidden"
            );

    }

}


/* =========================================================
   ERROR UI
   ========================================================= */

function showDataError(
    sourceKey = null
) {

    let detail =
        "No pude cargar los bancos del juego.";


    if (
        sourceKey &&
        state.errors[sourceKey]
    ) {

        detail =
            state.errors[sourceKey];

    }


    $("#overlayTitle")
        .textContent =
            "No pude leer el JSON.";


    $("#overlayText")
        .textContent =
            `${detail}

Si estás abriendo el archivo directamente con doble clic, el navegador podría bloquear peticiones externas por CORS.

Prueba usando Live Server, GitHub Pages, Netlify o cualquier servidor estático.`;


    $("#overlay")
        .classList
        .remove(
            "hidden"
        );

}


/* =========================================================
   RETRY
   ========================================================= */

$("#retryBtn")
    .addEventListener(

        "click",

        async () => {

            $("#overlay")
                .classList
                .add(
                    "hidden"
                );


            await loadAllSources();

        }

    );


/* =========================================================
   CLOSE ERROR
   ========================================================= */

$("#closeOverlayBtn")
    .addEventListener(

        "click",

        () => {

            $("#overlay")
                .classList
                .add(
                    "hidden"
                );

        }

    );


/* =========================================================
   KEYBOARD
   ========================================================= */

document.addEventListener(

    "keydown",

    event => {

        if (
            !gameScreen
                .classList
                .contains(
                    "active"
                )
        ) {
            return;
        }


        if (
            !$("#newRunOverlay")
                .classList
                .contains(
                    "hidden"
                )
        ) {
            return;
        }


        /*
            Después de responder:

            Enter / N =
            siguiente.
        */

        if (
            state.answered
        ) {

            if (
                event.key ===
                    "Enter" ||
                event.key
                    .toLowerCase() ===
                    "n"
            ) {

                const next =
                    $("#nextRoundBtn");


                next?.click();

            }


            return;

        }


        /*
            Multiple choice:

            1
            2
            3
            4
        */

        const choices =
            $$(".choice:not(:disabled)");


        if (
            choices.length &&
            [
                "1",
                "2",
                "3",
                "4"
            ]
            .includes(
                event.key
            )
        ) {

            const index =
                Number(
                    event.key
                ) - 1;


            choices[index]
                ?.click();

        }

    }

);


/* =========================================================
   MOBILE TOUCH
   ========================================================= */

document
    .querySelectorAll(
        "button"
    )
    .forEach(

        button => {

            button.style.touchAction =
                "manipulation";

        }

    );


/* =========================================================
   START
   ========================================================= */

applyAppInfo();

setAlbumTheme(null);

renderRecords();

renderChangelog();

if (hasUnseenVersion(state.profile)) {
    $("#whatsNewNotice").classList.remove("hidden");
    markVersionSeen(state.profile);
}
else if (!state.profile.meta.lastSeenVersion) {
    markVersionSeen(state.profile);
}

revealArchiveAccess();

initEditorialCursor();

updateStatsUI();

loadAllSources();
