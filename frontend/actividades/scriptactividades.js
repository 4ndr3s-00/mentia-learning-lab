// Lista de actividades entregadas
// por ahora esta vacia, aqui se agregaran cuando existan datos reales
const actividades = [];

// decide el color del circulo segun el puntaje
function claseSegunPuntaje(puntaje) {
    if (puntaje === null) return "pendiente";
    if (puntaje >= 85) return ""; // verde (color por defecto)
    return "medio"; // naranja
}

// arma el html de una tarjeta
function crearTarjeta(actividad) {
    const esAnalizado = actividad.estado === "analizado";

    const badgeEstado = esAnalizado
        ? `<span class="badge-estado analizado"><i class="fa-solid fa-circle-check"></i> Analizado</span>`
        : `<span class="badge-estado en-analisis"><i class="fa-solid fa-arrows-rotate"></i> En análisis</span>`;

    const circuloPuntaje = esAnalizado
        ? `<div class="puntaje ${claseSegunPuntaje(actividad.puntaje)}">${actividad.puntaje}</div>`
        : `<div class="puntaje pendiente"><i class="fa-regular fa-hourglass-half"></i></div>`;

    // si todavia esta en analisis, los links de ver reporte se deshabilitan
    const claseDeshabilitado = esAnalizado ? "" : "deshabilitado";

    return `
        <div class="tarjeta">

            <div class="tarjeta-header">
                <h3>${actividad.titulo}</h3>
                <span class="badge-lenguaje">${actividad.lenguaje}</span>
            </div>

            <p class="fecha-entrega">Entregado: ${actividad.fecha}</p>

            <div class="tarjeta-estado">
                ${badgeEstado}
                ${circuloPuntaje}
            </div>

            <hr>

            <div class="tarjeta-footer">
                <a href="#"><i class="fa-solid fa-code"></i> Ver código</a>
                <a href="#" class="${claseDeshabilitado}"><i class="fa-solid fa-chart-bar"></i> Ver reporte</a>
            </div>

        </div>
    `;
}

// dibuja todas las tarjetas dentro del contenedor
function dibujarActividades() {
    const contenedor = document.getElementById("lista-actividades");
    contenedor.innerHTML = actividades.map(crearTarjeta).join("");
}

dibujarActividades();