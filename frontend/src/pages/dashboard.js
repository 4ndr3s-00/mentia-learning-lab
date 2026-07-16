import sidebar from "../components/sidebar.js";
import header from "../components/header.js";
import { navigate } from "../router.js";
import { obtenerDashboard } from "../api.js";

const dashboard = {

    render() {

        return `

            <div class="flex min-h-screen bg-gray-100">

                ${sidebar.render()}

                <main class="flex-1 p-8">

                    ${header.render(
                        "Bienvenido a Mentia",
                        "Aquí encontrarás el resumen de tu aprendizaje."
                    )}

                    <section class="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">

                        <div class="bg-white rounded-2xl shadow-sm p-6">

                            <p class="text-gray-500">
                                Actividades subidas
                            </p>

                            <h2 id="uploaded-count" class="text-4xl font-bold mt-3">
                                0
                            </h2>

                        </div>

                        <div class="bg-white rounded-2xl shadow-sm p-6">

                            <p class="text-gray-500">
                                Actividades analizadas
                            </p>

                            <h2 id="analyzed-count" class="text-4xl font-bold mt-3">
                                0
                            </h2>

                        </div>

                        <div class="bg-white rounded-2xl shadow-sm p-6">

                            <p class="text-gray-500">
                                Plan de estudio
                            </p>

                            <h2 id="study-plan-status" class="text-2xl font-bold text-green-600 mt-3">
                                Sin actividades
                            </h2>

                        </div>

                    </section>

                    <section id="last-activity-section" class="bg-white rounded-2xl shadow-sm p-6 mt-8 hidden">

                        <h2 class="text-xl font-semibold text-gray-800">
                            Última actividad
                        </h2>

                        <div class="mt-5">

                            <p id="last-activity-title" class="font-semibold text-gray-700"></p>

                            <p id="last-activity-language" class="text-gray-500 mt-2"></p>

                            <p id="last-activity-date" class="text-sm text-gray-400 mt-2"></p>

                            <button id="view-analysis-button" class="mt-6 bg-[#6c4ef6] hover:bg-violet-700 text-white px-6 py-3 rounded-xl">
                                Ver análisis
                            </button>

                        </div>

                    </section>

                    <section class="bg-white rounded-2xl shadow-sm p-6 mt-6">

                        <h2 class="text-xl font-semibold text-gray-800">
                            Estado del plan de estudio
                        </h2>

                        <p id="study-plan-message" class="text-gray-500 mt-4">
                            Sube tu primera actividad para generar un plan de estudio.
                        </p>

                        <button id="study-plan-button" class="mt-6 bg-[#6c4ef6] hover:bg-violet-700 text-white px-6 py-3 rounded-xl">
                            Ver plan de estudio
                        </button>

                    </section>

                    <section class="bg-white rounded-2xl shadow-sm p-6 mt-6 mb-8">

                        <h2 class="text-xl font-semibold text-gray-800">
                            Acciones rápidas
                        </h2>

                        <div class="flex flex-wrap gap-4 mt-6">

                            <button id="upload-button" class="bg-[#6c4ef6] text-white px-6 py-3 rounded-xl hover:bg-violet-700">
                                Subir actividad
                            </button>

                            <button id="activities-button"  class="border border-[#6c4ef6] text-[#6c4ef6] px-6 py-3 rounded-xl hover:bg-violet-50">
                                Mis actividades
                            </button>

                        </div>

                    </section>

                </main>

            </div>

        `;

    },

    async mounted() {

        sidebar.mounted();

        // id de la ultima actividad, se llena cuando llega la respuesta del backend
        let idUltimaActividad = null;

        document.getElementById("upload-button")?.addEventListener("click",
            function () { navigate("/upload");
        });

        document.getElementById("activities-button")?.addEventListener("click",
            function () { navigate("/activities");
        });

        document.getElementById("view-analysis-button")?.addEventListener("click",
            function () { if (idUltimaActividad) navigate(`/analysis?id=${idUltimaActividad}`);
        });

        document.getElementById("study-plan-button")?.addEventListener("click",
            function () { if (idUltimaActividad) navigate(`/study-plan?id=${idUltimaActividad}`);
        });

        // trae los datos reales del backend y rellena la pantalla
        const datos = await obtenerDashboard();

        document.getElementById("uploaded-count").textContent = datos.subidas;
        document.getElementById("analyzed-count").textContent = datos.analizadas;
        document.getElementById("study-plan-status").textContent = datos.planActivo ? "Activo" : "Sin plan";

        if (datos.ultimaActividad) {
            idUltimaActividad = datos.ultimaActividad.id_actividad;

            document.getElementById("last-activity-section").classList.remove("hidden");
            document.getElementById("last-activity-title").textContent = datos.ultimaActividad.nombre_proyecto;
            document.getElementById("last-activity-language").textContent = datos.ultimaActividad.lenguaje;
            document.getElementById("last-activity-date").textContent =
                "Enviado el " + new Date(datos.ultimaActividad.fecha_subida).toLocaleDateString("es-ES");

            if (datos.planActivo) {
                document.getElementById("study-plan-message").textContent =
                    "Actualmente tienes un plan de estudio activo generado por Mentia IA.";
            }
        }

    }

};

export default dashboard;
