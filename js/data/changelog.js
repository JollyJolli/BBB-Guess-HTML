import { APP_INFO } from "../config.js";

export const CHANGELOG = Object.freeze([
    {
        version: APP_INFO.version,
        date: APP_INFO.releaseDate,
        changes: [
            "Nueva dirección visual: music magazine × arcade × archive.",
            "THE ARCHIVE deja de ser un easter egg y obtiene acceso permanente.",
            "THE ARCHIVE incorpora el bot comunitario completo de 2021 como ORIGIN / ERA 0.",
            "Menú recompuesto como portada editorial y tracklist jugable.",
            "Motor mantenible de temas visuales por álbum.",
            "Game screen con jerarquía extrema, metadata técnica y respuestas tipo tracklist.",
            "OG MODE reconstruido como archivo interactivo de MusicQuiz.",
            "Resultados y PNG compartible rediseñados como póster editorial.",
            "Composición editorial sostenida por tipografía, color y ritmo visual.",
            "Cursor contextual de escritorio y responsive rehecho desde móvil.",
            "Nueva convención de releases: cada versión lleva el nombre de una canción de Benito."
        ]
    },
    {
        version: "A0.0.5-Alpha",
        date: "2026-08-19",
        changes: [
            "Resultados avanzados con score, grade, tiempos y recorrido de respuestas.",
            "Resultado diseñado como PNG y opción de compartirlo desde móvil.",
            "Registros competitivos por modo.",
            "Mastery por álbum basado en precisión, exposición y consistencia.",
            "Eventos sorpresa dentro de NEW MODE.",
            "Combo renovado con hitos visuales.",
            "THE ARCHIVE: museo del MusicQuiz original.",
            "Arquitectura JavaScript separada por responsabilidades.",
            "Sistema central de versiones, configuración y migraciones de storage."
        ]
    },
    {
        version: "A0.0.2-Alpha",
        date: "DATE UNKNOWN",
        changes: [
            "Base web jugable con los cuatro modos originales.",
            "NEW MODE, Random y OG MODE.",
            "Stats locales, score y rachas."
        ]
    }
]);
