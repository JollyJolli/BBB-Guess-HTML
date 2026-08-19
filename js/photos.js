function mountEditorialPhoto(figure, source, alt) {
    if (!figure || !source) {
        return;
    }

    const surface = figure.querySelector(".photo-surface");

    if (!surface) {
        return;
    }

    const image = new Image();
    image.alt = alt;
    image.decoding = "async";

    image.addEventListener("load", () => {
        surface.prepend(image);
        figure.dataset.photoState = "ready";
    }, { once: true });

    image.addEventListener("error", () => {
        figure.dataset.photoState = "missing";
    }, { once: true });

    image.src = source;
}

export function initEditorialPhotos(sources = {}) {
    mountEditorialPhoto(
        document.querySelector("#heroEditorialPhoto"),
        sources.hero,
        "Retrato editorial de Bunny Quiz"
    );

    mountEditorialPhoto(
        document.querySelector(".final-result-photo"),
        sources.result,
        "Imagen editorial del resultado de Bunny Quiz"
    );
}
