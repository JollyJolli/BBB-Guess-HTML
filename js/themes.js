import { ALBUM_THEMES } from "./config.js";

function normalizeAlbumKey(value = "") {
    return String(value)
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toUpperCase()
        .replace(/[^A-Z0-9]+/g, " ")
        .trim();
}

const THEME_BY_ALIAS = new Map();

Object.values(ALBUM_THEMES).forEach(theme => {
    theme.aliases.forEach(alias => {
        THEME_BY_ALIAS.set(normalizeAlbumKey(alias), theme);
    });
});

export function getAlbumTheme(album) {
    return THEME_BY_ALIAS.get(normalizeAlbumKey(album)) || ALBUM_THEMES.core;
}

export function setAlbumTheme(album, root = document.documentElement) {
    const theme = getAlbumTheme(album);

    root.dataset.era = theme.id;
    root.style.setProperty("--era-stage", theme.colors.stage);
    root.style.setProperty("--era-deep", theme.colors.deep);
    root.style.setProperty("--era-primary", theme.colors.primary);
    root.style.setProperty("--era-secondary", theme.colors.secondary);
    root.style.setProperty("--era-signal", theme.colors.signal);
    root.style.setProperty("--era-paper", theme.colors.paper);
    root.style.setProperty("--era-ink", theme.colors.ink);

    const themeMeta = document.querySelector('meta[name="theme-color"]');
    if (themeMeta) themeMeta.content = theme.colors.stage;

    return theme;
}

export function applyAlbumThemeToElement(element, album) {
    const theme = getAlbumTheme(album);
    element.dataset.era = theme.id;
    element.style.setProperty("--row-accent", theme.colors.primary);
    element.style.setProperty("--row-signal", theme.colors.signal);
    return theme;
}

export function getSessionTheme(session) {
    const album = [...(session?.answers || [])]
        .reverse()
        .find(answer => answer.album)?.album;
    return getAlbumTheme(album);
}
