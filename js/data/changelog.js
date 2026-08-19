import { APP_INFO } from "../config.js";

export const CHANGELOG = Object.freeze([
    {
        version: APP_INFO.version,
        date: APP_INFO.releaseDate,
        changes: [
            "Resultados avanzados con score, grade, tiempos y recorrido de respuestas.",
            "Resultado diseñado como PNG y opción de compartirlo desde móvil.",
            "Registros competitivos por modo.",
            "Mastery por álbum basado en precisión, exposición y consistencia.",
            "Eventos sorpresa dentro de NEW MODE.",
            "Combo renovado con hitos visuales.",
            "THE ARCHIVE: museo secreto del MusicQuiz original.",
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
