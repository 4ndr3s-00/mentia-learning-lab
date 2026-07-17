import sidebar from "../components/sidebar.js";
import header from "../components/header.js";
import { navigate } from "../router.js";
import { obtenerActividades } from "../api.js";


const ESTADOS = {
    completado: { texto: "Analizado", icono: "fa-solid fa-check", color: "text-green-600" },
    analizando: { texto: "En análisis", icono: "fa-solid fa-hourglass-half", color: "text-yellow-600" },
    pendiente: { texto: "Pendiente", icono: "fa-regular fa-clock", color: "text-yellow-600" },
};


function tarjetaActividad(actividad) {
    const estado = ESTADOS[actividad.estado] || ESTADOS.pendiente;
    const fecha = new Date(actividad.fecha_subida).toLocaleDateString("es-ES");
    const clickeable = actividad.estado === "completado";

    return `
        <article data-id="${actividad.id_actividad}" class="bg-white rounded-2xl shadow-sm p-6 ${clickeable ? "cursor-pointer hover:shadow-md transition" : ""}">

            <div class="flex justify-between items-start gap-4">

                <div>

                    <h3 class="text-xl font-semibold text-gray-800">
                        ${actividad.nombre_proyecto}
                    </h3>

                    <span class="inline-block mt-3 bg-violet-100 text-violet-700 px-4 py-1 rounded-full text-sm font-medium">
                        ${actividad.lenguaje}
                    </span>

                </div>

            </div>

            <p class="text-sm text-gray-400 mt-5">
                Entregado el ${fecha}
            </p>

            <div class="flex items-center justify-between mt-8">

                ${actividad.puntaje != null ? `

                    <div class="flex items-center gap-4">

                        <div class="relative w-16 h-16 flex items-center justify-center">

                            <svg class="w-16 h-16 transform -rotate-90">
                                <circle cx="32" cy="32" r="26" stroke="#e5e7eb" stroke-width="6" fill="transparent" />
                                <circle cx="32" cy="32" r="26" stroke="#6c4ef6" stroke-width="6" fill="transparent"
                                    stroke-dasharray="163" stroke-dashoffset="${163 - (163 * actividad.puntaje) / 100}" />
                            </svg>

                            <span class="absolute text-sm font-bold text-gray-800">
                                ${actividad.puntaje}
                            </span>

                        </div>

                        <span class="${estado.color} font-semibold">
                            ${estado.texto}
                        </span>

                    </div>

                ` : `

                    <div class="flex items-center gap-3">
                        <i class="${estado.icono} ${estado.color} text-xl"></i>
                        <span class="${estado.color} font-semibold">
                            ${estado.texto}
                        </span>
                    </div>

                `}

            </div>

        </article>
    `;
}

const activities = {

    render() {

        return `

            <div class="flex min-h-screen bg-gray-100">

                ${sidebar.render()}

                <main class="flex-1 p-8 overflow-y-auto">

                    ${header.render(
                        "Mis actividades",
                        "Consulta las actividades que has enviado y el estado de análisis generado por Mentia IA."
                    )}

                    <section class="mt-8">

                        <h2 class="text-3xl font-bold text-gray-800">
                            Historial de entregas
                        </h2>

                        <p class="text-gray-500 mt-2">
                            Revisa tus entregas anteriores y el estado de evaluación de cada actividad.
                        </p>

                        <div id="activities-grid" class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mt-8">

                            <p class="text-gray-500">Cargando actividades...</p>

                        </div>

                    </section>

                </main>

            </div>

        `;

    },

    async mounted() {

        sidebar.mounted();

        const contenedor = document.getElementById("activities-grid");
        const actividades = await obtenerActividades();

        if (actividades.length === 0) {
            contenedor.innerHTML = `<p class="text-gray-500">Todavía no has subido ninguna actividad.</p>`;
            return;
        }

        contenedor.innerHTML = actividades.map(tarjetaActividad).join("");

        contenedor.querySelectorAll("article[data-id]").forEach((tarjeta) => {
            tarjeta.addEventListener("click", () => {
                if (tarjeta.classList.contains("cursor-pointer")) {
                    navigate(`/analysis?id=${tarjeta.dataset.id}`);
                }
            });
        });

    }

};


export default activities;
