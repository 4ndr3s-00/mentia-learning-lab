import { router } from "./router.js";
import { obtenerToken, registrarActividad, sesionExpirada } from "./api.js";

window.addEventListener("DOMContentLoaded", () => {
    router();
});

window.addEventListener("popstate", () => {
    router();
});

// cualquier interaccion del usuario cuenta como "actividad" y reinicia el contador de 30 minutos
// (se limita a una vez cada 5s para no saturar localStorage con mousemove/scroll)
let ultimoRegistro = 0;
["click", "keydown", "mousemove", "scroll"].forEach((evento) => {
    window.addEventListener(evento, () => {
        const ahora = Date.now();
        if (obtenerToken() && ahora - ultimoRegistro > 5000) {
            ultimoRegistro = ahora;
            registrarActividad();
        }
    }, { passive: true });
});

// revisa cada minuto si la sesion ya expiro, aunque el usuario se haya quedado quieto en la misma pagina
// (solo re-renderiza si de verdad expiro, para no interrumpir formularios o el analisis de IA en curso)
setInterval(() => {
    if (obtenerToken() && sesionExpirada()) router();
}, 60 * 1000);