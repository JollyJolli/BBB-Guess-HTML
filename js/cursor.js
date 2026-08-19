export function initEditorialCursor() {
    const cursor = document.querySelector("#editorialCursor");
    const label = document.querySelector("#editorialCursorLabel");
    const finePointer = window.matchMedia("(pointer: fine)");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    if (!cursor || !finePointer.matches || reducedMotion.matches) return;

    let frame = null;
    let x = -100;
    let y = -100;

    const paint = () => {
        cursor.style.transform = `translate3d(${x}px, ${y}px, 0)`;
        frame = null;
    };

    document.body.classList.add("editorial-cursor-ready");

    document.addEventListener("pointermove", event => {
        x = event.clientX;
        y = event.clientY;
        cursor.classList.add("is-visible");
        if (!frame) frame = requestAnimationFrame(paint);
    }, { passive: true });

    document.addEventListener("pointerover", event => {
        const target = event.target.closest("[data-cursor]");
        label.textContent = target?.dataset.cursor || "";
        cursor.classList.toggle("has-label", Boolean(target));
    });

    document.addEventListener("pointerout", event => {
        if (!event.relatedTarget) cursor.classList.remove("is-visible");
    });
}
